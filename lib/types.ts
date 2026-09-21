import type { FunctionReturnType } from "convex/server";
import type { api } from "@/convex/_generated/api";

// Server-fetched lists that the public pages pass to their client components
// as first-paint data (the live Convex subscription then takes over).
export type ProductCards = FunctionReturnType<typeof api.products.listCards>;
export type ActiveCategories = FunctionReturnType<typeof api.categories.list>;
