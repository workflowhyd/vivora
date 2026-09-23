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

// A banner collage supplied Papaya, ABC, Methi, Rose Petal, Jasmine
// Tea/Fragrance and Hibiscus Powder photos (each panel taller than wide, so
// unlike the earlier grids these were extracted at native aspect ratio with
// no cropping — object-contain on the site letterboxes them cleanly). Sets
// the photo on Papaya/ABC (already existed), and adds Methi Powder under
// Spice & Ingredient Powders and the three flower powders under the (so far
// empty) Flowers category. Safe to re-run.
export const addFlowerAndMethiPowderProducts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const bySlug = async (slug: string) =>
      ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
    const categoryBySlug = async (slug: string) => {
      const c = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!c) throw new Error(`Category not found: ${slug}`);
      return c;
    };

    const setPhoto: [string, string][] = [
      ["papaya-powder", "/images/products/papaya-powder.webp"],
      ["abc-powder", "/images/products/abc-powder.webp"],
    ];
    let updated = 0;
    for (const [slug, url] of setPhoto) {
      const product = await bySlug(slug);
      if (product) {
        await ctx.db.patch(product._id, { thumbnail: url, images: [url] });
        updated++;
      }
    }

    const spicePowders = await categoryBySlug("spice-ingredient-powders");
    const flowers = await categoryBySlug("flowers");
    const now = Date.now();

    const toAdd = [
      {
        slug: "methi-powder",
        name: "Methi Powder",
        categoryId: spicePowders._id,
        sortOrder: 5,
        shortDescription: "Traditional fenugreek powder for digestion and everyday wellness.",
        description:
          "Ground from sun-dried fenugreek, our methi powder carries the characteristic slightly bitter, nutty flavour used across Indian spice blends, pickles and traditional wellness formulations.",
        benefits: ["Supports digestion", "Helps maintain healthy blood sugar", "Rich in fibre"],
        applications: ["Spice blends", "Pickles", "Traditional formulations"],
        ingredients: ["100% dehydrated fenugreek"],
        image: "/images/products/methi-powder.webp",
      },
      {
        slug: "rose-petal-powder",
        name: "Rose Petal Powder",
        categoryId: flowers._id,
        sortOrder: 1,
        shortDescription: "Delicately dried rose petal powder for natural skin and beauty care.",
        description:
          "Shade-dried and finely milled rose petals, prized for their natural fragrance and gentle astringent properties across skincare, natural cosmetics and wellness formulations.",
        benefits: ["Supports healthy skin", "Rich in antioxidants", "Promotes a natural glow"],
        applications: ["Natural cosmetics", "Skincare formulations", "Wellness blends"],
        ingredients: ["100% dehydrated rose petals"],
        image: "/images/products/rose-petal-powder.webp",
      },
      {
        slug: "jasmine-tea-fragrance-powder",
        name: "Jasmine Tea / Fragrance Powder",
        categoryId: flowers._id,
        sortOrder: 2,
        shortDescription: "Fragrant jasmine flower powder for tea blends and aromatic formulations.",
        description:
          "Dried jasmine flowers milled into a fine powder, carrying a soothing natural fragrance suited to tea blends, potpourri and aromatic wellness products.",
        benefits: ["Promotes relaxation", "Natural fragrance", "Supports overall wellness"],
        applications: ["Tea blends", "Potpourri and fragrance", "Aromatic wellness products"],
        ingredients: ["100% dehydrated jasmine flowers"],
        image: "/images/products/jasmine-tea-fragrance-powder.webp",
      },
      {
        slug: "hibiscus-powder",
        name: "Hibiscus Powder",
        categoryId: flowers._id,
        sortOrder: 3,
        shortDescription: "Vibrant hibiscus flower powder for hair, skin and wellness use.",
        description:
          "Sun-dried hibiscus flowers ground into a rich red powder, a traditional ingredient for hair and skin care as well as tart herbal tea blends.",
        benefits: ["Supports hair health", "Promotes healthy skin", "Rich in antioxidants"],
        applications: ["Hair and skin care", "Herbal tea blends", "Natural cosmetics"],
        ingredients: ["100% dehydrated hibiscus flowers"],
        image: "/images/products/hibiscus-powder.webp",
      },
    ];

    let added = 0;
    for (const p of toAdd) {
      if (await bySlug(p.slug)) continue;
      await ctx.db.insert("products", {
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
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
        active: true,
        sortOrder: p.sortOrder,
        createdAt: now,
        updatedAt: now,
      });
      added++;
    }

    return `updated ${updated} photos, added ${added} of ${toAdd.length} products`;
  },
});

