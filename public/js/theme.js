(() => {
 const root = document.documentElement;
 let theme = 'dark';
 try { theme = localStorage.getItem('theme') || 'dark'; } catch {}
 root.classList.toggle('dark', theme !== 'light');
 document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('header-theme-button');
  const label = () => button?.setAttribute('aria-label', root.classList.contains('dark') ? 'Switch to light theme' : 'Switch to dark theme');
  label();
  button?.addEventListener('click', () => {
   root.classList.toggle('dark');
   try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch {}
   label();
  });
 });
})();
