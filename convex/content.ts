import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireAdmin } from "./lib/authz";
import { pageIds, slotByKey } from "./lib/contentRegistry";

const kindValidator = v.union(v.literal("text"), v.literal("image"), v.literal("video"));

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

// Uploads go straight to storage from the browser, so the size / type limits
// are enforced here, after the fact, against the stored file's metadata.
async function assertValidMedia(
  ctx: MutationCtx,
  storageId: Id<"_storage">,
  kind: "image" | "video"
) {
  const file = await ctx.db.system.get("_storage", storageId);
  if (!file) throw new Error("Uploaded file not found");
  const type = file.contentType ?? "";
  const limit = kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (!type.startsWith(`${kind}/`)) {
    await ctx.storage.delete(storageId);
    throw new Error(`That file is not a${kind === "image" ? "n image" : " video"}`);
  }
  if (file.size > limit) {
    await ctx.storage.delete(storageId);
    throw new Error(`File is too large (max ${limit / 1024 / 1024} MB)`);
  }
}

async function urlFor(ctx: QueryCtx, storageId?: Id<"_storage">, url?: string) {
  if (storageId) return await ctx.storage.getUrl(storageId);
  return url ?? null;
}

// ── Slot overrides ─────────────────────────────────────────────────────

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("pageContent").collect();
    return Promise.all(
      rows.map(async (row) => ({
        key: row.key,
        kind: row.kind,
        text: row.text,
        url: await urlFor(ctx, row.storageId),
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const setContent = mutation({
  args: {
    key: v.string(),
    text: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { key, text, storageId }) => {
    await requireAdmin(ctx);
    const slot = slotByKey.get(key);
    if (!slot) throw new Error(`Unknown content key: ${key}`);
    const kind = slot.kind === "textarea" ? "text" : slot.kind;

    const existing = await ctx.db
      .query("pageContent")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();

    if (kind === "text") {
      if (text === undefined) throw new Error("Text is required");
      if (text.length > 5000) throw new Error("Text is too long");
      const fields = { key, kind, text, storageId: undefined, updatedAt: Date.now() };
      if (existing) await ctx.db.replace(existing._id, fields);
      else await ctx.db.insert("pageContent", fields);
      return;
    }

    if (!storageId) throw new Error("A file is required");
    await assertValidMedia(ctx, storageId, kind);
    if (existing?.storageId && existing.storageId !== storageId) {
      await ctx.storage.delete(existing.storageId);
    }
    const fields = { key, kind, storageId, updatedAt: Date.now() };
    if (existing) await ctx.db.replace(existing._id, fields);
    else await ctx.db.insert("pageContent", fields);
  },
});

export const resetContent = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("pageContent")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (!existing) return;
    if (existing.storageId) await ctx.storage.delete(existing.storageId);
    await ctx.db.delete(existing._id);
  },
});

// ── Extra blocks ───────────────────────────────────────────────────────

async function withUrl(ctx: QueryCtx, block: { storageId?: Id<"_storage">; url?: string }) {
  return { mediaUrl: await urlFor(ctx, block.storageId, block.url) };
}

export const blocksForPage = query({
  args: { page: v.string() },
  handler: async (ctx, { page }) => {
    const blocks = await ctx.db
      .query("pageBlocks")
      .withIndex("by_page", (q) => q.eq("page", page))
      .collect();
    return Promise.all(
      blocks
        .filter((b) => b.active)
        .map(async (b) => ({ ...b, ...(await withUrl(ctx, b)) }))
    );
  },
});

export const blocksForPageAdmin = query({
  args: { page: v.string() },
  handler: async (ctx, { page }) => {
    await requireAdmin(ctx);
    const blocks = await ctx.db
      .query("pageBlocks")
      .withIndex("by_page", (q) => q.eq("page", page))
      .collect();
    return Promise.all(blocks.map(async (b) => ({ ...b, ...(await withUrl(ctx, b)) })));
  },
});

// Admin editor needs to know which slots are overridden without the public
// query's URL-only shape, so it just reuses getAll on the client.

const blockFields = {
  heading: v.optional(v.string()),
  body: v.optional(v.string()),
  caption: v.optional(v.string()),
  storageId: v.optional(v.id("_storage")),
  url: v.optional(v.string()),
  active: v.boolean(),
};

function assertBlockShape(
  kind: "text" | "image" | "video",
  b: { body?: string; storageId?: Id<"_storage">; url?: string }
) {
  if (kind === "text" && !b.body?.trim()) throw new Error("Text blocks need some text");
  if (kind !== "text" && !b.storageId && !b.url) throw new Error("Upload a file or add a link");
  if (b.url && !/^https?:\/\//i.test(b.url)) throw new Error("Links must start with http(s)://");
}

export const createBlock = mutation({
  args: { page: v.string(), kind: kindValidator, ...blockFields },
  handler: async (ctx, { page, kind, ...fields }) => {
    await requireAdmin(ctx);
    if (!pageIds.includes(page)) throw new Error("Unknown page");
    assertBlockShape(kind, fields);
    if (fields.storageId && kind !== "text") await assertValidMedia(ctx, fields.storageId, kind);
    const last = await ctx.db
      .query("pageBlocks")
      .withIndex("by_page", (q) => q.eq("page", page))
      .order("desc")
      .first();
    return await ctx.db.insert("pageBlocks", {
      page,
      kind,
      ...fields,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    });
  },
});

export const updateBlock = mutation({
  args: { id: v.id("pageBlocks"), ...blockFields },
  handler: async (ctx, { id, ...fields }) => {
    await requireAdmin(ctx);
    const block = await ctx.db.get(id);
    if (!block) throw new Error("Block not found");
    assertBlockShape(block.kind, fields);
    if (fields.storageId && block.kind !== "text" && fields.storageId !== block.storageId) {
      await assertValidMedia(ctx, fields.storageId, block.kind);
    }
    if (block.storageId && block.storageId !== fields.storageId) {
      await ctx.storage.delete(block.storageId);
    }
    await ctx.db.replace(id, {
      page: block.page,
      kind: block.kind,
      sortOrder: block.sortOrder,
      ...fields,
    });
  },
});

export const moveBlock = mutation({
  args: { id: v.id("pageBlocks"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { id, direction }) => {
    await requireAdmin(ctx);
    const block = await ctx.db.get(id);
    if (!block) throw new Error("Block not found");
    const blocks = await ctx.db
      .query("pageBlocks")
      .withIndex("by_page", (q) => q.eq("page", block.page))
      .collect();
    const i = blocks.findIndex((b) => b._id === id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= blocks.length) return;
    // Swap positions; renumber so ties from earlier deletes can't stall a move.
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    for (let n = 0; n < blocks.length; n++) {
      if (blocks[n].sortOrder !== n + 1) await ctx.db.patch(blocks[n]._id, { sortOrder: n + 1 });
    }
  },
});

export const removeBlock = mutation({
  args: { id: v.id("pageBlocks") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const block = await ctx.db.get(id);
    if (!block) return;
    if (block.storageId) await ctx.storage.delete(block.storageId);
    await ctx.db.delete(id);
  },
});
