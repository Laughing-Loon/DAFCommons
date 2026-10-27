# DAF Commons — Component & Style Guide

This is the source-of-truth design reference for DAF Commons. Add new patterns here when introducing them so we stay consistent.

## Design tokens

### Colors
| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#F5F3F0` | Default warm off-white page background |
| `--text` | `#0A0A0A` | Primary text, near-black |
| `--text-secondary` | `#3A3A3A` | Secondary text, captions |
| `--accent` | `#C2632A` | Burnt orange — used sparingly for emphasis, links, status, CTAs |
| `--border` | `rgba(10, 10, 10, 0.08)` | Subtle dividers and card borders |

Section background variants:
- `.section-warm` — `#EDE8E2` (slightly darker beige; used for rhythm breaks)

### Typography (all Inter)
| Class | Size | Weight | Use |
|-------|------|--------|-----|
| `.massive` | `clamp(48px, 8vw, 140px)` | 900 uppercase | Hero headlines |
| `.huge` | `clamp(40px, 6.5vw, 100px)` | 900 uppercase | Page titles |
| `.large` | `clamp(30px, 4.5vw, 72px)` | 900 uppercase | Section headers |
| `.medium` | `clamp(18px, 2.2vw, 28px)` | 800 uppercase | Card titles |
| `.body-large` | `clamp(16px, 1.8vw, 22px)` | 400 | Lead body text |
| `.body` | `clamp(15px, 1.4vw, 19px)` | 400 | Standard body |
| `.small` | `clamp(15px, 1.4vw, 19px)` | 400, `opacity: 0.7` | Caption / muted |

### Spacing
- Use `clamp()` for all margins and padding so spacing scales with viewport.
- Section vertical padding: `clamp(64px, 12vw, 160px) 0` (`.section`) or `clamp(48px, 8vw, 120px) 0` (`.section-small`).

### Responsive breakpoints
- Desktop: default
- Tablet: `≤768px` (hamburger nav, single-column CTAs)
- Phone: `≤480px` (single-column everything, horizontal-scroll filters)
- Component-specific: `.event-row` collapses at `≤900px`; `.values-stack` collapses at `≤600px`.

---

## Layout components

### `Base.astro`
Root layout. Loads global CSS, fonts, Supabase SDK, `Nav`, `Footer`. Accepts `title` prop.

### `Nav.astro`
Top navigation bar with logo, hamburger toggle for mobile, and nav links. Hovering the logo rotates the SVG 120° with a soft springy curve.

### `Footer.astro`
Three-column footer: newsletter signup, contact (email + LinkedIn), Learn (links to `/what-is-a-daf`). Newsletter form posts to `email_signups` via Supabase.

### `SearchBar.astro`
Reusable search input. Used on `/education` and `/directory`.

---

## Reusable patterns

### Sections
```html
<section class="section">              <!-- standard section -->
<section class="section-small">         <!-- compact section -->
<section class="section section-warm">  <!-- warm beige rhythm break -->
```

### Hero
```html
<section class="hero">
    <div class="container">
        <div class="hero-content scroll-animate">
            <h1 class="massive">DAF COMMONS<span class="hero-logo-icon"><svg.../></span></h1>
            <p class="body-large hero-subtitle">…</p>
        </div>
    </div>
</section>
```
The `.hero-logo-icon` SVG drifts continuously at 90s/rotation; speeds up to 12s on hover.

### Pull-quote (subtle emphasis without bold)
```html
<p class="pull-quote scroll-animate">…</p>
```
Editorial quote with a 3px accent vertical bar, italic, regular weight. Use for one paragraph that needs to land harder than surrounding text without resorting to bold.

### Values stack (numbered manifesto list)
```html
<ol class="values-stack">
    <li><span class="values-num">01</span><span class="values-text">Item one</span></li>
    <li><span class="values-num">02</span><span class="values-text">Item two</span></li>
</ol>
```
Numbered list with accent labels and bold sentence rows. Hover lifts row right and tints text in accent color.

### Event row (used for events, stories, research)
```html
<div class="event-list">
    <div class="event-row event-${status}">
        <div class="event-date-block">
            <div class="event-month">MAY</div>
            <div class="event-day">27</div>
            <div class="event-dow">TUE</div>
        </div>
        <div class="event-body">
            <h3 class="event-title">…</h3>
            <div class="event-meta">
                <span class="event-where">…</span>
                <span class="event-meta-sep">·</span>
                <span class="event-time">…</span>
            </div>
            <p class="event-description">…</p>
        </div>
        <div class="event-status-col">
            <span class="event-status-pill event-status-${status}">…</span>
            <a href="…" class="event-rsvp-link">CTA →</a>
        </div>
    </div>
</div>
```

