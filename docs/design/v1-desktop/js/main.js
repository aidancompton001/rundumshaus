/* ============================================================
   Rund ums Haus Littawe — main.js (v1-desktop)
   Module: Navigation (Burger + Dropdown), FAQ-Akkordeon,
           Scroll-Reveal, Stats-Counter, WhatsApp-Consent (DSGVO),
           Formular-Consent-Gate, Chip-Aufklappen, Jahr im Footer.
   Vanilla JS, keine Abhängigkeiten. Für den Port: jede Funktion
   entspricht einem künftigen React-Hook/Komponentenverhalten.
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Dropdown „Leistungen“ (Maus + Tastatur, Esc) ---------- */
  document.querySelectorAll(".nav-dropdown").forEach(function (dd) {
    var btn = dd.querySelector("button");
    var menu = dd.querySelector(".dropdown-menu");
    if (!btn || !menu) return;

    function setOpen(open) {
      dd.dataset.open = String(open);
      btn.setAttribute("aria-expanded", String(open));
    }
    setOpen(false);

    btn.addEventListener("click", function () {
      setOpen(dd.dataset.open !== "true");
    });
    dd.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setOpen(false); btn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!dd.contains(e.target)) setOpen(false);
    });
    dd.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!dd.contains(document.activeElement)) setOpen(false);
      }, 0);
    });
  });

  /* ---------- 2. Burger-Navigation (mobil) ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".main-nav");
  var navClose = document.querySelector(".nav-close");
  var overlay = document.querySelector(".nav-overlay");

  function setNav(open) {
    if (!nav) return;
    nav.dataset.open = String(open);
    if (burger) burger.setAttribute("aria-expanded", String(open));
    if (overlay) overlay.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
    if (open && navClose) navClose.focus();
    if (!open && burger) burger.focus();
  }
  if (burger && nav) {
    burger.addEventListener("click", function () { setNav(true); });
    if (navClose) navClose.addEventListener("click", function () { setNav(false); });
    if (overlay) overlay.addEventListener("click", function () { setNav(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.dataset.open === "true") setNav(false);
    });
  }

  /* ---------- 3. FAQ-Akkordeon (Tab/Enter/Esc, aria-expanded) ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector("button");
    var panel = item.querySelector(".faq-panel");
    if (!btn || !panel) return;

    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        btn.setAttribute("aria-expanded", "false");
        panel.hidden = true;
        btn.focus();
      }
    });
  });

  /* ---------- 4. Scroll-Reveal (IntersectionObserver, dezent) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 5. Stats-Counter (0 → Wert beim Erscheinen) ---------- */
  function animateCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || "";
    if (isNaN(target) || prefersReducedMotion) {
      el.textContent = (isNaN(target) ? el.textContent : target) + suffix;
      return;
    }
    var duration = 1100;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- 6. WhatsApp-Consent (DSGVO: 2-Schritt-Hinweis) ----------
     Erster Klick auf [data-wa] öffnet einen Hinweis (Datenübertragung an Meta)
     mit explizitem Weiter-Link. Kein Direktabsprung ohne Hinweis. */
  var WA_TEXT = "Es öffnet sich WhatsApp – dabei werden Daten an Meta übertragen.";
  document.querySelectorAll("[data-wa]").forEach(function (link) {
    var popover = null;

    function closePopover() {
      if (popover) { popover.remove(); popover = null; }
    }

    link.addEventListener("click", function (e) {
      if (popover) return; // Hinweis offen → normaler Klick ginge auf den Weiter-Link
      e.preventDefault();

      popover = document.createElement("div");
      popover.className = "wa-consent";
      popover.setAttribute("role", "dialog");
      popover.setAttribute("aria-label", "Hinweis zur Datenübertragung");

      var txt = document.createElement("p");
      txt.style.margin = "0";
      txt.textContent = WA_TEXT;

      var go = document.createElement("a");
      go.className = "wa-consent-go";
      go.href = link.href;
      go.target = "_blank";
      go.rel = "noopener";
      go.textContent = "Einverstanden – WhatsApp öffnen →";
      go.addEventListener("click", function () { closePopover(); });

      var abort = document.createElement("button");
      abort.type = "button";
      abort.textContent = "Abbrechen";
      abort.style.cssText = "display:block;margin-top:.35rem;font-size:.875rem;color:var(--color-ink-muted);min-height:24px;";
      abort.addEventListener("click", closePopover);

      popover.appendChild(txt);
      popover.appendChild(go);
      popover.appendChild(abort);

      var host = link.closest(".hero-ctas, .cta-buttons, .site-header .container, .footer-col, .contact-info-card") || link.parentElement;
      if (host && getComputedStyle(host).position === "static") host.style.position = "relative";
      (host || document.body).appendChild(popover);
      go.focus();

      document.addEventListener("keydown", function esc(ev) {
        if (ev.key === "Escape") { closePopover(); document.removeEventListener("keydown", esc); link.focus(); }
      });
      document.addEventListener("click", function outside(ev) {
        if (popover && !popover.contains(ev.target) && ev.target !== link && !link.contains(ev.target)) {
          closePopover();
          document.removeEventListener("click", outside);
        }
      }, true);
    });
  });

  /* ---------- 7. Kontaktformular: Consent-Gate + Inline-Fehler ---------- */
  var form = document.querySelector("form[data-form='kontakt']");
  if (form) {
    var consent = form.querySelector("#consent");
    var submit = form.querySelector("button[type='submit']");

    function syncConsent() {
      if (consent && submit) submit.disabled = !consent.checked;
    }
    if (consent) {
      consent.addEventListener("change", syncConsent);
      syncConsent();
    }

    form.addEventListener("submit", function (e) {
      // Валидируем на месте. Невалидную форму не отпускаем, валидная уходит на
      // FormSubmit — тот же обработчик и та же почта, что на живом сайте.
      // Поля НЕ блокируем до отправки: disabled-поля браузер не отправляет,
      // и раньше форма показывала успех, ничего не отослав.
      var valid = true;
      form.querySelectorAll(".form-field[data-required]").forEach(function (field) {
        var input = field.querySelector("input, textarea, select");
        var bad = !input || !input.value.trim() ||
                  (input.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value));
        field.dataset.invalid = String(bad);
        if (bad) valid = false;
      });
      if (!valid) {
        e.preventDefault();
        var first = form.querySelector('.form-field[data-invalid="true"] input, .form-field[data-invalid="true"] textarea');
        if (first) first.focus();
      }
    });
  }

  /* ---------- 8. „Weitere Einsatzorte“: Chips aufklappen ---------- */
  document.querySelectorAll("[data-chip-toggle]").forEach(function (btn) {
    var list = document.querySelector(btn.dataset.chipToggle);
    if (!list) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      list.querySelectorAll("[data-chip-extra]").forEach(function (chip) { chip.hidden = open; });
      btn.setAttribute("aria-expanded", String(!open));
      btn.textContent = open ? btn.dataset.moreLabel : btn.dataset.lessLabel;
    });
  });

  /* ---------- 9. Jahr im Copyright ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
