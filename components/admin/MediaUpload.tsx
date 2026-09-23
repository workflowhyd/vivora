"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Upload } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/Spinner";

const LIMITS = { image: 10, video: 100 } as const;
const ACCEPT = {
  image: "image/jpeg,image/png,image/webp,image/gif,image/avif",
  video: "video/mp4,video/webm",
} as const;

// Uploads a file to Convex storage and hands the storage id back. The server
// re-checks type and size when the id is saved, so these client checks are
// only for fast feedback.
export function MediaUpload({
  kind,
  onUploaded,
  label,
}: {
  kind: "image" | "video";
  onUploaded: (storageId: Id<"_storage">) => void | Promise<void>;
  label?: string;
}) {
  const generateUploadUrl = useMutation(api.content.generateUploadUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith(`${kind}/`)) {
      setError(`Please choose ${kind === "image" ? "an image" : "a video"} file.`);
      return;
    }
    if (file.size > LIMITS[kind] * 1024 * 1024) {
      setError(`Too large — max ${LIMITS[kind]} MB.`);
      return;
    }
    setBusy(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
      await onUploaded(storageId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[kind]}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 border border-charcoal/15 rounded-md px-3.5 py-2 text-sm hover:border-blue transition-colors duration-200 disabled:opacity-50"
      >
        {busy ? <Spinner /> : <Upload size={14} />}
        {busy ? "Uploading…" : (label ?? `Upload ${kind}`)}
      </button>
      <p className="text-xs text-charcoal/45 mt-1.5">
        {kind === "image" ? "JPG, PNG, WebP, GIF or AVIF" : "MP4 or WebM"} · max {LIMITS[kind]} MB
      </p>
      {error && <p className="text-sm text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}
