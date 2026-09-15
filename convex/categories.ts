import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/authz";

export const list = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, { activeOnly }) => {
    if (activeOnly) {
      return ctx.db
        .query("categories")
        .withIndex("by_active", (q) => q.eq("active", true))
        .order("asc")
        .collect();
    }
    return ctx.db.query("categories").withIndex("by_sortOrder").order("asc").collect();
  },
});

export const get = query({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

const categoryFields = {
  name: v.string(),
  slug: v.string(),
  description: v.string(),
  image: v.string(),
  active: v.boolean(),
  sortOrder: v.number(),
  seoTitle: v.optional(v.string()),
  seoDescription: v.optional(v.string()),
};

export const create = mutation({
  args: categoryFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db.insert("categories", args);
  },
});

export const update = mutation({
  args: { id: v.id("categories"), ...categoryFields },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const stillReferenced = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", id))
      .first();
    if (stillReferenced) {
      throw new Error(
        "Cannot delete a category that still has products — move or delete its products first."
      );
    }
    await ctx.db.delete(id);
  },
});
