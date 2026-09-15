/**
 * Placeholder catalogue imagery, sourced from Wikimedia Commons (freely
 * licensed for this kind of use) via the Photon CDN proxy — same pattern as
 * the old `data/images.ts`. Swap these for real product photography later;
 * nothing else in the codebase needs to change since products/categories
 * store their own image URLs directly.
 */
const wiki = (path: string) => `https://i0.wp.com/upload.wikimedia.org/wikipedia/commons/${path}?w=1600`;

export const categoryImages = {
  dehydratedVegetables: wiki("d/d5/A_Plate_of_Hometown_Dried_Vegetables_at_outside_the_market.jpg"),
  dehydratedFruits: wiki("4/45/Dried_Mango_Slices.JPG"),
  vegetablePowders: wiki("d/d4/Red_Chili_Powder_%28Lall_Mirch%29_%2849695826571%29.jpg"),
  fruitPowders: wiki("f/f8/Aamchur_Chutney.jpg"),
  leafPowders: wiki("0/07/Moringa_leaves_powder.jpg"),
  readyToCook: wiki("4/49/Vermicelli_Upma.jpg"),
  readyToFry: wiki("1/1f/Papad_%28roasted%29.jpg"),
  spicePowders: wiki("9/90/Kunyit_Bubuk.jpg"),
  specialty: wiki("a/aa/Hawthorn_Lodge_Gift_Hampers_%2825359652560%29.jpg"),
} as const;

export const productImages = {
  dehydratedVegetables: [
    wiki("7/7d/Dried_vegetables_on_Spice_bazaar_in_Istanbul_02.jpg"),
    wiki("c/c0/Dried_vegetables_on_Spice_bazaar_in_Istanbul_03.jpg"),
    wiki("c/cf/Sun-dried_tomatoes.jpg"),
    wiki("6/6a/Packaging_Sun_dried_tomatoes_and_peppers.jpg"),
    wiki("6/6e/Dried_Green_Peas.jpg"),
    wiki("d/d5/A_Plate_of_Hometown_Dried_Vegetables_at_outside_the_market.jpg"),
  ],
  dehydratedFruits: [
    wiki("4/45/Dried_Mango_Slices.JPG"),
    wiki("d/d5/Heap_of_Sun-dried_mango_slices.jpg"),
    wiki("5/5a/Sun-dried_sliced_mangoes.jpg"),
    wiki("8/84/Dry_Mango_Slices_%28Mango_Orugulu%29.jpg"),
    wiki("0/06/Dried_banana_chips.jpg"),
    wiki("3/39/Banana_chips.JPG"),
  ],
  vegetablePowders: [
    wiki("d/d4/Red_Chili_Powder_%28Lall_Mirch%29_%2849695826571%29.jpg"),
    wiki("9/9d/Chili_powder_at_Valencia_Market.jpg"),
    wiki("5/57/Sev_Tomato_1.jpg"),
    wiki("9/90/Kunyit_Bubuk.jpg"),
  ],
  fruitPowders: [
    wiki("f/f8/Aamchur_Chutney.jpg"),
    wiki("9/9a/Mango_Powder_Chutney.JPG"),
    wiki("4/45/Dried_Mango_Slices.JPG"),
  ],
  leafPowders: [
    wiki("0/07/Moringa_leaves_powder.jpg"),
    wiki("6/66/Moringa_oleifera_powder.jpg"),
    wiki("6/6f/Turmeric_and_Moringa_oleifera_powder_CNE_02.jpg"),
    wiki("c/c0/Sundrying_Curry_leaves_and_Indian_Gooseberry.jpg"),
    wiki("7/74/Mint_dried.jpg"),
    wiki("b/ba/Dried_mint_leaves_tea.jpg"),
  ],
  readyToCook: [
    wiki("4/49/Vermicelli_Upma.jpg"),
    wiki("5/5c/Semiya_Upma_Recipe.jpg"),
    wiki("5/5e/Traditional_Vermicelli_Upma_%28Semiya_Upma%29_with_Fresh_Vegetables.jpg"),
  ],
  readyToFry: [
    wiki("1/1f/Papad_%28roasted%29.jpg"),
    wiki("b/be/Papad_2023.jpg"),
    wiki("3/36/Stack_of_papadums.jpg"),
    wiki("a/af/Fryums_-_01.jpg"),
    wiki("2/24/Fryums_-_02.jpg"),
    wiki("3/3e/Khakhra.JPG"),
    wiki("4/45/Khakhra_Varities.jpg"),
    wiki("5/55/Bakers_chips_Kerala_Banana_Chips_deep_fried_in_Coconut_oil._Thin_Fresh_and_Crispy.jpg"),
  ],
  spicePowders: [
    wiki("9/90/Kunyit_Bubuk.jpg"),
    wiki("3/3e/Turmeric_Powder_Spelled_Out.jpg"),
    wiki("d/d4/Red_Chili_Powder_%28Lall_Mirch%29_%2849695826571%29.jpg"),
    wiki("7/7e/Dry_Ginger_1.jpg"),
    wiki("c/c4/Ginger_powder.JPG"),
    wiki("e/ef/Garlic_Powder%2C_Penzeys_Spices%2C_Arlington_Heights_MA.jpg"),
  ],
  specialty: [
    wiki("a/aa/Hawthorn_Lodge_Gift_Hampers_%2825359652560%29.jpg"),
    wiki("b/bc/Sabudana_Papad.jpg"),
    wiki("9/92/Spices_Kenya_Tea_Masala_001.jpg"),
    wiki("c/ce/Indian-made_masala_mix_for_cooking_fish_dishes.jpg"),
  ],
} as const;
