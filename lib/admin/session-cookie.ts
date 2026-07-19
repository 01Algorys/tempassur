export const ADMIN_TOKEN_COOKIE = "ta_admin_token"

// Idle timeout enforced client-side (auto-logout) — the cookie itself lives longer
// (see route.ts maxAge) so "remember session" survives a browser restart; the
// inactivity timer is what actually signs the admin out on the machine.
export const ADMIN_IDLE_TIMEOUT_MS = 15 * 60 * 1000
