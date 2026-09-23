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

const STANDARD_PACK_SIZES = ["25 kg bulk bag", "10 kg carton", "1 kg retail pouch"];
const STANDARD_STORAGE =
  "Store in a cool, dry place away from direct sunlight in the original sealed packaging.";
const STANDARD_MOQ = "1 x 25 kg bag (mixed pallet quantities available on request)";
const STANDARD_SHELF_LIFE = "18 months from date of manufacture";

// A handful of seed-data thumbnails turned out to be generic or outright
// mismatched (e.g. Tomato Powder showed a chili powder photo) once product
// photos actually started rendering on the site. Corrects the one we have an
// accurate free photo for, and clears the rest to "" (the site falls back to
// a plain placeholder icon rather than show a wrong photo) until real photos
// are supplied. Safe to re-run.
export const fixInaccurateProductPhotos = internalMutation({
  args: {},
  handler: async (ctx) => {
    const bySlug = async (slug: string) =>
      ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

    const onionPowder = await bySlug("onion-powder");
    if (onionPowder) {
      const accurate =
        "https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/3/36/Onion_Powder%2C_Penzeys_Spices%2C_Arlington_Heights_MA.jpg?w=1600";
      await ctx.db.patch(onionPowder._id, { thumbnail: accurate, images: [accurate] });
    }

    const clear = [
      "dehydrated-onion-flakes",
      "beetroot-powder",
      "banana-fruit-powder",
      "tomato-powder",
      "instant-khichdi-mix",
    ];
    let cleared = 0;
    for (const slug of clear) {
      const product = await bySlug(slug);
      if (product) {
        await ctx.db.patch(product._id, { thumbnail: "", images: [] });
        cleared++;
      }
    }
    return `set an accurate photo for Onion Powder; cleared the mismatched photo on ${cleared} products`;
  },
});

// New Vegetable/Fruit Powders SKUs. No thumbnail yet (no accurate free photo
// available) — set one later from /admin/products or via setProductPhoto.
// Safe to re-run — skips a product whose slug already exists.
export const addPowderProducts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    const categoryId = (slug: string) => {
      const c = categories.find((c) => c.slug === slug);
      if (!c) throw new Error(`Category not found: ${slug}`);
      return c._id;
    };
    const exists = async (slug: string) =>
      (await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()) !== null;

    const now = Date.now();
    const toAdd = [
      {
        slug: "carrot-powder",
        name: "Carrot Powder",
        categorySlug: "vegetable-powders",
        sortOrder: 4,
        shortDescription: "Vibrant orange carrot powder for natural colour, flavour and nutrition.",
        description:
          "Made from sun-dried, finely milled carrots, our carrot powder brings natural sweetness, colour and beta-carotene to soups, snacks, bakery and health food formulations.",
        benefits: ["Natural orange colour", "Rich in beta-carotene", "Long shelf life"],
        applications: ["Soups and sauces", "Bakery and snacks", "Nutrition fortification"],
        ingredients: ["100% dehydrated carrot"],
        specifications: [{ label: "Mesh size", value: "80-100 mesh" }],
      },
      {
        slug: "papaya-powder",
        name: "Papaya Powder",
        categorySlug: "fruit-powders",
        sortOrder: 3,
        shortDescription: "Naturally sweet papaya powder for smoothies, bakery and nutraceutical use.",
        description:
          "Freeze- and spray-dried papaya powder that carries the full tropical flavour and nutrition of ripe papaya into beverages, bakery and health food formulations.",
        benefits: ["No added sugar", "Retains natural flavour", "Rich in vitamin C"],
        applications: ["Smoothies and beverages", "Bakery inclusions", "Nutraceuticals"],
        ingredients: ["100% dehydrated papaya"],
        specifications: [{ label: "Mesh size", value: "80-100 mesh" }],
      },
      {
        // "ABC" = Apple, Beetroot, Carrot — the well-known wellness juice
        // blend, dehydrated and milled. Confirm this is the intended product.
        slug: "abc-powder",
        name: "ABC Powder",
        categorySlug: "vegetable-powders",
        sortOrder: 5,
        shortDescription: "Apple, beetroot and carrot powder blend for natural wellness and colour.",
        description:
          "A dehydrated blend of apple, beetroot and carrot — the same trio behind the popular ABC juice — milled into a convenient powder for health mixes, smoothies and natural colouring.",
        benefits: ["Natural wellness blend", "No added sugar", "Rich in natural colour and fibre"],
        applications: ["Health and wellness mixes", "Smoothies and beverages", "Natural food colouring"],
        ingredients: ["Dehydrated apple", "Dehydrated beetroot", "Dehydrated carrot"],
        specifications: [{ label: "Mesh size", value: "80-100 mesh" }],
      },
    ];

    let added = 0;
    for (const p of toAdd) {
      if (await exists(p.slug)) continue;
      await ctx.db.insert("products", {
        name: p.name,
        slug: p.slug,
        categoryId: categoryId(p.categorySlug),
        shortDescription: p.shortDescription,
        description: p.description,
        images: [],
        thumbnail: "",
        ingredients: p.ingredients,
        benefits: p.benefits,
        applications: p.applications,
        packSizes: STANDARD_PACK_SIZES,
        shelfLife: STANDARD_SHELF_LIFE,
        storage: STANDARD_STORAGE,
        moq: STANDARD_MOQ,
        specifications: p.specifications,
        active: true,
        sortOrder: p.sortOrder,
        createdAt: now,
        updatedAt: now,
      });
      added++;
    }
    return `added ${added} of ${toAdd.length} products`;
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

