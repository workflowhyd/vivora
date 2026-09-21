// The editable slots on the public site. Each slot has a stable key that the
// site components read through useContent(); the default here is what shows
// until an admin saves an override in the `pageContent` table. Shared by the
// Convex functions (to reject unknown keys) and the Next.js app (admin editor
// + site components) — keep it free of runtime dependencies.

export type SlotKind = "text" | "textarea" | "image" | "video";

export type Slot = {
  key: string;
  page: PageId;
  group: string;
  label: string;
  kind: SlotKind;
  default: string;
};

export const pages = [
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "products", label: "Products", path: "/products" },
  { id: "applications", label: "Applications", path: "/applications" },
  { id: "quality", label: "Quality", path: "/quality" },
  { id: "processing", label: "Processing", path: "/processing" },
  { id: "global-reach", label: "Global Reach", path: "/global-reach" },
  { id: "contact", label: "Contact", path: "/contact" },
] as const;

export type PageId = (typeof pages)[number]["id"];

export const pageIds: string[] = pages.map((p) => p.id);

const slots: Slot[] = [];

function add(
  page: PageId,
  group: string,
  key: string,
  label: string,
  kind: SlotKind,
  def = ""
) {
  slots.push({ key, page, group, label, kind, default: def });
}

// A section heading is split into eyebrow + main line + italic accent line to
// match how the components render it.
function heading(
  page: PageId,
  group: string,
  prefix: string,
  eyebrow: string | null,
  main: string,
  accent: string
) {
  if (eyebrow !== null) add(page, group, `${prefix}.eyebrow`, "Small label above heading", "text", eyebrow);
  add(page, group, `${prefix}.titleMain`, "Heading (first line)", "text", main);
  add(page, group, `${prefix}.titleAccent`, "Heading (highlighted line)", "text", accent);
}

// ── Home ──────────────────────────────────────────────────────────────
add("home", "Hero", "home.hero.eyebrow", "Small label under the logo", "text", "VIVORA FOODS");
add("home", "Hero", "home.hero.titleMain", "Heading (first line)", "text", "Dehydrated Foods, Powders");
add("home", "Hero", "home.hero.titleAccent", "Heading (highlighted second line)", "text", "& Ready-to-Cook");
add(
  "home",
  "Hero",
  "home.hero.body",
  "Paragraph",
  "textarea",
  "Vivora Foods supplies premium dehydrated vegetables, fruits, powders and ready-to-cook products from India — sourced, processed and packed for B2B buyers, distributors and retailers worldwide."
);
add("home", "Hero", "home.hero.brandLine", "Brand line (under the buttons)", "text", "Dry Delicious. Nature Goodness.");
add("home", "Hero", "home.hero.cta1", "Primary button text", "text", "View Products");
add("home", "Hero", "home.hero.cta2", "Secondary button text", "text", "Request a Quote");
add("home", "Hero", "home.hero.image", "Hero image (optional — replaces the default product photo)", "image");
add("home", "Hero", "home.hero.video", "Hero video (optional — replaces the image)", "video");
heading("home", "Categories section", "home.categories", null, "From harvest", "to dry delicious.");
heading("home", "Featured products section", "home.featured", "Our Range", "Featured", "products.");
heading("home", "More about Vivora section", "home.explore", null, "More about", "Vivora.");
add("home", "Contact banner", "home.banner.title", "Heading", "text", "Looking for reliable, export-grade supply?");
add("home", "Contact banner", "home.banner.cta", "Button text", "text", "Request a Quote");
[
  ["30+", "Products"],
  ["Global", "Market Ready"],
  ["100", "% Natural"],
  ["Quality", "Focused"],
].forEach(([value, label], i) => {
  add("home", "Statistics (also shown on About)", `stats.${i + 1}.value`, `Stat ${i + 1} value`, "text", value);
  add("home", "Statistics (also shown on About)", `stats.${i + 1}.label`, `Stat ${i + 1} label`, "text", label);
});

