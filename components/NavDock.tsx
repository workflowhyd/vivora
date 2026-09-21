"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Menu, MessageCircle, Package, X } from "lucide-react";
import { Logo } from "./Logo";
import { navLinks } from "@/data/content";
import { useContent } from "@/lib/useContent";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

// There is no header. Navigation lives in a floating dock at the bottom of the
// screen (logo · products · menu · quote) that opens a full-screen index of
// every page, plus a WhatsApp button in the corner.
export function NavDock() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { t } = useContent();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the menu after navigating (state reset during render, not in an effect).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const current = navLinks.find((l) =>
    l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)
  );

  const whatsappNumber = t("site.whatsapp").replace(/\D/g, "");
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "/contact";
  const whatsappExternal = Boolean(whatsappNumber);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[70] overflow-y-auto bg-green-dark text-cream-light"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(184,138,42,0.22), transparent 70%), radial-gradient(ellipse 50% 40% at 90% 0%, rgba(23,107,58,0.55), transparent 70%)",
            }}
            initial={{ clipPath: reduce ? "circle(150% at 50% 100%)" : "circle(0% at 50% 100%)" }}
            animate={{ clipPath: "circle(150% at 50% 100%)" }}
            exit={{ clipPath: reduce ? "circle(150% at 50% 100%)" : "circle(0% at 50% 100%)", opacity: reduce ? 0 : 1 }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <div className="mx-auto grid min-h-full max-w-[1440px] gap-12 px-6 pb-40 pt-14 md:grid-cols-12 md:gap-8 md:px-10 md:pt-20">
              <nav className="md:col-span-7" aria-label="Pages">
                <ul className="flex flex-col [&:hover>li:not(:hover)]:opacity-40">
                  {navLinks.map((link, i) => {
                    const active = current?.href === link.href;
                    return (
                      <motion.li
                        key={link.href}
                        className="border-b border-cream-light/10 transition-opacity duration-300"
                        initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.05, duration: 0.7, ease: EASE }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-baseline gap-5 py-3 md:py-4"
                        >
                          <span className="label-caps w-7 text-[11px] text-gold">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={cn(
                              "font-display text-4xl leading-none transition-transform duration-500 group-hover:translate-x-2 md:text-6xl",
                              active ? "italic text-gold" : "text-cream-light"
                            )}
                          >
                            {link.label}
                          </span>
                          <ArrowUpRight
                            size={22}
                            className="ml-auto self-center text-gold opacity-0 transition-all duration-500 group-hover:opacity-100"
                          />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <motion.aside
                className="flex flex-col gap-8 md:col-span-4 md:col-start-9 md:pt-3"
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
              >
                <p className="font-display text-2xl italic leading-snug text-gold md:text-3xl">
                  Dry Delicious.
                  <br />
                  Nature Goodness.
                </p>
                <p className="max-w-xs font-light leading-relaxed text-cream-light/65">
                  Premium dehydrated vegetables, fruits, powders and ready-to-cook products from India.
                </p>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="label-caps group inline-flex w-fit items-center gap-2 rounded-full bg-gold px-7 py-4 text-[13px] text-green-dark transition-colors duration-300 hover:bg-cream-light"
                >
                  Request a Quote
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <ul className="flex flex-col gap-3 text-sm font-light text-cream-light/70">
                  <li className="flex items-center gap-2.5">
                    <Mail size={15} className="shrink-0 text-gold" />
                    hello@vivorafoods.com
                  </li>
                  <li className="flex items-start gap-2.5">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
                    Miyapur, Hyderabad, Telangana, India
                  </li>
                </ul>
              </motion.aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The dock stays above the menu, so the same button opens and closes it. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex justify-center px-4 md:bottom-6">
        <motion.nav
          aria-label="Quick navigation"
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-cream-light/15 bg-blue-dark/85 p-1.5 shadow-[0_18px_50px_-15px_rgba(9,40,79,0.7)] backdrop-blur-xl"
          initial={{ opacity: 0, y: reduce ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: EASE }}
        >
          <Link href="/" aria-label="Vivora Foods home" className="shrink-0">
            <Logo className="h-11! md:h-12! rounded-lg" />
          </Link>

          <Link
            href="/products"
            aria-label="Products"
            className="label-caps flex h-11 items-center gap-2 rounded-full px-3.5 text-[12px] text-cream-light/85 transition-colors duration-300 hover:bg-cream-light/10 hover:text-gold md:h-12"
          >
            <Package size={18} />
            <span className="hidden sm:inline">Products</span>
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "label-caps flex h-11 items-center gap-2 rounded-full px-5 text-[12px] transition-colors duration-300 md:h-12",
              open ? "bg-gold text-green-dark" : "bg-cream-light text-blue-dark hover:bg-gold"
            )}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
            {open ? "Close" : "Menu"}
            {!open && current && current.href !== "/" && (
              <span className="hidden font-normal normal-case tracking-normal text-blue-dark/60 md:inline">
                · {current.label}
              </span>
            )}
          </button>

          <Link
            href="/contact"
            className="label-caps hidden h-12 items-center gap-2 rounded-full bg-green px-5 text-[12px] text-cream-light transition-colors duration-300 hover:bg-green-dark md:flex"
          >
            Request a Quote
            <ArrowRight size={14} />
          </Link>
        </motion.nav>
      </div>

      <motion.a
        href={whatsappHref}
        {...(whatsappExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-4 right-4 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110 md:bottom-6 md:right-6"
        initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
      >
        <MessageCircle size={28} fill="currentColor" strokeWidth={1.5} />
      </motion.a>
    </>
  );
}
