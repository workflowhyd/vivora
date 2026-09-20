"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Slot } from "@/convex/lib/contentRegistry";
import { MediaUpload } from "@/components/admin/MediaUpload";

export const fieldClasses =
  "w-full border border-charcoal/15 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue transition-colors duration-200";

export function SlotEditor({ slot }: { slot: Slot }) {
  const overrides = useQuery(api.content.getAll);
  const setContent = useMutation(api.content.setContent);
  const resetContent = useMutation(api.content.resetContent);
  const override = overrides?.find((o) => o.key === slot.key);

  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const isMedia = slot.kind === "image" || slot.kind === "video";
  const current = override?.text ?? slot.default;
  const value = draft ?? current;
  const dirty = draft !== null && draft !== current;

  const run = async (fn: () => Promise<unknown>) => {
    setStatus("saving");
    setError(null);
    try {
      await fn();
      setDraft(null);
      setStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium" htmlFor={slot.key}>
          {slot.label}
        </label>
        {override && (
          <button
            type="button"
            onClick={() => run(() => resetContent({ key: slot.key }))}
            className="text-xs text-charcoal/50 hover:text-red-600"
          >
            Reset
          </button>
        )}
      </div>

      {isMedia ? (
        <div className="mt-2 flex flex-col gap-3">
          {override?.url &&
            (slot.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={override.url} alt="" className="max-h-48 rounded-md border border-charcoal/10" />
            ) : (
              <video src={override.url} controls className="max-h-48 rounded-md" />
            ))}
          <MediaUpload
            kind={slot.kind === "image" ? "image" : "video"}
            label={override ? `Replace ${slot.kind}` : `Upload ${slot.kind}`}
            onUploaded={(storageId) => run(() => setContent({ key: slot.key, storageId }))}
          />
        </div>
      ) : (
        <div className="mt-2">
          {slot.kind === "textarea" ? (
            <textarea
              id={slot.key}
              rows={4}
              value={value}
              onChange={(e) => setDraft(e.target.value)}
              className={`${fieldClasses} resize-y`}
            />
          ) : (
            <input
              id={slot.key}
              value={value}
              onChange={(e) => setDraft(e.target.value)}
              className={fieldClasses}
            />
          )}
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              disabled={!dirty || status === "saving"}
              onClick={() => run(() => setContent({ key: slot.key, text: value }))}
              className="bg-green text-cream-light text-sm font-medium px-4 py-2 rounded-md hover:bg-green-dark transition-colors duration-200 disabled:opacity-40"
            >
              {status === "saving" ? "Saving…" : "Save"}
            </button>
            {status === "saved" && !dirty && <span className="text-xs text-green">Saved</span>}
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
