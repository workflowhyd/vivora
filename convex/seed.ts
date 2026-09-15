import { internalMutation } from "./_generated/server";
import { categories as categorySeed } from "./seedData/categories";
import { products as productSeed } from "./seedData/products";
import type { Id } from "./_generated/dataModel";

// One-time seed of the dehydrated-food catalogue. Safe to re-run — it's a
// no-op once either table already has rows. Categories are inserted first so
// products can resolve their categoryId from the slug map below.
export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingCategory = await ctx.db.query("categories").first();
    const categoryIdBySlug = new Map<string, Id<"categories">>();

    if (!existingCategory) {
      for (const category of categorySeed) {
        const id = await ctx.db.insert("categories", category);
        categoryIdBySlug.set(category.slug, id);
      }
    } else {
      const existing = await ctx.db.query("categories").collect();
      for (const category of existing) {
        categoryIdBySlug.set(category.slug, category._id);
      }
    }

    const existingProduct = await ctx.db.query("products").first();
    if (!existingProduct) {
      const now = Date.now();
      for (const { categorySlug, images, ...product } of productSeed) {
        const categoryId = categoryIdBySlug.get(categorySlug);
        if (!categoryId) {
          throw new Error(`Seed error: no category found for slug "${categorySlug}"`);
        }
        await ctx.db.insert("products", {
          ...product,
          images: [...images],
          categoryId,
          active: true,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  },
});