// Cropped from the two banner photos supplied for the home page (the same
// Vivora-branded packs), rather than generic stock — an accurate, on-brand
// photo instead of a mismatched one. Curry Leaf and Mint Leaf Powder have no
// accurate photo available (the previous ones showed a random wild bush and
// an unrelated market stall), so they're cleared to the plain placeholder
// instead. Safe to re-run.
export const fixMoreProductPhotos = internalMutation({
  args: {},
  handler: async (ctx) => {
    const bySlug = async (slug: string) =>
      ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

    const set: [string, string][] = [
      ["tomato-powder", "/images/products/tomato-powder.jpg"],
      ["turmeric-powder", "/images/products/turmeric-powder.jpg"],
    ];
    for (const [slug, url] of set) {
      const product = await bySlug(slug);
      if (product) await ctx.db.patch(product._id, { thumbnail: url, images: [url] });
    }

    const clear = ["curry-leaf-powder", "mint-leaf-powder"];
    for (const slug of clear) {
      const product = await bySlug(slug);
      if (product) await ctx.db.patch(product._id, { thumbnail: "", images: [] });
    }

    return `set ${set.length} accurate photos, cleared ${clear.length} mismatched ones`;
  },
});

// A single supplied banner image contained 6 branded product photos in a 2x3
// grid (Curry Leaf, Turmeric, Spinach, Ginger, Pumpkin, Garlic Powder), each
// cropped to its own file under public/images/products/. Sets the photo on
// the four existing products that match, and adds Spinach Powder and Pumpkin
// Powder (new SKUs, no existing entry) under Vegetable Powders. Safe to
// re-run — patches existing products every time, skips inserts whose slug
// already exists.
export const addSixPowderPhotosFromBannerGrid = internalMutation({
  args: {},
  handler: async (ctx) => {
    const bySlug = async (slug: string) =>
      ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

    const setPhoto: [string, string][] = [
      ["curry-leaf-powder", "/images/products/curry-leaf-powder.jpg"],
      ["turmeric-powder", "/images/products/turmeric-powder.jpg"],
      ["ginger-powder", "/images/products/ginger-powder.jpg"],
      ["garlic-powder", "/images/products/garlic-powder.jpg"],
    ];
    let updated = 0;
    for (const [slug, url] of setPhoto) {
      const product = await bySlug(slug);
      if (product) {
        await ctx.db.patch(product._id, { thumbnail: url, images: [url] });
        updated++;
      }
    }

    const vegetablePowders = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", "vegetable-powders"))
      .unique();
    if (!vegetablePowders) throw new Error("Category not found: vegetable-powders");

    const now = Date.now();
    const toAdd = [
      {
        slug: "spinach-powder",
        name: "Spinach Powder",
        sortOrder: 6,
        shortDescription: "Vibrant green spinach powder, rich in iron and natural nutrition.",
        description:
          "Made from shade-dried, finely milled spinach leaves, our spinach powder brings natural green colour and iron-rich nutrition to health foods, bakery, and beverage formulations.",
        benefits: ["Rich in iron", "Natural green colour", "Long shelf life"],
        applications: ["Health and wellness mixes", "Bakery inclusions", "Natural food colouring"],
        ingredients: ["100% dehydrated spinach"],
        specifications: [{ label: "Mesh size", value: "80-100 mesh" }],
        image: "/images/products/spinach-powder.jpg",
      },
      {
        slug: "pumpkin-powder",
        name: "Pumpkin Powder",
        sortOrder: 7,
        shortDescription: "Naturally sweet pumpkin powder, rich in vitamins A and C.",
        description:
          "Made from sun-dried, finely milled pumpkin, our pumpkin powder brings natural sweetness, colour, and everyday nutrition to soups, bakery, and health food formulations.",
        benefits: ["Rich in vitamins A & C", "Natural orange colour", "Long shelf life"],
        applications: ["Soups and sauces", "Bakery and snacks", "Nutrition fortification"],
        ingredients: ["100% dehydrated pumpkin"],
        specifications: [{ label: "Mesh size", value: "80-100 mesh" }],
        image: "/images/products/pumpkin-powder.jpg",
      },
    ];

    let added = 0;
    for (const p of toAdd) {
      if (await bySlug(p.slug)) continue;
      await ctx.db.insert("products", {
        name: p.name,
        slug: p.slug,
        categoryId: vegetablePowders._id,
        shortDescription: p.shortDescription,
        description: p.description,
        images: [p.image],
        thumbnail: p.image,
        ingredients: p.ingredients,
        benefits: p.benefits,
        applications: p.applications,
        packSizes: STANDARD_PACK_SIZES,
        shelfLife: STANDARD_SHELF_LIFE,
        storage: STANDARD_STORAGE,
        moq: STANDARD_MOQ,
        specifications: p.specifications,
        active: true,
        sortOrder: p.sortOrder,
        createdAt: now,
        updatedAt: now,
      });
      added++;
    }

    return `updated photos on ${updated} products, added ${added} new products`;
  },
});

