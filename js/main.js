/**
 * ruma — Sitio Web Oficial (Interactividad: tema claro/oscuro, navegación móvil, vista previa interactiva y soporte)
 */

(function () {
  const THEME_KEY = 'ruma_web_theme';

  const SUN_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  const MOON_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

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
    const btn = document.getElementById('theme-toggle');
    btn?.addEventListener('click', () => {
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

  function initShowcase() {
    const tabs = document.querySelectorAll('[data-preview-tab]');
    const panels = document.querySelectorAll('[data-preview-panel]');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-preview-tab');
        tabs.forEach(t => {
          const active = t === tab;
          t.classList.toggle('active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        panels.forEach(p => {
          p.classList.toggle('active', p.getAttribute('data-preview-panel') === target);
        });
      });
    });

    // Tareas interactivas en la tarjeta de ejemplo de Actividades
    const taskButtons = document.querySelectorAll('[data-demo-task]');
    const progressLabel = document.getElementById('demo-act-progress-label');
    const progressPct = document.getElementById('demo-act-progress-pct');
    const progressFill = document.getElementById('demo-act-progress-fill');

    function updateProgress() {
      const total = taskButtons.length;
      if (!total) return;
      let done = 0;
      taskButtons.forEach(b => { if (b.classList.contains('done')) done += 1; });
      const pct = Math.round((done / total) * 100);
      if (progressLabel) progressLabel.textContent = `${done}/${total} responsabilidades`;
      if (progressPct) progressPct.textContent = `${pct}%`;
      if (progressFill) progressFill.style.width = `${pct}%`;
    }

    taskButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isDone = btn.classList.toggle('done');
        btn.setAttribute('aria-pressed', isDone ? 'true' : 'false');
        const check = btn.querySelector('.p-check');
        if (check) check.textContent = isDone ? '✓' : '';
        updateProgress();
      });
    });
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
    initShowcase();
    initDeleteForm();
  });
})();
