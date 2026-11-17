/* SINOWAYS · 行程后台逻辑
   需求看板 → 详情/状态 → 资源库 → 标签匹配 → 逐日行程草案 → 回写需求。 */
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const STATUS = { new: "新需求", contacted: "已联系", planned: "已排期", confirmed: "已成行", closed: "已关闭" };
  const SOURCE = { assistant: "官网助手", qr: "扫码预约", youtube: "YouTube", facebook: "Facebook" };
  const REGION = { beijing: "北京", jiangnan: "江南", guangdong: "广东", zhejiang: "浙江/义乌", jingdezhen: "景德镇", sichuan: "四川", silkroad: "丝路", unsure: "待定" };
  const GROUP = { guides: "导游 / 接待", experiences: "文化体验", suppliers: "供应商 / 市场", logistics: "后勤保障", partners: "合作方" };
  const LANG = { en: "EN", zh: "中文", pt: "PT", ar: "عربي" };

  let leads = [], resources = [], view = "leads", drawerLead = null, builderLead = null;
  let matched = [], plan = [], assignedGuides = [], support = [], resGroup = "guides", knownIds = new Set();

  /* ---------- 基础 ---------- */
  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg; t.hidden = false;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.classList.remove("show"); setTimeout(() => { t.hidden = true; }, 300); }, 3000);
  }
  async function api(path, opts) {
    const url = window.SW_API ? window.SW_API(path) : path;
    const r = await fetch(url, Object.assign({ headers: { "Content-Type": "application/json" } }, opts));
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }
  function pending() { try { return JSON.parse(localStorage.getItem("sw-pending-leads") || "[]"); } catch (e) { return []; } }
  function setPending(list) { localStorage.setItem("sw-pending-leads", JSON.stringify(list)); }
  function allLeads() {
    const off = pending().filter((p) => !leads.some((l) => l.id === p.id)).map((p) => Object.assign({ offline: true }, p));
    return leads.concat(off);
  }
  function fmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return String(iso).slice(0, 16);
    return d.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  }

  /* ---------- 需求看板 ---------- */
  async function loadLeads(silent) {
    try {
      const data = await api("/api/leads");
      const fresh = data.filter((l) => knownIds.size && !knownIds.has(l.id));
      leads = data;
      knownIds = new Set(data.map((l) => l.id));
      setApiStatus(true);
      if (fresh.length && silent) toast("收到 " + fresh.length + " 条新需求：" + fresh[0].name);
    } catch (e) {
      setApiStatus(false);
      if (!silent) toast("后端未连接，显示本地缓存数据");
    }
    renderLeads();
    renderBuilderLeads();
    renderSync();
  }
  function setApiStatus(ok) {
    const dot = $("#api-dot"), txt = $("#api-text");
    if (!dot) return;
    dot.className = ok ? "ok" : "bad";
    txt.textContent = ok ? "API 已连接 · 实时同步" : "API 未连接 · 本地模式";
  }
  function renderSync() {
    const n = pending().length, b = $("#btn-sync");
    if (!b) return;
    b.hidden = n === 0;
    b.textContent = "同步 " + n + " 条离线需求";
  }
  async function syncPending() {
    const list = pending(), left = [];
    for (const p of list) {
      const payload = Object.assign({}, p);
      delete payload.id; delete payload.created_at; delete payload.status; delete payload.offline;
      try { await api("/api/leads", { method: "POST", body: JSON.stringify(payload) }); }
      catch (e) { left.push(p); }
    }
    setPending(left);
    await loadLeads();
    toast(left.length ? "已同步，仍有 " + left.length + " 条待重试" : "离线需求已全部同步到后台");
  }

  function filtered() {
    const st = $("#f-status").value, pu = $("#f-purpose").value, q = $("#f-search").value.trim().toLowerCase();
    return allLeads().filter((l) => {
      if (st && l.status !== st) return false;
      if (pu && !(l.purpose || []).includes(pu)) return false;
      if (q) {
        const hay = [l.id, l.name, l.nationality, l.interests, l.contact, (l.regions || []).join(" ")].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }
  function renderLeads() {
    const all = allLeads();
    $("#kpi-total").textContent = all.length;
    $("#kpi-new").textContent = all.filter((l) => l.status === "new").length;
    $("#kpi-progress").textContent = all.filter((l) => ["contacted", "planned"].includes(l.status)).length;
    $("#kpi-pax").textContent = all.reduce((s, l) => s + (parseInt(l.pax, 10) || 0), 0);
    $("#badge-new").textContent = all.filter((l) => l.status === "new").length || "";

    const list = filtered();
    const box = $("#lead-list");
    if (!list.length) { box.innerHTML = '<p class="empty">没有符合条件的需求。</p>'; return; }
    box.innerHTML = list.map((l) => {
      const purposes = (l.purpose || []).map((p) => `<span class="pill ${esc(p)}">${p === "culture" ? "文化" : "找货"}</span>`).join("");
      const regions = (l.regions || []).map((r) => esc(REGION[r] || r)).join(" · ") || "—";
      return `<div class="lead-row ${l.status === "new" ? "new" : ""}" data-id="${esc(l.id)}">
        <span><span class="lead-id">${esc(l.id)}</span><span class="lead-time">${esc(fmtDate(l.created_at))}${l.offline ? ' · <span class="offline-tag">待同步</span>' : ""}</span></span>
        <span><span class="lead-name">${esc(l.name || "未留名")}</span><span class="lead-sub">${esc(l.nationality || "—")} · ${esc(LANG[l.lang] || l.lang || "—")}</span></span>
        <span><span class="purpose-tags">${purposes}<span class="pill src">${esc(SOURCE[l.source] || l.source || "—")}</span></span><span class="lead-sub">${esc((l.dates || "").slice(0, 30))}</span></span>
        <span class="region-text">${regions}</span>
        <span class="pax">${esc(l.pax || 1)}</span>
        <span class="status ${esc(l.status || "new")}"><i></i>${esc(STATUS[l.status] || l.status)}</span>
        <span class="row-actions"><button type="button" data-act="view">查看</button><button type="button" data-act="match">编排</button></span>
      </div>`;
    }).join("");
  }

  /* ---------- 详情抽屉 ---------- */
  function openDrawer(id) {
    const l = allLeads().find((x) => x.id === id);
    if (!l) return;
    drawerLead = l;
    $("#d-id").textContent = l.id;
    $("#d-status").value = l.status || "new";
    $("#d-assignee").value = l.assignee || "";
    $("#d-notes").value = l.notes || "";
    const rows = [
      ["提交时间", fmtDate(l.created_at)], ["语言", LANG[l.lang] || l.lang], ["来源", SOURCE[l.source] || l.source || "—"],
      ["目的", (l.purpose || []).map((p) => p === "culture" ? "文化" : "找货").join(" + ")],
      ["区域", (l.regions || []).map((r) => REGION[r] || r).join(" · ")],
      ["时间 / 天数", l.dates], ["人数 / 国籍", (l.pax || 1) + " 人 · " + (l.nationality || "—")],
      ["档次", l.budget], ["联系人", l.name], ["联系方式", l.contact]
    ];
    let html = '<div class="d-section"><h3>需求信息</h3><dl class="d-grid">' + rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v || "—")}</dd>`).join("") + "</dl></div>";
    html += '<div class="d-section"><h3>客户原话 / 心愿清单</h3><div class="d-quote">' + esc(l.interests || "（未填写）") + "</div></div>";
    if (l.itinerary && l.itinerary.length) {
      html += '<div class="d-section"><h3>已保存的行程草案</h3><div class="d-plan">' + l.itinerary.map((d) => `<div><b>DAY ${esc(d.day)}</b>${esc(d.theme)} — ${esc((d.items || []).map((x) => x.name).join(" / "))}</div>`).join("") + "</div></div>";
    }
    $("#d-body").innerHTML = html;
    $("#drawer").hidden = false; $("#drawer-backdrop").hidden = false;
  }
  function closeDrawer() { $("#drawer").hidden = true; $("#drawer-backdrop").hidden = true; drawerLead = null; }
  async function saveDrawer() {
    if (!drawerLead) return;
    if (drawerLead.offline) { toast("这条是离线需求，请先点击「同步离线需求」"); return; }
    try {
      await api("/api/leads/" + encodeURIComponent(drawerLead.id), {
        method: "PATCH", body: JSON.stringify({
          status: $("#d-status").value, assignee: $("#d-assignee").value, notes: $("#d-notes").value
        })
      });
      await loadLeads();
      toast("已保存更新");
      closeDrawer();
    } catch (e) { toast("保存失败：" + e.message); }
  }

  /* ---------- 资源库 ---------- */
  async function loadResources() {
    try { resources = await api("/api/resources"); }
    catch (e) { resources = []; toast("资源库读取失败"); }
    renderResources();
  }
  function renderResources() {
    $("#res-count").textContent = resources.length + " 条资源";
    $("#res-tabs").innerHTML = Object.keys(GROUP).map((g) => {
      const n = resources.filter((r) => r.group === g).length;
      return `<button type="button" data-group="${g}" class="${resGroup === g ? "active" : ""}">${GROUP[g]} · ${n}</button>`;
    }).join("");
    const list = resources.filter((r) => r.group === resGroup);
    $("#res-grid").innerHTML = list.length ? list.map((r) => `<div class="res-card">
      <button type="button" class="res-del" data-del="${esc(r.id)}" title="删除">×</button>
      <h3>${esc(r.name)}</h3><p>${esc(r.detail)}</p>
      <p class="res-meta">${esc(r.meta || "")}</p>
      <div class="res-tags">${(r.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>`).join("")
      : '<p class="empty">这一组还没有资源，可在下方新增。</p>';
  }
  async function addResource(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    const payload = {
      group: f.get("group"), name: (f.get("name") || "").trim(), detail: f.get("detail"),
      meta: f.get("meta"), tags: (f.get("tags") || "").split(/[,，]/).map((x) => x.trim()).filter(Boolean)
    };
    if (!payload.name) return;
    try {
      await api("/api/resources", { method: "POST", body: JSON.stringify(payload) });
      e.target.reset(); resGroup = payload.group;
      await loadResources(); toast("已加入资源库");
    } catch (err) { toast("新增失败：" + err.message); }
  }
  async function deleteResource(id) {
    try { await api("/api/resources/" + encodeURIComponent(id), { method: "DELETE" }); await loadResources(); toast("已删除"); }
    catch (e) { toast("删除失败：" + e.message); }
  }

  /* ---------- 行程编排 ---------- */
  function renderBuilderLeads() {
    const sel = $("#b-lead");
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">— 请选择一条需求 —</option>' + allLeads().map((l) =>
      `<option value="${esc(l.id)}">${esc(l.id)} · ${esc(l.name || "未留名")} · ${(l.purpose || []).map((p) => p === "culture" ? "文化" : "找货").join("+")}</option>`).join("");
    // 默认落在最新一条需求上，进来即可直接匹配
    const all = allLeads();
    if (cur && all.some((l) => l.id === cur)) sel.value = cur;
    else if (all.length) sel.value = all[0].id;
    renderBuilderSummary();
  }
  function selectBuilder(id) {
    switchView("builder");
    $("#b-lead").value = id;
    builderLead = allLeads().find((l) => l.id === id) || null;
    renderBuilderSummary();
  }
  function renderBuilderSummary() {
    const l = builderLead || allLeads().find((x) => x.id === $("#b-lead").value);
    builderLead = l || null;
    if (!l) { $("#b-summary").innerHTML = ""; return; }
    const m = (l.dates || "").match(/(\d{1,2})\s*(day|天|dias|يوم)/i) || (l.dates || "").match(/\b(\d{1,2})\b/);
    if (m) $("#b-days").value = Math.min(21, Math.max(3, parseInt(m[1], 10)));
    $("#b-summary").innerHTML = `<b>${esc(l.name || "未留名")}</b> · ${esc(l.nationality || "—")} · ${esc(l.pax || 1)} 人 · ${esc(l.dates || "时间待定")}<br>目的：${(l.purpose || []).map((p) => p === "culture" ? "文化" : "找货").join(" + ")} ｜ 区域：${(l.regions || []).map((r) => REGION[r] || r).join(" · ") || "待定"} ｜ 心愿：${esc(l.interests || "—")}`;
  }
  async function runMatch() {
    const l = builderLead;
    if (!l) { toast("请先选择一条需求"); return; }
    const btn = $("#b-match"); btn.disabled = true; btn.textContent = "匹配中…";
    try {
      const r = await api("/api/match", {
        method: "POST", body: JSON.stringify({
          purpose: l.purpose || [], regions: l.regions || [], interests: l.interests || "",
          days: parseInt($("#b-days").value, 10) || 7
        })
      });
      matched = r.matched || []; plan = r.plan || []; assignedGuides = r.assigned_guides || []; support = r.support || [];
      $("#b-match-count").textContent = matched.length + " 条命中";
      renderMatched(); renderPlan();
      toast("已匹配 " + matched.length + " 条资源，生成 " + plan.length + " 天草案");
    } catch (e) { toast("匹配失败：" + e.message); }
    finally { btn.disabled = false; btn.textContent = "✳ 匹配现有资源并生成草案"; }
  }
  function renderMatched() {
    if (!matched.length) { $("#b-matched").innerHTML = '<p class="empty">没有命中资源，可先在资源库补充对应标签。</p>'; return; }
    const groups = {};
    matched.forEach((m) => (groups[m.group] = groups[m.group] || []).push(m));
    const lead = assignedGuides.length
      ? '<p class="match-group">建议指派接待</p>' + assignedGuides.map((g) =>
        `<div class="match-item"><span class="match-score">HOST</span><div><b>${esc(g.name)}</b><p>${esc(g.detail || "")} · ${esc(g.meta || "")}</p></div></div>`).join("")
      : "";
    const sup = support.length
      ? '<p class="match-group">全程保障</p>' + support.map((g) =>
        `<div class="match-item"><span class="match-score">24H</span><div><b>${esc(g.name)}</b><p>${esc(g.detail || "")}</p></div></div>`).join("")
      : "";
    $("#b-matched").innerHTML = lead + sup + Object.keys(groups).map((g) =>
      `<p class="match-group">${esc(GROUP[g] || g)}</p>` + groups[g].map((m) =>
        `<div class="match-item"><span class="match-score">${esc(m.score)}</span><div><b>${esc(m.name)}</b><p>${esc(m.detail || "")} · ${esc(m.meta || "")}</p></div></div>`).join("")).join("");
  }
  function renderPlan() {
    if (!plan.length) { $("#b-plan").innerHTML = '<p class="empty">草案会显示在这里，可直接编辑。</p>'; return; }
    $("#b-plan").innerHTML = plan.map((d, i) => `<div class="plan-day">
      <span class="plan-day-n">DAY ${esc(d.day)}</span>
      <div><input type="text" data-day="${i}" value="${esc(d.theme || "")}" aria-label="第 ${esc(d.day)} 天主题">
      <div class="items">${(d.items || []).map((x) => esc(x.name)).join(" · ") || "自由安排 / 机动"}</div></div></div>`).join("");
  }
  function collectPlan() {
    $$("#b-plan input[data-day]").forEach((inp) => { const i = +inp.dataset.day; if (plan[i]) plan[i].theme = inp.value; });
    return plan;
  }
  async function savePlan() {
    if (!builderLead) { toast("请先选择需求"); return; }
    if (builderLead.offline) { toast("离线需求请先同步"); return; }
    collectPlan();
    try {
      await api("/api/leads/" + encodeURIComponent(builderLead.id), {
        method: "PATCH", body: JSON.stringify({ itinerary: plan, status: builderLead.status === "new" ? "planned" : builderLead.status })
      });
      await loadLeads(); toast("草案已保存到该需求，并更新为「已排期」");
    } catch (e) { toast("保存失败：" + e.message); }
  }
  function exportPlan() {
    if (!plan.length) { toast("请先生成草案"); return; }
    collectPlan();
    const l = builderLead || {};
    const lines = ["SINOWAYS 深行中国 · 行程草案", "需求编号：" + (l.id || "—"), "客户：" + (l.name || "—") + " / " + (l.nationality || "—"),
      "人数：" + (l.pax || 1) + " · 时间：" + (l.dates || "待定"), "", "── 逐日安排 ──"];
    plan.forEach((d) => lines.push("DAY " + d.day + "｜" + (d.theme || "") + "\n      " + (d.items || []).map((x) => x.name).join(" · ")));
    lines.push("", "── 建议指派接待 ──");
    (assignedGuides.length ? assignedGuides : [{ name: "待指派" }]).forEach((g) => lines.push("· " + (g.name || "") + (g.meta ? " · " + g.meta : "")));
    lines.push("", "── 全程保障 ──");
    (support.length ? support : [{ name: "待补充" }]).forEach((g) => lines.push("· " + (g.name || "")));
    lines.push("", "── 匹配资源 ──");
    matched.forEach((m) => lines.push("[" + (GROUP[m.group] || m.group) + "] " + m.name + " · " + (m.meta || "")));
    lines.push("", "说明：本草案由 SINOWAYS 行程后台按客户需求与现有资源库自动匹配生成，需策划人工复核后发送客户。");
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "SINOWAYS-itinerary-" + (l.id || "draft") + ".txt";
    a.click(); URL.revokeObjectURL(a.href);
    toast("草案已导出");
  }

  /* ---------- 视图与事件 ---------- */
  const TITLES = { leads: ["需求看板", "客户需要与排期"], resources: ["现有资源库", "导游 · 体验 · 供应商 · 合作方"], builder: ["行程编排", "把需求匹配成逐日方案"] };
  function switchView(v) {
    view = v;
    $$(".side-nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
    $$(".view").forEach((s) => { s.hidden = s.id !== "view-" + v; });
    $("#view-title").textContent = TITLES[v][0];
    $("#view-h1").textContent = TITLES[v][1];
    if (v === "resources") loadResources();
    if (v === "builder") { renderBuilderLeads(); renderBuilderSummary(); }
  }

  function init() {
    $$(".side-nav button").forEach((b) => b.addEventListener("click", () => switchView(b.dataset.view)));
    $("#btn-refresh").addEventListener("click", () => { loadLeads(); if (view === "resources") loadResources(); toast("已刷新"); });
    $("#btn-sync").addEventListener("click", syncPending);
    ["#f-status", "#f-purpose", "#f-search"].forEach((s) => $(s).addEventListener("input", renderLeads));
    $("#lead-list").addEventListener("click", (e) => {
      const row = e.target.closest(".lead-row"); if (!row) return;
      const act = e.target.closest("button") ? e.target.closest("button").dataset.act : "view";
      if (act === "match") selectBuilder(row.dataset.id);
      else openDrawer(row.dataset.id);
    });
    $("#d-close").addEventListener("click", closeDrawer);
    $("#drawer-backdrop").addEventListener("click", closeDrawer);
    $("#d-save").addEventListener("click", saveDrawer);
    $("#d-match").addEventListener("click", () => { if (drawerLead) { const id = drawerLead.id; closeDrawer(); selectBuilder(id); } });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
    $("#res-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-group]"); if (b) { resGroup = b.dataset.group; renderResources(); } });
    $("#res-grid").addEventListener("click", (e) => { const b = e.target.closest("[data-del]"); if (b && confirm("确认删除这条资源？")) deleteResource(b.dataset.del); });
    $("#res-form").addEventListener("submit", addResource);
    $("#b-lead").addEventListener("change", renderBuilderSummary);
    $("#b-match").addEventListener("click", runMatch);
    $("#b-save").addEventListener("click", savePlan);
    $("#b-export").addEventListener("click", exportPlan);

    const tick = () => { $("#clock").textContent = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false }) + " CST"; };
    tick(); setInterval(tick, 1000);
    setInterval(() => { if (view === "leads") loadLeads(true); }, 12000);
    switchView("leads");
    loadLeads();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