// The 6 banner-grid photos were re-cropped as lossless squares straight from
// the source collage (no JPEG re-compression), upscaled to 1200x1200 with
// Lanczos resampling, and re-encoded as WebP — replacing the JPEG crops from
// addSixPowderPhotosFromBannerGrid. Safe to re-run.
export const upgradeSixPowderPhotosToWebp = internalMutation({
  args: {},
  handler: async (ctx) => {
    const bySlug = async (slug: string) =>
      ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

    const setPhoto: [string, string][] = [
      ["curry-leaf-powder", "/images/products/curry-leaf-powder.webp"],
      ["turmeric-powder", "/images/products/turmeric-powder.webp"],
      ["spinach-powder", "/images/products/spinach-powder.webp"],
      ["ginger-powder", "/images/products/ginger-powder.webp"],
      ["pumpkin-powder", "/images/products/pumpkin-powder.webp"],
      ["garlic-powder", "/images/products/garlic-powder.webp"],
    ];
    let updated = 0;
    for (const [slug, url] of setPhoto) {
      const product = await bySlug(slug);
      if (product) {
        await ctx.db.patch(product._id, { thumbnail: url, images: [url] });
        updated++;
      }
    }
    return `updated ${updated} of ${setPhoto.length} products to WebP photos`;
  },
});

// Removes categories (and their products) the business doesn't actually
// stock: Ready-to-Fry and Specialty Products. A category can't be deleted
// while it still has products (see categories.remove), so its products go
// first. Safe to re-run — skips whatever's already gone.
export const removeUnstockedCategories = internalMutation({
  args: {},
  handler: async (ctx) => {
    const slugs = ["ready-to-fry", "specialty-products"];
    let removedProducts = 0;
    let removedCategories = 0;
    for (const slug of slugs) {
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!category) continue;
      const products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categoryId", category._id))
        .collect();
      for (const product of products) {
        await ctx.db.delete(product._id);
        removedProducts++;
      }
      await ctx.db.delete(category._id);
      removedCategories++;
    }
    return `removed ${removedCategories} categories and ${removedProducts} products`;
  },
});
