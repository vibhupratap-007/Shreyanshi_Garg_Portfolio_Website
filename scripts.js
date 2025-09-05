// scripts.js — unified, production-ready version
// Features:
// - footer year
// - smooth internal scroll
// - sticky topbar shadow
// - platform dropdown behavior
// - single contact form handler that POSTs to Formspree and redirects to _next

document.addEventListener('DOMContentLoaded', () => {
    // ---------- 1) Footer year ----------
    const yearEl = document.getElementById('yr');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---------- 2) Smooth scroll for internal links ----------
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href.startsWith('#platform')) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ---------- 3) Sticky topbar shadow ----------
    const topbar = document.querySelector('.topbar');
    if (topbar) {
        const applyShadow = () => {
            topbar.style.boxShadow = window.scrollY > 8 ? '0 4px 12px rgba(0,0,0,.06)' : 'none';
        };
        applyShadow();
        window.addEventListener('scroll', applyShadow, { passive: true });
    }

    // ---------- 4) Platform dropdown (plus button) ----------
    const toggleBtn = document.getElementById('platformToggle');
    const menu = document.getElementById('platformMenu');
    const followBtn = document.getElementById('followBtn');

    if (toggleBtn && menu && followBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
            toggleBtn.setAttribute('aria-expanded', menu.classList.contains('open'));
        });

        // platform selection
        menu.querySelectorAll('.platform-item').forEach(item => {
            item.addEventListener('click', (ev) => {
                ev.preventDefault();
                const url = item.getAttribute('data-url');
                const platform = item.getAttribute('data-platform');
                if (url) followBtn.href = url;
                if (platform) followBtn.dataset.activePlatform = platform;
                menu.querySelectorAll('.platform-item').forEach(el => el.setAttribute('aria-checked', 'false'));
                item.setAttribute('aria-checked', 'true');
                menu.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // close on outside click
        document.addEventListener('click', (ev) => {
            if (!menu.contains(ev.target) && !toggleBtn.contains(ev.target)) {
                menu.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------- 5) Contact form handler (single authoritative handler) ----------
    // Uses Formspree-friendly JSON accept header to avoid redirect/CORS problems.
    const form = document.getElementById('contact-form'); // ensure this id is on your <form>
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        // create or reuse a small status element
        let status = document.getElementById('form-status');
        if (!status) {
            status = document.createElement('div');
            status.id = 'form-status';
            status.style.marginTop = '12px';
            status.style.fontSize = '14px';
            status.style.lineHeight = '1.4';
            // style color fallback; your CSS can override #form-status styling
            status.style.color = '#222';
            form.appendChild(status);
        }
        status.textContent = 'Sending…';

        try {
            const res = await fetch(form.action, {
                method: (form.method || 'POST').toUpperCase(),
                body: new FormData(form),
                headers: { 'Accept': 'application/json' } // <- important for Formspree JSON response
            });

            if (res.ok) {
                // success: reset + redirect to _next if provided
                form.reset();
                const nextInput = form.querySelector('input[name="_next"]');
                const redirectUrl = nextInput && nextInput.value ? nextInput.value : null;

                status.textContent = 'Message sent — redirecting…';
                // small delay for UX, then redirect (if URL exists)
                setTimeout(() => {
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else {
                        // if no _next provided, show success note and keep on page
                        status.textContent = 'Message sent — thank you!';
                        if (submitBtn) submitBtn.disabled = false;
                    }
                }, 300);
                return;
            }

            // non-OK: try to parse JSON error
            const data = await res.json().catch(() => null);
            status.textContent = data?.error || data?.message || 'Submission failed. Try again later.';
        } catch (err) {
            // network or fetch error
            console.error('Form submit error:', err);
            status.textContent = 'Network error — please try again.';
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            // clear status after a bit (optional)
            setTimeout(() => {
                if (status && status.parentNode) status.textContent = '';
            }, 6000);
        }
    });

}); // DOMContentLoaded end
