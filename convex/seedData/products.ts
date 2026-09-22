import { productImages } from "./images";

export interface SeedProduct {
  categorySlug: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: readonly string[];
  thumbnail: string;
  ingredients?: string[];
  benefits?: string[];
  applications?: string[];
  packSizes?: string[];
  shelfLife?: string;
  storage?: string;
  moq?: string;
  specifications?: { label: string; value: string }[];
  sortOrder: number;
}

const STANDARD_PACK_SIZES = ["25 kg bulk bag", "10 kg carton", "1 kg retail pouch"];
const STANDARD_STORAGE = "Store in a cool, dry place away from direct sunlight in the original sealed packaging.";
const STANDARD_MOQ = "1 x 25 kg bag (mixed pallet quantities available on request)";

export const products: SeedProduct[] = [
  // Dehydrated Vegetables
  {
    categorySlug: "dehydrated-vegetables",
    name: "Dehydrated Tomato Flakes",
    slug: "dehydrated-tomato-flakes",
    shortDescription: "Sun-dried tomato flakes with concentrated flavour and natural red colour.",
    description:
      "Our dehydrated tomato flakes are made from vine-ripened tomatoes, sliced and dried to preserve their natural sweetness and deep colour. Ideal for rehydration in sauces, soups, and instant meal bases.",
    images: productImages.dehydratedVegetables,
    thumbnail: productImages.dehydratedVegetables[3],
    ingredients: ["100% dehydrated tomato"],
    benefits: ["No added preservatives", "Long shelf life", "Retains natural colour and flavour"],
    applications: ["Instant soups", "Sauces and ketchups", "Snack seasoning", "Ready meals"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    specifications: [
      { label: "Moisture content", value: "≤ 6%" },
      { label: "Rehydration ratio", value: "1:8" },
      { label: "Form", value: "Flakes, 8-10mm" },
    ],
    sortOrder: 1,
  },
  {
    categorySlug: "dehydrated-vegetables",
    name: "Dehydrated Onion Flakes",
    slug: "dehydrated-onion-flakes",
    shortDescription: "Pungent, aromatic onion flakes dried to lock in flavour.",
    description:
      "Grown and processed in India, our dehydrated onion flakes deliver consistent pungency and aroma batch after batch, making them a reliable base ingredient for seasoning blends and snack manufacturing.",
    images: productImages.dehydratedVegetables,
    thumbnail: productImages.dehydratedVegetables[1],
    ingredients: ["100% dehydrated onion"],
    benefits: ["Consistent pungency", "Reduces prep time", "Extended shelf life"],
    applications: ["Seasoning blends", "Snack coatings", "Ready-to-cook mixes"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    specifications: [
      { label: "Moisture content", value: "≤ 6%" },
      { label: "Pungency", value: "High" },
    ],
    sortOrder: 2,
  },
  {
    categorySlug: "dehydrated-vegetables",
    name: "Dehydrated Green Peas",
    slug: "dehydrated-green-peas",
    shortDescription: "Sweet, tender green peas dried for easy storage and quick rehydration.",
    description:
      "Harvested at peak sweetness and dried using controlled processes that preserve colour and texture, our dehydrated green peas rehydrate quickly for use in pulao, soups, and ready-to-cook meal kits.",
    images: productImages.dehydratedVegetables,
    thumbnail: productImages.dehydratedVegetables[5],
    benefits: ["Retains natural sweetness", "Quick rehydration", "Year-round availability"],
    applications: ["Ready-to-cook meal kits", "Soups", "Rice dishes"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 3,
  },
  {
    categorySlug: "dehydrated-vegetables",
    name: "Mixed Vegetable Flakes",
    slug: "mixed-vegetable-flakes",
    shortDescription: "A balanced blend of dehydrated carrot, cabbage, and bell pepper.",
    description:
      "A convenient, colourful mix of dehydrated vegetables blended for balanced flavour and visual appeal — a popular base for instant noodle and soup manufacturers.",
    images: productImages.dehydratedVegetables,
    thumbnail: productImages.dehydratedVegetables[0],
    benefits: ["One SKU, multiple vegetables", "Consistent blend ratio", "Long shelf life"],
    applications: ["Instant noodles", "Soup mixes", "Ready meals"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 4,
  },

  // Dehydrated Fruits
  {
    categorySlug: "dehydrated-fruits",
    name: "Dehydrated Mango Slices",
    slug: "dehydrated-mango-slices",
    shortDescription: "Naturally sweet mango slices, sun-dried without added sugar.",
    description:
      "Made from Alphonso and Totapuri mango varieties, our dehydrated mango slices retain the fruit's natural sweetness and chewy texture — a favourite for premium snacking and bakery inclusions.",
    images: productImages.dehydratedFruits,
    thumbnail: productImages.dehydratedFruits[0],
    ingredients: ["100% dehydrated mango"],
    benefits: ["No added sugar", "Naturally sweet", "Rich in vitamin A & C"],
    applications: ["Premium snacking", "Trail mixes", "Bakery inclusions", "Cereal bars"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "12 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    specifications: [
      { label: "Moisture content", value: "≤ 12%" },
      { label: "Sugar added", value: "None" },
    ],
    sortOrder: 1,
  },
  {
    categorySlug: "dehydrated-fruits",
    name: "Dehydrated Banana Chips",
    slug: "dehydrated-banana-chips",
    shortDescription: "Crisp, naturally sweet banana chips dried at low temperature.",
    description:
      "Slow-dried to a light crunch, our banana chips are a wholesome snack base with a naturally sweet flavour, free from artificial additives.",
    images: productImages.dehydratedFruits,
    thumbnail: productImages.dehydratedFruits[4],
    benefits: ["Light, crisp texture", "No artificial flavouring", "Good source of potassium"],
    applications: ["Snacking", "Trail mixes", "Breakfast cereal"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "9 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 2,
  },
  {
    categorySlug: "dehydrated-fruits",
    name: "Sun-Dried Mango Cubes",
    slug: "sun-dried-mango-cubes",
    shortDescription: "Bite-sized mango cubes with a chewy, dense texture.",
    description:
      "Diced and sun-dried for a concentrated mango flavour, these cubes are ideal for confectionery, muesli, and gifting assortments.",
    images: productImages.dehydratedFruits,
    thumbnail: productImages.dehydratedFruits[2],
    applications: ["Confectionery", "Muesli and granola", "Gifting assortments"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "12 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 3,
  },

  // Vegetable Powders
  {
    categorySlug: "vegetable-powders",
    name: "Tomato Powder",
    slug: "tomato-powder",
    shortDescription: "Spray-dried tomato powder with vibrant colour and tangy flavour.",
    description:
      "Our tomato powder is processed to retain the tang and colour of fresh tomatoes, making it a versatile ingredient for seasoning blends, soup bases, and snack coatings.",
    images: productImages.vegetablePowders,
    thumbnail: productImages.vegetablePowders[1],
    benefits: ["Vibrant natural colour", "Concentrated flavour", "Long shelf life"],
    applications: ["Snack seasoning", "Soup bases", "Sauces"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    specifications: [{ label: "Mesh size", value: "80-100 mesh" }],
    sortOrder: 1,
  },
  {
    categorySlug: "vegetable-powders",
    name: "Beetroot Powder",
    slug: "beetroot-powder",
    shortDescription: "Deep-red beetroot powder for natural colouring and nutrition.",
    description:
      "Made from carefully dried and milled beetroot, this powder is prized as a natural colourant and nutritional additive across bakery, beverage, and health food applications.",
    images: productImages.vegetablePowders,
    thumbnail: productImages.vegetablePowders[2],
    benefits: ["Natural red colourant", "Rich in nitrates and antioxidants", "Clean label friendly"],
    applications: ["Natural food colouring", "Health beverages", "Bakery"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 2,
  },
  {
    categorySlug: "vegetable-powders",
    name: "Onion Powder",
    slug: "onion-powder",
    shortDescription: "Finely milled onion powder with consistent pungency.",
    description:
      "Ground from premium dehydrated onion, this powder offers convenient dosing and consistent flavour for seasoning manufacturers.",
    images: productImages.vegetablePowders,
    thumbnail: productImages.vegetablePowders[0],
    applications: ["Seasoning blends", "Instant noodles", "Snack coatings"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 3,
  },

  // Fruit Powders
  {
    categorySlug: "fruit-powders",
    name: "Mango Powder (Amchur)",
    slug: "mango-powder-amchur",
    shortDescription: "Tangy raw mango powder, a staple souring agent in Indian cuisine.",
    description:
      "Made from sun-dried raw mango slices, ground fine, amchur delivers the characteristic tang used across Indian curries, chutneys, and spice blends.",
    images: productImages.fruitPowders,
    thumbnail: productImages.fruitPowders[0],
    benefits: ["Natural souring agent", "Consistent tang", "Long shelf life"],
    applications: ["Spice blends", "Chutneys", "Snack seasoning"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 1,
  },
  {
    categorySlug: "fruit-powders",
    name: "Banana Fruit Powder",
    slug: "banana-fruit-powder",
    shortDescription: "Freeze-dried banana powder with a naturally sweet flavour.",
    description:
      "Freeze-dried to preserve nutrients and flavour, our banana powder is a versatile ingredient for infant food, bakery, and smoothie formulations.",
    images: productImages.fruitPowders,
    thumbnail: productImages.fruitPowders[1],
    applications: ["Infant food", "Bakery", "Smoothie mixes"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "12 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 2,
  },

  // Leaf Powders
  {
    categorySlug: "leaf-powders",
    name: "Moringa Leaf Powder",
    slug: "moringa-leaf-powder",
    shortDescription: "Nutrient-dense moringa powder from shade-dried leaves.",
    description:
      "Our moringa leaf powder is made from carefully shade-dried leaves, milled fine to preserve nutrients — a popular ingredient across health foods and nutraceuticals.",
    images: productImages.leafPowders,
    thumbnail: productImages.leafPowders[0],
    benefits: ["Rich in vitamins and minerals", "Shade-dried to preserve nutrients", "Vegan and clean label"],
    applications: ["Health supplements", "Smoothies", "Functional foods"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    specifications: [{ label: "Mesh size", value: "100 mesh" }],
    sortOrder: 1,
  },
  {
    categorySlug: "leaf-powders",
    name: "Curry Leaf Powder",
    slug: "curry-leaf-powder",
    shortDescription: "Aromatic curry leaf powder for seasoning and health foods.",
    description:
      "Sun-dried and milled curry leaves retain their distinctive aroma, making this powder a favourite for spice blends and traditional formulations.",
    images: productImages.leafPowders,
    thumbnail: productImages.leafPowders[3],
    applications: ["Spice blends", "Traditional formulations", "Snack seasoning"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 2,
  },
  {
    categorySlug: "leaf-powders",
    name: "Mint Leaf Powder",
    slug: "mint-leaf-powder",
    shortDescription: "Refreshing mint powder milled from dried mint leaves.",
    description:
      "Dried and milled at low temperature to preserve its essential oils, our mint leaf powder brings a fresh, cooling flavour to chutneys, beverages, and confectionery.",
    images: productImages.leafPowders,
    thumbnail: productImages.leafPowders[5],
    applications: ["Chutneys", "Beverages", "Confectionery"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 3,
  },

  // Ready-to-Cook
  {
    categorySlug: "ready-to-cook",
    name: "Instant Vermicelli Upma Mix",
    slug: "instant-vermicelli-upma-mix",
    shortDescription: "A pre-mixed vermicelli upma base ready in minutes.",
    description:
      "A convenient blend of roasted vermicelli, dehydrated vegetables, and seasoning — just add water or sauté for an authentic home-style upma in minutes.",
    images: productImages.readyToCook,
    thumbnail: productImages.readyToCook[0],
    benefits: ["Ready in under 10 minutes", "Authentic home-style taste", "Long shelf life"],
    applications: ["Breakfast meal kits", "Institutional catering", "Retail ready-meals"],
    packSizes: ["500 g pouch", "1 kg pouch", "10 kg foodservice pack"],
    shelfLife: "9 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: "500 units (mixed pack sizes available)",
    sortOrder: 1,
  },
  {
    categorySlug: "ready-to-cook",
    name: "Instant Khichdi Mix",
    slug: "instant-khichdi-mix",
    shortDescription: "A wholesome rice-and-lentil khichdi base with dehydrated vegetables.",
    description:
      "A balanced blend of rice, lentils, dehydrated vegetables, and mild spices — a nutritious, comforting one-pot meal ready in minutes.",
    images: productImages.readyToCook,
    thumbnail: productImages.readyToCook[1],
    applications: ["Retail ready-meals", "Institutional catering", "Travel food kits"],
    packSizes: ["500 g pouch", "1 kg pouch", "10 kg foodservice pack"],
    shelfLife: "9 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: "500 units (mixed pack sizes available)",
    sortOrder: 2,
  },

  // Ready-to-Fry
  {
    categorySlug: "ready-to-fry",
    name: "Sun-Dried Papad",
    slug: "sun-dried-papad",
    shortDescription: "Traditional urad dal papad, sun-dried and ready to fry or roast.",
    description:
      "Made using a traditional recipe, our sun-dried papads fry up light and crisp in seconds, or can be roasted for a lower-oil option.",
    images: productImages.readyToFry,
    thumbnail: productImages.readyToFry[0],
    ingredients: ["Urad dal flour", "Salt", "Edible oil", "Papad khar"],
    applications: ["Retail snacking", "HoReCa accompaniments", "Export"],
    packSizes: ["200 g pack", "1 kg bulk pack", "10 kg foodservice case"],
    shelfLife: "12 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: "1,000 units",
    sortOrder: 1,
  },
  {
    categorySlug: "ready-to-fry",
    name: "Tapioca Fryums",
    slug: "tapioca-fryums",
    shortDescription: "Crunchy tapioca-based fryums in assorted shapes.",
    description:
      "Made from premium tapioca starch, these fryums puff up light and crisp when fried — a versatile snack base for retail and foodservice.",
    images: productImages.readyToFry,
    thumbnail: productImages.readyToFry[3],
    applications: ["Retail snacking", "HoReCa accompaniments"],
    packSizes: ["200 g pack", "1 kg bulk pack"],
    shelfLife: "12 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: "1,000 units",
    sortOrder: 2,
  },
  {
    categorySlug: "ready-to-fry",
    name: "Khakhra (Roasted Wafers)",
    slug: "khakhra-roasted-wafers",
    shortDescription: "Thin, crisp wheat wafers — a light, ready-to-eat snack.",
    description:
      "A popular Gujarati snack, our khakhras are rolled thin and roasted (not fried) for a light, crunchy bite that needs no further preparation.",
    images: productImages.readyToFry,
    thumbnail: productImages.readyToFry[5],
    applications: ["Retail snacking", "Health-conscious snacking"],
    packSizes: ["200 g pack", "1 kg bulk pack"],
    shelfLife: "6 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: "1,000 units",
    sortOrder: 3,
  },

  // Spice & Ingredient Powders
  {
    categorySlug: "spice-ingredient-powders",
    name: "Turmeric Powder",
    slug: "turmeric-powder",
    shortDescription: "Vibrant, high-curcumin turmeric powder ground from select rhizomes.",
    description:
      "Sourced from select turmeric rhizomes and ground fresh, our turmeric powder offers a rich colour and high curcumin content prized in culinary and nutraceutical applications.",
    images: productImages.spicePowders,
    thumbnail: productImages.spicePowders[0],
    benefits: ["High curcumin content", "Vibrant natural colour", "Export-grade purity"],
    applications: ["Culinary spice blends", "Nutraceuticals", "Natural colouring"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "24 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    specifications: [{ label: "Curcumin content", value: "≥ 3%" }],
    sortOrder: 1,
  },
  {
    categorySlug: "spice-ingredient-powders",
    name: "Red Chilli Powder",
    slug: "red-chilli-powder",
    shortDescription: "Vibrant red chilli powder with balanced heat and colour.",
    description:
      "Ground from sun-dried red chillies selected for colour and consistent heat, this powder is a staple ingredient for spice blends and snack seasoning.",
    images: productImages.spicePowders,
    thumbnail: productImages.spicePowders[2],
    applications: ["Spice blends", "Snack seasoning", "Sauces"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    specifications: [{ label: "Scoville heat units", value: "15,000 - 30,000 SHU" }],
    sortOrder: 2,
  },
  {
    categorySlug: "spice-ingredient-powders",
    name: "Ginger Powder",
    slug: "ginger-powder",
    shortDescription: "Pungent, aromatic ginger powder milled from dried rhizomes.",
    description:
      "Made from carefully dried ginger rhizomes, our ginger powder retains a strong aroma and pungency suited to both culinary and health applications.",
    images: productImages.spicePowders,
    thumbnail: productImages.spicePowders[3],
    applications: ["Culinary spice blends", "Beverages", "Health supplements"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "24 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 3,
  },
  {
    categorySlug: "spice-ingredient-powders",
    name: "Garlic Powder",
    slug: "garlic-powder",
    shortDescription: "Pure garlic powder with consistent pungency and aroma.",
    description:
      "Milled from dehydrated garlic cloves, our garlic powder is a convenient, long-lasting alternative to fresh garlic for seasoning and sauce manufacturers.",
    images: productImages.spicePowders,
    thumbnail: productImages.spicePowders[5],
    applications: ["Seasoning blends", "Sauces", "Snack coatings"],
    packSizes: STANDARD_PACK_SIZES,
    shelfLife: "24 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: STANDARD_MOQ,
    sortOrder: 4,
  },

  // Specialty Products
  {
    categorySlug: "specialty-products",
    name: "Premium Vivora Gift Hamper",
    slug: "premium-vivora-gift-hamper",
    shortDescription: "A curated assortment of dehydrated fruits and spice powders in a gift-ready box.",
    description:
      "Thoughtfully curated for corporate gifting and festive retail, this hamper combines our best-selling dehydrated fruits and specialty powders in premium, export-ready packaging.",
    images: productImages.specialty,
    thumbnail: productImages.specialty[0],
    applications: ["Corporate gifting", "Festive retail", "Premium hospitality"],
    packSizes: ["Single gift box (assorted contents)"],
    shelfLife: "12 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: "50 units",
    sortOrder: 1,
  },
  {
    categorySlug: "specialty-products",
    name: "Sabudana Papad",
    slug: "sabudana-papad",
    shortDescription: "Translucent sago papad, a traditional fasting-friendly snack.",
    description:
      "Made from premium sabudana (sago), this papad puffs up into a light, crisp wafer when fried — a traditional favourite, especially during religious fasting periods.",
    images: productImages.specialty,
    thumbnail: productImages.specialty[1],
    applications: ["Retail snacking", "Festive and fasting foods"],
    packSizes: ["200 g pack", "1 kg bulk pack"],
    shelfLife: "12 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: "1,000 units",
    sortOrder: 2,
  },
  {
    categorySlug: "specialty-products",
    name: "Export Masala Gift Set",
    slug: "export-masala-gift-set",
    shortDescription: "A specialty spice masala blend set packaged for export and gifting.",
    description:
      "A set of signature masala blends packed in export-grade, moisture-proof pouches — designed for distributors looking to introduce authentic Indian spice blends to new markets.",
    images: productImages.specialty,
    thumbnail: productImages.specialty[2],
    applications: ["Export distribution", "Retail gifting", "HoReCa"],
    packSizes: ["Single set (4 x 100 g pouches)"],
    shelfLife: "18 months from date of manufacture",
    storage: STANDARD_STORAGE,
    moq: "50 units",
    sortOrder: 3,
  },
];