// The business wants exactly the 47 products on its master list (29 powders
// + 18 Ready-to-Cook items) — nothing else. This:
// 1. Deletes 7 products that aren't on that list.
// 2. Renames+re-slugs 6 products that ARE on the list but were seeded under
//    a different name (2 of which also move from Dehydrated Vegetables into
//    Ready-to-Cook, matching where the list puts them).
// 3. Deletes the now-empty Dehydrated Vegetables and Dehydrated Fruits
//    categories (every product that was in them got deleted or moved above).
// 4. Adds the 24 list items that don't exist under any name yet, as
//    placeholders (no photo — backfill via setProductPhoto once supplied).
// Safe to re-run — every step is a no-op once already applied.
export const reconcileTo47ProductList = internalMutation({
  args: {},
  handler: async (ctx) => {
    const bySlug = async (slug: string) =>
      ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
    const categoryBySlug = async (slug: string) => {
      const c = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!c) throw new Error(`Category not found: ${slug}`);
      return c;
    };

    const deleteSlugs = [
      "sun-dried-mango-cubes",
      "dehydrated-banana-chips",
      "dehydrated-mango-slices",
      "dehydrated-green-peas",
      "dehydrated-tomato-flakes",
      "mango-powder-amchur",
      "instant-vermicelli-upma-mix",
    ];
    let deleted = 0;
    for (const slug of deleteSlugs) {
      const product = await bySlug(slug);
      if (product) {
        await ctx.db.delete(product._id);
        deleted++;
      }
    }

    const readyToCook = await categoryBySlug("ready-to-cook");
    const renames: {
      slug: string;
      name: string;
      newSlug: string;
      categoryId?: (typeof readyToCook)["_id"];
    }[] = [
      { slug: "moringa-leaf-powder", name: "Moringa Powder", newSlug: "moringa-powder" },
      { slug: "banana-fruit-powder", name: "Banana Powder", newSlug: "banana-powder" },
      { slug: "mint-leaf-powder", name: "Mint Powder", newSlug: "mint-powder" },
      { slug: "red-chilli-powder", name: "Chilli Flakes / Powder", newSlug: "chilli-flakes-powder" },
      {
        slug: "dehydrated-onion-flakes",
        name: "Onion Flakes",
        newSlug: "onion-flakes",
        categoryId: readyToCook._id,
      },
      {
        slug: "mixed-vegetable-flakes",
        name: "Mixed Vegetable Dehydrated Pack",
        newSlug: "mixed-vegetable-dehydrated-pack",
        categoryId: readyToCook._id,
      },
    ];
    let renamed = 0;
    for (const r of renames) {
      const product = await bySlug(r.slug);
      if (product) {
        await ctx.db.patch(product._id, {
          name: r.name,
          slug: r.newSlug,
          ...(r.categoryId ? { categoryId: r.categoryId } : {}),
          updatedAt: Date.now(),
        });
        renamed++;
      }
    }

    let categoriesDeleted = 0;
    for (const slug of ["dehydrated-vegetables", "dehydrated-fruits"]) {
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (!category) continue;
      const remaining = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categoryId", category._id))
        .collect();
      if (remaining.length > 0) {
        throw new Error(`Category ${slug} still has ${remaining.length} products — not deleting`);
      }
      await ctx.db.delete(category._id);
      categoriesDeleted++;
    }

    const vegetablePowders = await categoryBySlug("vegetable-powders");
    const fruitPowders = await categoryBySlug("fruit-powders");
    const spicePowders = await categoryBySlug("spice-ingredient-powders");
    const flowers = await categoryBySlug("flowers");

    type NewProduct = {
      slug: string;
      name: string;
      categoryId: (typeof vegetablePowders)["_id"];
      shortDescription: string;
      description: string;
      benefits: string[];
      applications: string[];
      packSizes?: string[];
      moq?: string;
      shelfLife?: string;
      storage?: string;
    };

    const now = Date.now();
    const toAdd: NewProduct[] = [
      // Missing powders
      {
        slug: "sweet-potato-powder",
        name: "Sweet Potato Powder",
        categoryId: vegetablePowders._id,
        shortDescription: "Naturally sweet, vibrant orange sweet potato powder.",
        description:
          "Made from sun-dried, finely milled sweet potato, this powder brings natural sweetness, colour and everyday nutrition to bakery, beverage and health food formulations.",
        benefits: ["Naturally sweet", "Rich in beta-carotene", "Long shelf life"],
        applications: ["Bakery and snacks", "Health mixes", "Beverages"],
      },
      {
        slug: "vegetable-powder",
        name: "Vegetable Powder",
        categoryId: vegetablePowders._id,
        shortDescription: "A balanced blend of dehydrated vegetables milled into one convenient powder.",
        description:
          "A blend of dehydrated vegetables, dried and milled together into a single convenient powder for soups, seasoning blends and instant meal bases.",
        benefits: ["One SKU, multiple vegetables", "Consistent blend", "Long shelf life"],
        applications: ["Soups and sauces", "Seasoning blends", "Instant meal bases"],
      },
      {
        slug: "jackfruit-powder",
        name: "Jackfruit Powder",
        categoryId: fruitPowders._id,
        shortDescription: "Naturally sweet jackfruit powder for bakery and health food use.",
        description:
          "Made from dehydrated ripe jackfruit, finely milled to carry its distinctive sweet, tropical flavour into bakery, beverage and health food formulations.",
        benefits: ["Naturally sweet", "Rich in fibre", "Distinctive tropical flavour"],
        applications: ["Bakery inclusions", "Smoothies and beverages", "Health mixes"],
      },
      {
        slug: "coriander-powder",
        name: "Coriander Powder",
        categoryId: spicePowders._id,
        shortDescription: "Aromatic ground coriander for everyday cooking and spice blends.",
        description:
          "Ground from sun-dried coriander seed, this powder delivers the warm, citrusy aroma that forms the base of countless Indian spice blends and curries.",
        benefits: ["Aromatic and consistent", "Export-grade purity", "Long shelf life"],
        applications: ["Spice blends", "Curries", "Snack seasoning"],
      },
      {
        slug: "marigold-powder",
        name: "Marigold Powder",
        categoryId: flowers._id,
        shortDescription: "Vibrant marigold flower powder for natural care and wellness.",
        description:
          "Sun-dried marigold petals milled into a fine powder, valued for their vivid natural colour and traditional use in skincare and wellness formulations.",
        benefits: ["Supports eye health", "Rich in antioxidants", "Boosts immunity"],
        applications: ["Natural cosmetics", "Wellness blends", "Natural colouring"],
      },
      {
        slug: "chrysanthemum-powder",
        name: "Chrysanthemum Powder",
        categoryId: flowers._id,
        shortDescription: "Pure floral chrysanthemum powder for calming tea blends.",
        description:
          "Dried chrysanthemum flowers ground into a fine powder, traditionally used in calming tea blends and natural wellness formulations.",
        benefits: ["Supports relaxation", "Rich in antioxidants", "Promotes better sleep"],
        applications: ["Tea blends", "Wellness formulations", "Natural cosmetics"],
      },
      {
        slug: "lotus-petal-powder",
        name: "Lotus Petal Powder",
        categoryId: flowers._id,
        shortDescription: "Delicate lotus petal powder for natural beauty and wellness.",
        description:
          "Shade-dried lotus petals milled into a fine powder, prized in natural beauty and wellness formulations for their gentle, calming character.",
        benefits: ["Supports healthy skin", "Promotes inner calm", "Rich in antioxidants"],
        applications: ["Natural cosmetics", "Skincare formulations", "Wellness blends"],
      },
      {
        slug: "blue-tea-powder",
        name: "Blue Tea Powder",
        categoryId: flowers._id,
        shortDescription: "Vibrant butterfly pea flower powder, a natural blue colourant.",
        description:
          "Dried butterfly pea flowers milled into a vivid blue powder, popular as a natural colourant and as the base for colour-changing herbal tea blends.",
        benefits: ["Supports brain health", "Rich in antioxidants", "Natural detox support"],
        applications: ["Herbal tea blends", "Natural food colouring", "Wellness formulations"],
      },
      {
        slug: "lavender-powder",
        name: "Lavender Powder",
        categoryId: flowers._id,
        shortDescription: "Soothing lavender powder for calming wellness formulations.",
        description:
          "Dried lavender buds milled into a fine powder, carrying the plant's characteristic calming aroma into wellness blends and natural cosmetics.",
        benefits: ["Promotes relaxation", "Supports better sleep", "Natural stress relief"],
        applications: ["Wellness formulations", "Natural cosmetics", "Aromatic blends"],
      },
      // Missing Ready-to-Cook items
      {
        slug: "sabudana-sago-vadiyalu",
        name: "Sabudana (Sago) Vadiyalu",
        categoryId: readyToCook._id,
        shortDescription: "Traditional sun-dried sago vadiyalu, crispy and light when fried.",
        description:
          "Made using a traditional recipe, our sabudana vadiyalu are sun-dried and ready to fry into a light, crispy accompaniment.",
        benefits: ["Traditional recipe", "Sun-dried", "No preservatives"],
        applications: ["Retail snacking", "HoReCa accompaniments"],
      },
      {
        slug: "dried-brinjal-slices",
        name: "Dried Brinjal Slices",
        categoryId: readyToCook._id,
        shortDescription: "Farm-fresh brinjal, sun-dried into ready-to-cook slices.",
        description:
          "Farm-fresh brinjal sliced and sun-dried to lock in flavour, ready to rehydrate for curries and traditional preparations.",
        benefits: ["Farm fresh", "Sun-dried", "No preservatives"],
        applications: ["Curries", "Traditional preparations"],
      },
      {
        slug: "ginger-chips-dry",
        name: "Ginger Chips (Dry)",
        categoryId: readyToCook._id,
        shortDescription: "Spicy, aromatic dried ginger chips, naturally healthy.",
        description:
          "Sliced ginger, sun-dried to preserve its natural pungency and aroma — ready to use in cooking or as a snack base.",
        benefits: ["Rich in gingerols", "Sun-dried", "No preservatives"],
        applications: ["Cooking", "Snack bases", "Traditional formulations"],
      },
      {
        slug: "dried-bitter-gourd-chips",
        name: "Dried Bitter Gourd Chips",
        categoryId: readyToCook._id,
        shortDescription: "Crispy, nutritious bitter gourd chips, naturally dried.",
        description:
          "Sliced bitter gourd, sun-dried into crispy chips that rehydrate easily for traditional preparations.",
        benefits: ["Supports healthy living", "Sun-dried", "No preservatives"],
        applications: ["Traditional preparations", "Retail snacking"],
      },
      {
        slug: "tomato-vadiyalu-tomato-chips",
        name: "Tomato Vadiyalu / Tomato Chips",
        categoryId: readyToCook._id,
        shortDescription: "Tangy, flavourful sun-dried tomato vadiyalu.",
        description:
          "Sun-dried tomato, tangy and flavourful, ready to cook into traditional accompaniments.",
        benefits: ["Rich in lycopene", "Sun-dried", "No preservatives"],
        applications: ["Retail snacking", "Traditional preparations"],
      },
      {
        slug: "dried-dondakaya-ivy-gourd",
        name: "Dried Dondakaya (Ivy Gourd)",
        categoryId: readyToCook._id,
        shortDescription: "Naturally dried ivy gourd with a unique, traditional taste.",
        description:
          "Sliced ivy gourd (dondakaya), sun-dried to preserve its distinctive taste and texture for traditional South Indian preparations.",
        benefits: ["Supports digestion", "Sun-dried", "No preservatives"],
        applications: ["Traditional preparations", "Retail snacking"],
      },
      {
        slug: "garlic-flakes-fry-use",
        name: "Garlic Flakes (Fry Use)",
        categoryId: readyToCook._id,
        shortDescription: "Crispy, aromatic garlic flakes, ready for frying.",
        description:
          "Sliced garlic, dried to a crisp, ready-to-fry flake that enhances flavour across cooking and garnishing applications.",
        benefits: ["Enhances flavour", "Longer shelf life", "100% natural"],
        applications: ["Cooking", "Garnishing", "Snack coatings"],
      },
      {
        slug: "garlic-granules",
        name: "Garlic Granules",
        categoryId: readyToCook._id,
        shortDescription: "Fine, pure garlic granules — a versatile kitchen essential.",
        description:
          "Dehydrated garlic milled into fine granules, an easy-to-use, versatile kitchen essential for everyday cooking.",
        benefits: ["Easy to use", "Longer shelf life", "100% natural"],
        applications: ["Everyday cooking", "Seasoning blends"],
      },
      {
        slug: "sambar-vegetable-mix",
        name: "Sambar Vegetable Mix",
        categoryId: readyToCook._id,
        shortDescription: "An authentic, nutritious vegetable mix ready for sambar in minutes.",
        description:
          "A traditional blend of dehydrated vegetables sized for sambar, ready to rehydrate for an authentic, nutritious South Indian preparation in minutes.",
        benefits: ["Traditional recipe", "Rich in fibre", "100% natural"],
        applications: ["Sambar", "South Indian cooking"],
        packSizes: ["500 g pouch", "1 kg pouch", "10 kg foodservice pack"],
        moq: "500 units (mixed pack sizes available)",
      },
      {
        slug: "potato-cubes-dehydrated",
        name: "Potato Cubes (Dehydrated)",
        categoryId: readyToCook._id,
        shortDescription: "Convenient, versatile dehydrated potato cubes for any recipe.",
        description:
          "Diced potato, dehydrated for convenience and a long shelf life — perfect for curries, soups and ready-to-cook meal kits.",
        benefits: ["Easy to cook", "Longer shelf life", "100% natural"],
        applications: ["Curries", "Soups", "Ready-to-cook meal kits"],
      },
      {
        slug: "soup-vegetable-mix",
        name: "Soup Vegetable Mix",
        categoryId: readyToCook._id,
        shortDescription: "A wholesome, nutritious vegetable mix, ready for soup in minutes.",
        description:
          "A blend of dehydrated vegetables sized for soup, rehydrating quickly into a wholesome, nutritious bowl.",
        benefits: ["Easy to cook", "High nutrition", "Real ingredients"],
        applications: ["Soups", "Instant meal bases"],
        packSizes: ["500 g pouch", "1 kg pouch", "10 kg foodservice pack"],
        moq: "500 units (mixed pack sizes available)",
      },
      {
        slug: "vegetable-upma-mix",
        name: "Vegetable Upma Mix",
        categoryId: readyToCook._id,
        shortDescription: "A wholesome vegetable upma base ready in minutes.",
        description:
          "A pre-mixed blend of semolina, dehydrated vegetables and seasoning — a wholesome, quick-preparation start to the day.",
        benefits: ["Ready in minutes", "Nutritious and tasty", "100% natural"],
        applications: ["Breakfast meal kits", "Retail ready-meals"],
        packSizes: ["500 g pouch", "1 kg pouch", "10 kg foodservice pack"],
        moq: "500 units (mixed pack sizes available)",
      },
      {
        slug: "tomato-soup-premix",
        name: "Tomato Soup Premix",
        categoryId: readyToCook._id,
        shortDescription: "Warm, nourishing tomato soup, ready with real tomatoes.",
        description:
          "A convenient tomato soup premix made with real dehydrated tomato — just add water for a warm, nourishing bowl of soup.",
        benefits: ["Real tomatoes", "No preservatives", "Rich in antioxidants"],
        applications: ["Instant soups", "Retail ready-meals"],
        packSizes: ["500 g pouch", "1 kg pouch"],
        moq: "500 units (mixed pack sizes available)",
      },
      {
        slug: "dal-fry-mix",
        name: "Dal Fry Mix",
        categoryId: readyToCook._id,
        shortDescription: "Authentic dal fry, ready in minutes.",
        description:
          "A pre-mixed blend of lentils and traditional spices for an authentic dal fry, ready in minutes with a good source of protein.",
        benefits: ["Good source of protein", "No preservatives", "Rich in fibre"],
        applications: ["Retail ready-meals", "Institutional catering"],
        packSizes: ["500 g pouch", "1 kg pouch"],
        moq: "500 units (mixed pack sizes available)",
      },
      {
        slug: "rasam-mix",
        name: "Rasam Mix",
        categoryId: readyToCook._id,
        shortDescription: "Spicy, tangy South Indian rasam, ready in every sip.",
        description:
          "A traditional South Indian rasam premix carrying authentic spice and tang — just add water for a comforting, digestion-supporting bowl.",
        benefits: ["Natural ingredients", "Authentic taste", "Supports digestion"],
        applications: ["South Indian cooking", "Retail ready-meals"],
        packSizes: ["500 g pouch", "1 kg pouch"],
        moq: "500 units (mixed pack sizes available)",
      },
    ];

    let added = 0;
    for (let i = 0; i < toAdd.length; i++) {
      const p = toAdd[i];
      if (await bySlug(p.slug)) continue;
      await ctx.db.insert("products", {
        name: p.name,
        slug: p.slug,
        categoryId: p.categoryId,
        shortDescription: p.shortDescription,
        description: p.description,
        images: [],
        thumbnail: "",
        benefits: p.benefits,
        applications: p.applications,
        packSizes: p.packSizes ?? STANDARD_PACK_SIZES,
        shelfLife: p.shelfLife ?? STANDARD_SHELF_LIFE,
        storage: p.storage ?? STANDARD_STORAGE,
        moq: p.moq ?? STANDARD_MOQ,
        active: true,
        sortOrder: 100 + i,
        createdAt: now,
        updatedAt: now,
      });
      added++;
    }

    return `deleted ${deleted} products, renamed ${renamed}, deleted ${categoriesDeleted} empty categories, added ${added} of ${toAdd.length} placeholder products`;
  },
});

