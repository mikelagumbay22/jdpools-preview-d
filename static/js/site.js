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
  const prefersReduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const initCompare = (root) => {
    const frame = root.querySelector("[data-ba-frame]");
    const handle = root.querySelector("[data-ba-handle]");
    if (!frame || !handle) return;
    let pos = 50;
    let dragging = false;

    const set = (value) => {
      pos = Math.min(100, Math.max(0, value));
      root.style.setProperty("--ba-pos", pos + "%");
      const rounded = Math.round(pos);
      handle.setAttribute("aria-valuenow", String(rounded));
      handle.setAttribute("aria-valuetext", rounded + " percent");
    };

    const fromEvent = (event) => {
      const point = event.touches ? event.touches[0] : event;
      const box = frame.getBoundingClientRect();
      if (!box.width) return pos;
      return ((point.clientX - box.left) / box.width) * 100;
    };

    frame.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      dragging = true;
      frame.setPointerCapture(event.pointerId);
      set(fromEvent(event));
    });
    frame.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      set(fromEvent(event));
    });
    const stop = () => { dragging = false; };
    frame.addEventListener("pointerup", stop);
    frame.addEventListener("pointercancel", stop);

    handle.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 10 : 5;
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); set(pos - step); }
      else if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); set(pos + step); }
      else if (event.key === "Home") { event.preventDefault(); set(0); }
      else if (event.key === "End") { event.preventDefault(); set(100); }
    });

    set(prefersReduce ? 50 : 50);
  };

  const initTabs = (section) => {
    const tabs = [...section.querySelectorAll('[role="tab"]')];
    if (!tabs.length) return;
    const select = (tab) => {
      tabs.forEach((item) => {
        const on = item === tab;
        item.setAttribute("aria-selected", on ? "true" : "false");
        const panel = document.getElementById(item.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (event) => {
        let next = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = tabs[(index + 1) % tabs.length];
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (event.key === "Home") next = tabs[0];
        if (event.key === "End") next = tabs[tabs.length - 1];
        if (next) { event.preventDefault(); next.focus(); select(next); }
      });
    });
  };

  document.querySelectorAll("[data-ba]").forEach(initCompare);
  document.querySelectorAll(".ba-section").forEach(initTabs);
})();

(() => {
  const video = document.querySelector("[data-hero-video]");
  if (!video) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slow = !!(conn && (conn.saveData || conn.effectiveType === "slow-2g" || conn.effectiveType === "2g" || (typeof conn.downlink === "number" && conn.downlink > 0 && conn.downlink < 1.2)));
  if (reduce || slow) return;
  const mobile = matchMedia("(max-width: 699px)").matches;
  const add = (type, attr) => {
    const source = document.createElement("source");
    source.type = type;
    source.src = video.getAttribute(attr);
    video.appendChild(source);
  };
  add("video/webm", mobile ? "data-mobile-webm" : "data-desktop-webm");
  add("video/mp4", mobile ? "data-mobile-mp4" : "data-desktop-mp4");
  video.addEventListener("canplay", () => video.classList.add("is-ready"), { once: true });
  video.addEventListener("loadeddata", () => { video.play().catch(() => {}); }, { once: true });
  video.load();
})();
