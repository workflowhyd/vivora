import { ConvexHttpClient } from "convex/browser";
import type { FunctionReference, FunctionReturnType, OptionalRestArgs } from "convex/server";

// Server-side Convex reads for the public site. convex/nextjs's fetchQuery sends
// `cache: "no-store"`, which forces every route that uses it to render per
// request. Reading through Next's data cache instead lets pages be generated
// ahead of time and refreshed at most once a minute.
export function fetchCachedQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...args: OptionalRestArgs<Query>
): Promise<FunctionReturnType<Query>> {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
    fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }),
  });
  return client.query(query, ...args);
}
