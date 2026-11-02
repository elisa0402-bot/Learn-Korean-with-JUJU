/* Check published lesson revisions when the installed app opens or returns. */
(() => {
  const script = document.currentScript;
  const pageVersion = script && script.dataset.pageVersion;
  if (!pageVersion || !/^https?:$/.test(location.protocol)) return;
  const pageName = location.pathname.split('/').pop() || 'index.html';
  const base = new URL('.', script.src);
  let checking = false;
  let reloading = false;
  function hasWorkInProgress() {
    return [...document.querySelectorAll('input,textarea,select:not(#jump)')]
      .some(el => !['button','submit','hidden'].includes(el.type) && !!el.value)
      || !!document.querySelector('.mc.done,.ox.done,.flip.flipped,[data-mark],.opt[data-self].on');
  }
  async function check() {
    if (checking || reloading || document.hidden || !navigator.onLine) return;
    checking = true;
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) registration.update().catch(() => {});
      }
      const response = await fetch(new URL('version.json', base), {cache:'no-store'});
      if (!response.ok) return;
      const versions = await response.json();
      const latest = versions.pages && versions.pages[pageName];
      if (latest && latest !== pageVersion && !hasWorkInProgress()) {
        reloading = true;
        location.reload();
      }
    } catch (_) {
      // Keep the cached lesson usable while offline or during a deployment.
    } finally { checking = false; }
  }
  window.addEventListener('pageshow', check);
  window.addEventListener('focus', check);
  window.addEventListener('online', check);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
  setInterval(check, 60000);
  check();
})();