// ── About ─────────────────────────────────────────────────────────────
heading("about", "Story section", "about", "The Vivora Story", "Inspired by nature.", "Dry delicious, always.");
add(
  "about",
  "Story section",
  "about.body",
  "Paragraph",
  "textarea",
  "Every Vivora product begins with careful sourcing. From dehydration through to hygienic packing, we build a transparent, export-ready supply chain that food brands and distributors can rely on."
);
add("about", "Story section", "about.link", "Link text", "text", "Discover Our Story");

// ── Products ──────────────────────────────────────────────────────────
heading("products", "Page heading", "products", "Our Range", "The full", "catalogue.");

// ── Applications ──────────────────────────────────────────────────────
heading("applications", "Page heading", "applications", "Where It Goes", "Made for what", "comes next.");
[
  ["Gifting & Corporate", "Curated hampers and festive boxes built for celebrations and corporate gifting."],
  ["Retail & Snacking", "Shelf-ready packs and blends made for everyday, on-the-go snacking."],
  ["Bakery & Confectionery", "Consistent, food-safe dehydrated ingredients and powders for bakes, mixes and desserts."],
  ["HoReCa & Bulk", "Reliable, export-grade supply for hotels, caterers and food service partners."],
].forEach(([title, description], i) => {
  add("applications", `Card ${i + 1}`, `applications.${i + 1}.title`, "Title", "text", title);
  add("applications", `Card ${i + 1}`, `applications.${i + 1}.description`, "Description", "textarea", description);
});

// ── Quality ───────────────────────────────────────────────────────────
heading("quality", "Page heading", "quality", "Our Standard", "Quality you can", "build a product around.");
[
  ["Carefully Sourced", "Vegetables and fruit selected from trusted farms for consistent quality."],
  ["Rigorous Grading", "Every batch is hand-sorted against defined size and quality parameters."],
  ["Hygienic Packing", "Facilities designed around food safety and cleanliness standards."],
  ["Export Ready", "Documentation and packaging built for international markets."],
].forEach(([title, description], i) => {
  add("quality", `Pillar ${i + 1}`, `quality.${i + 1}.title`, "Title", "text", title);
  add("quality", `Pillar ${i + 1}`, `quality.${i + 1}.description`, "Description", "textarea", description);
});

// ── Processing ────────────────────────────────────────────────────────
heading("processing", "Page heading", "process", "The Journey", "From harvest", "to pack.");
[
  ["Source", "Vegetables and fruit are sourced directly from trusted farms and growers."],
  ["Clean", "Thorough cleaning removes impurities while preserving natural integrity."],
  ["Sort & Grade", "Every batch is hand-sorted and graded for size, colour and quality."],
  ["Dry & Process", "Controlled drying locks in natural flavour, texture and shelf life."],
  ["Grind & Blend", "Dried ingredients are finely ground into consistent, natural powders."],
  ["Pack", "Hygienic, export-ready packing ensures freshness from facility to destination."],
].forEach(([title, description], i) => {
  add("processing", `Stage ${i + 1}`, `process.${i + 1}.title`, "Title", "text", title);
  add("processing", `Stage ${i + 1}`, `process.${i + 1}.description`, "Description", "textarea", description);
});

// ── Global reach ──────────────────────────────────────────────────────
heading("global-reach", "Page heading", "reach", "Worldwide", "From India", "to the world.");

// ── Contact ───────────────────────────────────────────────────────────
add("contact", "Top banner", "contact.banner.main", "Heading (first line)", "text", "Let's create something");
add("contact", "Top banner", "contact.banner.accent", "Heading (highlighted line)", "text", "naturally exceptional.");
heading("contact", "Form intro", "contact", "Request a Quote", "Tell us what", "you're looking for.");
add(
  "contact",
  "Form intro",
  "contact.body",
  "Paragraph",
  "textarea",
  "Share a few details and our team will get back to you with pricing, samples and lead times."
);

add("contact", "WhatsApp button", "site.whatsapp", "WhatsApp number with country code, digits only (e.g. 919876543210)", "text", "");

export const contentSlots: readonly Slot[] = slots;

export const slotByKey: ReadonlyMap<string, Slot> = new Map(slots.map((s) => [s.key, s]));
