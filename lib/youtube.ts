// Matches youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID (with
// or without extra query params) and returns the bare video ID, or null for
// anything else (an uploaded file's storage URL, another host, ...).
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (!u.hostname.endsWith("youtube.com")) return null;
    if (u.pathname === "/watch") return u.searchParams.get("v");
    const shorts = u.pathname.match(/^\/shorts\/([^/]+)/);
    if (shorts) return shorts[1];
    const embed = u.pathname.match(/^\/embed\/([^/]+)/);
    if (embed) return embed[1];
    return null;
  } catch {
    return null;
  }
}
