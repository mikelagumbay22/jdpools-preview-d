(() => {
  const hdr = document.querySelector('[data-hdr]');
  const onScroll = () => hdr && hdr.classList.toggle('is-scrolled', scrollY > 80);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const btn = document.querySelector('[data-menu-btn]'), menu = document.querySelector('[data-menu]');
  if (btn && menu) {
    const set = open => { btn.setAttribute('aria-expanded', String(open)); menu.classList.toggle('is-open', open); document.body.style.overflow = open ? 'hidden' : ''; };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); } });
    addEventListener('resize', () => { if (innerWidth > 1050) set(false); });
  }
  const filters = document.querySelector('[data-filters]'), gallery = document.querySelector('[data-gallery]');
  if (filters && gallery) {
    filters.hidden = false;
    filters.addEventListener('click', event => {
      const button = event.target.closest('button'); if (!button) return;
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      gallery.querySelectorAll('[data-cat]').forEach(item => { item.hidden = button.dataset.f !== 'all' && item.dataset.cat !== button.dataset.f; });
    });
  }
})();

(() => {
  // Preview host has no form backend. Validate with the browser, then show the thanks page.
  document.querySelectorAll('form[name="project-inquiry"]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) return;
      event.preventDefault();
      const honeypot = form.querySelector('[name="bot-field"]');
      if (honeypot && honeypot.value) return;
      window.location.assign('thanks.html');
    });
  });
})();
