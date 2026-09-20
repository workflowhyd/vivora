"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { slotByKey } from "@/convex/lib/contentRegistry";

// Reads editable page content. Every slot has a default in the registry, so
// components render real copy immediately and swap in admin overrides once
// the (shared, cached) query resolves.
export function useContent() {
  const rows = useQuery(api.content.getAll);
  return useMemo(() => {
    const overrides = new Map(rows?.map((r) => [r.key, r]));
    return {
      t: (key: string): string =>
        overrides.get(key)?.text ?? slotByKey.get(key)?.default ?? "",
      media: (key: string): string | undefined => overrides.get(key)?.url ?? undefined,
    };
  }, [rows]);
}
