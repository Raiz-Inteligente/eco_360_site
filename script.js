document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const reveals = document.querySelectorAll('.reveal');
  const fullscreenButton = document.querySelector('.powerbi-fullscreen-toggle');
  const dashboardShell = document.querySelector('.dashboard-shell');

  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? 'Fechar' : 'Menu';
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (menuToggle) menuToggle.textContent = 'Menu';
    });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
    reveals.forEach((element) => observer.observe(element));
  }

  const updateFullscreenState = () => {
    const active = document.fullscreenElement === dashboardShell;
    dashboardShell?.classList.toggle('is-fullscreen', active);
    fullscreenButton?.setAttribute('aria-pressed', String(active));
    if (fullscreenButton) fullscreenButton.innerHTML = active ? 'Sair da tela cheia <span aria-hidden="true">⤢</span>' : 'Tela cheia <span aria-hidden="true">⛶</span>';
  };

  fullscreenButton?.addEventListener('click', async () => {
    if (!dashboardShell) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await dashboardShell.requestFullscreen();
    } catch (error) {
      dashboardShell.classList.toggle('is-fullscreen');
      updateFullscreenState();
    }
  });

  document.addEventListener('fullscreenchange', updateFullscreenState);
});