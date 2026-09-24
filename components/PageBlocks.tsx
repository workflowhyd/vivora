"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Reveal } from "./Reveal";
import { ReelCard } from "./ReelCard";
import { youtubeId } from "@/lib/youtube";

type Block = NonNullable<ReturnType<typeof useQuery<typeof api.content.blocksForPage>>>[number];

// A bare YouTube link with no heading/body is a "reel" — plain video blocks
// (with a heading/body, or an uploaded file) keep the existing one-per-row
// treatment; grouping only applies to this specific, caption-only shape.
function isReel(block: Block) {
  return block.kind === "video" && !block.heading && !block.body && Boolean(youtubeId(block.mediaUrl ?? ""));
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
            return (
              <Reveal key={group.items[0]._id} className="mx-auto w-full">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
                  {group.items.map((block) => (
                    <ReelCard
                      key={block._id}
                      youtubeId={youtubeId(block.mediaUrl ?? "")!}
                      caption={block.caption}
                    />
                  ))}
                </div>
              </Reveal>
            );
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
