import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Company",
    links: ["About", "Quality", "Processing", "Global Reach"],
  },
  {
    title: "Products",
    links: ["Dried Fruits", "Nuts & Kernels", "Gifting & Specialty"],
  },
];

export function Footer() {
  return (
    <footer className="bg-near-black pt-20 md:pt-28 pb-8">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-ivory/10">
          <div className="md:col-span-5">
            <Logo variant="light" />
            <p className="text-ivory/55 font-light mt-6 max-w-xs leading-relaxed">
              Premium dry fruits &amp; nuts. Dry delicious. Nature goodness.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2 md:col-start-auto">
              <h4 className="label-caps text-[11px] text-ivory/40">{col.title}</h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-ivory/70 hover:text-yellow transition-colors duration-300 font-light"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

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
