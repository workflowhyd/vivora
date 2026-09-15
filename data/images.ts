/**
 * Centralized image configuration for the marketing sections that aren't
 * backed by Convex (product/category imagery now lives with those records
 * directly — see convex/seedData/images.ts). Demo imagery is sourced from
 * Wikimedia Commons (freely licensed for this kind of use); swap for final
 * commercial photography later without touching component code.
 */

const wiki = (path: string) => `https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/${path}?w=1600`;

const driedVegSpiceBazaar = wiki("c/c0/Dried_vegetables_on_Spice_bazaar_in_Istanbul_03.jpg");
const giftHamper = wiki("a/aa/Hawthorn_Lodge_Gift_Hampers_%2825359652560%29.jpg");
const dryingTrays = wiki("c/c0/Sundrying_Curry_leaves_and_Indian_Gooseberry.jpg");
const spicePowderBowls = wiki("9/90/Kunyit_Bubuk.jpg");
const readyToCook = wiki("4/49/Vermicelli_Upma.jpg");
const warehouseBoxes = wiki(
  "6/64/EFTA00002251_-_White_door_with_a_window_and_handle_stands_in_a_warehouse_next_to_stacked_cardboard_boxes_on_a_pallet.jpg"
);
const freshBread = wiki("a/a1/Fresh_made_bread_06.jpg");
const dehydratedTomatoes = wiki("c/cf/Sun-dried_tomatoes.jpg");
const dehydratedMango = wiki("d/d5/Heap_of_Sun-dried_mango_slices.jpg");
const turmericPowder = wiki("3/3e/Turmeric_Powder_Spelled_Out.jpg");
const papad = wiki("1/1f/Papad_%28roasted%29.jpg");

export const images = {
  hero: driedVegSpiceBazaar,

  applications: {
    gifting: giftHamper,
    retail: readyToCook,
    bakery: freshBread,
    horeca: warehouseBoxes,
  },

  process: {
    select: dehydratedTomatoes,
    clean: dryingTrays,
    sort: spicePowderBowls,
    dry: dehydratedMango,
    roast: turmericPowder,
    pack: papad,
  },

  about: {
    farm: dryingTrays,
    orchard: dehydratedTomatoes,
    processing: turmericPowder,
    finished: spicePowderBowls,
  },

  cta: readyToCook,
} as const;
