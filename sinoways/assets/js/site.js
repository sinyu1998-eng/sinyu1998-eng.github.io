/* SINOWAYS · 官网交互层
   语言切换（含 RTL）、动态内容渲染、入场编排、导航状态、二维码、助手唤起。 */
(function () {
  "use strict";

  const $ = (s, root) => (root || document).querySelector(s);
  const $$ = (s, root) => Array.from((root || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let lang = "en";
  let revealObserver = null;

  function getInitialLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && window.I18N[q]) return q;
    const saved = localStorage.getItem("sw-lang");
    if (saved && window.I18N[saved]) return saved;
    return "en";
  }

  /* ---------- 动态内容 ---------- */
  function put(id, html) {
    const node = document.getElementById(id);
    if (node) node.innerHTML = html;
  }

  function renderDynamic() {
    const d = window.I18N[lang];
    const t = (k) => window.t(lang, k);

    put("culture-points", (d["culture.points"] || []).map((x) => `<li>${esc(x)}</li>`).join(""));
    put("sourcing-points", (d["sourcing.points"] || []).map((x) => `<li>${esc(x)}</li>`).join(""));

    put("journey-grid", (d.itineraries || []).map((x) => {
      const pre = x.n === "03" ? "both" : (x.n === "02" ? "sourcing" : "culture");
      return `<article class="journey-card reveal">
        <div class="jc-media"><img src="assets/img/${esc(x.img)}" alt="${esc(x.title)}" loading="lazy">
          <span class="jc-tag">${esc(x.tag)}</span><span class="jc-n">${esc(x.n)}</span></div>
        <div class="jc-body">
          <div class="jc-duration"><b>${esc(x.duration)}</b><span>${esc(t("journeys.days"))}</span></div>
          <h3>${esc(x.title)}</h3>
          <p class="jc-route">${esc(x.route)}</p>
          <p class="jc-desc">${esc(x.desc)}</p>
          <div class="jc-highlights">${x.highlights.map((h) => `<span>${esc(h)}</span>`).join("")}</div>
          <div class="jc-foot">
            <div class="jc-price">${esc(t("journeys.from"))} · USD / person<b>$${esc(x.price)}</b></div>
            <button type="button" class="jc-ask" data-open-assistant data-prefill="${pre}">${esc(t("journeys.ask"))} →</button>
          </div>
        </div></article>`;
    }).join(""));

    put("people-grid", (d.people || []).map((x) => `<article class="person reveal">
      <div class="person-initial">${esc((x.cn || x.name)[0])}</div>
      <h3>${esc(x.name)}</h3><span class="cn">${esc(x.cn)}</span>
      <p class="role">${esc(x.role)}</p><p class="meta">${esc(x.meta)}</p>
      <p class="line">“${esc(x.line)}”</p>
      <div class="tags">${x.tags.map((g) => `<span>${esc(g)}</span>`).join("")}</div>
    </article>`).join(""));

    put("formats-grid", (d.formats || []).map((x) => `<article class="format-card reveal">
      <p class="format-type">${esc(x.type)}</p>
      <h3>${esc(x.title)}</h3><p class="format-place">${esc(x.place)}</p>
      <p class="format-detail">${esc(x.detail)}</p>
      <p class="format-meta">${esc(x.meta)}</p>
    </article>`).join(""));

    put("steps-grid", (d.steps || []).map((x) => `<article class="step reveal">
      <div class="step-n">${esc(x.n)}</div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>
    </article>`).join(""));

    /* 纪录片板块：卡片点击进入 YouTube 频道（链接集中在 SW_CONFIG） */
    const yt = (window.SW_CONFIG && window.SW_CONFIG.ytChannel) || "https://www.youtube.com/@documentaryChina";
    put("films-grid", (d["film.series"] || []).map((x) => `<a class="film-card reveal" href="${esc(yt)}" target="_blank" rel="noopener">
      <div class="film-media"><img src="assets/img/${esc(x.img)}" alt="${esc(x.title)}" loading="lazy"><span class="film-play" aria-hidden="true">▶</span></div>
      <div class="film-body"><p class="film-type">${esc(x.type)}</p><h3>${esc(x.title)}</h3><p class="film-detail">${esc(x.detail)}</p><p class="film-meta">${esc(x.meta)}</p></div>
    </a>`).join(""));
  }

  /* ---------- 语言 ---------- */
  function applyLang(l, first) {
    lang = l;
    const meta = window.LANG_META[l];
    document.documentElement.lang = l;
    document.documentElement.dir = meta.dir;
    document.documentElement.dataset.lang = l;
    localStorage.setItem("sw-lang", l);

    $$("[data-i18n]").forEach((node) => {
      const v = window.t(l, node.dataset.i18n);
      if (typeof v === "string") node.textContent = v;
    });
    document.title = window.t(l, "meta.title");
    const desc = $('meta[name="description"]');
    if (desc) desc.content = window.t(l, "meta.desc");
    $$("[data-lang-btn]").forEach((b) => b.classList.toggle("active", b.dataset.langBtn === l));

    renderDynamic();
    observeReveals();
    /* 切换语言时内容直接可见：重建的卡片不再重播入场动画，避免瞬时空白 */
    if (!first) $$(".reveal").forEach((n) => n.classList.add("in"));
    if (window.Assistant) window.Assistant.setLang(l);
  }

  /* ---------- 入场动效 ---------- */
  function observeReveals() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((n) => n.classList.add("in")); return; }
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); revealObserver.unobserve(e.target); }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });
    $$(".reveal").forEach((n, i) => {
      if (!n.style.transitionDelay && i < 6) n.style.transitionDelay = (i * 80) + "ms";
      revealObserver.observe(n);
    });
    // 安全兜底：极端情况（锚点跳转、脚本时序、自动化截图）下也要保证内容可见
    clearTimeout(window._swRevealFallback);
    window._swRevealFallback = setTimeout(() => {
      $$(".reveal").forEach((n) => n.classList.add("in"));
    }, 4000);
  }

  /* ---------- 导航 ---------- */
  function initNav() {
    const header = $("#site-header");
    const toggle = $("#nav-toggle");
    const nav = $("#main-nav");
    const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      nav.addEventListener("click", (e) => {
        if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
      });
    }
    if ("IntersectionObserver" in window) {
      const links = $$(".main-nav a");
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
        });
      }, { rootMargin: "-35% 0px -60% 0px" });
      ["experiences", "sourcing", "guides", "journeys", "events", "films", "how"].forEach((id) => {
        const s = document.getElementById(id); if (s) obs.observe(s);
      });
    }
  }

  /* ---------- 二维码：指向当前站点的 /book.html，部署到任意域名都有效；
     平台访问控制环境下自动附带 sharecode，保证扫码直接可开 ---------- */
  function initQR() {
    const img = $("#qr-img");
    if (!img) return;
    img.onerror = null;
    if (/^https?:$/.test(location.protocol)) {
      const cfg = window.SW_CONFIG || {};
      /* 前端托管在别的域名（如 GitHub Pages）时，二维码与预约页都指向真正在跑的后端 */
      const base = (cfg.apiBase || location.origin).replace(/\/+$/, "");
      const sc = (cfg.apiBase && cfg.sharecode) || new URLSearchParams(location.search).get("sharecode");
      const target = base + "/book.html" + (sc ? "?sharecode=" + encodeURIComponent(sc) : "");
      /* 跨域托管时向平台取动态二维码；平台访问控制需要把 sharecode 一并带上 */
      const remote = cfg.apiBase && location.origin !== base;
      const qrEndpoint = (remote ? base : "") + "/qr.png?" + (remote && cfg.sharecode ? "sharecode=" + encodeURIComponent(cfg.sharecode) + "&" : "") + "url=";
      img.onerror = () => { img.onerror = null; img.src = "assets/img/qr-fallback.png"; };
      img.src = qrEndpoint + encodeURIComponent(target);
    } else {
      img.src = "assets/img/qr-fallback.png";
    }
  }

  /* ---------- 提示条 ---------- */
  window.showToast = function (msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(el._timer);
    el._timer = setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => { el.hidden = true; }, 340);
    }, 3200);
  };

  /* ---------- 启动 ---------- */
  function init() {
    const initial = getInitialLang();
    applyLang(initial, true);
    if (window.Assistant) window.Assistant.init(initial);

    $$("[data-lang-btn]").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.langBtn)));

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open-assistant]");
      if (!btn) return;
      e.preventDefault();
      if (window.Assistant) {
        window.Assistant.open();
        const p = btn.dataset.prefill;
        if (p) setTimeout(() => window.Assistant.prefill(p), 80);
        /* 渠道来源：从影片/社媒进来的需求在后台单独标记，方便统计内容转化 */
        const src = btn.dataset.source;
        if (src && window.Assistant.setSource) window.Assistant.setSource(src);
      }
    });

    /* 外链统一从 SW_CONFIG 读取，换频道/主页只改 i18n.js 一处 */
    const cfg = window.SW_CONFIG || {};
    const sub = $("#yt-sub");
    if (sub && cfg.ytChannel) sub.href = cfg.ytChannel.replace(/\/$/, "") + "?sub_confirmation=1";
    const link = (sel, url) => { const n = $(sel); if (n && url) n.href = url; };
    link("#footer-yt", cfg.ytChannel);
    link("#footer-fb", cfg.fbPage);

    initNav();
    initQR();

    // 首次进入给助手一个轻微呼吸提示，之后不再打扰
    const launcher = $("#as-launcher");
    if (launcher && !sessionStorage.getItem("sw-pulsed")) {
      setTimeout(() => { launcher.classList.add("pulse"); sessionStorage.setItem("sw-pulsed", "1"); }, 2600);
    }
    if (new URLSearchParams(location.search).get("book") === "1" && window.Assistant) {
      setTimeout(() => window.Assistant.open(), 500);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
