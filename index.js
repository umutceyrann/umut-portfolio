const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ====================== Theme (Dark / Light) ======================
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeIcon) themeIcon.className = theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill";
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

function toggleTheme() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("site-theme", next); } catch (e) { /* ignore */ }
}

(function initTheme() {
    let saved = "light";
    try { saved = localStorage.getItem("site-theme") || "light"; } catch (e) { /* ignore */ }
    setTheme(saved === "dark" ? "dark" : "light");
})();

themeToggle?.addEventListener("click", toggleTheme);

// ====================== Header (mobile) ======================
const desktopQuery = window.matchMedia("(min-width: 1024px)");
const collapseBtn = document.getElementById("collapse-btn");
const collapseHeaderItems = document.getElementById("collapsed-header-items");
let isMenuOpen = false;

function onHeaderClickOutside(e) {
    if (!collapseHeaderItems.contains(e.target) && e.target !== collapseBtn) {
        closeMenu();
    }
}

function onMenuKeydown(e) {
    if (e.key === "Escape") {
        closeMenu();
        collapseBtn.focus();
    }
}

function openMenu() {
    isMenuOpen = true;
    collapseHeaderItems.classList.add("opacity-100");
    collapseHeaderItems.style.width = "70vw";
    collapseBtn.classList.remove("bi-list");
    collapseBtn.classList.add("bi-x", "max-lg:tw-fixed");
    collapseBtn.setAttribute("aria-expanded", "true");
    setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1);
    document.addEventListener("keydown", onMenuKeydown);
}

function closeMenu() {
    isMenuOpen = false;
    collapseHeaderItems.classList.remove("opacity-100");
    collapseHeaderItems.style.width = desktopQuery.matches ? "" : "0vw";
    collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed");
    collapseBtn.classList.add("bi-list");
    collapseBtn.setAttribute("aria-expanded", "false");
    window.removeEventListener("click", onHeaderClickOutside);
    document.removeEventListener("keydown", onMenuKeydown);
}

function toggleHeader() {
    isMenuOpen ? closeMenu() : openMenu();
}

collapseBtn.addEventListener("click", toggleHeader);

// Close the mobile menu after choosing a link
collapseHeaderItems.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        if (isMenuOpen) closeMenu();
    });
});

desktopQuery.addEventListener("change", () => {
    closeMenu();
});

// ====================== Language (TR / EN) ======================
function applyLang(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-en]").forEach((el) => {
        if (el.dataset.tr === undefined) {
            el.dataset.tr = el.innerHTML.trim();
        }
        el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.tr;
    });

    document.querySelectorAll("[data-en-aria]").forEach((el) => {
        if (el.dataset.trAria === undefined) {
            el.dataset.trAria = el.getAttribute("aria-label") || "";
        }
        el.setAttribute("aria-label", lang === "en" ? el.dataset.enAria : el.dataset.trAria);
    });

    // The button offers the *other* language
    const label = document.getElementById("lang-label");
    const srLabel = document.getElementById("lang-sr");
    const langBtn = document.getElementById("lang-toggle");
    if (label) label.textContent = lang === "en" ? "TR" : "EN";
    if (srLabel) srLabel.textContent = lang === "en" ? "Türkçe" : "English";
    if (langBtn) langBtn.lang = lang === "en" ? "tr" : "en";

    try {
        localStorage.setItem("site-lang", lang);
    } catch (e) { /* ignore */ }
}

function toggleLang() {
    const current = document.documentElement.lang === "en" ? "en" : "tr";
    applyLang(current === "en" ? "tr" : "en");
}

(function initLang() {
    let saved = "tr";
    try { saved = localStorage.getItem("site-lang") || "tr"; } catch (e) { /* ignore */ }
    if (saved === "en") applyLang("en");
})();

document.getElementById("lang-toggle")?.addEventListener("click", toggleLang);

// ====================== Animations (GSAP) ======================
// Skip all motion when the user asks for reduced motion or GSAP failed to load;
// content then stays visible in its final state.
if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial state — invisible, shifted down
    gsap.set(".reveal-hero-text", { opacity: 0, y: 60, skewY: 3 });
    gsap.set(".reveal-hero-img",  { opacity: 0, scale: 0.92, y: 40 });
    gsap.set(".reveal-up",        { opacity: 0, y: 50 });
    gsap.set(".cert-card",        { opacity: 0, y: 40 });
    gsap.set(".tech-badge",       { opacity: 0, scale: 0.8 });
    gsap.set(".scroll-indicator", { opacity: 0 });

    window.addEventListener("load", () => {
        // Hero text — staggered word reveal
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        heroTl
            .to(".reveal-hero-text", {
                opacity: 1,
                y: 0,
                skewY: 0,
                duration: 0.9,
                stagger: 0.12,
            })
            .to(".reveal-hero-img", {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1,
                ease: "expo.out",
            }, "-=0.5")
            .to(".tech-badge", {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: "back.out(1.7)",
            }, "-=0.4")
            .to(".scroll-indicator", {
                opacity: 1,
                duration: 0.5,
            }, "-=0.2");

        // Hide scroll indicator once the user scrolls
        const hint = document.getElementById("scroll-hint");
        function hideHint() {
            if (window.scrollY > 60) {
                if (hint) gsap.to(hint, { opacity: 0, y: 10, duration: 0.4 });
                window.removeEventListener("scroll", hideHint);
            }
        }
        window.addEventListener("scroll", hideHint, { passive: true });
    });

    // Scroll-triggered reveals — per section
    gsap.utils.toArray("section").forEach((sec) => {
        const items = sec.querySelectorAll(".reveal-up");
        if (!items.length) return;

        gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
                trigger: sec,
                start: "top 82%",
                toggleActions: "play none none none",
            },
        });
    });

    // Cert cards — not covered by .reveal-up, need their own trigger
    const certCards = gsap.utils.toArray(".cert-card");
    if (certCards.length) {
        ScrollTrigger.batch(certCards, {
            start: "top 90%",
            onEnter: (batch) =>
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power2.out",
                }),
        });
    }

    // Magnetic CTA buttons
    document.querySelectorAll(".cta-btn").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.25,
                y: y * 0.25,
                duration: 0.4,
                ease: "power2.out",
            });
        });

        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        });
    });
}
