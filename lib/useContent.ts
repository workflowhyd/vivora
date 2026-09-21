"use client";

import { createContext, useContext, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { slotByKey } from "@/convex/lib/contentRegistry";

export type ContentRows = FunctionReturnType<typeof api.content.getAll>;

// Overrides fetched on the server when the page was generated, so the first
// paint already has the admin's text/media; the live query then takes over.
export const InitialContentContext = createContext<ContentRows>([]);

// Reads editable page content. Every slot has a default in the registry, so
// components always render real copy, with admin overrides applied on top.
export function useContent() {
  const initial = useContext(InitialContentContext);
  const rows = useQuery(api.content.getAll) ?? initial;
  return useMemo(() => {
    const overrides = new Map(rows.map((r) => [r.key, r]));
    return {
      t: (key: string): string =>
        overrides.get(key)?.text ?? slotByKey.get(key)?.default ?? "",
      media: (key: string): string | undefined => overrides.get(key)?.url ?? undefined,
    };
  }, [rows]);
}
