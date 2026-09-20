"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Reveal } from "./Reveal";

// Extra text / image / video blocks that an admin adds to a page from
// /admin/pages. Renders nothing when a page has none.
export function PageBlocks({ page }: { page: string }) {
  const blocks = useQuery(api.content.blocksForPage, { page });

  if (!blocks || blocks.length === 0) return null;

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 flex flex-col gap-14 md:gap-20">
        {blocks.map((block) => (
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
                <video
                  src={block.mediaUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-[2px] bg-blue-dark"
                />
                {block.caption && (
                  <figcaption className="text-charcoal/55 text-sm mt-3">{block.caption}</figcaption>
                )}
              </figure>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
