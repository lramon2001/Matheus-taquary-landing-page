(function () {
  "use strict";

  var WHATSAPP_E164 = "5561982359529";
  var DEFAULT_MESSAGE = "Olá, Matheus! Vim pela landing page.";

  function buildWhatsAppUrl(message) {
    var phone = (WHATSAPP_E164 || "").replace(/\D/g, "");
    var text = encodeURIComponent(message || DEFAULT_MESSAGE);
    if (!phone) {
      return "#contato";
    }
    return "https://wa.me/" + phone + (text ? "?text=" + text : "");
  }

  function initWhatsAppLinks() {
    var links = document.querySelectorAll(".js-whatsapp");
    links.forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var msg = el.getAttribute("data-msg") || DEFAULT_MESSAGE;
        var url = buildWhatsAppUrl(msg);
        if (url === "#contato") {
          window.alert(
            "Configure seu número do WhatsApp na variável WHATSAPP_E164 no arquivo script.js (apenas dígitos, com DDI, ex.: 5511999999999)."
          );
          return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
      });
    });
  }

  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  function initAccordion() {
    var root = document.querySelector("[data-accordion]");
    if (!root) return;

    root.querySelectorAll(".accordion-trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var panelId = btn.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;

        root.querySelectorAll(".accordion-trigger").forEach(function (other) {
          if (other === btn) return;
          other.setAttribute("aria-expanded", "false");
          var oid = other.getAttribute("aria-controls");
          var op = oid ? document.getElementById(oid) : null;
          if (op) op.setAttribute("hidden", "");
        });

        btn.setAttribute("aria-expanded", String(!expanded));
        if (panel) {
          if (expanded) {
            panel.setAttribute("hidden", "");
          } else {
            panel.removeAttribute("hidden");
          }
        }
      });
    });
  }

  function initReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
  }

  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function initResultadosCarousel() {
    var root = document.querySelector("[data-carousel]");
    if (!root) return;

    var track = root.querySelector("[data-carousel-track]");
    var viewport = root.querySelector("[data-carousel-viewport]");
    var dotsWrap = root.querySelector("[data-carousel-dots]");
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    if (!track || !viewport || !dotsWrap || !prevBtn || !nextBtn) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll(".carousel-slide"));
    var total = slides.length;
    if (!total) return;

    var index = 0;
    var autoTimer = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    dotsWrap.innerHTML = "";
    slides.forEach(function (_slide, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Ir para resultado " + (i + 1));
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
      dot.addEventListener("click", function () {
        setIndex(i);
        startAuto();
      });
      dotsWrap.appendChild(dot);
    });

    function setIndex(next) {
      index = (next + total) % total;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dotsWrap.querySelectorAll(".carousel-dot").forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (reduceMotion || total < 2) return;
      autoTimer = setInterval(function () {
        setIndex(index + 1);
      }, 4500);
    }

    prevBtn.addEventListener("click", function () {
      setIndex(index - 1);
      startAuto();
    });
    nextBtn.addEventListener("click", function () {
      setIndex(index + 1);
      startAuto();
    });

    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);
    root.addEventListener("focusin", stopAuto);
    root.addEventListener("focusout", startAuto);

    var touchX = null;
    viewport.addEventListener(
      "touchstart",
      function (e) {
        touchX = e.changedTouches[0].clientX;
        stopAuto();
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      function (e) {
        if (touchX == null) return;
        var dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) < 40) {
          startAuto();
          return;
        }
        setIndex(index + (dx < 0 ? 1 : -1));
        startAuto();
      },
      { passive: true }
    );

    setIndex(0);
    startAuto();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initWhatsAppLinks();
    initHeader();
    initNav();
    initAccordion();
    initResultadosCarousel();
    initReveal();
    initYear();
  });
})();
