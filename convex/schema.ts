import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  products: defineTable({
    slug: v.string(),
    name: v.string(),
    category: v.union(
      v.literal("Nuts & Kernels"),
      v.literal("Dried Fruits"),
      v.literal("Snacking Mixes")
    ),
    description: v.string(),
    image: v.string(),
    accentColor: v.string(),
    order: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_slug", ["slug"]),

  categories: defineTable({
    number: v.string(),
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    image: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  inquiries: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    productInterest: v.optional(v.string()),
    status: v.union(v.literal("new"), v.literal("contacted"), v.literal("closed")),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),
});
