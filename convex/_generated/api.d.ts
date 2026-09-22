/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminAllowlist from "../adminAllowlist.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as content from "../content.js";
import type * as http from "../http.js";
import type * as inquiries from "../inquiries.js";
import type * as lib_authz from "../lib/authz.js";
import type * as lib_contentRegistry from "../lib/contentRegistry.js";
import type * as migrations from "../migrations.js";
import type * as products from "../products.js";
import type * as seed from "../seed.js";
import type * as seedData_categories from "../seedData/categories.js";
import type * as seedData_images from "../seedData/images.js";
import type * as seedData_products from "../seedData/products.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminAllowlist: typeof adminAllowlist;
  auth: typeof auth;
  categories: typeof categories;
  content: typeof content;
  http: typeof http;
  inquiries: typeof inquiries;
  "lib/authz": typeof lib_authz;
  "lib/contentRegistry": typeof lib_contentRegistry;
  migrations: typeof migrations;
  products: typeof products;
  seed: typeof seed;
  "seedData/categories": typeof seedData_categories;
  "seedData/images": typeof seedData_images;
  "seedData/products": typeof seedData_products;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
