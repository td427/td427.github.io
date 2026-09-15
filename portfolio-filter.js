/* Topic filter + index toggle. Delegated so no markup depends on JS to paint. */
(() => {
  if (window.__pfInit) return;
  window.__pfInit = true;
  let active = 'all';
  let indexOpen = false;
  const on = (el) => {
    /* data-on is what the hover CSS keys off — without it the generic hover rule
       greys out the border of the chip that is currently selected. */
    el.setAttribute('data-on', '');
    el.style.border = '1px solid var(--color-accent)';
    el.style.color = 'var(--color-accent)';
    el.style.background = 'rgba(224,64,251,0.12)';
  };
  const off = (el) => {
    el.removeAttribute('data-on');
    el.style.border = '1px solid #2e2e2e';
    el.style.color = '#9a9a9a';
    el.style.background = 'transparent';
  };
  const apply = () => {
    let n = 0;
    document.querySelectorAll('[data-topics]').forEach((el) => {
      /* Restore an explicit value — reading the inline style is unreliable once
         a previous filter pass has cleared it. Articles are flex, index rows grid. */
      const shown = el.tagName === 'ARTICLE' ? 'flex' : 'grid';
      const hit = active === 'all' || el.dataset.topics.split(' ').includes(active);
      el.style.display = hit ? shown : 'none';
      if (hit && el.tagName === 'ARTICLE') n++;
    });
    document.querySelectorAll('[data-filter]').forEach((b) => {
      b.dataset.filter === active ? on(b) : off(b);
    });
    const c = document.getElementById('postcount');
    if (c) c.textContent = n + (n === 1 ? ' post' : ' posts') + (active === 'all' ? ' selected' : ' in view');
  };
  /* The 'All' chip paints active from authored markup; mark it so before any click.
     Deferred — this script runs in <head>, before the chips exist. */
  const markAll = () => {
    const b = document.querySelector('[data-filter="all"]');
    if (b) b.setAttribute('data-on', '');
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markAll);
  } else {
    markAll();
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-filter]');
    if (b) { active = b.dataset.filter; apply(); return; }
    const t = e.target.closest && e.target.closest('#indextoggle');
    if (t) {
      indexOpen = !indexOpen;
      const ix = document.getElementById('index');
      if (ix) ix.style.display = indexOpen ? 'block' : 'none';
      t.textContent = indexOpen ? 'Close index' : 'Index';
      t.style.background = indexOpen ? 'rgba(224,64,251,0.12)' : 'transparent';
    }
  });
})();