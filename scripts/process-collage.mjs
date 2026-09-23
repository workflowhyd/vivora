import sharp from "sharp";
import path from "path";
import fs from "fs";

// Usage: node process-collage.mjs <source.png> <cols> <rows> <outDir> <name1,name2,...>
const [, , src, colsArg, rowsArg, outDir, namesArg] = process.argv;
const cols = Number(colsArg);
const rows = Number(rowsArg);
const names = namesArg.split(",");

const TARGET = 1200;

async function main() {
  const img = sharp(src);
  const meta = await img.metadata();
  const w = meta.width;
  const h = meta.height;
  const cw = w / cols;
  const rh = h / rows;
  const side = Math.min(cw, rh); // square side = the smaller cell dimension

  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < names.length; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const cellLeft = c * cw;
    const cellTop = r * rh;
    // center the square crop within the cell on whichever axis has slack
    const left = Math.round(cellLeft + (cw - side) / 2);
    const top = Math.round(cellTop + (rh - side) / 2);
    const sideR = Math.round(side);

    const name = names[i];
    const cropped = sharp(src).extract({ left, top, width: sideR, height: sideR });

    const upscaled = cropped.clone().resize(TARGET, TARGET, {
      kernel: sharp.kernel.lanczos3,
      fit: "fill",
    });

    await upscaled
      .clone()
      .webp({ quality: 92 })
      .toFile(path.join(outDir, `${name}.webp`));

    await upscaled
      .clone()
      .png({ compressionLevel: 9 })
      .toFile(path.join(outDir, `${name}.png`));

    console.log(`${name}: box(${left},${top},${sideR}x${sideR}) -> ${TARGET}x${TARGET}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
