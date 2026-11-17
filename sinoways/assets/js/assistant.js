/* SINOWAYS · 线上预约小助手
   8 步引导式问答 → 生成需求卡 → POST /api/leads 推到行程后台。
   API 不可用时降级存 localStorage，后台页面仍可读取并重试同步。 */
(function () {
  "use strict";

  const STEPS = [
    { key: "as.q1", type: "single", opts: ["culture", "sourcing", "both"], prefix: "opt.purpose." },
    { key: "as.q2", type: "multi", opts: window.REGION_KEYS, prefix: "lbl.region." },
    { key: "as.q3", type: "text", ph: "as.ph.date", quick: ["as.quick.spring", "as.quick.summer", "as.quick.autumn", "as.quick.flex"] },
    { key: "as.q4", type: "two", fields: [{ ph: "as.ph.pax", key: "pax", type: "number" }, { ph: "as.ph.country", key: "nationality" }] },
    { key: "as.q5", type: "text", ph: "as.ph.interest", skip: true },
    { key: "as.q6", type: "single", opts: ["essential", "signature", "private"], prefix: "opt.budget." },
    { key: "as.q7", type: "two", fields: [{ ph: "as.ph.name", key: "name" }, { ph: "as.ph.contact", key: "contact" }] },
    { key: "as.q8", type: "summary" }
  ];

  let lang = "en";
  let step = 0;
  let data = {};
  let transcript = [];   // { q, answer } 用于切换语言时重放
  let multiSel = [];
  let seq = 0;
  let opened = false;
  let el = {};
  let source = "";   // 渠道来源：assistant / qr / youtube / facebook，随需求推到后台

  const t = (k) => window.t(lang, k);
  const $ = (id) => document.getElementById(id);

  function cache() {
    el = {
      panel: $("as-panel"), launcher: $("as-launcher"), messages: $("as-messages"),
      actions: $("as-actions"), form: $("as-input"), progressFill: $("as-progress-fill"),
      progressText: $("as-progress-text"), close: $("as-close"), restart: $("as-restart")
    };
  }

  function addMsg(text, who) {
    if (!el.messages) return;
    const d = document.createElement("div");
    d.className = "as-msg " + who;
    d.textContent = text;
    el.messages.appendChild(d);
    el.messages.scrollTop = el.messages.scrollHeight;
    return d;
  }

  function botSay(text, instant) {
    if (instant) { addMsg(text, "bot"); return; }
    const my = ++seq;
    const holder = addMsg(t("as.typing") + "  ", "bot typing");
    setTimeout(() => {
      if (my !== seq || !holder) return;
      holder.className = "as-msg bot";
      holder.textContent = text;
      el.messages.scrollTop = el.messages.scrollHeight;
    }, 340);
  }

  function setProgress() {
    if (!el.progressFill) return;
    el.progressFill.style.width = Math.min(100, ((step + 1) / STEPS.length) * 100) + "%";
    el.progressText.textContent = t("as.progress") + " " + (step + 1) + " " + t("as.of") + " " + STEPS.length;
  }

  function clearActions() {
    el.actions.innerHTML = "";
    el.form.hidden = true;
    el.form.classList.remove("two");
  }

  function chip(label, onClick, cls) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "as-chip " + (cls || "");
    b.textContent = label || "";
    if (onClick) b.addEventListener("click", onClick);
    el.actions.appendChild(b);
    return b;
  }

  function buildForm(fields) {
    el.form.innerHTML = "";
    fields.forEach((f) => {
      const input = document.createElement("input");
      input.type = f.type || "text";
      input.placeholder = t(f.ph);
      input.autocomplete = "off";
      input.dataset.key = f.key;
      input.setAttribute("aria-label", t(f.ph));
      el.form.appendChild(input);
    });
    const btn = document.createElement("button");
    btn.type = "submit";
    btn.textContent = "↗";
    btn.setAttribute("aria-label", t("as.send"));
    el.form.appendChild(btn);
    el.form.hidden = false;
    if (fields.length > 1) el.form.classList.add("two");
    el.form.onsubmit = (e) => {
      e.preventDefault();
      const inputs = el.form.querySelectorAll("input");
      const values = {};
      inputs.forEach((i) => { values[i.dataset.key] = i.value.trim(); });
      if (fields.length === 1 && !values[fields[0].key]) { inputs[0].focus(); return; }
      if (fields.length > 1 && (!values[fields[0].key] || !values[fields[1].key])) {
        (values[fields[0].key] ? inputs[1] : inputs[0]).focus(); return;
      }
      Object.assign(data, values);
      finish(step, fields.length === 1 ? values[fields[0].key] : values);
    };
    el.form.querySelector("input").focus();
  }

  function summaryHTML() {
    const regions = (data.regions || []).map((r) => t("lbl.region." + r)).join(", ") || "—";
    const purpose = data.purpose === "both" ? t("lbl.both") : (data.purpose === "culture" ? t("lbl.culture") : t("lbl.sourcing"));
    const rows = [
      [t("as.sum.purpose"), purpose],
      [t("as.sum.regions"), regions],
      [t("as.sum.dates"), data.dates || "—"],
      [t("as.sum.pax"), (data.pax || "—") + (data.nationality ? " · " + data.nationality : "")],
      [t("as.sum.interests"), data.interests || "—"],
      [t("as.sum.budget"), t("lbl.budget." + (data.budget || "signature"))],
      [t("as.sum.contact"), (data.name || "") + (data.contact ? " · " + data.contact : "")]
    ];
    const card = document.createElement("div");
    card.className = "as-summary";
    const h = document.createElement("h4");
    h.textContent = t("as.summary.title");
    card.appendChild(h);
    const dl = document.createElement("dl");
    rows.forEach(([k, v]) => {
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v;
      dl.append(dt, dd);
    });
    card.appendChild(dl);
    el.actions.prepend(card);
  }

  function renderStep(instant) {
    clearActions();
    setProgress();
    const s = STEPS[step];
    botSay(t(s.key), instant);

    if (s.type === "single") {
      s.opts.forEach((o) => chip(t(s.prefix + o), () => finish(step, o), "wide"));
    } else if (s.type === "multi") {
      multiSel = (data.regions || []).slice();
      const buttons = s.opts.map((o) => chip(t(s.prefix + o), null));
      buttons.forEach((b, idx) => {
        const o = s.opts[idx];
        b.onclick = () => {
          const i = multiSel.indexOf(o);
          if (i >= 0) { multiSel.splice(i, 1); b.classList.remove("selected"); }
          else { multiSel.push(o); b.classList.add("selected"); }
        };
        if (multiSel.includes(o)) b.classList.add("selected");
      });
      chip(t("as.confirm") + " →", () => finish(step, multiSel.length ? multiSel.slice() : ["unsure"]), "confirm wide");
    } else if (s.type === "text") {
      buildForm([{ ph: s.ph, key: s.key === "as.q3" ? "dates" : "interests" }]);
      if (s.quick) s.quick.forEach((q) => chip(t(q), () => { el.form.querySelector("input").value = t(q); el.form.querySelector("input").focus(); }));
      if (s.skip) chip(t("as.skip"), () => finish(step, ""), "ghost");
    } else if (s.type === "two") {
      buildForm(s.fields);
    } else if (s.type === "summary") {
      summaryHTML();
      const send = chip(t("as.submit") + "  ↗", submitBrief, "confirm wide");
      send.id = "as-submit";
      chip(t("as.restart"), () => reset(), "ghost");
    }
  }

  function answerText(i, raw) {
    const s = STEPS[i];
    if (!s) return "";
    if (s.type === "single") return t(s.prefix + raw);
    if (s.type === "multi") return raw.map((r) => t("lbl.region." + r)).join(", ");
    if (s.type === "two") return Object.values(raw).filter(Boolean).join(" · ");
    return raw || "—";
  }

  function finish(i, raw) {
    const s = STEPS[i];
    if (s.key === "as.q1") data.purpose = raw;
    if (s.key === "as.q2") data.regions = raw;
    transcript.push({ q: s.key, answer: raw });
    addMsg(answerText(i, raw), "user");
    step = i + 1;
    if (step < STEPS.length) renderStep();
    else renderStep();
  }

  function replay() {
    el.messages.innerHTML = "";
    addMsg(t("as.welcome"), "bot");
    transcript.forEach((x) => {
      addMsg(t(x.q), "bot");
      const idx = STEPS.findIndex((s) => s.key === x.q);
      addMsg(answerText(idx, x.answer), "user");
    });
    renderStep(true);
  }

  async function submitBrief() {
    const btn = $("as-submit");
    if (btn) { btn.disabled = true; btn.textContent = t("as.sending"); }
    const payload = {
      lang,
      purpose: data.purpose === "both" ? ["culture", "sourcing"] : [data.purpose || "culture"],
      regions: data.regions || [],
      dates: data.dates || "",
      pax: parseInt(data.pax, 10) || 1,
      nationality: data.nationality || "",
      interests: data.interests || "",
      budget: data.budget || "signature",
      name: data.name || "",
      contact: data.contact || "",
      source: source || (document.body.classList.contains("book-page") ? "qr" : "assistant")
    };
    let ok = false, ref = "";
    try {
      const apiUrl = window.SW_API ? window.SW_API("api/leads") : "api/leads";
      const r = await fetch(apiUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error("api");
      const j = await r.json();
      ok = true; ref = j.lead.id;
    } catch (e) {
      const pending = JSON.parse(localStorage.getItem("sw-pending-leads") || "[]");
      ref = "LOCAL-" + Date.now().toString().slice(-6);
      pending.push(Object.assign({ id: ref, created_at: new Date().toISOString(), status: "new", offline: true }, payload));
      localStorage.setItem("sw-pending-leads", JSON.stringify(pending));
    }
    clearActions();
    setProgress();
    const box = document.createElement("div");
    box.className = "as-msg bot as-done";
    box.style.maxWidth = "100%";
    const b = document.createElement("b"); b.textContent = t("as.done");
    const p = document.createElement("p"); p.textContent = ok ? t("as.doneText") : (t("as.offline") + " " + t("as.doneText"));
    const refEl = document.createElement("span"); refEl.className = "ref";
    refEl.textContent = t("as.ref") + " · " + ref;
    box.append(b, p, refEl);
    el.messages.appendChild(box);
    el.messages.scrollTop = el.messages.scrollHeight;
    chip(t("as.again"), () => reset(), "confirm wide");
    if (window.showToast) window.showToast(t("as.done"));
  }

  function reset() {
    seq++;
    data = {}; transcript = []; multiSel = []; step = 0;
    el.messages.innerHTML = "";
    botSay(t("as.welcome"), true);
    renderStep(true);
  }

  function open() {
    if (!el.panel) return;
    el.panel.hidden = false;
    requestAnimationFrame(() => el.panel.classList.add("open"));
    if (el.launcher) el.launcher.setAttribute("aria-expanded", "true");
    if (!opened) { reset(); opened = true; }
  }
  function close() {
    if (!el.panel) return;
    el.panel.classList.remove("open");
    if (el.launcher) el.launcher.setAttribute("aria-expanded", "false");
    setTimeout(() => { if (!el.panel.classList.contains("open")) el.panel.hidden = true; }, 340);
  }
  function toggle() { el.panel.classList.contains("open") ? close() : open(); }

  function init(initialLang) {
    cache();
    if (!el.panel) return;
    lang = initialLang || "en";
    /* 支持 ?src=youtube / ?src=facebook 等外链参数（挂在视频简介或帖子里即可统计转化） */
    const qs = new URLSearchParams(location.search).get("src");
    if (qs) source = qs;
    if (el.launcher) el.launcher.addEventListener("click", toggle);
    if (el.close) el.close.addEventListener("click", close);
    if (el.restart) el.restart.addEventListener("click", reset);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    if (document.body.classList.contains("book-page")) {
      if (el.launcher) el.launcher.hidden = true;
      el.panel.hidden = false;
      el.panel.classList.add("open");
      opened = true;
      reset();
    }
  }

  function setLang(l) {
    lang = l;
    if (!el.panel) return;
    if (opened) replay();
  }

  function prefill(purpose) {
    open();
    if (data.purpose || transcript.length) return;
    data.purpose = purpose;
    transcript.push({ q: "as.q1", answer: purpose });
    el.messages.innerHTML = "";
    addMsg(t("as.welcome"), "bot");
    addMsg(t("as.q1"), "bot");
    addMsg(answerText(0, purpose), "user");
    step = 1;
    renderStep(true);
  }

  function setSource(s) { if (s) source = String(s); }

  window.Assistant = { init, setLang, open, close, prefill, reset, setSource };
})();
