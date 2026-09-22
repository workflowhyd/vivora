import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/authz";

// Public — called from the site's contact/quote form. No auth check: this is
// the one write in the schema anonymous visitors are meant to make. status
// and createdAt are always set server-side, never trusted from the client.
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    message: v.string(),
    productInterest: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("inquiries", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.db.query("inquiries").withIndex("by_createdAt").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("inquiries"),
    status: v.union(v.literal("new"), v.literal("contacted"), v.literal("closed")),
  },
  handler: async (ctx, { id, status }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { status });
  },
});

export const remove = mutation({
  args: { id: v.id("inquiries") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
