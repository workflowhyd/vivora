import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Applications", href: "/applications" },
  { label: "Quality", href: "/quality" },
  { label: "Processing", href: "/processing" },
  { label: "Global Reach", href: "/global-reach" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-near-black pt-20 md:pt-28 pb-8">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-ivory/10">
          <div className="md:col-span-5">
            <Logo variant="light" />
            <p className="text-ivory/55 font-light mt-6 max-w-xs leading-relaxed">
              Premium dehydrated foods, powders &amp; ready-to-cook products. Dry
              delicious. Nature goodness.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="label-caps text-[11px] text-ivory/40">Company</h4>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ivory/70 hover:text-yellow transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="label-caps text-[11px] text-ivory/40">Products</h4>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-ivory/70 hover:text-yellow transition-colors duration-300 font-light"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/dehydrated-vegetables"
                  className="text-ivory/70 hover:text-yellow transition-colors duration-300 font-light"
                >
                  Dehydrated Vegetables
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/spice-ingredient-powders"
                  className="text-ivory/70 hover:text-yellow transition-colors duration-300 font-light"
                >
                  Spice Powders
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="label-caps text-[11px] text-ivory/40">Contact</h4>
            <ul className="mt-5 space-y-3">
              <li className="flex items-center gap-2.5 text-ivory/70 font-light">
                <Mail size={15} className="text-orange shrink-0" />
                hello@vivorafoods.com
              </li>
              <li className="flex items-center gap-2.5 text-ivory/70 font-light">
                <Phone size={15} className="text-orange shrink-0" />
                +91 00000 00000
              </li>
              <li className="flex items-center gap-2.5 text-ivory/70 font-light">
                <MapPin size={15} className="text-orange shrink-0" />
                India
              </li>
              <li className="flex items-center gap-2.5 text-ivory/70 font-light">
                <MessageCircle size={15} className="text-orange shrink-0" />
                WhatsApp
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-ivory/40 text-sm">© 2026 Vivora Foods. All rights reserved.</p>
          <p className="text-ivory/40 text-sm">Dry Delicious. Nature Goodness.</p>
        </div>
      </div>
    </footer>
  );
}
