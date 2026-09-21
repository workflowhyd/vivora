import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import AdminConvexProvider from "./AdminConvexProvider";
import { AdminShell } from "./AdminShell";

// The auth providers (and the cookie reads behind them) live only here, so the
// public site doesn't pay for them and can be served as static pages.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <AdminConvexProvider>
        <AdminShell>{children}</AdminShell>
      </AdminConvexProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
