// Generates a single self-contained HTML preview combining home + community.
// Reads dist/ output, inlines CSS, strips runtime scripts (Supabase, analytics),
// and writes to /Users/lilylouis/Desktop/DAF-Commons-Preview.html.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url);
const home = readFileSync(new URL('index.html', DIST), 'utf8');
const community = readFileSync(new URL('community/index.html', DIST), 'utf8');

// Find the bundled CSS file (Astro hashes the name).
const cssDir = new URL('_astro/', DIST);
const cssFile = readdirSync(cssDir).find(f => f.endsWith('.css'));
const css = readFileSync(new URL(cssFile, cssDir), 'utf8');

// Extract <main>...</main> content from a page.
const extractMain = (html) => {
    const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    return m ? m[1] : '';
};

// Strip Supabase / analytics / external script tags (they need a server).
const stripRuntimeScripts = (html) =>
    html
        .replace(/<script[^>]*src="\/scripts\/supabase\.js"[^>]*><\/script>/g, '')
        .replace(/<script[^>]*src="\/scripts\/signup\.js"[^>]*><\/script>/g, '')
        .replace(/<script[^>]*src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase[^"]*"[^>]*><\/script>/g, '')
        .replace(/<vercel-analytics[\s\S]*?<\/script>/g, '');

const homeMain = stripRuntimeScripts(extractMain(home));
const communityMain = stripRuntimeScripts(extractMain(community));

// Build a clean nav with in-doc anchor links instead of routes.
const inlineNav = `
<nav>
    <div class="container">
        <a href="#home" class="logo">
            <div class="logo-icon">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="8" fill="#C2632A"/>
                    <circle cx="60" cy="20" r="6" fill="#0A0A0A"/>
                    <circle cx="95" cy="40" r="6" fill="#0A0A0A"/>
                    <circle cx="95" cy="80" r="6" fill="#0A0A0A"/>
                    <circle cx="60" cy="100" r="6" fill="#0A0A0A"/>
                    <circle cx="25" cy="80" r="6" fill="#0A0A0A"/>
                    <circle cx="25" cy="40" r="6" fill="#0A0A0A"/>
                    <line x1="60" y1="60" x2="60" y2="20" stroke="#0A0A0A" stroke-width="2"/>
                    <line x1="60" y1="60" x2="95" y2="40" stroke="#0A0A0A" stroke-width="2"/>
                    <line x1="60" y1="60" x2="95" y2="80" stroke="#0A0A0A" stroke-width="2"/>
                    <line x1="60" y1="60" x2="60" y2="100" stroke="#0A0A0A" stroke-width="2"/>
                    <line x1="60" y1="60" x2="25" y2="80" stroke="#0A0A0A" stroke-width="2"/>
                    <line x1="60" y1="60" x2="25" y2="40" stroke="#0A0A0A" stroke-width="2"/>
                </svg>
            </div>
            <span>DAF COMMONS</span>
        </a>
        <ul>
            <li><a href="#home" class="nav-link">Home</a></li>
            <li><a href="#community" class="nav-link">Community</a></li>
        </ul>
    </div>
</nav>`;

const inlineFooter = `
<footer>
    <div class="container">
        <div class="footer-grid">
            <div>
                <div class="footer-label">Chat with us!</div>
                <a href="mailto:DAFCommons@gmail.com" class="footer-email">DAFCommons@gmail.com</a>
            </div>
            <div>
                <div class="footer-label">Note</div>
                <p class="footer-text">Static preview — no live data sync. Hosted version: <a href="https://www.dafcommons.com" style="color: var(--accent);">www.dafcommons.com</a></p>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="footer-copyright">&copy; 2026 DAF Commons. Preview build.</div>
        </div>
    </div>
</footer>`;

// Minimal scroll-animate fallback so things become visible without IntersectionObserver.
const inlineScript = `
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.05 });
        document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    });
</script>`;

const combined = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DAF Commons — Preview (Home + Community)</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
${css}
    </style>
</head>
<body>
    <div class="bg-texture bg-texture-1"></div>
    <div class="bg-texture bg-texture-2"></div>
    ${inlineNav}
    <main>
        <div id="home">
${homeMain}
        </div>
        <div id="community" style="border-top: 1px solid var(--border);">
${communityMain}
        </div>
    </main>
    ${inlineFooter}
    ${inlineScript}
</body>
</html>`;

const outPath = '/Users/lilylouis/Desktop/DAF-Commons-Preview.html';
writeFileSync(outPath, combined);
console.log(`Wrote ${combined.length.toLocaleString()} bytes to ${outPath}`);
