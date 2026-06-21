/* ============================================
   Shared Page Shell — injected via JS
   Call: renderShell({ activePage })
   ============================================ */

function renderShell(opts = {}) {
  const navHtml = `
    <div class="grid-bg"></div>

    <div class="search-overlay" role="dialog" aria-label="Search">
      <button class="search-close" aria-label="Close search">✕</button>
      <div class="search-box">
        <span class="search-icon">⌕</span>
        <input class="search-input" type="search" placeholder="Search companies, case studies, comparisons…" />
      </div>
      <div class="search-results" aria-live="polite"></div>
    </div>

    <nav class="nav">
      <div class="container">
        <div class="nav-inner">
          <a href="../index.html" class="nav-logo">R<span>.</span>N</a>
          <ul class="nav-links">
            <li><a href="companies.html" ${opts.activePage==='companies'?'style="color:var(--gold)"':''}>Companies</a></li>
            <li><a href="cases.html" ${opts.activePage==='cases'?'style="color:var(--gold)"':''}>Case Studies</a></li>
            <li><a href="ceo.html" ${opts.activePage==='ceo'?'style="color:var(--gold)"':''}>CEO For A Day</a></li>
            <li><a href="comparisons.html" ${opts.activePage==='comparisons'?'style="color:var(--gold)"':''}>Comparisons</a></li>
          </ul>
          <button class="nav-search-btn open-search">
            <span>⌕</span><span>Search</span>
            <kbd style="font-size:0.65rem;opacity:0.6;margin-left:0.25rem">⌘K</kbd>
          </button>
          <button class="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  `;

  const footerHtml = `
    <footer class="footer">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-logo">R<span>.</span>N Sakinala</div>
          <ul class="footer-links">
            <li><a href="https://www.linkedin.com/in/rechita-nityashree-sakinala-a29857287/" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="mailto:rechitanityashree26@gmail.com">Email</a></li>
            <li><a href="../assets/rechita-resume.pdf" download>Resume</a></li>
          </ul>
          <p class="footer-copy">© 2025 Rechita Nityashree Sakinala</p>
        </div>
      </div>
    </footer>
  `;

  const shellDiv = document.createElement('div');
  shellDiv.innerHTML = navHtml;
  document.body.prepend(...shellDiv.childNodes);

  const footerEl = document.createElement('div');
  footerEl.innerHTML = footerHtml;
  document.body.append(...footerEl.childNodes);
}