// Sets photos for the 29 products backfilled from 5 collages dropped into
// assets/incoming (Marigold/Chrysanthemum/Lotus Petal/Blue Tea/Lavender;
// Sabudana/Brinjal/Ginger Chips/Bitter Gourd/Tomato Vadiyalu/Dondakaya;
// Garlic Flakes/Mixed Veg/Onion Flakes/Garlic Granules/Sambar/Potato Cubes;
// Soup Veg Mix/Khichdi/Upma/Tomato Soup/Dal Fry/Rasam; Chilli/Mint/Sweet
// Potato/Vegetable/Jackfruit/Coriander). Every panel was extracted at native
// aspect ratio (no cropping). Safe to re-run.
export const setPhotosForFiveMoreCollages = internalMutation({
  args: {},
  handler: async (ctx) => {
    const bySlug = async (slug: string) =>
      ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

    const slugs = [
      "marigold-powder",
      "chrysanthemum-powder",
      "lotus-petal-powder",
      "blue-tea-powder",
      "lavender-powder",
      "sabudana-sago-vadiyalu",
      "dried-brinjal-slices",
      "ginger-chips-dry",
      "dried-bitter-gourd-chips",
      "tomato-vadiyalu-tomato-chips",
      "dried-dondakaya-ivy-gourd",
      "garlic-flakes-fry-use",
      "mixed-vegetable-dehydrated-pack",
      "onion-flakes",
      "garlic-granules",
      "sambar-vegetable-mix",
      "potato-cubes-dehydrated",
      "soup-vegetable-mix",
      "instant-khichdi-mix",
      "vegetable-upma-mix",
      "tomato-soup-premix",
      "dal-fry-mix",
      "rasam-mix",
      "chilli-flakes-powder",
      "mint-powder",
      "sweet-potato-powder",
      "vegetable-powder",
      "jackfruit-powder",
      "coriander-powder",
    ];

    let updated = 0;
    for (const slug of slugs) {
      const product = await bySlug(slug);
      const url = `/images/products/${slug}.webp`;
      if (product) {
        await ctx.db.patch(product._id, { thumbnail: url, images: [url] });
        updated++;
      }
    }
    return `updated ${updated} of ${slugs.length} products`;
  },
});

