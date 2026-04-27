# DAF Commons — Project Context for Claude Code

## Project Overview

DAF Commons (www.dafcommons.com) is a community platform for Donor Advised Fund (DAF) holders. It helps DAF holders connect, learn, and find stakeholders in the impact investing ecosystem.

- **Framework**: Astro (static site generation)
- **CMS**: Supabase (runtime content sync via JS)
- **Hosting**: Vercel (auto-deploys from GitHub)
- **GitHub**: `Laughing-Loon/DAFCommons`
- **Supabase Project ID**: `gkwbloqfhkpdtctsqqwk`
- **Live site**: https://www.dafcommons.com

## Repository Structure

```
src/
  pages/           # Astro page routes
    index.astro       # Home page
    education.astro   # Education Hub (searchable resource library)
    directory.astro   # Stakeholder Directory (searchable org cards)
    community.astro   # Community page (coming soon)
    about.astro       # About page (team, FAQ, collaborators)
  components/
    Nav.astro         # Global navigation bar
    Footer.astro      # Global footer (newsletter signup, contact, LinkedIn)
    SearchBar.astro   # Reusable search input component
  layouts/
    Base.astro        # Base HTML layout (loads Supabase SDK, global CSS, Nav, Footer)
  styles/
    global.css        # All CSS (single file — typography, layout, components, responsive)
public/
  scripts/
    supabase.js       # Supabase client init + content sync engine
    education.js      # Education Hub: fetch resources, render cards, search/filter
    directory.js      # Directory: fetch orgs, render cards, search/filter
    animations.js     # Scroll animations (IntersectionObserver)
    signup.js         # Newsletter signup form handler
  images/             # Static images (team photos, logos, rocks)
```

## Content Architecture

### How CMS content sync works

HTML elements have `data-content="content_key"` attributes with fallback text inline. On page load, `supabase.js` fetches all rows from `site_content`, builds a key→value map, and replaces `.textContent` on matching elements.

**CRITICAL**: HTML fallback text MUST exactly match the Supabase `content` value — including curly/smart quotes (`'` `'` `"` `"` `—` `…`). If they differ even slightly, users see a visible text flash on page load when the JS replaces the content.

Other data attributes:
- `data-src="key"` — sets `element.src` (for images)
- `data-href="key"` — sets `element.href` (for links)
- `data-placeholder="key"` — sets `element.placeholder` (for inputs)

### Footer CTA pattern

Education and Directory pages have footer CTAs. The CTA text is in a `data-content` span, but the linked element (email or form link) is a **separate `<a>` tag outside the span**. Supabase content must NOT include the link text, or `.textContent` replacement will duplicate it.

Example:
```html
<span data-content="directory_footer_cta">Know of an organization who should be on this directory? Fill out this</span>
<a href="https://forms.gle/Bv7dGsKVR7UJ1WnCA" target="_blank">submission form</a>.
```

## Supabase Schema

### `site_content` — CMS text content for all pages
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| id | integer | YES | Auto-increment PK |
| page | varchar | YES | Page name: home, about, education, directory, community, global |
| section | varchar | YES | Section within page (hero, faq, footer, etc.) |
| content_key | varchar | YES | Unique key matching `data-content` attributes in HTML |
| content_type | varchar | YES | heading, paragraph, label, link, etc. |
| content | text | YES | The actual text content |
| display_order | integer | no | Sort order |
| updated_at | timestamptz | no | Auto-updated |

Pages & sections in use: home (hero, problem_intro, problem, solution, features, cta), about (hero, who, what, faq, team, collaborators, contact), education (hero, search, filters, no_results, footer), directory (hero, search, filters, no_results, footer), community (hero), global (nav, footer, meta)

### `education_resources` — Education Hub resource library
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| id | uuid | YES | PK |
| title | text | YES | Resource title |
| author | text | no | Who wrote it (displayed beneath title in accent color) |
| description | text | no | Summary text |
| type | text | YES | Article, guide, or tool (used for filtering) |
| tags | text[] | no | Array of tags |
| keywords | text | no | Search keywords |
| resource_url | text | no | External link |
| featured | boolean | no | Featured flag |
| display_order | integer | no | Sort order |
| created_at | timestamptz | no | |
| updated_at | timestamptz | no | |

