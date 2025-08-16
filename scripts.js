// script.js — clean, updated version

document.addEventListener('DOMContentLoaded', () => {
    // 1) Footer year
    const yearEl = document.getElementById('yr');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2) Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#' || id.startsWith('#platform')) return;
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

    // 4) Sticky header shadow
    const topbar = document.querySelector('.topbar');
    if (topbar) {
        const applyShadow = () => {
            topbar.style.boxShadow = window.scrollY > 8 ? '0 4px 12px rgba(0,0,0,.06)' : 'none';
        };
        applyShadow();
        window.addEventListener('scroll', applyShadow, { passive: true });
    }

    // 5) Platform dropdown toggle
    const toggleBtn = document.getElementById('platformToggle');
    const menu = document.getElementById('platformMenu');
    const followBtn = document.getElementById('followBtn');

    if (toggleBtn && menu && followBtn) {
        // Toggle dropdown
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent outside-click handler from firing immediately
            menu.classList.toggle('open');
            toggleBtn.setAttribute(
                'aria-expanded',
                menu.classList.contains('open')
            );
        });

        // Handle platform selection
        menu.querySelectorAll('.platform-item').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const url = btn.getAttribute('data-url');
                const platform = btn.getAttribute('data-platform');

                // Update follow button
                followBtn.href = url;
                followBtn.dataset.activePlatform = platform;

                // Mark active
                menu.querySelectorAll('.platform-item').forEach((el) =>
                    el.setAttribute('aria-checked', 'false')
                );
                btn.setAttribute('aria-checked', 'true');

                // Close menu
                menu.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
                menu.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
