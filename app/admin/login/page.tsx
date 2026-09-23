"use client";

import { FormEvent, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Spinner } from "@/components/Spinner";

// Sign-in only, by username. Admin accounts are created by the developer
// (and must be on the allowlist in convex/adminAllowlist.ts); there is no
// self-serve sign-up here.
export default function AdminLoginPage() {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    // Usernames are matched exactly, so ignore stray capitals / spaces from
    // phone keyboards and autofill.
    formData.set("email", String(formData.get("email") ?? "").trim().toLowerCase());
    formData.set("flow", "signIn");
    try {
      await signIn("password", formData);
    } catch {
      setError("Invalid username or password.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-cream-light text-center">Vivora Admin</h1>
        <p className="label-caps text-[11px] text-cream-light/50 text-center mt-2">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="bg-cream-light rounded-md p-8 mt-8 flex flex-col gap-5">
          <div>
            <label className="label-caps text-[10px] text-blue/70" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="email"
              type="text"
              required
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full bg-transparent border-b border-blue/20 pb-2.5 mt-2 text-blue-dark focus:outline-none focus:border-blue"
            />
          </div>
          <div>
            <label className="label-caps text-[10px] text-blue/70" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-transparent border-b border-blue/20 pb-2.5 mt-2 text-blue-dark focus:outline-none focus:border-blue"
            />
          </div>

          {error && <p className="text-crimson text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex items-center justify-center gap-2 bg-green text-cream-light text-[13px] label-caps px-6 py-3.5 rounded-full hover:bg-green-dark transition-colors duration-300 disabled:opacity-60"
          >
            {submitting && <Spinner />}
            {submitting ? "Please wait…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
