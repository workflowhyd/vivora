import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { isAllowlistedAdminEmail } from "./adminAllowlist";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    async beforeSessionCreation(ctx, { userId }) {
      const user = await ctx.db.get(userId);
      if (!isAllowlistedAdminEmail(user?.email)) {
        throw new Error("This email is not authorized for admin access.");
      }
    },
  },
});
