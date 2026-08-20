document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.main-nav a')];

  const setActiveNav = (target) => {
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === target) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  setActiveNav(window.location.hash || '#dashboard');

  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
    lucide.createIcons();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setActiveNav(link.getAttribute('href')));
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const views = {
    visao: { title: 'Visão 360°', heading: 'Visão consolidada' },
    producao: { title: 'Produção', heading: 'Performance produtiva' },
    clima: { title: 'Clima', heading: 'Inteligência climática' },
    ambiente: { title: 'Meio Ambiente', heading: 'Saúde do ambiente' },
    emissoes: { title: 'Emissões', heading: 'Balanço de emissões' },
    territorio: { title: 'Território', heading: 'Leitura do território' }
  };

  document.querySelectorAll('.dash-link').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.dash-link').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const view = views[button.dataset.view];
      document.querySelector('#dash-title').textContent = view.title;
      document.querySelector('#mock-heading').textContent = view.heading;
    });
  });
});
