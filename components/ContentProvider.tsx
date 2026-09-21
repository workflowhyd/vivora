"use client";

import type { ReactNode } from "react";
import { InitialContentContext, type ContentRows } from "@/lib/useContent";

export function ContentProvider({ initial, children }: { initial: ContentRows; children: ReactNode }) {
  return <InitialContentContext.Provider value={initial}>{children}</InitialContentContext.Provider>;
}
