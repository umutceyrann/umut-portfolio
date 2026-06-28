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
// Default language is Turkish. Each translatable element holds the Turkish
// text inline and the English text in a data-en attribute. The original
// Turkish is captured into data-tr on first switch so we can switch back.

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
    } catch (e) {
        /* storage unavailable — ignore */
    }
}

function toggleLang() {
    const current = document.documentElement.lang === "en" ? "en" : "tr";
    applyLang(current === "en" ? "tr" : "en");
}

// restore saved preference
(function initLang() {
    let saved = "tr";
    try {
        saved = localStorage.getItem("site-lang") || "tr";
    } catch (e) {
        /* ignore */
    }
    if (saved === "en") applyLang("en");
})();

// ====================== Animations (GSAP) ======================
gsap.registerPlugin(ScrollTrigger);

gsap.to(".reveal-hero-text", { opacity: 0, y: "100%" });
gsap.to(".reveal-hero-img", { opacity: 0, y: "100%" });
gsap.to(".reveal-up", { opacity: 0, y: "100%" });

window.addEventListener("load", () => {
    gsap.to(".reveal-hero-text", {
        opacity: 1,
        y: "0%",
        duration: 0.8,
        stagger: 0.15,
    });

    gsap.to(".reveal-hero-img", {
        opacity: 1,
        y: "0%",
        duration: 0.8,
    });
});

// reveal-up sections on scroll
const sections = gsap.utils.toArray("section");

sections.forEach((sec) => {
    const revealUptimeline = gsap.timeline({
        paused: true,
        scrollTrigger: {
            trigger: sec,
            start: "10% 80%",
            end: "20% 90%",
        },
    });

    revealUptimeline.to(sec.querySelectorAll(".reveal-up"), {
        opacity: 1,
        duration: 0.8,
        y: "0%",
        stagger: 0.15,
    });
});
