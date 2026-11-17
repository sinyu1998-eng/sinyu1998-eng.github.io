/* 手机桥 v0.1 — 本地 OCR + 工单比对 + 哈希出单
   所有计算在浏览器完成，照片不上传。 */
(() => {
  const $ = (id) => document.getElementById(id);
  const drop = $('drop'), file = $('file'), run = $('run'), prog = $('prog'), plog = $('plog');
  let imgFile = null, imgURL = null, ocrText = '', worker = null, busy = false;
  let edited = 0, ocrDone = false;

  const log = (s) => { plog.textContent = s; };

  /* ---------- 采集 ---------- */
  function setImage(f) {
    imgFile = f;
    if (imgURL) URL.revokeObjectURL(imgURL);
    imgURL = URL.createObjectURL(f);
    drop.classList.add('has');
    drop.innerHTML = `<img src="${imgURL}" alt=""><div class="chip">${f.name.slice(0, 22)} · ${(f.size / 1024).toFixed(0)} KB</div>`;
    run.disabled = false;
    ocrDone = false;
    $('raw').textContent = '—';
    log('已载入图像，点击「开始识别」。');
  }

  drop.addEventListener('click', () => file.click());
  file.addEventListener('change', (e) => e.target.files[0] && setImage(e.target.files[0]));
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('hot'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('hot'); }));
  drop.addEventListener('drop', (e) => {
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) setImage(f);
  });
  // 粘贴截图
  window.addEventListener('paste', (e) => {
    const it = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'));
    if (it) setImage(it.getAsFile());
  });

  /* ---------- 识别 ---------- */
  async function ensureWorker() {
    if (worker) return worker;
    log('加载识别引擎（首次约 3–6 秒）…');
    worker = await Tesseract.createWorker('eng', 1, {
      workerPath: 'vendor/tess.worker.js',
      corePath: 'vendor/',
      langPath: 'vendor',
      logger: (m) => {
        if (m.status === 'recognizing text') {
          prog.querySelector('i').style.width = Math.round(m.progress * 100) + '%';
          log('识别中 ' + Math.round(m.progress * 100) + '%');
        }
      }
    });
    return worker;
  }

  run.addEventListener('click', async () => {
    if (!imgFile || busy) return;
    busy = true; run.disabled = true;
    prog.classList.add('on'); prog.querySelector('i').style.width = '0%';
    try {
      const w = await ensureWorker();
      const { data } = await w.recognize(imgURL);
      ocrText = (data.text || '').replace(/\n{3,}/g, '\n\n').trim();
      $('raw').textContent = ocrText || '（未识别到文字）';
      const f = parse(ocrText);
      fill(f);
      ocrDone = true; edited = 0;
      log(`识别完成 · 置信度 ${(data.confidence || 0).toFixed(0)}% · 抽出 ${Object.values(f).filter(Boolean).length} 个字段`);
      document.querySelector('.steps span[data-s="2"]')?.classList.add('on');
      updateDiff();
    } catch (err) {
      log('识别失败：' + err.message + '（可手动填写右侧字段）');
    } finally {
      busy = false; run.disabled = false;
      setTimeout(() => { prog.classList.remove('on'); }, 600);
    }
  });

  function parse(t) {
    const g = (re) => { const m = t.match(re); return m ? m[1].trim().replace(/[·•.,;]$/, '') : ''; };
    const out = {
      sku: g(/(?:SKU|MODEL|ITEM\s*NO|P\/N)[\s:：#\-]*([A-Z0-9][A-Z0-9\-_\/]{2,24})/i),
      lot: g(/(?:LOT|BATCH)[\s:：#\-]*([A-Z0-9\-]{3,20})/i),
      qty: g(/(?:QTY|QUANTITY|数量)[\s:：#\-]*(\d{1,6})/i),
      date: g(/(?:MFG|DATE|生产日期)[\s:：#\-]*(\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2})/i),
      carton: g(/(?:CTN|CARTON|箱号)(?:\s*NO\.?|\s*#)?[\s:：#\-]*([A-Z0-9\-]{2,20})/i),
      po: g(/(?:P\.?O\.?\s*(?:NO\.?|#)?)[\s:：#\-]*([A-Z0-9\-]{4,24})/i)
    };
    out.date = out.date.replace(/\//g, '-').replace(/\./g, '-');
    return out;
  }

  function fill(f) {
    if (f.sku) $('fSku').value = f.sku;
    if (f.lot) $('fLot').value = f.lot;
    if (f.qty) $('fQty').value = f.qty;
    if (f.date) $('fDate').value = f.date;
    if (f.carton) $('fCarton').value = f.carton;
    if (f.po) $('fPo').value = f.po;
  }

  // 记录人工修改
  ['fSku', 'fLot', 'fQty', 'fDate', 'fCarton', 'fPo', 'fExp'].forEach(id => {
    $(id).addEventListener('input', () => {
      if (id === 'fQty' || id === 'fExp') updateDiff();
      if (ocrDone && ['fSku', 'fLot', 'fQty', 'fDate', 'fCarton', 'fPo'].includes(id)) edited++;
    });
  });

  /* ---------- 比对 ---------- */
  function num(v) { const n = parseInt(String(v).replace(/[^\d]/g, ''), 10); return isFinite(n) ? n : 0; }
  function updateDiff() {
    const qty = num($('fQty').value), exp = num($('fExp').value);
    const d = $('diff');
    if (!qty || !exp) { d.textContent = '数量比对：等待识别数量 / 填写应有数量'; return; }
    const diff = qty - exp;
    d.innerHTML = diff === 0
      ? `数量比对：<b style="color:#6FE39A">一致</b>（${qty} / ${exp}）`
      : `数量比对：<b>差 ${diff > 0 ? '+' : ''}${diff} 件</b>（实到 ${qty}，应收 ${exp}）`;
  }

  const defects = new Set();
  $('chk').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const k = b.dataset.k;
    const on = b.getAttribute('aria-pressed') === 'true';
    b.setAttribute('aria-pressed', String(!on));
    on ? defects.delete(k) : defects.add(k);
  });

  /* ---------- 出单 ---------- */
  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function reportData() {
    const d = {
      v: 'bridge/0.1',
      ts: new Date().toISOString(),
      source: imgFile ? imgFile.name : '',
      sku: $('fSku').value.trim(),
      lot: $('fLot').value.trim(),
      qty: num($('fQty').value),
      mfg: $('fDate').value.trim(),
      carton: $('fCarton').value.trim(),
      po: $('fPo').value.trim(),
      expected: num($('fExp').value),
      defects: [...defects].sort(),
      ocr_confidence: null,
      human_edits: edited
    };
    const reasons = [];
    let status = 'PASS';
    if (d.defects.includes('混装/错货') || d.defects.length >= 2) status = 'REJECT';
    else if (d.defects.length === 1) status = 'HOLD';
    if (d.expected && d.qty !== d.expected) { status = status === 'REJECT' ? 'REJECT' : 'HOLD'; reasons.push(`数量不符：实到 ${d.qty} / 应收 ${d.expected}`); }
    if (d.defects.length) reasons.push('缺陷：' + d.defects.join('、'));
    if (!d.defects.length && (!d.expected || d.qty === d.expected)) reasons.push('标签与工单一致，未见外观缺陷');
    d.status = status; d.reasons = reasons;
    return d;
  }

  $('make').addEventListener('click', async () => {
    const d = reportData();
    if (!d.sku && !d.qty) { log('还没有识别结果，先载入照片或手填字段。'); return; }
    const canon = JSON.stringify(d, Object.keys(d).sort());
    const h = await sha256(canon);
    const short = h.slice(0, 16).toUpperCase();
    const day = d.ts.slice(0, 10).replace(/-/g, '');
    d.report_no = `INSP-${day}-${short.slice(0, 4)}`;
    d.hash = short;

    const v = $('verdict');
    v.className = 'verdict ' + (d.status === 'PASS' ? 'pass' : d.status === 'HOLD' ? 'hold' : 'rej');
    v.querySelector('.vd').textContent = d.status === 'PASS' ? 'PASS · 放行' : d.status === 'HOLD' ? 'HOLD · 待复核' : 'REJECT · 退回';
    v.querySelector('.why').textContent = d.reasons.join('；') + '。';

    $('repDl').innerHTML = [
      ['报告号', d.report_no],
      ['时间', d.ts.replace('T', ' ').slice(0, 19) + ' UTC'],
      ['SKU', d.sku || '—'],
      ['批次', d.lot || '—'],
      ['数量', `${d.qty} / 应收 ${d.expected || '—'}`],
      ['生产日期', d.mfg || '—'],
      ['箱号', d.carton || '—'],
      ['工单', d.po || '—'],
      ['缺陷', d.defects.length ? d.defects.join('、') : '无'],
      ['人工修正', d.human_edits ? d.human_edits + ' 处' : '0'],
      ['指纹', `<span class="hash">${short}</span>`]
    ].map(([k, val]) => `<dt>${k}</dt><dd>${val}</dd>`).join('');
    $('rep').classList.add('on');
    [3,4].forEach(n=>document.querySelector(`.steps span[data-s="${n}"]`)?.classList.add('on'));
    window.__report = d;
  });

  $('print').addEventListener('click', () => { if (!window.__report) return log('先生成报告。'); window.print(); });

  $('json').addEventListener('click', () => {
    if (!window.__report) return log('先生成报告。');
    const blob = new Blob([JSON.stringify(window.__report, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (window.__report.report_no || 'inspection') + '.json';
    a.click();
  });

  /* ---------- 示例 ---------- */
  $('demo').addEventListener('click', async () => {
    const r = await fetch('demo-label.png');
    const b = await r.blob();
    setImage(new File([b], 'demo-label.png', { type: 'image/png' }));
  });

  $('reset').addEventListener('click', () => {
    imgFile = null; ocrText = ''; edited = 0; ocrDone = false;
    ['fSku', 'fLot', 'fQty', 'fDate', 'fCarton'].forEach(id => $(id).value = '');
    $('fPo').value = 'PO-2026-1108'; $('fExp').value = '120';
    drop.classList.remove('has');
    drop.innerHTML = '<div class="ico">▣</div><p>把眼镜拍的标签照片拖进来<br>或点击选择</p><small>JPG / PNG · 建议正对标签、光线均匀</small>';
    $('raw').textContent = '—'; $('rep').classList.remove('on');
    $('verdict').className = 'verdict';
    $('verdict').querySelector('.vd').textContent = '待判定';
    $('verdict').querySelector('.why').textContent = '识别完成并确认数量后生成结论。';
    document.querySelectorAll('.steps span').forEach((s, i) => s.classList.toggle('on', i === 0));
    defects.clear();
    document.querySelectorAll('#chk button').forEach(b => b.setAttribute('aria-pressed', 'false'));
    log('已清空。');
    run.disabled = true;
  });
})();
