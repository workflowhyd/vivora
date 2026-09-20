// Sign-in identifiers (emails or usernames) allowed to hold admin access.
// Add teammates here as needed.
export const ADMIN_EMAILS = ["nikilbabu3435@gmail.com", "admin"] as const;

export function isAllowlistedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((allowed) => allowed.toLowerCase() === normalized);
}
