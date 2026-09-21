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
add("home", "Hero", "home.hero.eyebrow", "Tagline (hidden text for search engines)", "text", "Dry Delicious. Goodness in Every Meal.");
add("home", "Hero", "home.hero.titleMain", "Heading, first part (hidden text for search engines)", "text", "Dehydrated Foods, Powders");
add("home", "Hero", "home.hero.titleAccent", "Heading, second part (hidden text for search engines)", "text", "& Ready-to-Cook");
add(
  "home",
  "Hero",
  "home.hero.body",
  "Paragraph (hidden text for search engines)",
  "textarea",
  "Vivora Foods supplies premium dehydrated vegetables, fruits, powders and ready-to-cook products from India — sourced, processed and packed for B2B buyers, distributors and retailers worldwide."
);
add("home", "Hero", "home.hero.cta1", "Primary button text", "text", "View Products");
add("home", "Hero", "home.hero.cta2", "Secondary button text", "text", "Request a Quote");
add("home", "Hero", "home.hero.image", "Hero image (optional — replaces the default poster)", "image");
add("home", "Hero", "home.hero.video", "Hero video (optional — replaces the image)", "video");
heading("home", "Categories section", "home.categories", null, "From harvest", "to dry delicious.");
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
add("about", "One-line highlights", "about.applications.label", "Applications — label", "text", "Applications");
add("about", "One-line highlights", "about.applications.line", "Applications — line", "text", "Gifting, retail, bakery and HoReCa — made for what comes next.");
add("about", "One-line highlights", "about.quality.label", "Quality — label", "text", "Quality");
add("about", "One-line highlights", "about.quality.line", "Quality — line", "text", "Carefully sourced, rigorously graded, hygienically packed and export ready.");
add("about", "One-line highlights", "about.reach.label", "Global Reach — label", "text", "Global Reach");
add("about", "One-line highlights", "about.reach.line", "Global Reach — line", "text", "Exporting from India to the world — UAE, Saudi Arabia, UK, Europe, USA, Canada and Australia.");

// Certifications: up to six cards on the About page. A card is hidden when its
// name is empty, so extra ones can be added (or removed) from the admin panel.
heading("about", "Certifications section", "about.certs", "Certifications", "Certified for", "confidence.");
[
  ["FSSAI", "Licensed by the Food Safety and Standards Authority of India."],
  ["ISO", "ISO-certified quality and food safety management."],
  ["APEDA", "Registered with APEDA for the export of processed and agricultural food products."],
  ["Food Safety", "Hygienic processing and packing built around food safety standards."],
  ["", ""],
  ["", ""],
].forEach(([name, description], i) => {
  const group = `Certification ${i + 1}`;
  add("about", group, `about.certs.${i + 1}.name`, "Name (leave empty to hide this card)", "text", name);
  add("about", group, `about.certs.${i + 1}.description`, "Description", "textarea", description);
  add("about", group, `about.certs.${i + 1}.number`, "Certificate / licence number (optional)", "text", "");
  add("about", group, `about.certs.${i + 1}.logo`, "Logo or certificate image (optional)", "image");
});

// ── Products ──────────────────────────────────────────────────────────
heading("products", "Page heading", "products", "Our Range", "The full", "catalogue.");

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
