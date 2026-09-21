import { fetchCachedQuery } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";
import ConvexClientProvider from "../ConvexClientProvider";
import { ContentProvider } from "@/components/ContentProvider";

// Public pages are generated ahead of time and refreshed at most once a minute,
// so visitors get static HTML instead of a per-request render.
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const initialContent = await fetchCachedQuery(api.content.getAll).catch(() => []);
  return (
    <ConvexClientProvider>
      <ContentProvider initial={initialContent}>{children}</ContentProvider>
    </ConvexClientProvider>
  );
}
