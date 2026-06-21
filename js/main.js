// NAV SCROLL
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// HAMBURGER
const ham = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (ham && navLinks) {
  ham.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// SCROLL REVEAL
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  revealEls.forEach(el => obs.observe(el));
}

// SEARCH
const overlay  = document.querySelector('.search-overlay');
const input    = document.querySelector('.search-input');
const closeBtn = document.querySelector('.search-close');
const openBtns = document.querySelectorAll('.open-search');

function openSearch() {
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => input?.focus(), 80);
}
function closeSearch() {
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}
openBtns.forEach(b => b.addEventListener('click', openSearch));
closeBtn?.addEventListener('click', closeSearch);
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape') closeSearch();
});

function doSearch(q) {
  const res = document.querySelector('.search-results');
  if (!res) return;
  const idx = window.CONTENT_INDEX || [];
  if (!q.trim()) { res.innerHTML = ''; return; }
  const hits = idx.filter(i =>
    i.title.toLowerCase().includes(q.toLowerCase()) ||
    (i.excerpt || '').toLowerCase().includes(q.toLowerCase()) ||
    (i.tags || []).some(t => t.toLowerCase().includes(q.toLowerCase()))
  ).slice(0, 7);
  if (!hits.length) {
    res.innerHTML = `<p style="padding:1.5rem;font-size:0.85rem;color:var(--text-3);text-align:center">No results for "${q}"</p>`;
    return;
  }
  res.innerHTML = hits.map(i => `
    <a href="${i.file}" class="search-result">
      <div class="search-result-type">${i.type}</div>
      <div class="search-result-title">${i.title}</div>
    </a>`).join('');
}
input?.addEventListener('input', e => doSearch(e.target.value));

// TAG FILTER
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tag = btn.dataset.tag;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.filterable').forEach(card => {
      card.style.display = (tag === 'all' || (card.dataset.tags || '').split(',').includes(tag)) ? '' : 'none';
    });
  });
});

// MARKDOWN LOADER
async function loadMd(mdPath, target) {
  const el = document.querySelector(target);
  if (!el || !mdPath) return;
  try {
    const res = await fetch(mdPath);
    if (!res.ok) throw new Error();
    const raw = await res.text();

    const fm = {};
    let body = raw;
    const match = raw.match(/^---\n([\s\S]+?)\n---\n/);
    if (match) {
      body = raw.slice(match[0].length);
      match[1].split('\n').forEach(l => {
        const [k, ...v] = l.split(':');
        if (k) fm[k.trim()] = v.join(':').trim();
      });
    }

    if (fm.title)  document.querySelectorAll('[data-title]').forEach(e => e.textContent = fm.title);
    if (fm.excerpt) document.querySelectorAll('[data-excerpt]').forEach(e => e.textContent = fm.excerpt);
    if (fm.date)   document.querySelectorAll('[data-date]').forEach(e => {
      e.textContent = new Date(fm.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    });
    if (fm.tags)   document.querySelectorAll('[data-tags-el]').forEach(e => {
      e.innerHTML = fm.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');
    });

    if (typeof marked !== 'undefined') {
      marked.setOptions({ breaks: true, gfm: true });
      const html = DOMPurify ? DOMPurify.sanitize(marked.parse(body)) : marked.parse(body);
      el.innerHTML = html;
      enhanceSWOT(el);
    } else {
      el.innerHTML = `<pre style="white-space:pre-wrap;color:var(--text-2)">${body}</pre>`;
    }

    const iobs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); iobs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    el.querySelectorAll('h2,h3,p,ul,blockquote,table').forEach((node, i) => {
      node.classList.add('reveal');
      if (i % 3 === 1) node.classList.add('delay-1');
      if (i % 3 === 2) node.classList.add('delay-2');
      iobs.observe(node);
    });
  } catch {
    el.innerHTML = `<p style="color:var(--text-3);padding:2rem 0">Content file not found. Make sure the markdown file exists at the path set in data-md.</p>`;
  }
}

