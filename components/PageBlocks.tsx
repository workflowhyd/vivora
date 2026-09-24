"use client";

import { useRef } from "react";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Reveal } from "./Reveal";
import { ReelCard } from "./ReelCard";
import { youtubeId } from "@/lib/youtube";

type Block = NonNullable<ReturnType<typeof useQuery<typeof api.content.blocksForPage>>>[number];

// A video block with no heading/body — a YouTube link or an uploaded file —
// is a "reel". One WITH a heading/body keeps the existing side-by-side
// treatment; grouping only applies to this bare, caption-only shape.
function isReel(block: Block) {
  return block.kind === "video" && !block.heading && !block.body && Boolean(block.mediaUrl);
}

// Runs of adjacent blocks are grouped so consecutive reels render as one
// grid instead of one full-width row each; anything else passes through
// as its own single-item group, keeping the original render order.
function groupBlocks(blocks: Block[]) {
  const groups: { reel: boolean; items: Block[] }[] = [];
  for (const block of blocks) {
    const reel = isReel(block);
    const last = groups[groups.length - 1];
    if (last && last.reel === reel && reel) last.items.push(block);
    else groups.push({ reel, items: [block] });
  }
  return groups;
}

// A horizontally-scrolling, snap-aligned row of reels with prev/next
// buttons on desktop — accommodates however many reels an admin adds (today
// 3, side by side; more later scroll instead of shrinking to fit).
function ReelSlider({ blocks }: { blocks: Block[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-reel]");
    const step = (card?.offsetWidth ?? el.clientWidth * 0.8) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <Reveal className="mx-auto w-full">
      <div className="flex items-center gap-4">
        <div
          ref={trackRef}
          className="no-scrollbar flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto md:gap-6"
        >
          {blocks.map((block) => (
            <div key={block._id} data-reel className="w-[45%] shrink-0 snap-start sm:w-[30%] md:w-[23%]">
              <ReelCard
                youtubeId={youtubeId(block.mediaUrl ?? "") ?? undefined}
                fileSrc={youtubeId(block.mediaUrl ?? "") ? undefined : (block.mediaUrl ?? undefined)}
                caption={block.caption}
              />
            </div>
          ))}
        </div>
        {blocks.length > 1 && (
          <div className="hidden shrink-0 flex-col gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous reels"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-blue/15 text-blue transition-colors duration-300 hover:bg-blue/5"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Next reels"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-blue/15 text-blue transition-colors duration-300 hover:bg-blue/5"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Reveal>
  );
}

// Extra text / image / video blocks that an admin adds to a page from
// /admin/pages. Renders nothing when a page has none.
export function PageBlocks({ page }: { page: string }) {
  const blocks = useQuery(api.content.blocksForPage, { page });

  if (!blocks || blocks.length === 0) return null;

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 flex flex-col gap-14 md:gap-20">
        {groupBlocks(blocks).map((group) => {
          if (group.reel) {
            return <ReelSlider key={group.items[0]._id} blocks={group.items} />;
          }
          const block = group.items[0];
          const ytId = block.kind === "video" && block.mediaUrl ? youtubeId(block.mediaUrl) : null;
          const hasSideText = Boolean(block.heading || block.body);

          // A YouTube link with a heading/body renders as a two-column
          // "video with description on the side" row instead of the plain
          // centered block the other kinds use.
          if (ytId && hasSideText) {
            return (
              <Reveal key={block._id} className="mx-auto w-full">
                <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                  <div className="mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-md bg-blue-dark">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title={block.heading ?? "Video"}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div>
                    {block.heading && (
                      <h2 className="font-display text-3xl leading-[1.1] text-blue-dark md:text-4xl">
                        {block.heading}
                      </h2>
                    )}
                    {block.body && (
                      <p className="mt-4 whitespace-pre-line font-light leading-relaxed text-charcoal/70">
                        {block.body}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          }

          return (
            <Reveal key={block._id} className="mx-auto w-full max-w-3xl">
              {block.kind === "text" && (
                <div>
                  {block.heading && (
                    <h2 className="font-display text-3xl md:text-4xl leading-[1.1] text-blue-dark">
                      {block.heading}
                    </h2>
                  )}
                  <p className="text-charcoal/70 font-light leading-relaxed mt-4 whitespace-pre-line">
                    {block.body}
                  </p>
                </div>
              )}
              {block.kind === "image" && block.mediaUrl && (
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.mediaUrl}
                    alt={block.caption ?? block.heading ?? ""}
                    className="w-full rounded-[2px]"
                    loading="lazy"
                  />
                  {block.caption && (
                    <figcaption className="text-charcoal/55 text-sm mt-3">{block.caption}</figcaption>
                  )}
                </figure>
              )}
              {block.kind === "video" && block.mediaUrl && (
                <figure>
                  {ytId ? (
                    <div className="mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-md bg-blue-dark">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        title={block.heading ?? "Video"}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video
                      src={block.mediaUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full rounded-[2px] bg-blue-dark"
                    />
                  )}
                  {block.caption && (
                    <figcaption className="text-charcoal/55 text-sm mt-3">{block.caption}</figcaption>
                  )}
                </figure>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
