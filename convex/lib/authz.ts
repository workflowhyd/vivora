import type { MutationCtx, QueryCtx } from "../_generated/server";
import { isAllowlistedAdminEmail } from "../adminAllowlist";

// Every admin-gated query/mutation should call this instead of a bare
// getUserIdentity() truthiness check — it also enforces the email allowlist,
// so a session issued before the allowlist existed can't slip through.
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || !isAllowlistedAdminEmail(identity.email)) {
    throw new Error("Unauthorized");
  }
  return identity;
}
