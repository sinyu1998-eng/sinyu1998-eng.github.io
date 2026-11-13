/* ============================================================
   Site shell: paged navigation + full bilingual switch.
   Bilingual text lives inline in each page as data-zh / data-en,
   so CodeBuddy can edit copy right next to the markup.
   ============================================================ */
(function () {
  'use strict';

  var PAGES = [
    { id: 'index',    file: 'index.html',    zh: '首页',   en: 'Home' },
    { id: 'ventures', file: 'ventures.html', zh: '创业',   en: 'Ventures' },
    { id: 'research', file: 'research.html', zh: '科研',   en: 'Research' },
    { id: 'service',  file: 'service.html',  zh: '公益',   en: 'Service' },
    { id: 'creative', file: 'creative.html', zh: '创作',   en: 'Creative' },
    { id: 'profile',  file: 'profile.html',  zh: '档案',   en: 'Profile' }
  ];

  var TITLES = {
    zh: '黄倩如 Qianru (Carol) Huang — 创业 · 科研 · 公益',
    en: 'Qianru (Carol) Huang — Ventures · Research · Service'
  };
  var DESCS = {
    zh: '黄倩如（Qianru / Carol Huang）：正在做的出海 AI 项目、传播与计算社会科学研究，以及长期的公众表达与公益教育工作。',
    en: 'Qianru (Carol) Huang — AI products for global trade, communication & computational social science research, and long-running public-speaking and community education work.'
  };

  function lang() {
    var saved = null;
    try { saved = localStorage.getItem('qrh-lang'); } catch (e) {}
    return saved === 'en' ? 'en' : 'zh';
  }
  function setLang(v) {
    try { localStorage.setItem('qrh-lang', v); } catch (e) {}
  }

  function applyLang(v) {
    var attr = v === 'en' ? 'data-en' : 'data-zh';
    document.documentElement.lang = v === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-zh]').forEach(function (el) {
      var t = el.getAttribute(attr);
      if (t !== null) el.innerHTML = t;
    });
    var btn = document.getElementById('langBtn');
    if (btn) btn.textContent = v === 'en' ? '中文' : 'EN';
    document.title = TITLES[v];
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', DESCS[v]);
  }

  function toggleLang() {
    var next = lang() === 'en' ? 'zh' : 'en';
    setLang(next);
    applyLang(next);
  }
  window.toggleLang = toggleLang;

  function currentId() { return document.body.getAttribute('data-page') || 'index'; }

  function buildNav() {
    var slot = document.getElementById('navSlot');
    if (!slot) return;
    var cur = currentId();
    var tabs = PAGES.map(function (p, i) {
      var n = String(i + 1).padStart(2, '0');
      var badge = "<span class='n'>" + n + "</span>";
      return '<a href="' + p.file + '" class="' + (p.id === cur ? 'on' : '') + '"' +
             ' data-zh="' + badge + p.zh + '" data-en="' + badge + p.en + '">' +
             badge + p.zh + '</a>';
    }).join('');
    slot.innerHTML =
      '<div class="topbar"><div class="topbar-in">' +
        '<a class="brand" href="index.html">Huang<i>.</i>倩如</a>' +
        '<div class="tabs">' + tabs + '</div>' +
        '<button class="langbtn" id="langBtn" onclick="toggleLang()" aria-label="Switch language">EN</button>' +
      '</div></div>';
  }

  function buildPageHead() {
    var slot = document.getElementById('headSlot');
    if (!slot) return;
    var cur = currentId();
    var idx = PAGES.findIndex(function (p) { return p.id === cur; });
    var n = String(idx + 1).padStart(2, '0');
    var track = PAGES.map(function (p, i) {
      return '<i class="' + (i === idx ? 'on' : '') + '"></i>';
    }).join('');
    slot.innerHTML =
      '<div class="page"><div class="pagehead">' +
        '<div class="pageno" data-zh="PAGE <b>' + n + '</b> / 06" data-en="PAGE <b>' + n + '</b> / 06">PAGE <b>' + n + '</b> / 06</div>' +
        '<div class="pagetrack" aria-hidden="true">' + track + '</div>' +
      '</div></div>';
  }

  function buildPager() {
    var slot = document.getElementById('pagerSlot');
    if (!slot) return;
    var cur = currentId();
    var idx = PAGES.findIndex(function (p) { return p.id === cur; });
    var prev = PAGES[(idx - 1 + PAGES.length) % PAGES.length];
    var next = PAGES[(idx + 1) % PAGES.length];
    slot.innerHTML =
      '<div class="page"><div class="pager">' +
        '<a class="pg prev" href="' + prev.file + '">' +
          '<div class="pl" data-zh="← 上一页" data-en="← Previous">← 上一页</div>' +
          '<div class="pt" data-zh="' + prev.zh + '" data-en="' + prev.en + '">' + prev.zh + '</div>' +
        '</a>' +
        '<a class="pg next" href="' + next.file + '">' +
          '<div class="pl" data-zh="下一页 →" data-en="Next →">下一页 →</div>' +
          '<div class="pt" data-zh="' + next.zh + '" data-en="' + next.en + '">' + next.zh + '</div>' +
        '</a>' +
      '</div></div>';
  }

  function buildFooter() {
    var slot = document.getElementById('footSlot');
    if (!slot) return;
    slot.innerHTML =
      '<footer>' +
        '<div class="fbig" data-zh="把研究直觉，做成能用的产品；把公众表达，变成可被点亮的能力。" ' +
             'data-en="Turn research intuition into products that work — and public speaking into a skill anyone can grow.">' +
             '把研究直觉，做成能用的产品；把公众表达，变成可被点亮的能力。</div>' +
        '<p>sinyu1998@gmail.com · <a href="https://github.com/sinyu1998-eng" target="_blank" style="color:var(--accent)">github.com/sinyu1998-eng</a></p>' +
        '<div class="social">' +
          '<a href="https://space.bilibili.com/12316908" target="_blank">Bilibili ↗</a>' +
          '<a href="https://x.com/Qinrhung4" target="_blank">X / Twitter ↗</a>' +
          '<span data-zh="微信公众号：Marguerite&amp;Asbury" data-en="WeChat Official: Marguerite&amp;Asbury">微信公众号：Marguerite&amp;Asbury</span>' +
          '<span data-zh="微信：workonly1998" data-en="WeChat: workonly1998">微信：workonly1998</span>' +
          '<a href="https://search.asu.edu/profile/5227977" target="_blank" data-zh="ASU 主页 ↗" data-en="ASU profile ↗">ASU 主页 ↗</a>' +
        '</div>' +
        '<p class="copy">© 2026 Qianru (Carol) Huang · Paged edition · 中 / EN</p>' +
      '</footer>';
  }

  function init() {
    buildNav();
    buildPageHead();
    buildPager();
    buildFooter();
    applyLang(lang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
