/**
 * Centralized image configuration for the marketing sections that aren't
 * backed by Convex (product/category imagery now lives with those records
 * directly — see convex/seedData/images.ts). Demo imagery is sourced from
 * Wikimedia Commons (freely licensed for this kind of use); swap for final
 * commercial photography later without touching component code.
 *
 * Chosen specifically to depict Indian vegetables, dehydration and
 * powder-making — NOT dry fruits/nuts/orchards, which don't represent
 * Vivora's actual product line.
 */

const wiki = (path: string) => `https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/${path}?w=1600`;

const vegetableMarketAhmedabad = wiki("e/eb/Vegetable_market%2C_Ahmedabad.jpg");
const vegetablesRoadsideStall = wiki("7/7d/Vegetables_arranged_at_a_roadside_stall_in_India.jpg");
const dehydratedVegetablesJV = wiki("7/7d/Joint_venture_dehydrated_dried_vegetables.jpg");
const dehydratedVegetablesJV2 = wiki("9/9a/Joint_venture_dehydrated_dried_vegetables_%281%29.jpg");
const vegetableStallOoty = wiki("7/74/Potato_Bean_Tomato_Veg_Stall_Ooty_Market_Nilgiris_Aug25_A7CR_07103.jpg");
const turmericPowder = wiki("3/3e/Turmeric_Powder_Spelled_Out.jpg");
const northIndianThali = wiki("8/8b/North_Indian_Vegetarian_Thali-MB51.jpg");
const warehouseBoxes = wiki(
  "6/64/EFTA00002251_-_White_door_with_a_window_and_handle_stands_in_a_warehouse_next_to_stacked_cardboard_boxes_on_a_pallet.jpg"
);
const readyToCookUpma = wiki("4/49/Vermicelli_Upma.jpg");
const giftHamper = wiki("a/aa/Hawthorn_Lodge_Gift_Hampers_%2825359652560%29.jpg");
const freshBread = wiki("a/a1/Fresh_made_bread_06.jpg");

export const images = {
  hero: dehydratedVegetablesJV,

  applications: {
    gifting: giftHamper,
    retail: readyToCookUpma,
    bakery: freshBread,
    horeca: warehouseBoxes,
  },

  process: {
    select: vegetableMarketAhmedabad,
    clean: vegetablesRoadsideStall,
    sort: vegetableStallOoty,
    dry: dehydratedVegetablesJV2,
    roast: turmericPowder,
    pack: warehouseBoxes,
  },

  about: {
    farm: vegetablesRoadsideStall,
  },

  cta: northIndianThali,
} as const;
