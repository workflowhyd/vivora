import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/authz";
import { descendantIdsOf } from "../lib/categoryTree";

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
  parentId: v.optional(v.id("categories")),
  seoTitle: v.optional(v.string()),
  seoDescription: v.optional(v.string()),
};

export const create = mutation({
  args: categoryFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (args.parentId) {
      const parent = await ctx.db.get(args.parentId);
      if (!parent) throw new Error("Parent category not found");
    }
    return ctx.db.insert("categories", args);
  },
});

export const update = mutation({
  args: { id: v.id("categories"), ...categoryFields },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    if (fields.parentId) {
      if (fields.parentId === id) {
        throw new Error("A category can't be its own parent.");
      }
      const allCategories = await ctx.db.query("categories").collect();
      if (descendantIdsOf(allCategories, id).has(fields.parentId)) {
        throw new Error("Can't move a category under one of its own sub-categories.");
      }
    }
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
    const hasChildren = await ctx.db
      .query("categories")
      .withIndex("by_parent", (q) => q.eq("parentId", id))
      .first();
    if (hasChildren) {
      throw new Error(
        "Cannot delete a category that still has sub-categories — move or delete them first."
      );
    }
    await ctx.db.delete(id);
  },
});