// Sets photos for the final 6 products — Moringa/Tomato/Banana/Carrot/
// Beetroot/Onion Powder ("Set 1"), the last collage of the 47-item list.
// Replaces the older jar photo on Tomato Powder. Note this collage uses a
// different Vivora logo render (script wordmark, no leaf/V icon) than the
// other 41 photographed products — a branding inconsistency to reconcile
// later, not something to fix here. Safe to re-run.
export const setPhotosForSetOne = internalMutation({
  args: {},
  handler: async (ctx) => {
    const bySlug = async (slug: string) =>
      ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

    const slugs = [
      "moringa-powder",
      "tomato-powder",
      "banana-powder",
      "carrot-powder",
      "beetroot-powder",
      "onion-powder",
    ];

    let updated = 0;
    for (const slug of slugs) {
      const product = await bySlug(slug);
      const url = `/images/products/${slug}.webp`;
      if (product) {
        await ctx.db.patch(product._id, { thumbnail: url, images: [url] });
        updated++;
      }
    }
    return `updated ${updated} of ${slugs.length} products`;
  },
});

// Every category still used a generic Wikipedia stock photo as its
// thumbnail (several duplicated across unrelated categories — e.g.
// "Flowers" showed a moringa LEAF photo). Now that every product has a real
// branded photo, point each category at one of its own. Safe to re-run.
export const useRealPhotosForCategoryThumbnails = internalMutation({
  args: {},
  handler: async (ctx) => {
    const setImage: [string, string][] = [
      // Top-level (shown on the home page)
      ["dehydrated-products", "/images/products/tomato-powder.webp"],
      ["spice-ingredient-powders", "/images/products/turmeric-powder.webp"],
      ["ready-to-cook", "/images/products/instant-khichdi-mix.webp"],
      ["leaf-powders", "/images/products/moringa-powder.webp"],
      // Sub-categories (shown once a visitor drills into Dehydrated Products)
      ["vegetables", "/images/products/carrot-powder.webp"],
      ["fruits", "/images/products/banana-powder.webp"],
      ["flowers", "/images/products/hibiscus-powder.webp"],
      ["vegetable-powders", "/images/products/beetroot-powder.webp"],
      ["fruit-powders", "/images/products/papaya-powder.webp"],
    ];

    let updated = 0;
    for (const [slug, image] of setImage) {
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (category) {
        await ctx.db.patch(category._id, { image });
        updated++;
      }
    }
    return `updated ${updated} of ${setImage.length} category thumbnails`;
  },
});

