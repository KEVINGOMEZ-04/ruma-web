/**
 * ruma — Sitio Web Oficial
 * Interactividad: tema claro/oscuro, escenario hero con pantallas reales,
 * recorrido guiado interactivo, galería filtrable, lightbox, guía PWA y soporte.
 */

(function () {
  const THEME_KEY = 'ruma_web_theme';

  const SUN_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  const MOON_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  const SCREENS_CATALOG = [
    {
      id: 'home',
      src: 'assets/screens/screen-home.webp',
      kicker: 'Inicio del grupo',
      title: 'Tu espacio privado en un toque',
      desc: 'Portada personalizada, código de invitación de 6 caracteres (RUMA26), miembros activos y accesos directos a Recuerdos, Películas, Series, Música, Libros y Objetivos.'
    },
    {
      id: 'activities',
      src: 'assets/screens/screen-activities.webp',
      kicker: 'Objetivos · Actividades',
      title: 'Planes reales con resumen claro',
      desc: 'Separa Metas a largo plazo, Actividades concretas y Notas compartidas. Consulta de un vistazo planes pendientes, próximos eventos y cuántas tareas te corresponden.'
    },
    {
      id: 'activity-detail',
      src: 'assets/screens/screen-activity-detail.webp',
      kicker: 'Detalle de actividad',
      title: 'Responsabilidades por integrante',
      desc: 'Cada salida (cine, viaje, cena o cumpleaños) tiene fecha, lugar, estado (Planeando, Confirmada, En curso, Completada), participantes y tareas asignadas con progreso automático.'
    },
    {
      id: 'memories',
      src: 'assets/screens/screen-memories.webp',
      kicker: 'Recuerdos · Google Drive',
      title: 'Calendario y línea de tiempo compartida',
      desc: 'Explora los momentos del grupo por mes o en línea de tiempo. Las fotos, videos y notas de voz se respaldan en calidad original dentro de la carpeta de Google Drive de tu grupo.'
    },
    {
      id: 'movies',
      src: 'assets/screens/screen-movies.webp',
      kicker: 'Club de Cine y Series',
      title: 'Catálogo conectado a TMDb',
      desc: 'Lleva el estado individual de cada integrante (Por ver, Vista, Favorita), califica películas y series, comparte reseñas y controla el avance capítulo por capítulo.'
    },
    {
      id: 'series',
      src: 'assets/screens/screen-series.webp',
      kicker: 'Centro de Series',
      title: 'Maratones con avance por capítulo',
      desc: 'Añade series desde TMDb, marca cada capítulo visto por temporada, sigue tu progreso y el de tu grupo, y califica o comenta sin spoilers.'
    },
    {
      id: 'books',
      src: 'assets/screens/screen-books.webp',
      kicker: 'Club de Libros',
      title: 'Biblioteca grupal con avance de páginas',
      desc: 'Busca libros con Google Books y Open Library, actualiza la página en la que vas, guarda calificaciones y comenta lecturas compartidas con tu grupo.'
    },
    {
      id: 'music',
      src: 'assets/screens/screen-music.webp',
      kicker: 'Música compartida',
      title: 'Playlist colaborativa con avance de 30s',
      desc: 'Añade canciones con dedicatorias, escucha avances oficiales, consulta la letra y abre cada canción directamente en Spotify, YouTube o Apple Music.'
    },
    {
      id: 'chat',
      src: 'assets/screens/screen-chat.webp',
      kicker: 'Chat contextual',
      title: 'Conversa citando contenido del grupo',
      desc: 'Responde enlazando un recuerdo, una actividad o una película directo en la burbuja, reacciona con emojis y comparte fotos, videos o notas de voz sin saturar el dispositivo.'
    }
  ];

  function getScreen(id) {
    return SCREENS_CATALOG.find(s => s.id === id) || SCREENS_CATALOG[0];
  }

  function applyTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#15111E' : '#FCFAFF');
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = next === 'dark' ? SUN_SVG : MOON_SVG;
      btn.setAttribute('aria-label', next === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
      btn.setAttribute('title', next === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    }
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
  }

  function initTheme() {
    let saved = 'light';
    try { saved = localStorage.getItem(THEME_KEY) || 'light'; } catch (_) {}
    applyTheme(saved);
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  function initMobileNav() {
    const btn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    if (!btn || !drawer) return;

    const close = () => {
      drawer.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  // Lightbox global para ampliar cualquier pantallazo real
  let openLightboxById = () => {};

  function initLightbox() {
    const lb = document.getElementById('screen-lightbox');
    if (!lb) return;

    const imgEl = document.getElementById('lb-img');
    const kickerEl = document.getElementById('lb-kicker');
    const titleEl = document.getElementById('lb-title');
    const descEl = document.getElementById('lb-desc');
    const counterEl = document.getElementById('lb-counter');
    let currentIdx = 0;

    function renderIdx(idx) {
      currentIdx = (idx + SCREENS_CATALOG.length) % SCREENS_CATALOG.length;
      const item = SCREENS_CATALOG[currentIdx];
      if (imgEl) { imgEl.src = item.src; imgEl.alt = item.title; }
      if (kickerEl) kickerEl.textContent = item.kicker;
      if (titleEl) titleEl.textContent = item.title;
      if (descEl) descEl.textContent = item.desc;
      if (counterEl) counterEl.textContent = `${currentIdx + 1} / ${SCREENS_CATALOG.length}`;
    }

    function open(screenId) {
      const idx = SCREENS_CATALOG.findIndex(s => s.id === screenId);
      renderIdx(idx >= 0 ? idx : 0);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openLightboxById = open;

    document.getElementById('lb-close')?.addEventListener('click', close);
    document.getElementById('lb-prev')?.addEventListener('click', () => renderIdx(currentIdx - 1));
    document.getElementById('lb-next')?.addEventListener('click', () => renderIdx(currentIdx + 1));

    lb.addEventListener('click', (e) => {
      if (e.target === lb) close();
    });

    // Gesto táctil: deslizar izquierda/derecha para navegar entre pantallazos
    let touchX = null;
    lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 50) renderIdx(currentIdx + (dx < 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') renderIdx(currentIdx - 1);
      else if (e.key === 'ArrowRight') renderIdx(currentIdx + 1);
    });

    document.querySelectorAll('[data-open-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const sid = trigger.getAttribute('data-open-lightbox');
        open(sid);
      });
    });
  }

  function swapImage(viewportEl, imgEl, nextSrc, nextAlt) {
    if (!imgEl || imgEl.getAttribute('src') === nextSrc) return;
    viewportEl?.classList.add('switching');
    setTimeout(() => {
      imgEl.src = nextSrc;
      imgEl.alt = nextAlt || '';
      viewportEl?.classList.remove('switching');
    }, 120);
  }

  function initHeroStage() {
    const heroImg = document.getElementById('hero-phone-img');
    const heroVp = document.getElementById('hero-phone-viewport');
    const heroZoom = document.getElementById('hero-zoom-btn');
    const tabs = document.querySelectorAll('[data-hero-screen]');
    const peeks = document.querySelectorAll('[data-peek-screen]');
    if (!heroImg || !tabs.length) return;

    function selectHero(screenId) {
      const item = getScreen(screenId);
      swapImage(heroVp, heroImg, item.src, item.title);
      heroZoom?.setAttribute('data-open-lightbox', item.id);
      tabs.forEach(t => {
        const active = t.getAttribute('data-hero-screen') === screenId;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    tabs.forEach(t => t.addEventListener('click', () => selectHero(t.getAttribute('data-hero-screen'))));
    peeks.forEach(p => p.addEventListener('click', () => selectHero(p.getAttribute('data-peek-screen'))));
  }

  function initGuidedTour() {
    const steps = Array.from(document.querySelectorAll('[data-tour-step]'));
    const tourImg = document.getElementById('tour-phone-img');
    const tourVp = document.getElementById('tour-phone-viewport');
    const tourZoom = document.getElementById('tour-zoom-btn');
    const capTitle = document.getElementById('tour-cap-title');
    const capText = document.getElementById('tour-cap-text');
    const prevBtn = document.getElementById('tour-prev-btn');
    const nextBtn = document.getElementById('tour-next-btn');
    if (!steps.length || !tourImg) return;

    let activeStepIdx = 0;

    function showScreen(screenId) {
      const item = getScreen(screenId);
      swapImage(tourVp, tourImg, item.src, item.title);
      tourZoom?.setAttribute('data-open-lightbox', item.id);
      if (capTitle) capTitle.textContent = item.title;
      if (capText) capText.textContent = item.desc;
    }

    function activateStep(idx) {
      activeStepIdx = (idx + steps.length) % steps.length;
      const stepEl = steps[activeStepIdx];
      steps.forEach((s, i) => {
        const on = i === activeStepIdx;
        s.classList.toggle('active', on);
        s.setAttribute('aria-expanded', on ? 'true' : 'false');
      });

      const activeSub = stepEl.querySelector('.tour-subpill.active');
      const screenId = activeSub?.getAttribute('data-sub-screen') || stepEl.getAttribute('data-tour-screen');
      showScreen(screenId);
    }

    steps.forEach((stepEl, idx) => {
      stepEl.addEventListener('click', (e) => {
        if (e.target.closest('.tour-subpill')) return;
        activateStep(idx);
      });
    });

    document.querySelectorAll('.tour-subpill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const parentStep = pill.closest('[data-tour-step]');
        const stepIdx = steps.indexOf(parentStep);
        if (stepIdx >= 0 && stepIdx !== activeStepIdx) {
          activeStepIdx = stepIdx;
          steps.forEach((s, i) => {
            s.classList.toggle('active', i === activeStepIdx);
            s.setAttribute('aria-expanded', i === activeStepIdx ? 'true' : 'false');
          });
        }
        parentStep?.querySelectorAll('.tour-subpill').forEach(p => p.classList.toggle('active', p === pill));
        showScreen(pill.getAttribute('data-sub-screen'));
      });
    });

    prevBtn?.addEventListener('click', () => activateStep(activeStepIdx - 1));
    nextBtn?.addEventListener('click', () => activateStep(activeStepIdx + 1));
  }

  function initGalleryFilters() {
    const pills = document.querySelectorAll('[data-gallery-filter]');
    const cards = document.querySelectorAll('[data-screen-cat]');
    if (!pills.length || !cards.length) return;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-gallery-filter');
        pills.forEach(p => {
          const active = p === pill;
          p.classList.toggle('active', active);
          p.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        cards.forEach(card => {
          const cat = card.getAttribute('data-screen-cat');
          card.hidden = filter !== 'all' && cat !== filter;
        });
      });
    });
  }

  function initInstallTabs() {
    const tabs = document.querySelectorAll('[data-install-tab]');
    const panels = document.querySelectorAll('[data-install-panel]');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-install-tab');
        tabs.forEach(t => {
          const on = t === tab;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach(p => {
          p.classList.toggle('active', p.getAttribute('data-install-panel') === target);
        });
      });
    });
  }

  function initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      els.forEach(el => el.classList.add('revealed'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    els.forEach(el => io.observe(el));
  }

  function initDeleteForm() {
    const form = document.getElementById('delete-account-form');
    if (!form) return;

    const feedback = document.getElementById('delete-form-feedback');
    const copyBtn = document.getElementById('btn-copy-delete-request');

    function buildPayload() {
      const identifier = (document.getElementById('del-identifier')?.value || '').trim();
      const scope = document.getElementById('del-scope')?.value || 'cuenta-completa';
      const notes = (document.getElementById('del-notes')?.value || '').trim();
      const scopeText = scope === 'solo-datos'
        ? 'Eliminar solo datos específicos (mantener cuenta)'
        : 'Eliminar cuenta completa y todos los datos asociados';

      const subject = `[ruma] Solicitud de eliminación de datos — ${identifier || 'Usuario'}`;
      const body = [
        'Hola equipo de ruma,',
        '',
        'Solicito el siguiente trámite sobre mi cuenta y datos personales:',
        `- Tipo de solicitud: ${scopeText}`,
        `- Cuenta (@usuario, correo o teléfono): ${identifier || '(indicar aquí)'}`,
        notes ? `- Detalles adicionales: ${notes}` : null,
        '',
        'Confirmo que soy el titular de esta cuenta y entiendo que la eliminación definitiva es irreversible.'
      ].filter(Boolean).join('\n');

      return { identifier, subject, body };
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { identifier, subject, body } = buildPayload();
      if (!identifier) {
        if (feedback) feedback.textContent = 'Ingresa tu @usuario, correo o teléfono registrado.';
        return;
      }
      const mailto = `mailto:kelvix110@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      if (feedback) {
        feedback.textContent = 'Se abrió tu aplicación de correo con la solicitud lista. Si no se abrió, usa el botón "Copiar texto de solicitud".';
      }
    });

    copyBtn?.addEventListener('click', async () => {
      const { subject, body } = buildPayload();
      const text = `Para: kelvix110@gmail.com\nAsunto: ${subject}\n\n${body}`;
      try {
        await navigator.clipboard.writeText(text);
        if (feedback) feedback.textContent = 'Solicitud copiada al portapapeles. Envíala a kelvix110@gmail.com.';
      } catch (_) {
        if (feedback) feedback.textContent = 'Envía tu solicitud directamente a kelvix110@gmail.com indicando tu @usuario o correo.';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initLightbox();
    initHeroStage();
    initGuidedTour();
    initGalleryFilters();
    initInstallTabs();
    initScrollReveal();
    initDeleteForm();
  });
})();