// SWOT auto-enhance
function enhanceSWOT(container) {
  container.querySelectorAll('table').forEach(table => {
    const headers = [...table.querySelectorAll('th')].map(th => th.textContent.trim().toLowerCase());
    if (!headers.some(h => h.includes('strength'))) return;
    const rows = [...table.querySelectorAll('tbody tr')];
    const get = key => rows.map(r => r.querySelectorAll('td')[headers.findIndex(h => h.includes(key))]?.textContent.trim()).filter(Boolean);
    const box = document.createElement('div');
    box.className = 'swot-grid';
    [['s', 'Strengths', 'strength'], ['w', 'Weaknesses', 'weakness'], ['o', 'Opportunities', 'opportunit'], ['t', 'Threats', 'threat']].forEach(([cls, label, key]) => {
      const items = get(key);
      box.innerHTML += `<div class="swot-cell ${cls}"><h5>${label}</h5><ul>${items.map(v => `<li>${v}</li>`).join('')}</ul></div>`;
    });
    table.replaceWith(box);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DIVIDER ANIMATION
// Each <hr> line fades out on scroll, replaced by a cursive "Rechita" signature
// drawn letter-by-letter using SVG stroke-dashoffset animation.
// Uses Dancing Script font (loaded via Google Fonts) for the cursive look.
// ─────────────────────────────────────────────────────────────────────────────

function initDividers() {
  // Load Dancing Script for the signature feel
  if (!document.querySelector('#sig-font')) {
    const link = document.createElement('link');
    link.id = 'sig-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap';
    document.head.appendChild(link);
  }

  document.querySelectorAll('hr').forEach((hr, idx) => {
    // Build SVG containing the text rendered as a stroke (fill:none)
    // We set a large initial strokeDashoffset then animate to 0 — draws like handwriting
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'hr-name-svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('xmlns', svgNS);
    // viewBox with generous vertical room so descenders show
    svg.setAttribute('viewBox', '0 0 400 70');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const styleEl = document.createElementNS(svgNS, 'style');
    styleEl.textContent = `
      .sig-t {
        font-family: 'Dancing Script', 'Brush Script MT', cursive;
        font-size: 52px;
        font-weight: 600;
        fill: none;
        stroke: #C9A84C;
        stroke-width: 0.9;
        stroke-linecap: round;
        stroke-linejoin: round;
        letter-spacing: 3px;
      }
    `;

    const textEl = document.createElementNS(svgNS, 'text');
    textEl.setAttribute('class', 'sig-t');
    textEl.setAttribute('x', '200');
    textEl.setAttribute('y', '54');
    textEl.setAttribute('text-anchor', 'middle');
    textEl.textContent = 'Rechita';

    svg.appendChild(styleEl);
    svg.appendChild(textEl);
    hr.appendChild(svg);

    // After fonts load, get the real text stroke length and initialise dasharray
    function setupDash() {
      let len;
      try { len = Math.ceil(textEl.getComputedTextLength() * 4.2); } catch (e) { len = 1400; }
      if (!len || len < 100) len = 1400;
      textEl.style.strokeDasharray = len;
      textEl.style.strokeDashoffset = len;
      hr._sigLen = len;
    }

    // Run after a small delay to let the font download
    setTimeout(setupDash, 300);
    document.fonts?.ready.then(setupDash);
  });

  // Intersection observer — triggers draw when hr scrolls into view
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const hr = entry.target;
      const textEl = hr.querySelector('text');
      if (!textEl) return;

      if (entry.isIntersecting) {
        // Step 1: line fades out
        hr.classList.add('name-visible');
        // Step 2: after short pause, draw the signature in
        setTimeout(() => {
          textEl.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          textEl.style.strokeDashoffset = '0';
        }, 250);
      } else {
        // Reset for re-entry
        hr.classList.remove('name-visible');
        textEl.style.transition = 'none';
        const len = hr._sigLen || 1400;
        textEl.style.strokeDashoffset = len;
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('hr').forEach(hr => io.observe(hr));
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  const md   = document.body.dataset.md;
  if (['company-analysis', 'case-study', 'ceo-scenario', 'comparison'].includes(page)) {
    loadMd(md, '.article-wrap');
  }
  initDividers();
});
