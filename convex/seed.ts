import { internalMutation } from "./_generated/server";

const wiki = (path: string) =>
  `https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/${path}?w=1600`;

const products = [
  {
    slug: "premium-cashews",
    name: "Premium Cashews",
    category: "Nuts & Kernels" as const,
    description: "Creamy, whole W240-grade cashews, hand-sorted for size and colour.",
    image: wiki("d/df/Cashew_nuts_with_skin.jpg"),
    accentColor: "#D9C4A0",
    order: 0,
  },
  {
    slug: "california-almonds",
    name: "California Almonds",
    category: "Nuts & Kernels" as const,
    description: "Crunchy, protein-rich almonds sourced from trusted growers.",
    image: wiki("3/37/Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg"),
    accentColor: "#B98A5E",
    order: 1,
  },
  {
    slug: "kashmiri-walnuts",
    name: "Kashmiri Walnuts",
    category: "Nuts & Kernels" as const,
    description: "Light-coloured, buttery walnut kernels with minimal bitterness.",
    image: wiki("b/b2/Walnuts_-_whole_and_open_with_halved_kernel.jpg"),
    accentColor: "#A9773F",
    order: 2,
  },
  {
    slug: "iranian-pistachios",
    name: "Iranian Pistachios",
    category: "Nuts & Kernels" as const,
    description: "Naturally split, roasted-and-salted pistachios with vivid green kernels.",
    image: wiki("f/ff/Pistacia_vera_Kerman.jpg"),
    accentColor: "#8CA45C",
    order: 3,
  },
  {
    slug: "roasted-hazelnuts",
    name: "Roasted Hazelnuts",
    category: "Nuts & Kernels" as const,
    description: "Deep, toasty flavour perfect for snacking and confectionery.",
    image: wiki("e/e4/Hazelnuts_%28Corylus_avellana%29_-_whole_with_kernels.jpg"),
    accentColor: "#9C6B3E",
    order: 4,
  },
  {
    slug: "golden-raisins",
    name: "Golden Raisins",
    category: "Dried Fruits" as const,
    description: "Sun-dried, seedless grapes with a naturally sweet, tangy bite.",
    image: wiki("7/7d/Raisins_01.jpg"),
    accentColor: "#6B4A2C",
    order: 5,
  },
  {
    slug: "medjool-dates",
    name: "Medjool Dates",
    category: "Dried Fruits" as const,
    description: "Soft, caramel-sweet dates prized as nature's candy.",
    image: wiki("9/9e/Date_Fruit.jpg"),
    accentColor: "#5A3420",
    order: 6,
  },
  {
    slug: "turkish-dried-apricots",
    name: "Turkish Dried Apricots",
    category: "Dried Fruits" as const,
    description: "Tangy-sweet apricots, sun-dried to lock in colour and flavour.",
    image: wiki("c/c0/Anthap_Sun_Dried_Apricot.jpg"),
    accentColor: "#D9822B",
    order: 7,
  },
  {
    slug: "dried-figs",
    name: "Dried Figs",
    category: "Dried Fruits" as const,
    description: "Honeyed, chewy figs packed with natural fibre and sweetness.",
    image: wiki("2/28/Dried_figs_%282%29.jpg"),
    accentColor: "#7A4B33",
    order: 8,
  },
  {
    slug: "dried-mango-slices",
    name: "Dried Mango Slices",
    category: "Dried Fruits" as const,
    description: "Tropical, chewy mango slices with concentrated natural sweetness.",
    image: wiki("d/d5/Heap_of_Sun-dried_mango_slices.jpg"),
    accentColor: "#E0A63C",
    order: 9,
  },
  {
    slug: "california-prunes",
    name: "California Prunes",
    category: "Dried Fruits" as const,
    description: "Rich, jammy prunes with a naturally smooth, sweet finish.",
    image: wiki("a/ac/Dried_apricot%2C_Malatya_01.jpg"),
    accentColor: "#3E2A2F",
    order: 10,
  },
  {
    slug: "signature-trail-mix",
    name: "Signature Trail Mix",
    category: "Snacking Mixes" as const,
    description: "A hand-blended mix of nuts, seeds and dried fruit for everyday snacking.",
    image: wiki("7/71/Planters-Trail-Mix.jpg"),
    accentColor: "#8A6A3C",
    order: 11,
  },
];

const categories = [
  {
    number: "01",
    slug: "dried-fruits",
    title: "Dried Fruits",
    description: "Sun-ripened fruit, naturally dried to concentrate flavour and goodness.",
    image: wiki("8/8a/Bowl_of_Dates.jpg"),
    order: 0,
  },
  {
    number: "02",
    slug: "nuts-kernels",
    title: "Nuts & Kernels",
    description: "Hand-sorted, export-grade nuts selected for size, colour and crunch.",
    image: wiki("1/1e/Mixed_nuts_bowl.jpg"),
    order: 1,
  },
  {
    number: "03",
    slug: "gifting-specialty",
    title: "Gifting & Specialty",
    description: "Curated hampers and mixes built for celebrations and everyday snacking.",
    image: wiki("a/aa/Hawthorn_Lodge_Gift_Hampers_%2825359652560%29.jpg"),
    order: 2,
  },
];

// One-time data migration from the site's old static data/*.ts files. Safe
// to re-run — it's a no-op once either table already has rows.
export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingProduct = await ctx.db.query("products").first();
    if (!existingProduct) {
      for (const product of products) {
        await ctx.db.insert("products", product);
      }
    }

    const existingCategory = await ctx.db.query("categories").first();
    if (!existingCategory) {
      for (const category of categories) {
        await ctx.db.insert("categories", category);
      }
    }
  },
});
