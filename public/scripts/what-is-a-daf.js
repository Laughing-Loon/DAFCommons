// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObs.observe(el));

// Active sidebar nav
const chapters = document.querySelectorAll('.chapter');
const navLinks = document.querySelectorAll('.chapter-nav a');

function updateNav() {
    let cur = '';
    chapters.forEach(ch => {
        if (window.scrollY >= ch.offsetTop - window.innerHeight * 0.45)
            cur = ch.dataset.ch;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.ch === cur));
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Pie chart
const pieObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            drawPie();
            pieObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

const pieWrap = document.querySelector('.pie-wrap');
if (pieWrap) pieObs.observe(pieWrap);

function drawPie() {
    const canvas = document.getElementById('pieChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 140, cy = 140, r = 120, gap = 0.02;
    const slices = [
        { pct: 0.35, color: '#C2632A' },
        { pct: 0.30, color: '#D98A5E' },
        { pct: 0.35, color: '#EAB899' },
    ];
    const start = -Math.PI / 2;
    const total = 200;

    function animate(frame) {
        ctx.clearRect(0, 0, 280, 280);
        const p = Math.min(frame / total, 1);
        let s = start;
        slices.forEach(sl => {
            const sweep = sl.pct * 2 * Math.PI * p;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, s, s + sweep - gap);
            ctx.closePath();
            ctx.fillStyle = sl.color;
            ctx.fill();
            s += sweep;
        });
        // donut hole
        ctx.beginPath();
        ctx.arc(cx, cy, 58, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        if (p < 1) requestAnimationFrame(() => animate(frame + 3));
    }
    requestAnimationFrame(() => animate(0));
}

// Flow diagram animation
const flowDiagram = document.getElementById('flow-diagram');
let flowAnimated = false;

function animateFlow() {
    [
        { id: 'p-donor-sponsor', delay: 0,    dur: 600 },
        { id: 'p-sponsor-daf',   delay: 500,  dur: 600 },
        { id: 'p-daf-np',        delay: 1100, dur: 700 },
        { id: 'p-daf-ent',       delay: 1100, dur: 700 },
    ].forEach(({ id, delay, dur }) => {
        const p = document.getElementById(id);
        if (!p) return;
        setTimeout(() => {
            p.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.16,1,0.3,1)`;
            p.style.strokeDashoffset = '0';
        }, delay);
    });

    [
        { id: 'arr1', delay: 600  },
        { id: 'arr2', delay: 1100 },
        { id: 'arr3', delay: 1850 },
        { id: 'arr4', delay: 1850 },
    ].forEach(({ id, delay }) => {
        setTimeout(() => {
            const e = document.getElementById(id);
            if (e) e.style.opacity = '1';
        }, delay);
    });

    [
        { id: 'lbl1', delay: 650  },
        { id: 'lbl2', delay: 1150 },
        { id: 'lbl3', delay: 1900 },
        { id: 'lbl4', delay: 1900 },
        { id: 'lbl5', delay: 2100 },
    ].forEach(({ id, delay }) => {
        setTimeout(() => {
            const e = document.getElementById(id);
            if (e) {
                e.style.transition = 'opacity 0.4s ease';
                e.style.opacity = '1';
            }
        }, delay);
    });

    setTimeout(startMoneyDots, 2000);
}

function startMoneyDots() {
    const svg = document.getElementById('flow-svg');
    if (!svg) return;

    [
        { pathId: 'p-donor-sponsor', dur: 1200, offset: 0   },
        { pathId: 'p-sponsor-daf',   dur: 1200, offset: 400 },
        { pathId: 'p-daf-np',        dur: 1400, offset: 200 },
        { pathId: 'p-daf-ent',       dur: 1400, offset: 600 },
    ].forEach(cfg => {
        const pe = document.getElementById(cfg.pathId);
        if (!pe) return;
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '5');
        dot.setAttribute('fill', '#C2632A');
        dot.setAttribute('opacity', '0.9');
        svg.appendChild(dot);
        let st = null;
        const tl = pe.getTotalLength();

        function ad(ts) {
            if (!st) st = ts + (cfg.offset || 0);
            const el = ts - st;
            if (el < 0) { requestAnimationFrame(ad); return; }
            const t = (el % cfg.dur) / cfg.dur;
            try {
                const pt = pe.getPointAtLength(t * tl);
                dot.setAttribute('cx', pt.x);
                dot.setAttribute('cy', pt.y);
                const fz = 0.12;
                if (t < fz) dot.setAttribute('opacity', (t / fz).toFixed(2));
                else if (t > 1 - fz) dot.setAttribute('opacity', ((1 - t) / fz).toFixed(2));
                else dot.setAttribute('opacity', '0.85');
            } catch (_) {}
            requestAnimationFrame(ad);
        }
        requestAnimationFrame(ad);
    });

    // Return path dot
    const rp = document.getElementById('p-ent-return');
    if (rp) {
        const rd = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        rd.setAttribute('r', '4');
        rd.setAttribute('fill', '#C2632A');
        rd.setAttribute('opacity', '0.6');
        svg.appendChild(rd);
        let rst = null;
        const rl = rp.getTotalLength();
        const rdur = 1800;

        function ar(ts) {
            if (!rst) rst = ts + 900;
            const el = ts - rst;
            if (el < 0) { requestAnimationFrame(ar); return; }
            const t = (el % rdur) / rdur;
            try {
                const pt = rp.getPointAtLength(t * rl);
                rd.setAttribute('cx', pt.x);
                rd.setAttribute('cy', pt.y);
                const fz = 0.12;
                if (t < fz) rd.setAttribute('opacity', (t / fz * 0.6).toFixed(2));
                else if (t > 1 - fz) rd.setAttribute('opacity', ((1 - t) / fz * 0.6).toFixed(2));
                else rd.setAttribute('opacity', '0.55');
            } catch (_) {}
            requestAnimationFrame(ar);
        }
        requestAnimationFrame(ar);
    }
}

const flowObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !flowAnimated) {
            flowAnimated = true;
            animateFlow();
            flowObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.25 });
if (flowDiagram) flowObs.observe(flowDiagram);

// Glossary tooltips
const tip = document.getElementById('g-tip');
const tipTerm = document.getElementById('g-tip-term');
const tipDef = document.getElementById('g-tip-def');
let activeG = null;

document.querySelectorAll('.g').forEach(el => {
    el.addEventListener('mouseenter', function(e) {
        tipTerm.textContent = this.dataset.term || '';
        tipDef.textContent = this.dataset.def || '';
        tip.classList.add('visible');
        positionTip(e);
        activeG = this;
    });
    el.addEventListener('mousemove', positionTip);
    el.addEventListener('mouseleave', function() {
        tip.classList.remove('visible');
        activeG = null;
    });
    el.addEventListener('click', function(e) {
        e.stopPropagation();
        if (activeG === this && tip.classList.contains('visible')) {
            tip.classList.remove('visible');
            activeG = null;
            return;
        }
        tipTerm.textContent = this.dataset.term || '';
        tipDef.textContent = this.dataset.def || '';
        tip.classList.add('visible');
        const r = this.getBoundingClientRect();
        tip.style.left = Math.min(r.left, window.innerWidth - 300) + 'px';
        tip.style.top = (r.bottom + 8) + 'px';
        activeG = this;
    });
});

function positionTip(e) {
    const x = e.clientX + 16, y = e.clientY + 16, tw = 280;
    tip.style.left = (x + tw > window.innerWidth ? x - tw - 32 : x) + 'px';
    tip.style.top = (y + 120 > window.innerHeight ? e.clientY - 140 : y) + 'px';
}

document.addEventListener('click', () => {
    tip.classList.remove('visible');
    activeG = null;
});