### `organizations` — Stakeholder Directory
| Column | Type | Required | Notes |
|--------|------|----------|-------|
| id | uuid | YES | PK |
| name | text | YES | Organization name |
| description | text | no | What they do |
| website | text | no | URL |
| type | text | YES | DAF Sponsor, Impact Investment Advisor, Investment Intermediary, Investment Vehicle, Technology Platform |
| featured | boolean | no | |
| logo_url | text | no | |
| display_order | integer | no | Sort order |
| created_at | timestamptz | no | |
| updated_at | timestamptz | no | |

### `email_signups` — Newsletter subscriptions
| Column | Type | Required |
|--------|------|----------|
| id | bigint | YES |
| name | text | no |
| email | text | YES |
| source | text | no |
| status | text | no |
| created_at | timestamptz | no |

### Other tables (not yet fully integrated)
- `community_events` — Future community events
- `user_submissions` — User-submitted content
- `whatsapp_groups` — Community WhatsApp group links

## Design System

### Color Palette
- `--bg`: #F5F3F0 (warm off-white)
- `--text`: #0A0A0A (near-black)
- `--text-secondary`: #3A3A3A
- `--accent`: #C2632A (burnt orange)
- `--border`: rgba(10, 10, 10, 0.08)

### Typography Scale (all use Inter font)
- `.massive`: clamp(48px, 8vw, 140px) — weight 900, uppercase, hero headlines
- `.huge`: clamp(40px, 6.5vw, 100px) — weight 900, uppercase, page titles
- `.large`: clamp(30px, 4.5vw, 72px) — weight 900, uppercase, section headers
- `.medium`: clamp(18px, 2.2vw, 28px) — weight 800, uppercase, card titles
- `.body-large`: clamp(16px, 1.8vw, 22px) — weight 400, body text
- `.body`: clamp(15px, 1.4vw, 19px) — weight 400, standard text
- `.small`: clamp(15px, 1.4vw, 19px) — weight 400, opacity 0.7

### Design Principles
- Bold, editorial typography as the primary visual element
- Generous whitespace with `clamp()` for all spacing
- White cards on warm off-white background, 20px border-radius
- Minimal color — accent used sparingly (labels, CTAs, active states)
- Cards lift on hover (translateY -4px)
- Scroll-triggered fade-in animations (opacity + translateY)
- Mobile-first responsive: 3-col → 2-col → 1-col grid breakdowns

### Responsive Breakpoints
- Desktop: default styles
- Tablet (≤768px): hamburger nav, single-column CTAs, tighter spacing
- Phone (≤480px): single-column everything, tighter padding, horizontal-scroll filters

## Git Workflow & Deployment

### ⚠️ CRITICAL RULE: NEVER push to `main` from terminal. Always merge via GitHub PR.

### Branches
- `staging` — Vercel auto-deploys to a preview URL
- `main` — Vercel auto-deploys to www.dafcommons.com

### Deployment Process
1. Make changes on `staging` branch
2. Commit and push to `staging`
3. Wait for Vercel build, verify on staging preview URL
4. Create GitHub PR: staging → main
5. Merge PR on GitHub (never `git push origin main`)
6. Verify on www.dafcommons.com

### Commit conventions
- Stage specific files (never `git add -A`)
- Descriptive commit messages summarizing what changed
- Always verify you're on `staging` before committing (`git branch`)

## Important Conventions

1. When adding new CMS-managed text: add `data-content="key"` to the HTML element, put matching fallback text inline (with curly quotes), and INSERT a matching row in `site_content`
2. When updating existing text: update BOTH the HTML fallback AND the Supabase row to keep them identical
3. The JS files in `public/scripts/` contain fallback data arrays (RESOURCES_FALLBACK, etc.) — these are used if Supabase fetch fails. Keep them reasonably in sync but they don't need to be exact.
4. All CSS is in one file (`global.css`). New styles go before the `/* ===== UTILITY ===== */` section at the bottom.
5. Page-specific CSS classes: `.page-tight-hero` (education/directory), `.page-about` (about page)
