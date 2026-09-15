import { categoryImages } from "./images";

export const categories = [
  {
    slug: "dehydrated-vegetables",
    name: "Dehydrated Vegetables",
    description:
      "Sun- and machine-dried vegetables that lock in flavour and nutrition for a long shelf life without refrigeration — ideal for bulk food manufacturing, instant meals, and export.",
    image: categoryImages.dehydratedVegetables,
    active: true,
    sortOrder: 1,
  },
  {
    slug: "dehydrated-fruits",
    name: "Dehydrated Fruits",
    description:
      "Naturally sweet, sun-ripened fruits dried to preserve their taste and texture — perfect for snacking, bakery inclusions, and confectionery.",
    image: categoryImages.dehydratedFruits,
    active: true,
    sortOrder: 2,
  },
  {
    slug: "vegetable-powders",
    name: "Vegetable Powders",
    description:
      "Finely milled vegetable powders for natural colouring, seasoning, and nutrition fortification across food manufacturing.",
    image: categoryImages.vegetablePowders,
    active: true,
    sortOrder: 3,
  },
  {
    slug: "fruit-powders",
    name: "Fruit Powders",
    description:
      "Freeze- and spray-dried fruit powders that carry the full flavour of fresh fruit into beverages, bakery, and nutraceutical formulations.",
    image: categoryImages.fruitPowders,
    active: true,
    sortOrder: 4,
  },
  {
    slug: "leaf-powders",
    name: "Leaf Powders",
    description:
      "Nutrient-dense leaf powders — moringa, curry leaf, mint, and more — for health foods, supplements, and traditional formulations.",
    image: categoryImages.leafPowders,
    active: true,
    sortOrder: 5,
  },
  {
    slug: "ready-to-cook",
    name: "Ready-to-Cook",
    description:
      "Pre-mixed, pre-measured meal bases that cut kitchen prep time while keeping an authentic, home-style taste.",
    image: categoryImages.readyToCook,
    active: true,
    sortOrder: 6,
  },
  {
    slug: "ready-to-fry",
    name: "Ready-to-Fry",
    description:
      "Traditional papads, fryums, and snack bases ready to fry or roast straight from the pack.",
    image: categoryImages.readyToFry,
    active: true,
    sortOrder: 7,
  },
  {
    slug: "spice-ingredient-powders",
    name: "Spice & Ingredient Powders",
    description:
      "Aromatic, export-grade spice powders ground fresh to preserve their essential oils and flavour intensity.",
    image: categoryImages.spicePowders,
    active: true,
    sortOrder: 8,
  },
  {
    slug: "specialty-products",
    name: "Specialty Products",
    description:
      "Curated gifting sets and specialty formats built for retail, corporate gifting, and premium HoReCa placements.",
    image: categoryImages.specialty,
    active: true,
    sortOrder: 9,
  },
] as const;
