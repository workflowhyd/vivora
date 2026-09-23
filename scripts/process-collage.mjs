import sharp from "sharp";
import path from "path";
import fs from "fs";

// Usage: node process-collage.mjs <source.png> <cols> <rows> <outDir> <name1,name2,...> [--square]
// By default each cell is extracted at its native aspect ratio (no cropping
// beyond the grid boundary) and upscaled so its longer side hits TARGET —
// nothing gets cut off. The site's product boxes use object-contain, so a
// non-square source just letterboxes cleanly. Pass --square to force a
// centered square crop instead (only safe when nothing essential sits near
// the top/bottom edges of the cell).
const [, , src, colsArg, rowsArg, outDir, namesArg, ...rest] = process.argv;
const cols = Number(colsArg);
const rows = Number(rowsArg);
const names = namesArg.split(",");
const forceSquare = rest.includes("--square");

const TARGET = 1200;

async function main() {
  const img = sharp(src);
  const meta = await img.metadata();
  const w = meta.width;
  const h = meta.height;
  const cw = w / cols;
  const rh = h / rows;

  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < names.length; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const cellLeft = c * cw;
    const cellTop = r * rh;

    let left, top, extractW, extractH;
    if (forceSquare) {
      const side = Math.min(cw, rh);
      left = Math.round(cellLeft + (cw - side) / 2);
      top = Math.round(cellTop + (rh - side) / 2);
      extractW = extractH = Math.round(side);
    } else {
      left = Math.round(cellLeft);
      top = Math.round(cellTop);
      extractW = Math.round(cw);
      extractH = Math.round(rh);
    }

    const name = names[i];
    const cropped = sharp(src).extract({ left, top, width: extractW, height: extractH });

    const longSide = Math.max(extractW, extractH);
    const scale = TARGET / longSide;
    const outW = Math.round(extractW * scale);
    const outH = Math.round(extractH * scale);

    const upscaled = cropped.clone().resize(outW, outH, {
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

    console.log(`${name}: box(${left},${top},${extractW}x${extractH}) -> ${outW}x${outH}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
