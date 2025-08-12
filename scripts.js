
// script.js — minimal, readable, scoped

document.addEventListener('DOMContentLoaded', () => {
    // 1) Footer year
    const yearEl = document.getElementById('yr');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2) Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return; // ignore non-target links
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // 3) Contact form (demo handler)
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thanks! This is a demo. Connect a backend or Netlify Forms to receive messages.');
            form.reset();
        });
    }

    // 4) Subtle shadow on sticky header when scrolling
    const topbar = document.querySelector('.topbar');
    if (topbar) {
        const applyShadow = () => {
            topbar.style.boxShadow = window.scrollY > 8 ? '0 4px 12px rgba(0,0,0,.06)' : 'none';
        };
        applyShadow();
        window.addEventListener('scroll', applyShadow, { passive: true });
    }
});

