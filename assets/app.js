/* ============================================================
   Genius PDF Web — shared behaviour
   Language + direction toggle (persisted), active nav, mobile menu,
   faux QR / barcode / data-matrix renderers, preset tabs, filters.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- persisted language ---------- */
  var KEY = "geniusPdfLang";
  function readLang() {
    try { return localStorage.getItem(KEY) || "ar"; } catch (e) { return "ar"; }
  }
  function writeLang(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* preview sandbox */ }
  }

  function applyLang(lang) {
    var rtl = lang === "ar";
    var html = document.documentElement, body = document.body;
    html.lang = lang; html.dir = rtl ? "rtl" : "ltr"; body.dir = rtl ? "rtl" : "ltr";
    document.querySelectorAll("[data-ar]").forEach(function (el) {
      var val = el.getAttribute(rtl ? "data-ar" : "data-en");
      if (val !== null) el.innerHTML = val;
    });
    var ar = document.getElementById("ar"), en = document.getElementById("en");
    if (ar) ar.setAttribute("aria-pressed", String(rtl));
    if (en) en.setAttribute("aria-pressed", String(!rtl));
    writeLang(lang);
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  /* ---------- highlight the active nav link ---------- */
  function markActiveNav() {
    var here = location.pathname.split("/").pop() || "index.html";
    if (here === "") here = "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === here) a.classList.add("active");
    });
  }

  /* ---------- mobile menu ---------- */
  function wireMenu() {
    var burger = document.querySelector(".nav-burger");
    var links = document.querySelector(".nav-links");
    if (!burger || !links) return;
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  /* ---------- faux QR (looks like a real ZATCA QR) ---------- */
  function buildQR(svg, seedInit) {
    var N = 23, seed = seedInit;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    function finder(r, c) {
      var z = [[0, 0], [0, N - 7], [N - 7, 0]];
      for (var i = 0; i < z.length; i++) {
        var R = z[i][0], C = z[i][1];
        if (r >= R - 1 && r <= R + 7 && c >= C - 1 && c <= C + 7) return true;
      }
      return false;
    }
    var d = "";
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      if (finder(r, c)) continue;
      if (rnd() > 0.5) d += "M" + c + " " + r + "h1v1h-1z";
    }
    function fp(R, C) {
      return "M" + C + " " + R + "h7v7h-7z" +
        "M" + (C + 1) + " " + (R + 1) + "h5v5h-5z" +
        "M" + (C + 2) + " " + (R + 2) + "h3v3h-3z";
    }
    var ring = fp(0, 0) + fp(0, N - 7) + fp(N - 7, 0);
    svg.innerHTML =
      '<path d="' + d + '" fill="#14313A"/>' +
      '<path d="' + ring + '" fill="#14313A" fill-rule="evenodd"/>';
  }
  function initQRs() {
    document.querySelectorAll("svg[data-qr]").forEach(function (el, i) {
      buildQR(el, 73219 + i * 4111);
    });
  }

  /* ---------- faux barcodes ---------- */
  function initBarcodes() {
    document.querySelectorAll("[data-code]").forEach(function (box, idx) {
      var seed = 4801 + idx * 97;
      var rnd = function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
      var kind = box.dataset.code;
      var n = kind === "ean" ? 36 : 30;
      var html = "";
      for (var i = 0; i < n; i++) {
        var w = 1 + Math.round(rnd() * 3);
        var tall = kind === "ean" && (i < 2 || i > n - 3 || (i > n / 2 - 1 && i < n / 2 + 1));
        html += '<i style="width:' + w + "px;height:" + (tall ? "100%" : "88%") +
          ";align-self:" + (tall ? "stretch" : "center") + '"></i>';
      }
      box.innerHTML = html;
    });
  }

  /* ---------- faux data-matrix (10x10) ---------- */
  function initDataMatrix() {
    document.querySelectorAll("[data-dm]").forEach(function (box, idx) {
      var seed = 991 + idx * 53;
      var rnd = function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
      var html = "";
      for (var i = 0; i < 100; i++) {
        var row = Math.floor(i / 10), col = i % 10;
        var on;
        if (col === 0 || row === 9) on = true;                       // solid L
        else if (row === 0) on = col % 2 === 0;                      // dotted top
        else if (col === 9) on = row % 2 === 1;                      // dotted right
        else on = rnd() > 0.5;
        html += '<i class="' + (on ? "" : "o") + '"></i>';
      }
      box.innerHTML = html;
    });
  }

  /* ---------- generic preset / tab groups ----------
     <div data-tabs="targetId">
       <button data-tab="striped" aria-pressed="true">…</button> …
     </div>
     toggles class on #targetId (table) and on its wrapper for dark/pastel skins
  -------------------------------------------------------------- */
  function wireTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (group) {
      var targetId = group.dataset.tabs;
      var target = document.getElementById(targetId);
      var wrap = target ? target.closest(".mini") : null;
      var base = target ? (target.dataset.base || "demo") : "demo";
      group.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        group.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        var p = b.dataset.tab;
        if (target) target.className = base + " " + p;
        if (wrap) {
          wrap.classList.toggle("darkwrap", p === "dark");
          wrap.classList.toggle("pastelwrap", p === "pastel");
        }
      });
    });
  }

  /* ---------- template category filter ----------
     <div data-filter>…<button data-cat="financial">…</button></div>
     cards: <a class="tpl" data-cat="financial">
  -------------------------------------------------------------- */
  function wireFilter() {
    var bar = document.querySelector("[data-filter]");
    if (!bar) return;
    var cards = document.querySelectorAll("[data-cat]");
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      bar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      var cat = b.dataset.cat;
      cards.forEach(function (card) {
        if (!card.classList.contains("tpl") && !card.classList.contains("vclass")) return;
        var show = cat === "all" || card.dataset.cat === cat;
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* ---------- validation-gate demo (architecture/home optional) ---------- */
  function wireValidationDemo() {
    var sw = document.getElementById("vSwitch");
    if (!sw) return;
    var data = {
      ok: { vat: "1,952.25", grand: "14,967.25", vatPass: true, grandPass: true,
        ar: "كل الفحوص ناجحة — جاهز للتوليد.", en: "All checks passed — ready to generate.", cls: "ok" },
      bad: { vat: "2,055.00", grand: "15,070.00", vatPass: false, grandPass: false,
        ar: "⚠ الضريبة محسوبة على المجموع قبل الخصم — يجب أن تكون 1,952.25. التوليد متوقّف.",
        en: "⚠ VAT computed on the pre-discount subtotal — it must be 1,952.25. Generation halted.", cls: "err" }
    };
    function set(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
    function apply(s) {
      var d = data[s];
      sw.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.state === s)); });
      set("vVat", d.vat); set("vGrand", d.grand);
      var nVat = document.getElementById("nVat"), nGrand = document.getElementById("nGrand");
      if (nVat) nVat.classList.toggle("flag", !d.vatPass);
      if (nGrand) nGrand.classList.toggle("flag", !d.grandPass);
      var cVat = document.getElementById("cVat"), cGrand = document.getElementById("cGrand");
      if (cVat) { cVat.className = "vr " + (d.vatPass ? "pass" : "fail"); cVat.querySelector(".ic").textContent = d.vatPass ? "✓" : "✕"; }
      if (cGrand) { cGrand.className = "vr " + (d.grandPass ? "pass" : "fail"); cGrand.querySelector(".ic").textContent = d.grandPass ? "✓" : "✕"; }
      set("cVatV", d.vat); set("cGrandV", d.grand);
      var lang = document.documentElement.lang;
      var ban = document.getElementById("vBanner");
      if (ban) { ban.className = "vban " + d.cls; ban.innerHTML = '<span data-ar="' + d.ar + '" data-en="' + d.en + '">' + (lang === "ar" ? d.ar : d.en) + "</span>"; }
      var btn = document.getElementById("vBtn");
      if (btn) { var pass = d.vatPass && d.grandPass; btn.className = "vbtn " + (pass ? "on" : "off"); btn.disabled = !pass; }
    }
    sw.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) apply(b.dataset.state); });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    applyLang(readLang());
    markActiveNav();
    wireMenu();
    var ar = document.getElementById("ar"), en = document.getElementById("en");
    if (ar) ar.addEventListener("click", function () { applyLang("ar"); });
    if (en) en.addEventListener("click", function () { applyLang("en"); });
    initQRs(); initBarcodes(); initDataMatrix();
    wireTabs(); wireFilter(); wireValidationDemo();
  });
})();
