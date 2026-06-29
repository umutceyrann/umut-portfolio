// ====================== Theme (Dark / Light) ======================
function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.getElementById('theme-icon').className = next === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    try { localStorage.setItem('site-theme', next); } catch (e) { /* ignore */ }
}

(function initTheme() {
    let saved = 'light';
    try { saved = localStorage.getItem('site-theme') || 'light'; } catch (e) { /* ignore */ }
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.className = 'bi bi-sun-fill';
    }
})();

// ====================== Header (mobile) ======================
const RESPONSIVE_WIDTH = 1024;

let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH;
const collapseBtn = document.getElementById("collapse-btn");
const collapseHeaderItems = document.getElementById("collapsed-header-items");

function onHeaderClickOutside(e) {
    if (!collapseHeaderItems.contains(e.target)) {
        toggleHeader();
    }
}

function toggleHeader() {
    if (isHeaderCollapsed) {
        collapseHeaderItems.classList.add("opacity-100");
        collapseHeaderItems.style.width = "70vw";
        collapseBtn.classList.remove("bi-list");
        collapseBtn.classList.add("bi-x", "max-lg:tw-fixed");
        isHeaderCollapsed = false;
        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1);
    } else {
        collapseHeaderItems.classList.remove("opacity-100");
        collapseHeaderItems.style.width = "0vw";
        collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed");
        collapseBtn.classList.add("bi-list");
        isHeaderCollapsed = true;
        window.removeEventListener("click", onHeaderClickOutside);
    }
}

function responsive() {
    if (window.innerWidth > RESPONSIVE_WIDTH) {
        collapseHeaderItems.style.width = "";
    } else {
        isHeaderCollapsed = true;
    }
}
window.addEventListener("resize", responsive);

// ====================== Language (TR / EN) ======================
function applyLang(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-en]").forEach((el) => {
        if (el.dataset.tr === undefined) {
            el.dataset.tr = el.innerHTML.trim();
        }
        el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.tr;
    });

    const label = document.getElementById("lang-label");
    if (label) label.textContent = lang === "en" ? "TR" : "EN";

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

// ====================== Animations (GSAP) ======================
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

    // Hide scroll indicator on scroll
    window.addEventListener("scroll", () => {
        const hint = document.getElementById("scroll-hint");
        if (hint && window.scrollY > 60) {
            gsap.to(hint, { opacity: 0, y: 10, duration: 0.4 });
        }
    }, { passive: true });
});

// Scroll-triggered reveals — per section
const sections = gsap.utils.toArray("section");

sections.forEach((sec) => {
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