**Variant — no date block** (use for stories or research, where dates aren't meaningful):
```html
<div class="event-row event-row-no-date event-${status}">
    <!-- no .event-date-block; layout collapses to 1fr auto -->
    <div class="event-body">…</div>
    <div class="event-status-col">…</div>
</div>
```

**Status values** (drives pill color):
- `open` → solid accent pill with pulsing dot
- `invite` → outlined pill
- `closed` → muted gray pill

### Status pills (standalone)
```html
<span class="event-status-pill event-status-open">
    <span class="event-status-dot"></span>
    Active
</span>
```

### Section-end prompts (after a list)
All use the same shape: short sentence + accent link, opacity 0.6, left-aligned.
- `.story-subscribe-prompt` — after stories list
- `.event-host-prompt` — after events list
- `.home-research-prompt` — after research list

```html
<p class="story-subscribe-prompt">
    Want more? <a href="…">Subscribe on Substack →</a>
</p>
```

### Cards
- `.feature-card` — three-pillar card on home
- `.cta-card` — generic CTA card with form/list/button
- `.research-card` — currently unused (legacy)

All cards: `padding: clamp(32px, 5vw, 48px); background: white; border-radius: 20px; transition: translateY(-4px) on hover.`

### Buttons
- `.button.btn-primary` — solid accent
- `.button.btn-secondary` — text + bottom border
- `.button.btn-outline` — outline button

### Forms
- `.form-container` — newsletter / signup form layout
- Inputs use `border-bottom` style, no full borders. Submit is solid accent.

---

## Animation conventions

### Scroll-triggered fade-in
Add `.scroll-animate` to any element. `animations.js` adds `.visible` when it intersects the viewport. Default state: `opacity: 0; transform: translateY(40px)` → `opacity: 1; transform: translateY(0)` over 0.8s.

### Subtle ambient motion
- **Hero logo**: continuous 90s rotation; 12s on hover.
- **Nav logo**: 120° rotation on hover with spring easing.
- **Status dot** (open events): 2s ease-in-out pulse.
- **Card hover**: `translateY(-4px)` lift.
- **Values-stack rows**: `translateX(4px)` + accent color on hover.

All animations respect `@media (prefers-reduced-motion: reduce)`.

### Cubic-bezier curves in use
- Spring overshoot (logo hover): `cubic-bezier(0.34, 1.56, 0.64, 1)` — 1.4s
- Default ease: `0.2s` for most hover states

---

## Content data flow

Static text:
1. HTML element has `data-content="content_key"` with fallback text inline.
2. `public/scripts/supabase.js` fetches `site_content` rows, builds key→value map, replaces `.textContent`.
3. **Critical**: HTML fallback must match Supabase value exactly (including curly quotes `'` `'` `"` `"` `—`) or text flashes on load.

Other data attributes:
- `data-src="key"` — sets `element.src`
- `data-href="key"` — sets `element.href`
- `data-placeholder="key"` — sets `element.placeholder`

Dynamic lists (events, stories, research):
- Fetched from Supabase at runtime by `public/scripts/dynamic-lists.js`.
- Tables: `community_events`, `substack_posts`, `research_initiatives` (see CLAUDE.md for schemas).
- Pages provide empty containers (`#eventList`, `#storyList`, `#researchList`); the script populates them on `DOMContentLoaded`.
- No hardcoded fallback in `.astro` files — Supabase is the single source of truth.

---

## Conventions when adding new patterns

1. **Add the pattern to `global.css`** before the `/* ===== UTILITY ===== */` section at the bottom.
2. **Add it to this doc** with the HTML example and a short reason for the pattern.
3. **Reuse classes** before forking. If two visually similar things diverge, ask whether they should be the same component first.
4. **Use design tokens** (CSS variables) — never hardcode color hex in component styles.
5. **Test all three breakpoints** (desktop / 768 / 480) before considering the work done.
6. **Respect reduced motion**: any animation loop or transform > 200ms should be wrapped in `@media (prefers-reduced-motion: reduce)`.

---

## File map

```
src/
  pages/           # Astro routes
  components/
    Nav.astro      # Top navigation
    Footer.astro   # Site footer
    SearchBar.astro
  layouts/
    Base.astro     # Root layout (CSS, fonts, Supabase SDK, Nav, Footer)
  styles/
    global.css     # All styles — single file
public/scripts/
  supabase.js      # Content sync engine
  animations.js    # Scroll-fade IntersectionObserver
  signup.js        # Newsletter form handler
  education.js     # Education hub fetch + render + filter
  directory.js     # Directory fetch + render + filter
docs/
  COMPONENTS.md    # This file
```
