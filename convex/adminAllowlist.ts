// Emails allowed to hold admin access. Add teammate emails here as needed.
export const ADMIN_EMAILS = ["nikilbabu3435@gmail.com"] as const;

export function isAllowlistedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((allowed) => allowed.toLowerCase() === normalized);
}
