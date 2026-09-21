"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { LayoutDashboard, FileText, Package, LayoutGrid, Inbox, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuthActions();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-cream text-blue-dark">
      <aside className="w-60 shrink-0 bg-green-dark text-cream-light flex flex-col">
        <div className="px-6 py-6">
          <span className="font-display text-xl">Vivora Admin</span>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-200",
                  active ? "bg-cream-light/10 text-cream-light" : "text-cream-light/60 hover:text-cream-light hover:bg-cream-light/5"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-6">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-cream-light/60 hover:text-cream-light hover:bg-cream-light/5 w-full transition-colors duration-200"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 md:p-12">{children}</main>
    </div>
  );
}
