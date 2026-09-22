import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// One-time restructure of the flat category list into a tree: Dehydrated
// Vegetables/Fruits and Vegetable/Fruit Powders keep their existing slug,
// name and products, and become leaves under new "Vegetables" and "Fruits"
// group categories, themselves under a new "Dehydrated Products" group. A new
// "Flowers" leaf is added alongside them (no products yet). Every other
// existing category (Leaf Powders, Ready-to-Cook, Ready-to-Fry, Spice &
// Ingredient Powders, Specialty Products) is untouched and stays top-level.
// Safe to re-run — it's a no-op once "dehydrated-products" already exists.
export const groupDehydratedCategories = internalMutation({
  args: {},
  handler: async (ctx) => {
    const already = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", "dehydrated-products"))
      .unique();
    if (already) return "already run — no changes made";

    const bySlug = async (slug: string) =>
      ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

    const veg = await bySlug("dehydrated-vegetables");
    const vegPowder = await bySlug("vegetable-powders");
    const fruit = await bySlug("dehydrated-fruits");
    const fruitPowder = await bySlug("fruit-powders");
    if (!veg || !vegPowder || !fruit || !fruitPowder) {
      throw new Error(
        "Expected categories not found — run convex/seed.ts first, or check slugs manually."
      );
    }

    const dehydratedProductsId = await ctx.db.insert("categories", {
      name: "Dehydrated Products",
      slug: "dehydrated-products",
      description:
        "Sun- and machine-dried vegetables, fruits and flowers — as slices or finely milled powders — for food manufacturing, retail and export.",
      image:
        "https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/7/7d/Joint_venture_dehydrated_dried_vegetables.jpg?w=1600",
      active: true,
      sortOrder: 1,
    });

    const vegetablesId = await ctx.db.insert("categories", {
      name: "Vegetables",
      slug: "vegetables",
      description: "Dehydrated vegetables, as whole pieces and slices or milled into fine powders.",
      image:
        "https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/d/df/Joint_venture_dehydrated_dried_vegetables_%282%29.jpg?w=1600",
      active: true,
      sortOrder: 1,
      parentId: dehydratedProductsId,
    });

    const fruitsId = await ctx.db.insert("categories", {
      name: "Fruits",
      slug: "fruits",
      description: "Dehydrated fruits, as slices and pieces or milled into fine powders.",
      image:
        "https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/4/45/Dried_Mango_Slices.JPG?w=1600",
      active: true,
      sortOrder: 2,
      parentId: dehydratedProductsId,
    });

    await ctx.db.insert("categories", {
      name: "Flowers",
      slug: "flowers",
      description: "Dehydrated edible and decorative flowers for tea blends, garnish and natural colour.",
      image:
        "https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/0/07/Moringa_leaves_powder.jpg?w=1600",
      active: true,
      sortOrder: 3,
      parentId: dehydratedProductsId,
    });

    await ctx.db.patch(veg._id, { parentId: vegetablesId, sortOrder: 1 });
    await ctx.db.patch(vegPowder._id, { parentId: vegetablesId, sortOrder: 2 });
    await ctx.db.patch(fruit._id, { parentId: fruitsId, sortOrder: 1 });
    await ctx.db.patch(fruitPowder._id, { parentId: fruitsId, sortOrder: 2 });

    // Renumber the remaining top-level categories after Dehydrated Products.
    const rest = [
      "leaf-powders",
      "ready-to-cook",
      "ready-to-fry",
      "spice-ingredient-powders",
      "specialty-products",
    ];
    for (let i = 0; i < rest.length; i++) {
      const category = await bySlug(rest[i]);
      if (category) await ctx.db.patch(category._id, { sortOrder: i + 2 });
    }

    return "done";
  },
});

// The "featured" flag was dropped from the products schema/UI (there was no
// use for it — the catalogue has no featured section). Patching a field to
// `undefined` removes it from the document, so this clears the stale value
// left on documents written under the old schema. Safe to re-run.
export const removeFeaturedField = internalMutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let cleared = 0;
    for (const product of products) {
      if ("featured" in product) {
        // `featured` no longer exists in the schema, so it's typed as excess
        // here on purpose — this cast is only to unset that stale field.
        await ctx.db.patch(product._id, { featured: undefined } as Partial<typeof product>);
        cleared++;
      }
    }
    return `cleared "featured" from ${cleared} of ${products.length} products`;
  },
});

// Sets the WhatsApp button's number (the "site.whatsapp" admin field on the
// Request a Quote page) once, from outside the admin panel. Safe to re-run —
// it always overwrites with the given number.
export const setWhatsappNumber = internalMutation({
  args: { digits: v.string() },
  handler: async (ctx, { digits }) => {
    const existing = await ctx.db
      .query("pageContent")
      .withIndex("by_key", (q) => q.eq("key", "site.whatsapp"))
      .unique();
    const fields = { key: "site.whatsapp", kind: "text" as const, text: digits, updatedAt: Date.now() };
    if (existing) await ctx.db.replace(existing._id, fields);
    else await ctx.db.insert("pageContent", fields);
  },
});
