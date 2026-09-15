import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const productCategory = v.union(
  v.literal("Nuts & Kernels"),
  v.literal("Dried Fruits"),
  v.literal("Snacking Mixes")
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("products").withIndex("by_order").order("asc").collect();
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    category: productCategory,
    description: v.string(),
    image: v.string(),
    accentColor: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    if (!(await ctx.auth.getUserIdentity())) throw new Error("Unauthorized");
    return ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    slug: v.string(),
    name: v.string(),
    category: productCategory,
    description: v.string(),
    image: v.string(),
    accentColor: v.string(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...fields }) => {
    if (!(await ctx.auth.getUserIdentity())) throw new Error("Unauthorized");
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    if (!(await ctx.auth.getUserIdentity())) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});
