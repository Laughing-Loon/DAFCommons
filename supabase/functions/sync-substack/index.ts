// sync-substack — pulls new "DAF Holders in the Wild" posts from the DAF Commons
// Substack RSS feed and inserts them into `substack_posts` so they appear in the
// Community page story list. Runs daily via pg_cron (see migration
// `schedule_sync_substack`). Idempotent: posts already in the table (matched by
// URL slug) are skipped. Call with ?dry=1 to preview without inserting.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const FEED_URL = "https://dafcommons.substack.com/feed";
const SERIES = /^DAF Holders in the Wild\b/i;
const MAX_EXCERPT = 500;
const WORDS_PER_MINUTE = 300;

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

function tag(item: string, name: string): string {
  const m = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  if (!m) return "";
  return m[1].replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1").trim();
}

function slugOf(url: string): string | null {
  const m = url.match(/\/p\/([^/?#]+)/);
  return m ? m[1] : null;
}

// "DAF Holders in the Wild - Ed Casabian" → "DAF Holders in the Wild: Ed Casabian"
function normalizeTitle(raw: string): { title: string; guest: string | null } {
  const m = raw.match(/^(DAF Holders in the Wild)\s*[-–—:|]\s*(.+)$/i);
  if (!m) return { title: raw, guest: null };
  return { title: `DAF Holders in the Wild: ${m[2].trim()}`, guest: m[2].trim() };
}

function truncateAtSentence(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return end > max * 0.5 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, "") + "…";
}

// Every post opens with the same "Welcome to our Nth installment…" boilerplate;
// the guest introduction paragraph that follows makes the best excerpt.
function buildExcerpt(html: string, guest: string | null): string {
  const paras = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((m) => stripTags(m[1]))
    .filter(Boolean);
  const isBoilerplate = (p: string) =>
    /^Welcome to our\b/i.test(p) || /^Yet telling stories\b/i.test(p);
  const firstName = guest?.split(/\s+/)[0];
  const intro =
    (firstName && paras.find((p) => !isBoilerplate(p) && p.includes(firstName))) ||
    paras.find((p) => !isBoilerplate(p)) ||
    "";
  return truncateAtSentence(intro, MAX_EXCERPT);
}

function readTime(html: string): string {
  const words = stripTags(html).split(" ").length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
}

Deno.serve(async (req: Request) => {
  const dry = new URL(req.url).searchParams.has("dry");
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const feedRes = await fetch(FEED_URL, { headers: { "User-Agent": "DAFCommons-sync/1.0" } });
  if (!feedRes.ok) {
    return Response.json({ error: `feed fetch failed: ${feedRes.status}` }, { status: 502 });
  }
  const xml = await feedRes.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

  const { data: existing, error: readErr } = await supabase
    .from("substack_posts")
    .select("url, display_order");
  if (readErr) return Response.json({ error: readErr.message }, { status: 500 });

  const knownSlugs = new Set(existing.map((r) => r.url && slugOf(r.url)).filter(Boolean));
  const nextOrder = Math.max(0, ...existing.map((r) => r.display_order ?? 0)) + 10;

  const candidates = items
    .map((item) => ({
      rawTitle: decodeEntities(tag(item, "title")),
      link: tag(item, "link"),
      pubDate: tag(item, "pubDate"),
      content: tag(item, "content:encoded"),
    }))
    .filter((p) => SERIES.test(p.rawTitle) && p.link && !knownSlugs.has(slugOf(p.link)))
    // Oldest first so display_order follows publish order.
    .sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());

  const rows = candidates.map((p, i) => {
    const { title, guest } = normalizeTitle(p.rawTitle);
    return {
      title,
      excerpt: buildExcerpt(p.content, guest),
      author: "DAF Commons",
      read_time: readTime(p.content),
      eyebrow: "Field note",
      status: "open",
      url: p.link,
      published_at: p.pubDate ? new Date(p.pubDate).toISOString().slice(0, 10) : null,
      display_order: nextOrder + i * 10,
    };
  });

  if (!dry && rows.length) {
    const { error } = await supabase.from("substack_posts").insert(rows);
    if (error) return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ dry, inserted: dry ? 0 : rows.length, rows });
});
