/* =========================================================
   共通スクリプト（フレームワーク不使用・素のJS）
   - ヘッダーのスクロール演出
   - モバイルナビの開閉
   - スクロールで要素をふわっと表示(reveal)
   - 現在地セクションのナビハイライト
   - フッターの年号自動更新
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var header = document.querySelector("[data-header]");
    var navToggle = document.querySelector("[data-nav-toggle]");
    var navLinks = document.querySelector("[data-nav-links]");

    /* --- ヘッダー: スクロールで背景を付ける --- */
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* --- モバイルナビ開閉 --- */
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        var isOpen = navLinks.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
      });
      navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          navLinks.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }

    /* --- スクロールリビール --- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }

    /* --- ナビの現在地ハイライト --- */
    var sections = document.querySelectorAll("main section[id]");
    var navAnchors = document.querySelectorAll('[data-nav-links] a[href^="#"]');
    if ("IntersectionObserver" in window && sections.length && navAnchors.length) {
      var navIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.getAttribute("id");
            navAnchors.forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === "#" + id);
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach(function (s) { navIo.observe(s); });
    }

    /* --- フッターの年号 --- */
    var yearEl = document.querySelector("[data-year]");
    if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
  });
})();
