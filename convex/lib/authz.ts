import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { isAllowlistedAdminEmail } from "../adminAllowlist";

// Every admin-gated query/mutation should call this instead of a bare
// getUserIdentity() truthiness check — it also enforces the email allowlist,
// so a session issued before the allowlist existed can't slip through.
//
// Note: the JWT identity from ctx.auth.getUserIdentity() only carries a
// `sub` claim (userId:sessionId) by default — no `email` — so the email has
// to be looked up from the users table via the userId, not read off the
// identity object directly.
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = await ctx.db.get(userId);
  if (!isAllowlistedAdminEmail(user?.email)) {
    throw new Error("Unauthorized");
  }
  return user;
}
