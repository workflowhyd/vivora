"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Image as ImageIcon, Trash2, Type, Video } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { fieldClasses } from "./SlotEditor";
import { youtubeId } from "@/lib/youtube";
import { Spinner } from "@/components/Spinner";

type Kind = "text" | "image" | "video";
type Block = Doc<"pageBlocks"> & { mediaUrl: string | null };

const kindMeta = {
  text: { label: "Text", icon: Type },
  image: { label: "Image", icon: ImageIcon },
  video: { label: "Video", icon: Video },
} as const;

export function BlocksEditor({ page }: { page: string }) {
  const blocks = useQuery(api.content.blocksForPageAdmin, { page });
  const createBlock = useMutation(api.content.createBlock);
  const [error, setError] = useState<string | null>(null);

  const addBlock = async (kind: Kind) => {
    setError(null);
    try {
      // Media blocks are created on upload; text blocks start with placeholder copy.
      if (kind === "text") {
        await createBlock({ page, kind, heading: "New heading", body: "Write your text here.", active: false });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add block.");
    }
  };

  const addMedia = async (kind: "image" | "video", storageId: Id<"_storage">) => {
    setError(null);
    try {
      await createBlock({ page, kind, storageId, active: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add block.");
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-start gap-4">
        <button
          type="button"
          onClick={() => addBlock("text")}
          className="inline-flex items-center gap-2 bg-green text-cream-light text-sm font-medium px-4 py-2 rounded-md hover:bg-green-dark transition-colors duration-200"
        >
          <Type size={14} /> Add text block
        </button>
        <MediaUpload kind="image" label="Add image block" onUploaded={(id) => addMedia("image", id)} />
        <MediaUpload kind="video" label="Add video block" onUploaded={(id) => addMedia("video", id)} />
      </div>
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      <div className="flex flex-col gap-4 mt-6">
        {blocks?.length === 0 && (
          <p className="text-sm text-charcoal/50">No extra blocks on this page yet.</p>
        )}
        {blocks?.map((block, i) => (
          <BlockCard key={block._id} block={block} isFirst={i === 0} isLast={i === blocks.length - 1} />
        ))}
      </div>
    </div>
  );
}

function BlockCard({ block, isFirst, isLast }: { block: Block; isFirst: boolean; isLast: boolean }) {
  const updateBlock = useMutation(api.content.updateBlock);
  const moveBlock = useMutation(api.content.moveBlock);
  const removeBlock = useMutation(api.content.removeBlock);

  const [heading, setHeading] = useState(block.heading ?? "");
  const [body, setBody] = useState(block.body ?? "");
  const [caption, setCaption] = useState(block.caption ?? "");
  const [url, setUrl] = useState(block.url ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  const Icon = kindMeta[block.kind].icon;
  const dirty =
    heading !== (block.heading ?? "") ||
    body !== (block.body ?? "") ||
    caption !== (block.caption ?? "") ||
    url !== (block.url ?? "");

  const save = async (patch: Partial<{ active: boolean; storageId: Id<"_storage"> }> = {}) => {
    setStatus("saving");
    setError(null);
    try {
      await updateBlock({
        id: block._id,
        heading: heading || undefined,
        body: body || undefined,
        caption: caption || undefined,
        storageId: patch.storageId ?? block.storageId,
        url: url || undefined,
        active: patch.active ?? block.active,
      });
      setStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setStatus("idle");
    }
  };

  const guard = async (fn: () => Promise<unknown>) => {
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="bg-white border border-charcoal/10 rounded-md p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 label-caps text-[11px] text-charcoal/60">
          <Icon size={14} /> {kindMeta[block.kind].label} block
          {!block.active && <span className="text-gold normal-case">· hidden</span>}
        </span>
        <div className="flex items-center gap-1">
          <IconButton title="Move up" disabled={isFirst} onClick={() => guard(() => moveBlock({ id: block._id, direction: "up" }))}>
            <ArrowUp size={15} />
          </IconButton>
          <IconButton title="Move down" disabled={isLast} onClick={() => guard(() => moveBlock({ id: block._id, direction: "down" }))}>
            <ArrowDown size={15} />
          </IconButton>
          <IconButton
            title={block.active ? "Hide from site" : "Show on site"}
            onClick={() => save({ active: !block.active })}
          >
            {block.active ? <Eye size={15} /> : <EyeOff size={15} />}
          </IconButton>
          <IconButton
            title="Delete"
            onClick={() => {
              if (confirm("Delete this block? This can't be undone.")) guard(() => removeBlock({ id: block._id }));
            }}
          >
            <Trash2 size={15} />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {block.kind === "text" ? (
          <>
            <input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Heading (optional)"
              className={fieldClasses}
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Text"
              className={`${fieldClasses} resize-y`}
            />
          </>
        ) : (
          <>
            {block.mediaUrl &&
              (block.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={block.mediaUrl} alt="" className="max-h-56 rounded-md border border-charcoal/10 self-start" />
              ) : youtubeId(block.mediaUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId(block.mediaUrl)}`}
                  className="aspect-[9/16] max-h-56 rounded-md self-start"
                  allowFullScreen
                />
              ) : (
                <video src={block.mediaUrl} controls className="max-h-56 rounded-md self-start" />
              ))}
            {block.kind === "video" && (
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="YouTube (or other video) link — leave blank if uploading a file below"
                className={fieldClasses}
              />
            )}
            {block.kind === "video" && (
              <>
                <input
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Heading (optional — shows beside the video)"
                  className={fieldClasses}
                />
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  placeholder="Description (optional — shows beside the video)"
                  className={`${fieldClasses} resize-y`}
                />
              </>
            )}
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption (optional)"
              className={fieldClasses}
            />
            <MediaUpload
              kind={block.kind}
              label={`Replace ${block.kind}`}
              onUploaded={(storageId) => save({ storageId })}
            />
          </>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!dirty || status === "saving"}
            onClick={() => save()}
            className="inline-flex items-center gap-2 bg-green text-cream-light text-sm font-medium px-4 py-2 rounded-md hover:bg-green-dark transition-colors duration-200 disabled:opacity-40"
          >
            {status === "saving" && <Spinner />}
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          {status === "saved" && !dirty && <span className="text-xs text-green">Saved</span>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

function IconButton({
  children,
  title,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className="p-2 rounded-md text-charcoal/55 hover:text-blue hover:bg-charcoal/5 transition-colors duration-200 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
