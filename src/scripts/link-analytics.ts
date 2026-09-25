// Link attribution only; no persistent visitor ID, IP address, or fingerprint.
export function startLinkAnalytics() {
  try {
    const endpoint = 'https://mingrui-link-analytics.mingrui-link-analytics.workers.dev/collect';
    const allowed = ['/', '/cv/', '/publications/', '/demos/singing-voice-conversion/'];
    const path = location.pathname.replace(/\/?$/, '/');
    if (!allowed.includes(path)) return;
    if (localStorage.getItem('ml-analytics-optout') === '1' || navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    const key = 'ml-link-session', now = Date.now();
    const url = new URL(location.href), ref = url.searchParams.get('ref');
    let state = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (ref && /^[a-f0-9]{32}$/.test(ref)) {
      if (!state || state.code !== ref || now - state.updated > 1800000) state = { code: ref, session: crypto.randomUUID(), updated: now };
      url.searchParams.delete('ref');
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    } else if (ref || !state || now - state.updated > 1800000) {
      sessionStorage.removeItem(key); return;
    }
    state.updated = now; sessionStorage.setItem(key, JSON.stringify(state));
    let visibleMs = 0, last = performance.now();
    const timer = window.setInterval(async () => {
      const tick = performance.now();
      if (document.visibilityState === 'visible') visibleMs += Math.min(tick - last, 1000);
      last = tick;
      if (visibleMs < 5000) return;
      clearInterval(timer);
      try {
        if (localStorage.getItem('ml-analytics-optout') === '1') return;
        const current = JSON.parse(sessionStorage.getItem(key) || 'null');
        if (!current || current.code !== state.code) return;
        const sentKey = 'ml-visit:' + state.code + ':' + path + ':' + Math.floor(Date.now() / 1800000);
        if (sessionStorage.getItem(sentKey)) return;
        const response = await fetch(endpoint, { method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: state.code, session: state.session, path }), keepalive: true });
        if (response.ok) sessionStorage.setItem(sentKey, '1');
      } catch { /* Analytics must never interrupt the website. */ }
    }, 500);
    window.addEventListener('pagehide', () => clearInterval(timer), { once: true });
  } catch { /* Storage blocked: skip optional analytics. */ }
}
