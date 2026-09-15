/**
 * Centralized image configuration.
 *
 * All image URLs used across the site live here so the client can swap in
 * final commercial photography later without touching component code.
 * Demo imagery is sourced from Wikimedia Commons (freely licensed for this
 * kind of use), favouring genuine dry fruit / nut photography over
 * unrelated stock wherever available.
 */

// Served through the Photon CDN (WordPress.com/Jetpack's public image proxy)
// rather than upload.wikimedia.org directly — Wikimedia's own edge applies
// aggressive per-IP throttling to bursts of distinct file requests (as a
// single page load triggers), while Photon is built for exactly this kind
// of high-volume hotlinking and serves the same Commons-licensed originals.
const wiki = (path: string) => `https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/${path}?w=1600`;

const cashewsHeap = wiki("b/b9/CASHEW_NUTS.jpg");
const cashewsShelled = wiki("d/df/Cashew_nuts_with_skin.jpg");
const almonds = wiki("3/37/Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg");
const walnuts = wiki("b/b2/Walnuts_-_whole_and_open_with_halved_kernel.jpg");
const raisins = wiki("7/7d/Raisins_01.jpg");
const dates = wiki("9/9e/Date_Fruit.jpg");
const driedFigs = wiki("2/28/Dried_figs_%282%29.jpg");
const driedMango = wiki("d/d5/Heap_of_Sun-dried_mango_slices.jpg");
const pistachios = wiki("f/ff/Pistacia_vera_Kerman.jpg");
const mixedNutsBowl = wiki("1/1e/Mixed_nuts_bowl.jpg");
const trailMix = wiki("7/71/Planters-Trail-Mix.jpg");
const giftHamper = wiki("a/aa/Hawthorn_Lodge_Gift_Hampers_%2825359652560%29.jpg");
const almondOrchard = wiki("2/2f/Almond_Orchard_Trees%28GN05798%29.jpg");
const almondOrchardBloom = wiki("9/91/Orchard_of_Almond_Trees_in_Bloom%28GN11358%29.jpg");
const datePalmPlantation = wiki("1/14/Date_Palm_Plantation%28GN00078%29.jpg");
const cashewFactory = wiki("3/33/Cashew_Nuts_local_factory.jpg");
const cashewProcessing = wiki("2/20/Cashew_processing_factory.jpg");
const mozambiqueCashewPlant = wiki("0/0c/Mozambique_cashew_processing_plant.jpg");
const hazelnuts = wiki("e/e4/Hazelnuts_%28Corylus_avellana%29_-_whole_with_kernels.jpg");
const bowlOfDates = wiki("8/8a/Bowl_of_Dates.jpg");
const driedApricots = wiki("c/c0/Anthap_Sun_Dried_Apricot.jpg");
const driedApricotsSpread = wiki("a/ac/Dried_apricot%2C_Malatya_01.jpg");
const warehouseBoxes = wiki(
  "6/64/EFTA00002251_-_White_door_with_a_window_and_handle_stands_in_a_warehouse_next_to_stacked_cardboard_boxes_on_a_pallet.jpg"
);
const freshBread = wiki("a/a1/Fresh_made_bread_06.jpg");

export const images = {
  hero: cashewsHeap,

  brandIntro: {
    primary: almondOrchard,
    secondary: datePalmPlantation,
    tertiary: driedFigs,
  },

  categories: {
    driedFruits: bowlOfDates,
    nutsKernels: mixedNutsBowl,
    giftingSpecialty: giftHamper,
  },

  products: {
    cashew: cashewsShelled,
    almond: almonds,
    walnut: walnuts,
    pistachio: pistachios,
    raisin: raisins,
    date: dates,
    driedApricot: driedApricots,
    driedFig: driedFigs,
    driedMango: driedMango,
    hazelnut: hazelnuts,
    trailMix: trailMix,
    prune: driedApricotsSpread,
  },

  featuredProduct: walnuts,

  applications: {
    gifting: giftHamper,
    retail: trailMix,
    bakery: freshBread,
    horeca: warehouseBoxes,
  },

  process: {
    select: almondOrchardBloom,
    clean: cashewFactory,
    sort: mixedNutsBowl,
    dry: cashewProcessing,
    roast: mozambiqueCashewPlant,
    pack: warehouseBoxes,
  },

  about: {
    farm: almondOrchardBloom,
    orchard: datePalmPlantation,
    processing: cashewProcessing,
    finished: raisins,
  },

  cta: mixedNutsBowl,

  colorSpectrum: {
    apricot: driedApricotsSpread,
    pistachio: pistachios,
    raisin: raisins,
    walnut: walnuts,
    date: bowlOfDates,
  },
} as const;
