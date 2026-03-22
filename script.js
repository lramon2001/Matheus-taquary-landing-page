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
            "error"
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

  document.addEventListener("DOMContentLoaded", function () {
    initWhatsAppLinks();
    initHeader();
    initNav();
    initAccordion();
    initReveal();
    initYear();
  });
})();
