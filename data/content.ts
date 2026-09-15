import { images } from "./images";

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Applications", href: "#applications" },
  { label: "Quality", href: "#quality" },
  { label: "Global Reach", href: "#global-reach" },
  { label: "Contact", href: "#contact" },
];

export const colorSpectrum = [
  {
    label: "AMBER",
    ingredient: "Dried Apricot",
    color: "#D9822B",
    image: images.colorSpectrum.apricot,
  },
  {
    label: "GREEN",
    ingredient: "Pistachio",
    color: "#7E9A52",
    image: images.colorSpectrum.pistachio,
  },
  {
    label: "PLUM",
    ingredient: "Raisin",
    color: "#5A3E2C",
    image: images.colorSpectrum.raisin,
  },
  {
    label: "EARTH",
    ingredient: "Walnut",
    color: "#A9773F",
    image: images.colorSpectrum.walnut,
  },
  {
    label: "CARAMEL",
    ingredient: "Date",
    color: "#7A4A26",
    image: images.colorSpectrum.date,
  },
];

export const applications = [
  {
    number: "01",
    title: "Gifting & Corporate",
    description: "Curated hampers and festive boxes built for celebrations and corporate gifting.",
    image: images.applications.gifting,
    accent: "#DCB35A",
  },
  {
    number: "02",
    title: "Retail & Snacking",
    description: "Shelf-ready packs and blends made for everyday, on-the-go snacking.",
    image: images.applications.retail,
    accent: "#8A5A2C",
  },
  {
    number: "03",
    title: "Bakery & Confectionery",
    description: "Consistent, food-safe nuts and dried fruit for bakes, chocolates and desserts.",
    image: images.applications.bakery,
    accent: "#3C7A45",
  },
  {
    number: "04",
    title: "HoReCa & Bulk",
    description: "Reliable, export-grade supply for hotels, caterers and food service partners.",
    image: images.applications.horeca,
    accent: "#8A2A3F",
  },
];

export const processStages = [
  {
    number: "01",
    title: "Source",
    description: "Nuts and fruit are sourced directly from trusted growers and orchards.",
    image: images.process.select,
  },
  {
    number: "02",
    title: "Clean",
    description: "Thorough cleaning removes impurities while preserving natural integrity.",
    image: images.process.clean,
  },
  {
    number: "03",
    title: "Sort & Grade",
    description: "Every batch is hand-sorted and graded for size, colour and quality.",
    image: images.process.sort,
  },
  {
    number: "04",
    title: "Dry & Process",
    description: "Controlled drying locks in natural flavour, texture and shelf life.",
    image: images.process.dry,
  },
  {
    number: "05",
    title: "Roast & Season",
    description: "Select ranges are gently roasted and seasoned to order.",
    image: images.process.roast,
  },
  {
    number: "06",
    title: "Pack",
    description: "Hygienic, export-ready packing ensures freshness from facility to destination.",
    image: images.process.pack,
  },
];

export const qualityPillars = [
  {
    title: "Carefully Sourced",
    description: "Nuts and fruit selected from trusted growers for consistent quality.",
  },
  {
    title: "Rigorous Grading",
    description: "Every batch is hand-sorted against defined size and quality parameters.",
  },
  {
    title: "Hygienic Packing",
    description: "Facilities designed around food safety and cleanliness standards.",
  },
  {
    title: "Export Ready",
    description: "Documentation and packaging built for international markets.",
  },
];

export const statistics = [
  { value: "30+", label: "Products" },
  { value: "Global", label: "Market Ready" },
  { value: "100", label: "% Natural" },
  { value: "Quality", label: "Focused" },
];

export const globalDestinations = [
  { name: "UAE", x: 59, y: 44 },
  { name: "Saudi Arabia", x: 52, y: 50 },
  { name: "UK", x: 46.5, y: 22 },
  { name: "Europe", x: 51.5, y: 28 },
  { name: "USA", x: 20, y: 34 },
  { name: "Canada", x: 20, y: 20 },
  { name: "Australia", x: 80, y: 72 },
];

export const origin = { name: "India", x: 63.5, y: 46 };
