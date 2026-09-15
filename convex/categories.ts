import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("categories").withIndex("by_order").order("asc").collect();
  },
});

export const get = query({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    number: v.string(),
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    image: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    if (!(await ctx.auth.getUserIdentity())) throw new Error("Unauthorized");
    return ctx.db.insert("categories", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    number: v.string(),
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    image: v.string(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...fields }) => {
    if (!(await ctx.auth.getUserIdentity())) throw new Error("Unauthorized");
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }) => {
    if (!(await ctx.auth.getUserIdentity())) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});
