import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    image: v.string(),
    active: v.boolean(),
    sortOrder: v.number(),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_sortOrder", ["sortOrder"])
    .index("by_active", ["active", "sortOrder"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"),
    shortDescription: v.string(),
    description: v.string(),
    images: v.array(v.string()),
    thumbnail: v.string(),
    ingredients: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    applications: v.optional(v.array(v.string())),
    packSizes: v.optional(v.array(v.string())),
    shelfLife: v.optional(v.string()),
    storage: v.optional(v.string()),
    moq: v.optional(v.string()),
    specifications: v.optional(
      v.array(v.object({ label: v.string(), value: v.string() }))
    ),
    featured: v.boolean(),
    active: v.boolean(),
    sortOrder: v.number(),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_sortOrder", ["sortOrder"])
    .index("by_category", ["categoryId", "sortOrder"])
    .index("by_featured", ["featured", "sortOrder"])
    .index("by_active", ["active", "sortOrder"]),

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