// Adds the requested YouTube Short as a video block on the home page, with
// a description alongside it (PageBlocks renders a YouTube link + heading/
// body as a side-by-side row — see components/PageBlocks.tsx). Safe to
// re-run — skips if a block with this exact URL already exists on the page.
export const addHomeYoutubeVideoBlock = internalMutation({
  args: {},
  handler: async (ctx) => {
    const url = "https://youtube.com/shorts/P_tFt5QgCDI?feature=share";
    const existing = await ctx.db
      .query("pageBlocks")
      .withIndex("by_page", (q) => q.eq("page", "home"))
      .collect();
    if (existing.some((b) => b.url === url)) return "already added — no changes made";

    const last = existing.sort((a, b) => b.sortOrder - a.sortOrder)[0];
    await ctx.db.insert("pageBlocks", {
      page: "home",
      kind: "video",
      url,
      heading: "See Vivora Foods in Action",
      body: "From farm-fresh produce to carefully dehydrated, export-ready powders and ready-to-cook packs — take a quick look at how Vivora Foods brings natural goodness to your kitchen, one batch at a time.",
      active: true,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    });
    return "added";
  },
});

// A reference poster for Tomato Powder showed the actual retail pack-size
// lineup — 100g/250g/500g/1kg pouches — replacing the generic bulk sizing
// (25kg bag / 10kg carton / 1kg pouch) every powder product was seeded
// with. Applies it to all products in the 5 powder categories (Vegetable,
// Fruit, Leaf, Spice & Ingredient, Flowers). Ready-to-Cook items are left
// untouched — their pack sizes were already retail-appropriate and this
// poster was specifically for a powder. Safe to re-run.
export const useRetailPackSizesForPowders = internalMutation({
  args: {},
  handler: async (ctx) => {
    const powderCategorySlugs = [
      "vegetable-powders",
      "fruit-powders",
      "leaf-powders",
      "spice-ingredient-powders",
      "flowers",
    ];
    const categories = await ctx.db.query("categories").collect();
    const powderCategoryIds = new Set(
      categories.filter((c) => powderCategorySlugs.includes(c.slug)).map((c) => c._id)
    );

    const retailPackSizes = ["100 g pouch", "250 g pouch", "500 g pouch", "1 kg pouch"];
    const products = await ctx.db.query("products").collect();
    let updated = 0;
    for (const product of products) {
      if (powderCategoryIds.has(product.categoryId)) {
        await ctx.db.patch(product._id, { packSizes: retailPackSizes, updatedAt: Date.now() });
        updated++;
      }
    }
    return `updated pack sizes on ${updated} powder products`;
  },
});

