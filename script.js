document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os ícones Lucide depois que o HTML estiver disponível.
  if (window.lucide) lucide.createIcons();

  const powerbiShell = document.querySelector('.powerbi-shell');
  const powerbiIframe = document.querySelector('.powerbi-wrapper iframe');
  const fullscreenButton = document.querySelector('.powerbi-fullscreen-toggle');
  const fullscreenText = fullscreenButton?.querySelector('.powerbi-fullscreen-text');
  const fullscreenIcon = fullscreenButton?.querySelector('.powerbi-fullscreen-icon');

  const getFullscreenElement = () => {
    return document.fullscreenElement
      || document.webkitFullscreenElement
      || document.mozFullScreenElement
      || document.msFullscreenElement
      || null;
  };

  const updateFullscreenButton = () => {
    if (!fullscreenButton || !fullscreenText || !fullscreenIcon) return;

    const activeElement = getFullscreenElement();
    const isFullscreen = activeElement === powerbiShell || activeElement === powerbiIframe;

    powerbiShell?.classList.toggle('is-fullscreen', isFullscreen);
    powerbiIframe?.classList.toggle('is-fullscreen', isFullscreen);

    fullscreenButton.classList.toggle('is-active', isFullscreen);
    fullscreenButton.setAttribute('aria-pressed', String(isFullscreen));
    fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Sair da tela cheia' : 'Ativar tela cheia');
    fullscreenText.textContent = isFullscreen ? 'Sair da tela cheia' : 'Tela cheia';
    fullscreenIcon.textContent = isFullscreen ? '⤢' : '⛶';
  };

  const syncFullscreenState = () => {
    requestAnimationFrame(() => {
      applyFullscreenStyles();
      updateFullscreenButton();
    });
  };

  const requestFullscreen = async (element) => {
    if (!element) return false;

    if (typeof element.requestFullscreen === 'function') {
      await element.requestFullscreen();
      return true;
    }

    if (typeof element.webkitRequestFullscreen === 'function') {
      await element.webkitRequestFullscreen();
      return true;
    }

    if (typeof element.mozRequestFullScreen === 'function') {
      await element.mozRequestFullScreen();
      return true;
    }

    if (typeof element.msRequestFullscreen === 'function') {
      await element.msRequestFullscreen();
      return true;
    }

    return false;
  };

  const exitFullscreen = async () => {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
      return;
    }

    if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
      return;
    }

    if (document.mozCancelFullScreen) {
      await document.mozCancelFullScreen();
      return;
    }

    if (document.msExitFullscreen) {
      await document.msExitFullscreen();
    }
  };

  const applyFullscreenStyles = () => {
    const isFullscreen = !!getFullscreenElement();
    const wrapper = document.querySelector('.powerbi-wrapper');

    if (powerbiShell) {
      powerbiShell.style.position = isFullscreen ? 'fixed' : '';
      powerbiShell.style.inset = isFullscreen ? '0' : '';
      powerbiShell.style.width = isFullscreen ? '100vw' : '';
      powerbiShell.style.height = isFullscreen ? '100vh' : '';
      powerbiShell.style.maxWidth = isFullscreen ? '100vw' : '';
      powerbiShell.style.maxHeight = isFullscreen ? '100vh' : '';
      powerbiShell.style.margin = isFullscreen ? '0' : '';
      powerbiShell.style.padding = isFullscreen ? '0' : '';
      powerbiShell.style.zIndex = isFullscreen ? '9999' : '';
      powerbiShell.style.background = isFullscreen ? '#000' : '';
    }

    if (wrapper) {
      wrapper.style.position = isFullscreen ? 'absolute' : '';
      wrapper.style.inset = isFullscreen ? '0' : '';
      wrapper.style.width = isFullscreen ? '100vw' : '';
      wrapper.style.height = isFullscreen ? '100vh' : '';
      wrapper.style.maxWidth = isFullscreen ? '100vw' : '';
      wrapper.style.maxHeight = isFullscreen ? '100vh' : '';
      wrapper.style.aspectRatio = isFullscreen ? 'auto' : '';
      wrapper.style.borderRadius = isFullscreen ? '0' : '';
      wrapper.style.borderWidth = isFullscreen ? '0' : '';
      wrapper.style.margin = isFullscreen ? '0' : '';
    }

    if (powerbiIframe) {
      powerbiIframe.style.position = isFullscreen ? 'absolute' : '';
      powerbiIframe.style.inset = isFullscreen ? '0' : '';
      powerbiIframe.style.width = isFullscreen ? '100%' : '';
      powerbiIframe.style.height = isFullscreen ? '100%' : '';
      powerbiIframe.style.maxWidth = isFullscreen ? 'none' : '';
      powerbiIframe.style.maxHeight = isFullscreen ? 'none' : '';
      powerbiIframe.style.border = isFullscreen ? '0' : '';
      powerbiIframe.style.display = isFullscreen ? 'block' : '';
    }
  };

  const toggleFullscreen = async () => {
    const activeElement = getFullscreenElement();

    if (!activeElement) {
      try {
        if (powerbiIframe && typeof powerbiIframe.requestFullscreen === 'function') {
          await powerbiIframe.requestFullscreen();
          return;
        }
      } catch (error) {
        console.warn('Fullscreen no iframe falhou, tentando no shell:', error);
      }

      if (powerbiShell && typeof powerbiShell.requestFullscreen === 'function') {
        await powerbiShell.requestFullscreen();
      }
      return;
    }

    await exitFullscreen();
  };

  const handleEscapeExit = async (event) => {
    if (event.key === 'Escape' && getFullscreenElement()) {
      event.preventDefault();
      await exitFullscreen();
      syncFullscreenState();
    }
  };

  fullscreenButton?.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', handleEscapeExit);

  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach((eventName) => {
    document.addEventListener(eventName, syncFullscreenState);
  });

  updateFullscreenButton();
  applyFullscreenStyles();

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
