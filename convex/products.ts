import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/authz";
import type { Doc } from "./_generated/dataModel";

const specification = v.object({ label: v.string(), value: v.string() });

const productFields = {
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
  specifications: v.optional(v.array(specification)),
  featured: v.boolean(),
  active: v.boolean(),
  sortOrder: v.number(),
  seoTitle: v.optional(v.string()),
  seoDescription: v.optional(v.string()),
  seoKeywords: v.optional(v.array(v.string())),
};

export const list = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    featured: v.optional(v.boolean()),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, { categoryId, featured, activeOnly }) => {
    let results: Doc<"products">[];
    if (categoryId) {
      results = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
        .order("asc")
        .collect();
    } else if (featured !== undefined) {
      results = await ctx.db
        .query("products")
        .withIndex("by_featured", (q) => q.eq("featured", featured))
        .order("asc")
        .collect();
    } else if (activeOnly) {
      results = await ctx.db
        .query("products")
        .withIndex("by_active", (q) => q.eq("active", true))
        .order("asc")
        .collect();
    } else {
      results = await ctx.db.query("products").withIndex("by_sortOrder").order("asc").collect();
    }

    if (categoryId && featured !== undefined) {
      results = results.filter((p) => p.featured === featured);
    }
    if (activeOnly && (categoryId || featured !== undefined)) {
      results = results.filter((p) => p.active);
    }
    return results;
  },
});

export const listByCategory = query({
  args: { categoryId: v.id("categories"), activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, { categoryId, activeOnly }): Promise<Doc<"products">[]> => {
    let results = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .order("asc")
      .collect();
    if (activeOnly) {
      results = results.filter((p) => p.active);
    }
    return results;
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const products = await ctx.db.query("products").withIndex("by_sortOrder").order("asc").collect();
    const categories = await ctx.db.query("categories").collect();
    const categoryNameById = new Map(categories.map((c) => [c._id, c.name]));
    return products.map((product) => ({
      ...product,
      categoryName: categoryNameById.get(product.categoryId) ?? "Unknown",
    }));
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!product) return null;
    const category = await ctx.db.get(product.categoryId);
    return { ...product, category };
  },
});

export const create = mutation({
  args: productFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    return ctx.db.insert("products", { ...args, createdAt: now, updatedAt: now });
  },
});

export const update = mutation({
  args: { id: v.id("products"), ...productFields },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
