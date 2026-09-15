"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { navLinks } from "@/data/content";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-forest/90 backdrop-blur-md py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)]"
            : "bg-transparent py-6"
        )}
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 flex items-center justify-between">
          <Link href="/" aria-label="Vivora Foods home">
            <Logo variant="light" />
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] label-caps text-ivory/85 hover:text-yellow transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/#contact"
            className="hidden lg:inline-flex items-center gap-2 text-[13px] label-caps text-ivory border border-ivory/40 rounded-full px-5 py-2.5 hover:bg-ivory hover:text-forest transition-all duration-300 group"
          >
            Request a Quote
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>

          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="lg:hidden text-ivory p-2 -mr-2"
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              aria-label="Close menu"
              className="absolute inset-0 bg-near-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 h-full w-[84%] max-w-sm bg-forest flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <Logo variant="light" />
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="text-ivory p-2"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-6 mt-6">
                {navLinks.map((link, i) => (
                  <MotionLink
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                    className="font-display text-3xl text-ivory py-3 border-b border-ivory/10"
                  >
                    {link.label}
                  </MotionLink>
                ))}
              </nav>

              <div className="mt-auto px-6 pb-10 pt-6">
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 w-full text-[13px] label-caps text-forest bg-yellow rounded-full px-5 py-3.5"
                >
                  Request a Quote
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
