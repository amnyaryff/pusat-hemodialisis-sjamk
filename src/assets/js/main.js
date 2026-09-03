/* =========================================================================
   Pusat Hemodialisis SJAMK — front-end behaviour
   - contact links (WhatsApp / phone)
   - mobile nav disclosure + sticky-header shadow
   - language switch (BM | EN segmented toggle, persisted; BM default)
   ========================================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var LANG_KEY = "sjamk-lang";
  var DEFAULT_LANG = "ms";
  var currentLang = DEFAULT_LANG;

  function parseJSON(id, fallback) {
    var el = document.getElementById(id);
    if (!el) return fallback;
    try { return JSON.parse(el.textContent); } catch (e) { return fallback; }
  }

  var I18N = parseJSON("i18n-data", { ms: {}, en: {} });
  var SITE = parseJSON("site-data", { whatsapp: "", phone: "", name: "" });

  /* ---------- contact links ----------------------------------------- */
  function waHref(text) {
    if (!SITE.whatsapp) return "#";
    var base = "https://wa.me/" + SITE.whatsapp;
    return text ? base + "?text=" + encodeURIComponent(text) : base;
  }

  function wireContactLinks() {
    var tel = SITE.phone ? "tel:" + SITE.phone.replace(/[^+\d]/g, "") : "#";
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.setAttribute("href", waHref(a.getAttribute("data-wa-text") || ""));
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
    document.querySelectorAll("[data-tel]").forEach(function (a) {
      a.setAttribute("href", tel);
    });
  }

  /* ---------- mobile nav ------------------------------------------------- */
  function wireNav() {
    var header = document.querySelector(".site-header");
    var btn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");

    if (header) {
      var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (!btn || !nav) return;
    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    }
    btn.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false);
    });
    var mq = window.matchMedia("(min-width: 900px)");
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function () {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- language -------------------------------------------------- */
  function readLang() {
    try {
      var s = localStorage.getItem(LANG_KEY);
      if (s === "ms" || s === "en") return s;
    } catch (e) {}
    return DEFAULT_LANG;
  }
  function storeLang(l) { try { localStorage.setItem(LANG_KEY, l); } catch (e) {} }

  function applyLang(lang) {
    currentLang = lang === "en" ? "en" : "ms";
    var dict = I18N[currentLang] || {};

    root.setAttribute("lang", currentLang);
    root.setAttribute("data-lang", currentLang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (dict[k] != null) el.textContent = dict[k];
    });
    document.querySelectorAll("[data-i18n-obj]").forEach(function (el) {
      var v = el.getAttribute(currentLang === "en" ? "data-en" : "data-ms");
      if (v != null && v !== "") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var b = pair.split(":");
        var attr = (b[0] || "").trim(), key = (b[1] || "").trim();
        if (attr && dict[key] != null) el.setAttribute(attr, dict[key]);
      });
    });

    // reflect state on the BM | EN switch
    document.querySelectorAll("[data-lang-set]").forEach(function (opt) {
      var on = opt.getAttribute("data-lang-set") === currentLang;
      opt.classList.toggle("is-active", on);
      opt.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function wireLangSwitch() {
    document.querySelectorAll("[data-lang-set]").forEach(function (opt) {
      opt.addEventListener("click", function () {
        var next = opt.getAttribute("data-lang-set");
        if (next === currentLang) return;
        storeLang(next);
        applyLang(next);
      });
    });
  }

  /* ---------- year ----------------------------------------------------- */
  function wireYear() {
    var y = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = y; });
  }

  /* ---------- stat counters (roll up when scrolled into view) --------- */
  function wireCounters() {
    var nums = document.querySelectorAll(".stat__num[data-count]");
    if (!nums.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function run(el) {
      var target = Number(el.getAttribute("data-count")) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduce || !target) { el.textContent = target + suffix; return; }
      var start = performance.now(), dur = 1400;
      function frame(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) {
      nums.forEach(run);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------- init --------------------------------------------------------- */
  function init() {
    wireContactLinks();
    wireNav();
    wireLangSwitch();
    wireYear();
    wireCounters();
    applyLang(readLang());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