// Renames "Vegetable Powders"/"Fruit Powders" to plain "Powders" (they're
// already nested under "Vegetables"/"Fruits", so the repeated word was
// redundant in the dropdown: "Vegetables > Vegetable Powders"), and adds a
// sibling "Slices" category under each. The 9 sliced/diced items that were
// sitting in the flat "Ready-to-Cook" bucket are actually dehydrated
// vegetable pieces, not cooked-meal mixes, so they move into
// "Vegetables > Slices". No fruit-slice products exist in the current
// 47-item list, so "Fruits > Slices" is added empty, ready for future
// stock. Safe to re-run.
export const splitPowdersAndSlices = internalMutation({
  args: {},
  handler: async (ctx) => {
    const bySlug = async (slug: string) =>
      ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

    const vegetablePowders = await bySlug("vegetable-powders");
    const fruitPowders = await bySlug("fruit-powders");
    const vegetables = await bySlug("vegetables");
    const fruits = await bySlug("fruits");
    if (!vegetablePowders || !fruitPowders || !vegetables || !fruits) {
      throw new Error("Expected categories not found");
    }

    if (vegetablePowders.name !== "Powders") {
      await ctx.db.patch(vegetablePowders._id, { name: "Powders" });
    }
    if (fruitPowders.name !== "Powders") {
      await ctx.db.patch(fruitPowders._id, { name: "Powders" });
    }

    const ensureSlices = async (
      slug: string,
      parent: NonNullable<typeof vegetables>,
      image: string
    ) => {
      const existing = await bySlug(slug);
      if (existing) return existing._id;
      return ctx.db.insert("categories", {
        name: "Slices",
        slug,
        description: `Sun- and machine-dried ${parent.name.toLowerCase()} pieces and slices.`,
        image,
        active: true,
        sortOrder: 2,
        parentId: parent._id,
      });
    };

    const vegSlicesId = await ensureSlices(
      "vegetable-slices",
      vegetables,
      "/images/products/potato-cubes-dehydrated.webp"
    );
    await ensureSlices("fruit-slices", fruits, "/images/products/banana-powder.webp");

    const moveToSlices = [
      "dried-brinjal-slices",
      "ginger-chips-dry",
      "dried-bitter-gourd-chips",
      "dried-dondakaya-ivy-gourd",
      "potato-cubes-dehydrated",
      "onion-flakes",
      "garlic-flakes-fry-use",
      "tomato-vadiyalu-tomato-chips",
      "sabudana-sago-vadiyalu",
    ];
    let moved = 0;
    for (const slug of moveToSlices) {
      const product = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (product && product.categoryId !== vegSlicesId) {
        await ctx.db.patch(product._id, { categoryId: vegSlicesId, updatedAt: Date.now() });
        moved++;
      }
    }

    return `renamed 2 powder categories, added Slices under Vegetables/Fruits, moved ${moved} of ${moveToSlices.length} products into Vegetables > Slices`;
  },
});
