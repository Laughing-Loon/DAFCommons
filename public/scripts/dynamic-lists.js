// Dynamic list rendering for events, substack posts, and research initiatives.
// Reads from Supabase, populates DOM containers if they exist on the page.
// Containers must be empty <div class="event-list"> with one of these IDs:
//   #eventList     → community_events
//   #storyList     → substack_posts
//   #researchList  → research_initiatives
// Depends on `supabaseClient` (initialized in supabase.js).

(function () {
    if (typeof supabaseClient === 'undefined') {
        console.error('[dynamic-lists] supabaseClient not initialized');
        return;
    }

    const STATUS_COPY = {
        open: 'Open to join',
        invite: 'Invite only',
        closed: 'RSVP closed',
    };

    const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const EN_DASH = '–';

    function formatEventDate(start, end) {
        const s = new Date(start);
        if (!end) {
            return { month: MONTHS[s.getUTCMonth()], day: String(s.getUTCDate()), dow: DOW[s.getUTCDay()] };
        }
        const e = new Date(end);
        const sameMonth = s.getUTCMonth() === e.getUTCMonth();
        const month = sameMonth
            ? MONTHS[s.getUTCMonth()]
            : MONTHS[s.getUTCMonth()] + EN_DASH + MONTHS[e.getUTCMonth()];
        const day = sameMonth
            ? `${s.getUTCDate()}${EN_DASH}${e.getUTCDate()}`
            : `${s.getUTCDate()}${EN_DASH}${e.getUTCDate()}`;
        const dowS = DOW[s.getUTCDay()];
        const dowE = DOW[e.getUTCDay()];
        return { month, day, dow: dowS === dowE ? dowS : `${dowS}${EN_DASH}${dowE}` };
    }

    function el(tag, opts) {
        const node = document.createElement(tag);
        if (opts) {
            if (opts.class) node.className = opts.class;
            if (opts.text != null) node.textContent = opts.text;
            if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
        }
        return node;
    }

    function statusPill(status, label) {
        const pill = el('span', { class: `event-status-pill event-status-${status}` });
        if (status === 'open') pill.appendChild(el('span', { class: 'event-status-dot' }));
        pill.appendChild(document.createTextNode((status === 'open' ? ' ' : '') + (label || '')));
        return pill;
    }

    function ctaLink(href, label) {
        return el('a', {
            class: 'event-rsvp-link',
            attrs: { href: href || '#', target: '_blank', rel: 'noopener' },
            text: label,
        });
    }

    function metaRow(parts) {
        const meta = el('div', { class: 'event-meta' });
        const filtered = parts.filter(Boolean);
        filtered.forEach((p, i) => {
            if (i > 0) meta.appendChild(el('span', { class: 'event-meta-sep', text: '·' }));
            meta.appendChild(el('span', { class: i === 0 ? 'event-where' : 'event-time', text: p }));
        });
        return filtered.length ? meta : null;
    }

    async function fetchTable(name) {
        try {
            const { data, error } = await supabaseClient
                .from(name)
                .select('*')
                .order('display_order', { ascending: true });
            if (error) throw error;
            return { rows: data || [], error: null };
        } catch (err) {
            console.error(`[dynamic-lists] ${name} fetch error`, err);
            return { rows: [], error: err };
        }
    }

    // Empty / error state shown when a list has zero rows (or fetch failed).
    function renderEmpty(container, message) {
        const placeholder = el('div', { class: 'event-list-empty', text: message });
        container.appendChild(placeholder);
    }

    const EMPTY_COPY = {
        events:   'No upcoming events on the calendar — check back soon.',
        stories:  'More field notes coming soon.',
        research: 'No active research right now.',
    };
    const ERROR_COPY = "Couldn't load — please refresh.";

    function renderEvents(result) {
        const container = document.getElementById('eventList');
        if (!container) return;
        container.innerHTML = '';
        if (result.error) { renderEmpty(container, ERROR_COPY); return; }
        if (result.rows.length === 0) { renderEmpty(container, EMPTY_COPY.events); return; }
        result.rows.forEach(row => {
            const { month, day, dow } = formatEventDate(row.event_date, row.end_date);
            const wrapper = el('div', { class: `event-row scroll-animate event-${row.status}` });

            const dateBlock = el('div', { class: 'event-date-block' });
            dateBlock.appendChild(el('div', { class: 'event-month', text: month }));
            dateBlock.appendChild(el('div', { class: 'event-day', text: day }));
            dateBlock.appendChild(el('div', { class: 'event-dow', text: dow }));
            wrapper.appendChild(dateBlock);

            const body = el('div', { class: 'event-body' });
            body.appendChild(el('h3', { class: 'event-title', text: row.title }));
            const meta = metaRow([row.location, row.time_label]);
            if (meta) body.appendChild(meta);
            if (row.description) body.appendChild(el('p', { class: 'event-description', text: row.description }));
            wrapper.appendChild(body);

            const statusCol = el('div', { class: 'event-status-col' });
            statusCol.appendChild(statusPill(row.status, STATUS_COPY[row.status] || row.status));
            statusCol.appendChild(ctaLink(row.registration_url, `${row.cta_label || 'RSVP'} →`));
            wrapper.appendChild(statusCol);

            container.appendChild(wrapper);
        });
    }

    function renderStories(result) {
        const container = document.getElementById('storyList');
        if (!container) return;
        container.innerHTML = '';
        if (result.error) { renderEmpty(container, ERROR_COPY); return; }
        if (result.rows.length === 0) { renderEmpty(container, EMPTY_COPY.stories); return; }
        result.rows.forEach(row => {
            const wrapper = el('div', { class: `event-row event-row-no-date scroll-animate event-${row.status}` });

            const body = el('div', { class: 'event-body' });
            body.appendChild(el('h3', { class: 'event-title', text: row.title }));
            const meta = metaRow([row.author, row.read_time]);
            if (meta) body.appendChild(meta);
            if (row.excerpt) body.appendChild(el('p', { class: 'event-description', text: row.excerpt }));
            wrapper.appendChild(body);

            const statusCol = el('div', { class: 'event-status-col' });
            statusCol.appendChild(statusPill(row.status, row.eyebrow || ''));
            statusCol.appendChild(ctaLink(row.url, 'Read on Substack →'));
            wrapper.appendChild(statusCol);

            container.appendChild(wrapper);
        });
    }

    function renderResearch(result) {
        const container = document.getElementById('researchList');
        if (!container) return;
        container.innerHTML = '';
        if (result.error) { renderEmpty(container, ERROR_COPY); return; }
        if (result.rows.length === 0) { renderEmpty(container, EMPTY_COPY.research); return; }
        result.rows.forEach(row => {
            const wrapper = el('div', { class: `event-row event-row-no-date scroll-animate event-${row.status}` });

            const body = el('div', { class: 'event-body' });
            body.appendChild(el('h3', { class: 'event-title', text: row.title }));
            if (row.phase) {
                const meta = el('div', { class: 'event-meta' });
                meta.appendChild(el('span', { class: 'event-where', text: row.phase }));
                body.appendChild(meta);
            }
            if (row.body) body.appendChild(el('p', { class: 'event-description', text: row.body }));
            wrapper.appendChild(body);

            const statusCol = el('div', { class: 'event-status-col' });
            statusCol.appendChild(statusPill(row.status, row.status_label || ''));
            statusCol.appendChild(ctaLink(row.cta_link, row.cta_label || ''));
            wrapper.appendChild(statusCol);

            container.appendChild(wrapper);
        });
    }

    function observeNewAnimates() {
        if (typeof IntersectionObserver === 'undefined') {
            document.querySelectorAll('.event-list .scroll-animate').forEach(el => el.classList.add('visible'));
            return;
        }
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.event-list .scroll-animate').forEach(el => obs.observe(el));
    }

    async function init() {
        const wantEvents = !!document.getElementById('eventList');
        const wantStories = !!document.getElementById('storyList');
        const wantResearch = !!document.getElementById('researchList');
        if (!wantEvents && !wantStories && !wantResearch) return;

        const empty = { rows: [], error: null };
        const [events, stories, research] = await Promise.all([
            wantEvents ? fetchTable('community_events') : Promise.resolve(empty),
            wantStories ? fetchTable('substack_posts') : Promise.resolve(empty),
            wantResearch ? fetchTable('research_initiatives') : Promise.resolve(empty),
        ]);

        if (wantEvents) renderEvents(events);
        if (wantStories) renderStories(stories);
        if (wantResearch) renderResearch(research);

        observeNewAnimates();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
