document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os ícones Lucide depois que o HTML estiver disponível.
  if (window.lucide) lucide.createIcons();

  // Captura os controles do menu responsivo e os links do header.
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.main-nav a')];

  // Aplica o estado visual e semântico ao link da seção atual.
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

  // Abre ou fecha a navegação no mobile e alterna o ícone menu/fechar.
  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
    lucide.createIcons();
  });

  // Fecha o menu após selecionar uma seção e atualiza o link ativo.
  navLinks.forEach((link) => {
    link.addEventListener('click', () => setActiveNav(link.getAttribute('href')));
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Adiciona rolagem suave às âncoras internas da página.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Títulos exibidos quando um módulo do dashboard é selecionado.
  const views = {
    visao: { title: 'Visão 360°', heading: 'Visão consolidada' },
    producao: { title: 'Produção', heading: 'Performance produtiva' },
    clima: { title: 'Clima', heading: 'Inteligência climática' },
    ambiente: { title: 'Meio Ambiente', heading: 'Saúde do ambiente' },
    emissoes: { title: 'Emissões', heading: 'Balanço de emissões' },
    territorio: { title: 'Território', heading: 'Leitura do território' }
  };

  // Atualiza o botão ativo e os títulos do painel ao trocar de módulo.
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
