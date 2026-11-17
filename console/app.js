/* 云帆 CloudSail · 交付控制台 —— 纯前端可交互演示 */
'use strict';

/* ---------------- i18n ---------------- */
let LANG = 'zh';
const t = o => (typeof o === 'string' ? o : o[LANG] || o.zh);
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ---------------- 指纹 ---------------- */
function fnv(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
function fp(ev) {
  const s = [ev.code, ev.ts, ev.org.zh,
    ...ev.f.map((x, j) => (ev.changed && ev.changedIdx === j) ? x[3] : x[2])].join('|');
  const a = fnv(s).toString(16).padStart(8, '0');
  const b = fnv(s.split('').reverse().join('')).toString(16).padStart(8, '0');
  return '0x' + a + '…' + b.slice(0, 4);
}
function shortHash(ev, salt) {
  return '0x' + fnv(ev.code + salt).toString(16).padStart(6, '0');
}

/* ---------------- 数据 ---------------- */
/* f: [键中, 键英, 值, 可篡改为?] */
const E = (code, zh, en, org, ts, docs, f, extra) => Object.assign({
  code, zh, en, org, ts, docs, f, open: false, changed: false, was: null
}, extra || {});

const BATCHES = [
  {
    id: 'CS-2610-0788', buyer: { zh: '欧盟 · 家居零售 B-114', en: 'EU · Home retail B-114' },
    spec: '12 SKU · 1,200 pcs', amount: '¥86,400', status: 'ok', route: { zh: '义乌 → 宁波 → 汉堡', en: 'Yiwu → Ningbo → Hamburg' },
    events: [
      E('SRC', '寻源', 'Sourcing', { zh: '义乌 · 家居长尾厂 S-0218', en: 'Yiwu · long-tail factory S-0218' }, '2026-09-18 09:12',
        [{ zh: '报价单 QT-8841', en: 'Quotation QT-8841' }, { zh: '打样确认 SP-2210', en: 'Sample approval SP-2210' }],
        [['单价', 'Unit price', '¥12.40 / pc', '¥11.90 / pc'], ['起订量', 'MOQ', '500 pcs', '500 pcs'], ['打样周期', 'Sampling', '3 d', '3 d']],
        { flaw: { i: 0, rule: 'fp', note: { zh: '单价被改低 0.5 元', en: 'Unit price lowered by ¥0.50' } } }),
      E('AUD', '验厂', 'Factory audit', { zh: '第三方 QC · 义乌分部', en: 'Third-party QC · Yiwu desk' }, '2026-09-24 14:40',
        [{ zh: '验厂报告 AU-3320', en: 'Audit report AU-3320' }, { zh: '营业执照核对件', en: 'Business licence check' }],
        [['主体一致', 'Legal entity match', '通过 / PASS', '通过 / PASS'], ['厂房面积', 'Floor area', '1,240 ㎡', '1,240 ㎡'], ['在册员工', 'Staff on payroll', '38', '38']],
        { flaw: { i: 1, rule: 'fp', note: { zh: '厂房面积被放大', en: 'Floor area inflated' } } }),
      E('QC', '质检', 'QC inspection', { zh: 'AQL 2.5 · 抽检 200 件', en: 'AQL 2.5 · 200 pcs sampled' }, '2026-10-06 11:05',
        [{ zh: '质检报告 QC-6612', en: 'QC report QC-6612' }, { zh: '缺陷照片 × 3', en: 'Defect photos × 3' }],
        [['抽检数', 'Sample size', '200 pcs', '200 pcs'], ['缺陷数', 'Defects found', '3', '0'], ['判定', 'Result', '通过 / PASS', '通过 / PASS']],
        { flaw: { i: 1, rule: 'fp', note: { zh: '缺陷数被改成 0', en: 'Defect count zeroed' } } }),
      E('FRT', '出运', 'Freight', { zh: '宁波 → 汉堡 · 40HQ', en: 'Ningbo → Hamburg · 40HQ' }, '2026-10-14 07:30',
        [{ zh: '提单 BL-NGB24100718', en: 'B/L NGB24100718' }, { zh: '报关单 3104202600001', en: 'Customs decl. 3104202600001' }],
        [['提单号', 'B/L no.', 'NGB24100718', 'NGB24100781'], ['柜型', 'Container', '40HQ', '40HQ'], ['开船', 'Sailed', '2026-10-16', '2026-10-16']],
        { flaw: { i: 0, rule: 'fp', note: { zh: '提单号差一位', en: 'B/L number off by one digit' } } }),
      E('SGN', '签收', 'Delivery signed', { zh: '汉堡 · 收货方仓库', en: 'Hamburg · consignee warehouse' }, '2026-11-09 10:22',
        [{ zh: '签收单 POD-5521', en: 'POD-5521' }, { zh: '装箱照片 × 2', en: 'Carton photos × 2' }],
        [['签收数量', 'Qty received', '1,200 pcs', '1,260 pcs'], ['签收人', 'Signed by', 'M. Weber', 'M. Weber'], ['外箱破损', 'Carton damage', '0', '0']],
        { flaw: { i: 0, rule: 'qty', note: { zh: '签收数量被多加 60 件', en: '60 units added on receipt' } } })
    ]
  },
  {
    id: 'CS-2610-0921', buyer: { zh: '东南亚 · 3C 配件 B-068', en: 'SEA · 3C accessories B-068' },
    spec: '8 SKU · 4,000 pcs', amount: '¥212,000', status: 'bad', route: { zh: '义乌 → 宁波 → 巴生港', en: 'Yiwu → Ningbo → Port Klang' },
    events: [
      E('SRC', '寻源', 'Sourcing', { zh: '义乌 · 3C 配件厂 S-0441', en: 'Yiwu · 3C accessories S-0441' }, '2026-09-02 10:00',
        [{ zh: '报价单 QT-8620', en: 'Quotation QT-8620' }],
        [['单价', 'Unit price', '¥9.80 / pc'], ['起订量', 'MOQ', '1,000 pcs'], ['账期', 'Terms', '30% 预付']]),
      E('AUD', '验厂', 'Factory audit', { zh: '云帆质检组', en: 'CloudSail QC team' }, '2026-10-21 16:10',
        [{ zh: '验厂报告 AU-3188', en: 'Audit report AU-3188' }],
        [['主体一致', 'Legal entity match', '通过 / PASS'], ['厂房面积', 'Floor area', '860 ㎡'], ['在册员工', 'Staff on payroll', '22']],
        { conflict: { zh: '验厂报告签发于出运之后', en: 'Audit issued after shipment' } }),
      E('QC', '质检', 'QC inspection', { zh: 'AQL 2.5 · 抽检 315 件', en: 'AQL 2.5 · 315 pcs sampled' }, '2026-10-11 09:40',
        [{ zh: '质检报告 QC-6402', en: 'QC report QC-6402' }],
        [['抽检数', 'Sample size', '315 pcs'], ['缺陷数', 'Defects found', '11'], ['判定', 'Result', '让步接收 / CONCESSION']]),
      E('FRT', '出运', 'Freight', { zh: '宁波 → 巴生港 · 40HQ × 2', en: 'Ningbo → Port Klang · 40HQ × 2' }, '2026-10-15 06:50',
        [{ zh: '提单 BL-NGB24092201', en: 'B/L NGB24092201' }],
        [['提单号', 'B/L no.', 'NGB24092201'], ['柜型', 'Container', '40HQ × 2'], ['开船', 'Sailed', '2026-10-17']]),
      E('SGN', '签收', 'Delivery signed', { zh: '巴生港 · 客户指定仓', en: 'Port Klang · nominated warehouse' }, '2026-11-04 15:30',
        [{ zh: '签收单 POD-5488', en: 'POD-5488' }],
        [['签收数量', 'Qty received', '4,000 pcs'], ['短装', 'Shortage', '0'], ['外箱破损', 'Carton damage', '4 箱']])
    ]
  },
  {
    id: 'CS-2611-0417', buyer: { zh: '欧盟 · 户外用品 B-233', en: 'EU · Outdoor gear B-233' },
    spec: '6 SKU · 800 pcs', amount: '¥58,900', status: 'ok', route: { zh: '义乌 → 宁波 → 鹿特丹', en: 'Yiwu → Ningbo → Rotterdam' },
    events: [
      E('SRC', '寻源', 'Sourcing', { zh: '义乌 · 户外用品厂 S-0192', en: 'Yiwu · outdoor goods S-0192' }, '2026-10-08 11:20',
        [{ zh: '报价单 QT-9012', en: 'Quotation QT-9012' }, { zh: '打样确认 SP-2288', en: 'Sample approval SP-2288' }],
        [['单价', 'Unit price', '¥16.20 / pc', '¥14.90 / pc'], ['起订量', 'MOQ', '800 pcs', '800 pcs'], ['打样周期', 'Sampling', '5 d', '5 d']],
        { flaw: { i: 0, rule: 'fp', note: { zh: '单价被改低', en: 'Unit price lowered' } } }),
      E('AUD', '验厂', 'Factory audit', { zh: '第三方 QC · 义乌分部', en: 'Third-party QC · Yiwu desk' }, '2026-10-16 13:15',
        [{ zh: '验厂报告 AU-3401', en: 'Audit report AU-3401' }],
        [['主体一致', 'Legal entity match', '通过 / PASS', '通过 / PASS'], ['厂房面积', 'Floor area', '2,100 ㎡', '2,100 ㎡'], ['在册员工', 'Staff on payroll', '64', '64']]),
      E('QC', '质检', 'QC inspection', { zh: 'AQL 2.5 · 抽检 125 件', en: 'AQL 2.5 · 125 pcs sampled' }, '2026-10-29 10:05',
        [{ zh: '质检报告 QC-6720', en: 'QC report QC-6720' }],
        [['抽检数', 'Sample size', '125 pcs', '125 pcs'], ['缺陷数', 'Defects found', '2', '0'], ['判定', 'Result', '通过 / PASS', '通过 / PASS']],
        { flaw: { i: 1, rule: 'fp', note: { zh: '缺陷数被改成 0', en: 'Defect count zeroed' } } }),
      E('FRT', '出运', 'Freight', { zh: '宁波 → 鹿特丹 · 40HQ', en: 'Ningbo → Rotterdam · 40HQ' }, '2026-11-06 08:40',
        [{ zh: '提单 BL-NGB26110430', en: 'B/L NGB26110430' }],
        [['提单号', 'B/L no.', 'NGB26110430', 'NGB26110403'], ['柜型', 'Container', '40HQ', '40HQ'], ['开船', 'Sailed', '2026-11-08', '2026-11-08']],
        { flaw: { i: 0, rule: 'fp', note: { zh: '提单号被调换', en: 'B/L number swapped' } } }),
      E('SGN', '签收', 'Delivery signed', { zh: '鹿特丹 · 预计 2026-12-02', en: 'Rotterdam · ETA 2026-12-02' }, '在途 / IN TRANSIT',
        [{ zh: '到港通知（未生成）', en: 'Arrival notice (pending)' }],
        [['预计到港', 'ETA', '2026-12-02'], ['当前状态', 'Status', '海上运输中']], { pending: true })
    ]
  },
  {
    id: 'CS-2611-0502', buyer: { zh: '俄罗斯 · 五金批发 B-091', en: 'Russia · Hardware wholesale B-091' },
    spec: '4 SKU · 2,400 pcs', amount: '¥73,500', status: 'warn', route: { zh: '义乌 → 满洲里 → 莫斯科', en: 'Yiwu → Manzhouli → Moscow' },
    events: [
      E('SRC', '寻源', 'Sourcing', { zh: '义乌 · 五金厂 S-0533', en: 'Yiwu · hardware S-0533' }, '2026-11-02 09:30',
        [{ zh: '报价单 QT-9130', en: 'Quotation QT-9130' }],
        [['单价', 'Unit price', '¥30.60 / pc', '¥27.80 / pc'], ['起订量', 'MOQ', '600 pcs'], ['结算', 'Settlement', '人民币 · 30% 预付']],
        { flaw: { i: 0, rule: 'fp', note: { zh: '单价被改低', en: 'Unit price lowered' } } }),
      E('AUD', '验厂', 'Factory audit', { zh: '云帆质检组', en: 'CloudSail QC team' }, '2026-11-09 15:20',
        [{ zh: '验厂报告 AU-3502', en: 'Audit report AU-3502' }],
        [['主体一致', 'Legal entity match', '通过 / PASS'], ['厂房面积', 'Floor area', '1,780 ㎡'], ['在册员工', 'Staff on payroll', '51']]),
      E('QC', '质检', 'QC inspection', { zh: '待排期', en: 'Not scheduled' }, '—',
        [{ zh: '质检报告（未生成）', en: 'QC report (pending)' }],
        [['抽检数', 'Sample size', '—'], ['缺陷数', 'Defects found', '—'], ['判定', 'Result', '待检 / PENDING']], { pending: true }),
      E('FRT', '出运', 'Freight', { zh: '满洲里口岸 · 待定', en: 'Manzhouli · TBD' }, '—',
        [{ zh: '提单（未生成）', en: 'B/L (pending)' }],
        [['柜型', 'Container', '—'], ['预计发运', 'ETD', '2026-11-24']], { pending: true }),
      E('SGN', '签收', 'Delivery signed', { zh: '莫斯科 · 待定', en: 'Moscow · TBD' }, '—',
        [{ zh: '签收单（未生成）', en: 'POD (pending)' }],
        [['签收数量', 'Qty received', '—']], { pending: true })
    ]
  },
  {
    id: 'CS-2610-0651', buyer: { zh: '中东 · 工程批发 B-207', en: 'Middle East · Project wholesale B-207' },
    spec: '3 SKU · 5,000 pcs', amount: '¥148,000', status: 'ok', route: { zh: '义乌 → 宁波 → 杰贝阿里', en: 'Yiwu → Ningbo → Jebel Ali' },
    events: [
      E('SRC', '寻源', 'Sourcing', { zh: '义乌 · 五金件厂 S-0104', en: 'Yiwu · metal parts S-0104' }, '2026-09-05 08:50',
        [{ zh: '报价单 QT-8590', en: 'Quotation QT-8590' }],
        [['单价', 'Unit price', '¥29.60 / pc', '¥26.40 / pc'], ['起订量', 'MOQ', '5,000 pcs'], ['公差', 'Tolerance', '±0.05 mm']],
        { flaw: { i: 0, rule: 'fp', note: { zh: '单价被改低', en: 'Unit price lowered' } } }),
      E('AUD', '验厂', 'Factory audit', { zh: '第三方 QC · 义乌分部', en: 'Third-party QC · Yiwu desk' }, '2026-09-12 11:30',
        [{ zh: '验厂报告 AU-3201', en: 'Audit report AU-3201' }],
        [['主体一致', 'Legal entity match', '通过 / PASS'], ['设备点数', 'Machines', '34'], ['在册员工', 'Staff on payroll', '96']]),
      E('QC', '质检', 'QC inspection', { zh: 'AQL 1.5 · 抽检 200 件', en: 'AQL 1.5 · 200 pcs sampled' }, '2026-09-22 14:00',
        [{ zh: '质检报告 QC-6301', en: 'QC report QC-6301' }],
        [['抽检数', 'Sample size', '200 pcs'], ['缺陷数', 'Defects found', '1'], ['判定', 'Result', '通过 / PASS']]),
      E('FRT', '出运', 'Freight', { zh: '宁波 → 杰贝阿里 · 40HQ', en: 'Ningbo → Jebel Ali · 40HQ' }, '2026-09-27 07:10',
        [{ zh: '提单 BL-NGB24091502', en: 'B/L NGB24091502' }],
        [['提单号', 'B/L no.', 'NGB24091502'], ['柜型', 'Container', '40HQ'], ['开船', 'Sailed', '2026-09-29']]),
      E('SGN', '签收', 'Delivery signed', { zh: '杰贝阿里 · 客户仓库', en: 'Jebel Ali · client warehouse' }, '2026-10-19 12:40',
        [{ zh: '签收单 POD-5310', en: 'POD-5310' }],
        [['签收数量', 'Qty received', '5,000 pcs'], ['短装', 'Shortage', '0'], ['外箱破损', 'Carton damage', '0']])
    ]
  }
];

/* ---------------- 状态 ---------------- */
const state = { view: 'anchor', batchIdx: 0, tampered: false, role: 'buyer' };
const getBatch = () => BATCHES[state.batchIdx];

/* ---------------- toast ---------------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
}

/* ================= 台1 锚 ================= */
function renderBatchList() {
  const host = $('#blist');
  host.innerHTML = BATCHES.map((b, i) => {
    const s = b.status === 'ok' ? 'ok' : b.status === 'bad' ? 'bad' : 'warn';
    const lab = b.status === 'ok' ? (LANG === 'zh' ? '已核验' : 'Verified')
      : b.status === 'bad' ? (LANG === 'zh' ? '有异常' : 'Exception')
        : (LANG === 'zh' ? '进行中' : 'In progress');
    return `<button class="bitem ${i === state.batchIdx ? 'on' : ''}" data-i="${i}">
      <div class="r1">${b.id}<span class="sdot ${s}"></span></div>
      <div class="r2">${t(b.buyer)}</div>
      <div class="r3"><span>${b.spec}</span><span>${lab}</span></div>
    </button>`;
  }).join('');
  $('#bcnt').textContent = BATCHES.length;
  const ok = BATCHES.filter(b => b.status === 'ok').length;
  const bad = BATCHES.filter(b => b.status === 'bad').length;
  const warn = BATCHES.length - ok - bad;
  let sum = document.getElementById('blsum');
  if (!sum) { sum = document.createElement('div'); sum.id = 'blsum'; sum.className = 'blsum'; $('#blist').after(sum); }
  sum.innerHTML = `<div><b>${BATCHES.length}</b>${LANG === 'zh' ? '在库' : 'in store'}</div>
    <div><b>${ok}</b>${LANG === 'zh' ? '已核验' : 'verified'}</div>
    <div class="w"><b>${warn}</b>${LANG === 'zh' ? '进行中' : 'ongoing'}</div>
    <div class="e"><b>${bad}</b>${LANG === 'zh' ? '异常' : 'exception'}</div>`;
}

function renderTL() {
  const b = getBatch();
  $('#bid').textContent = b.id;
  const doneN = b.events.filter(e => !e.pending).length;
  const head = `<div class="bhead">
    <div class="bh-l">
      <div class="bh-id">${b.id}</div>
      <div class="bh-sub">${t(b.buyer)}<i>·</i>${t(b.route)}</div>
    </div>
    <div class="bh-r">
      <div class="bh-k"><b>${doneN}</b> / ${b.events.length} ${LANG === 'zh' ? '节点' : 'nodes'}</div>
      <div class="bh-bar"><i style="width:${doneN / b.events.length * 100}%"></i></div>
      <div class="bh-v">${b.amount}</div>
    </div>
  </div>`;
  $('#tl').innerHTML = head + b.events.map((ev, i) => {
    const cls = ev.changed ? 'bad' : ev.pending ? 'pending' : ev.conflict ? 'bad' : 'done';
    const hashNow = fp(ev);
    const hashIssued = ev.changed ? ev.hashIssued : hashNow;
    const fields = ev.f.map(([kz, ke, v, tv], j) => {
      const isChg = ev.changed && ev.changedIdx === j;
      return `<div class="fld ${isChg ? 'changed' : ''}">
        <div class="k">${LANG === 'zh' ? kz : ke}</div>
        <div class="v">${isChg ? tv : v}${isChg ? `<span class="was">${LANG === 'zh' ? '原始' : 'was'}: ${v}</span>` : ''}</div>
      </div>`;
    }).join('');
    const docs = ev.docs.map(d => `<span class="docchip">${t(d)}</span>`).join('');
    return `<div class="ev ${cls} ${ev.open ? 'open' : ''}" data-ev="${i}">
      <div class="evdot"><i></i></div>
      <div class="evhead">
        <span class="st">${String(i + 1).padStart(2, '0')}</span>
        <div class="emain">
          <div class="eline">
            <span class="t">${t({ zh: ev.zh, en: ev.en })}<span>${ev.code}</span></span>
            <span class="ehash ${ev.changed ? 'chg' : ''}">${hashNow.slice(0, 12)}</span>
          </div>
          <div class="esub">${t(ev.org)}<i>·</i>${ev.docs.length} ${LANG === 'zh' ? '份单据' : 'docs'}<i>·</i>${ev.ts}</div>
        </div>
        <span class="chev">▶</span>
      </div>
      <div class="evbody">
        <div class="evgrid">${fields}</div>
        <div>${docs}</div>
        <div class="hashrow">
          <span class="lab">${LANG === 'zh' ? '签发指纹' : 'Issued'}</span><span class="h">${hashIssued}</span>
          ${ev.changed
        ? `<span class="lab">${LANG === 'zh' ? '当前指纹' : 'Current'}</span><span class="h chg">${hashNow}</span>
               <span class="hbadge">${LANG === 'zh' ? '✕ 已被改动' : '✕ altered'}</span>`
        : `<span class="hok">${LANG === 'zh' ? '✓ 与签发一致' : '✓ matches issued'}</span>`}
          <span class="hstamp">${ev.ts}</span>
        </div>
      </div>
    </div>`;
  }).join('') + `<div class="tlhint">${LANG === 'zh' ? '↑ 点任意一行展开原始单据与指纹' : '↑ Click any row to open its document and fingerprint'}</div>`;
}

function computeChecks(b) {
  const failed = [];
  // 1 主体一致
  const entityBad = b.events.some(e => e.changed && e.changedField && /主体/.test(e.changedField));
  failed.push({ zh: '主体与营业执照一致', en: 'Legal entity matches licence', ok: !entityBad, why: { zh: '工厂档案与签发主体一致', en: 'Consistent with factory file' } });

  // 2 时间连续
  const dates = b.events.filter(e => !e.pending).map(e => ({ e, d: (e.ts.match(/\d{4}-\d{2}-\d{2}/) || [''])[0] })).filter(x => x.d);
  let timeBad = false;
  for (let i = 1; i < dates.length; i++) if (dates[i].d < dates[i - 1].d) timeBad = true;
  const conflict = b.events.find(e => e.conflict);
  if (conflict) timeBad = true;
  const timeWhy = conflict ? t(conflict.conflict)
    : timeBad ? (LANG === 'zh' ? '节点时间与前后顺序冲突' : 'Timeline out of order')
      : (LANG === 'zh' ? '五个节点时间严格递增' : 'Five timestamps strictly ordered');
  failed.push({ zh: '时间顺序可追溯', en: 'Timeline is traceable', ok: !timeBad, why: { zh: timeWhy, en: timeWhy } });

  // 3 指纹一致
  const fpBad = b.events.some(e => e.changed);
  failed.push({ zh: '字段与签发指纹一致', en: 'Fields match issued fingerprint', ok: !fpBad, why: fpBad ? { zh: '有节点指纹已变化', en: 'Fingerprint changed' } : { zh: '全部节点未被改动', en: 'No node altered' } });

  // 4 数量相符（条件）
  const qtyBad = b.events.some(e => e.changed && e.changedRule === 'qty');
  if (qtyBad) failed.push({ zh: '签收数量与提单相符', en: 'Received qty matches B/L', ok: false, why: { zh: '签收数与提单不一致', en: 'Mismatch with B/L' } });

  return failed;
}

function renderConcl() {
  const b = getBatch();
  const checks = computeChecks(b);
  const bad = checks.some(c => !c.ok);
  const fpBreak = b.events.some(e => e.changed);
  const role = state.role;

  let roleBlock = '';
  if (role === 'factory') {
    const todo = b.events.filter(e => e.pending);
    roleBlock = `<div class="sec">${LANG === 'zh' ? '你需要提供' : 'You must provide'}</div>
      <div class="checks">${todo.length ? todo.map(e => `<div class="chk"><span class="ic" style="background:rgba(240,179,60,.16);color:var(--amber)">·</span>${t({ zh: e.zh, en: e.en })}<span class="why">${t(e.docs[0])}</span></div>`).join('')
      : `<div class="chk"><span class="ic">✓</span>${LANG === 'zh' ? '本批凭证已齐，无待办' : 'All documents in, nothing pending'}</div>`}</div>
      <div class="sec">${LANG === 'zh' ? '下一次交付' : 'Next delivery'}</div>
      <div class="kv"><span>${LANG === 'zh' ? '预计排产' : 'Planned'}</span><b>2026-11-24</b></div>
      <div class="kv"><span>${LANG === 'zh' ? '需提前' : 'Lead time'}</span><b>7 d</b></div>
      <div class="sec" style="margin-top:4px">${LANG === 'zh' ? '你的记录' : 'Your record'}</div>
      <div class="kv"><span>${LANG === 'zh' ? '近 6 批一次通过' : 'First-pass, last 6'}</span><b>5 / 6</b></div>
      <div class="kv"><span>${LANG === 'zh' ? '平均补单次数' : 'Avg. resubmits'}</span><b>1.2</b></div>
      <div class="kv"><span>${LANG === 'zh' ? '连续合格批数' : 'Clean streak'}</span><b>4</b></div>`;
  } else if (role === 'ops') {
    const changed = b.events.filter(e => e.changed);
    roleBlock = `<div class="sec">${LANG === 'zh' ? '内部审计' : 'Internal audit'}</div>
      <div class="kv"><span>${LANG === 'zh' ? '节点数' : 'Nodes'}</span><b>${b.events.length} / 5</b></div>
      <div class="kv"><span>${LANG === 'zh' ? '指纹异常' : 'Fingerprint breaks'}</span><b style="color:${changed.length ? 'var(--red)' : 'var(--green)'}">${changed.length}</b></div>
      <div class="kv"><span>${LANG === 'zh' ? '最后写入' : 'Last write'}</span><b>${changed.length ? '未授权修改' : '正常'}</b></div>
      <div class="kv"><span>${LANG === 'zh' ? '写入方' : 'Writer'}</span><b>${changed.length ? 'ops@cs · 手工' : 'system'}</b></div>
      ${changed.length ? `<div class="kv"><span>${LANG === 'zh' ? '告警' : 'Alert'}</span><b style="color:var(--red)">${t(changed[0].flaw.note)}</b></div>` : ''}`;
  } else {
    roleBlock = `<div class="sec">${LANG === 'zh' ? '批次信息' : 'Batch'}</div>
      <div class="kv"><span>${LANG === 'zh' ? '路线' : 'Route'}</span><b>${t(b.route)}</b></div>
      <div class="kv"><span>${LANG === 'zh' ? '规格' : 'Spec'}</span><b>${b.spec}</b></div>
      <div class="kv"><span>${LANG === 'zh' ? '货值' : 'Value'}</span><b>${b.amount}</b></div>`;
  }

  $('#concl').innerHTML = `
    <div class="verdict ${bad ? 'bad' : ''}">
      <div class="vlab"><span>${bad ? '⚠' : '✓'}</span>${bad ? (LANG === 'zh' ? '买家结论 · 拒绝采信' : 'Verdict · not reliable') : (LANG === 'zh' ? '买家结论 · 可采信' : 'Verdict · reliable')}</div>
      <div class="vtxt">${bad ? (LANG === 'zh' ? '这份凭证链有一处对不上' : 'One link does not add up') : (LANG === 'zh' ? '这条链上的事，你可以自己核对' : 'You can check every link yourself')}</div>
      <div class="vsub">${bad
      ? (fpBreak
        ? (LANG === 'zh' ? '不需要打电话问任何人。点开标红的那一个节点，你会看到原始值与当前值的差别。' : 'No phone calls needed. Open the red node and you will see original versus current.')
        : (LANG === 'zh' ? '单据本身是真的，顺序是假的：验厂报告签发在出运之后。这种错，纸质档案里根本看不出来。' : 'The documents are real, the order is not — the audit was issued after the goods shipped.'))
      : (LANG === 'zh' ? '五个节点、五份原始单据、五个指纹。任何一处事后改动，都会和签发时对不上。' : 'Five nodes, five original documents, five fingerprints. Any later edit breaks the match.')}</div>
    </div>
    <div class="checks ${role === 'factory' ? 'hidefac' : ''}">${checks.map(c => `<div class="chk ${c.ok ? '' : 'fail'}">
        <span class="ic">${c.ok ? '✓' : '✕'}</span>${LANG === 'zh' ? c.zh : c.en}
        <span class="why">${t(c.why)}</span></div>`).join('')}</div>
    <div class="sec ${role === 'factory' ? 'hidefac' : ''}">${LANG === 'zh' ? '凭证包' : 'Document pack'} · ${b.events.length} ${LANG === 'zh' ? '份' : 'files'}</div>
    <div class="docpack ${role === 'factory' ? 'hidefac' : ''}">${b.events.map(e => `<div class="dprow">${t(e.docs[0])}<span>${e.pending ? '—' : 'PDF'}</span></div>`).join('')}</div>
    ${roleBlock}
    <div class="tamper ${role === 'factory' ? 'hidefac' : ''}">
      ${state.tampered
      ? `<button class="btn ghost" id="btnRestore" style="flex:1">${LANG === 'zh' ? '还原数据' : 'Restore'}</button>`
      : `<button class="btn danger" id="btnTamper" style="flex:1">${LANG === 'zh' ? '模拟篡改' : 'Simulate tampering'}</button>`}
    </div>`;
}

function renderAnchor() { renderBatchList(); renderTL(); renderConcl(); }

function doTamper() {
  const b = getBatch();
  const target = b.events.find(e => e.flaw && !e.changed);
  if (!target) { toast(LANG === 'zh' ? '这个批次没有可篡改的字段了' : 'No field left to tamper with'); return; }
  const { i, rule } = target.flaw;
  target.hashIssued = fp(target);
  target.changed = true;
  target.changedIdx = i;
  target.changedRule = rule;
  target.changedField = target.f[i][0];
  target.open = true;
  state.tampered = true;
  if (b.status === 'ok') b.status = 'bad';
  renderAnchor();
  toast(LANG === 'zh' ? `已改动「${target.f[i][0]}」，指纹随即对不上` : `Altered “${target.f[i][1]}” — fingerprint no longer matches`);
}

function doRestore() {
  const b = getBatch();
  b.events.forEach(e => { e.changed = false; e.changedIdx = -1; e.changedRule = null; e.changedField = null; });
  b.status = b.id === 'CS-2610-0921' ? 'bad' : b.id.startsWith('CS-2611-0502') ? 'warn' : 'ok';
  state.tampered = false;
  renderAnchor();
  toast(LANG === 'zh' ? '已还原到签发状态' : 'Restored to issued state');
}

/* ================= 台2 舵手 ================= */
const COLS = [
  { zh: '询价', en: 'Quoted' }, { zh: '打样', en: 'Sampling' }, { zh: '生产', en: 'Producing' },
  { zh: '发运', en: 'Shipping' }, { zh: '签收', en: 'Delivered' }
];
const REQUIRED = [
  { zh: '报价单', en: 'Quotation' }, { zh: '验厂报告', en: 'Audit report' }, { zh: '质检报告', en: 'QC report' },
  { zh: '提单', en: 'B/L' }, { zh: '签收单', en: 'POD' }
];
let KCARDS = [];

function initKb() {
  KCARDS = [
    { id: 'CT-8841', ti: { zh: '12 SKU · 家居', en: '12 SKU · home' }, sup: 'S-0218', amt: '¥86,400', stage: 2, docs: ['报价单', '验厂报告', '质检报告', '提单'] },
    { id: 'CT-8902', ti: { zh: '8 SKU · 3C 配件', en: '8 SKU · 3C' }, sup: 'S-0441', amt: '¥212,000', stage: 1, docs: ['报价单', '验厂报告'] },
    { id: 'CT-9012', ti: { zh: '6 SKU · 户外', en: '6 SKU · outdoor' }, sup: 'S-0192', amt: '¥58,900', stage: 3, docs: ['报价单', '验厂报告', '质检报告', '提单'] },
    { id: 'CT-9130', ti: { zh: '4 SKU · 五金', en: '4 SKU · hardware' }, sup: 'S-0533', amt: '¥73,500', stage: 0, docs: ['报价单'] },
    { id: 'CT-9205', ti: { zh: '3 SKU · 饰品', en: '3 SKU · jewellery' }, sup: 'S-0267', amt: '¥31,200', stage: 1, docs: ['报价单', '验厂报告'] },
    { id: 'CT-8590', ti: { zh: '3 SKU · 五金件', en: '3 SKU · metal' }, sup: 'S-0104', amt: '¥148,000', stage: 4, docs: ['报价单', '验厂报告', '质检报告', '提单', '签收单'] },
    { id: 'CT-9312', ti: { zh: '5 SKU · 家居布艺', en: '5 SKU · textiles' }, sup: 'S-0355', amt: '¥44,800', stage: 0, docs: ['报价单'] },
    { id: 'CT-8703', ti: { zh: '9 SKU · 宠物', en: '9 SKU · pet' }, sup: 'S-0121', amt: '¥67,300', stage: 2, docs: ['报价单', '验厂报告', '质检报告'] },
    { id: 'CT-9456', ti: { zh: '7 SKU · 户外灯具', en: '7 SKU · lighting' }, sup: 'S-0410', amt: '¥92,100', stage: 1, docs: ['报价单'] },
    { id: 'CT-8801', ti: { zh: '2 SKU · 3C 支架', en: '2 SKU · mounts' }, sup: 'S-0488', amt: '¥38,600', stage: 3, docs: ['报价单', '验厂报告', '质检报告', '提单'] },
    { id: 'CT-9220', ti: { zh: '6 SKU · 饰品', en: '6 SKU · jewellery' }, sup: 'S-0267', amt: '¥27,400', stage: 0, docs: ['报价单'] },
    { id: 'CT-9044', ti: { zh: '4 SKU · 工具', en: '4 SKU · tools' }, sup: 'S-0163', amt: '¥119,000', stage: 2, docs: ['报价单', '验厂报告'] }
  ];
  renderKb();
}

function renderKb() {
  $('#kb').innerHTML = COLS.map((c, k) => {
    const cards = KCARDS.filter(x => x.stage === k);
    return `<div class="kcol" data-k="${k}">
      <div class="kcolh"><b>${LANG === 'zh' ? c.zh : c.en}</b><span class="c">${cards.length}</span></div>
      <div class="kbody" data-drop="${k}">
        ${cards.map(card => `<div class="kcard" draggable="true" data-id="${card.id}">
          <div class="id">${card.id}</div>
          <div class="ti">${t(card.ti)}</div>
          <div class="mt"><span class="tag">${card.sup}</span><span>${card.amt}</span>
            ${card.stage >= 4 ? '<span class="okd">✓</span>' : (!card.docs.includes(REQUIRED[card.stage + 1].zh) ? '' : '<span class="okd">✓</span>')}
            <button class="adv" data-adv="${card.id}" title="推进" style="margin-left:auto;width:19px;height:19px;border-radius:5px;border:1px solid var(--line2);color:#8A9099;font-size:10px;line-height:1">→</button>
          </div>
          ${(() => {
        if (card.stage >= 4) return `<div class="okline">${LANG === 'zh' ? '已闭环 · 5 份凭证齐全' : 'Closed · 5 documents on file'}</div>`;
        const need = REQUIRED[card.stage + 1].zh;
        return card.docs.includes(need)
          ? `<div class="okline">${LANG === 'zh' ? `可推进：凭证齐` : 'Ready to advance'}</div>`
          : `<div class="missline">${LANG === 'zh' ? `缺「${need}」，卡在这一步` : `Missing “${REQUIRED[card.stage + 1].en}”`}</div>`;
      })()}
        </div>`).join('')}
      </div>
        <div class="kadd" data-add="${k}">＋</div>
      </div>
    </div>`;
  }).join('');
}

function tryAdvance(id, to) {
  const c = KCARDS.find(x => x.id === id);
  if (!c) return;
  if (to <= c.stage) { c.stage = to; renderKb(); return; }
  if (to > c.stage + 1) { toast(LANG === 'zh' ? '只能一步一步推进' : 'One stage at a time'); return; }
  const need = REQUIRED[c.stage + 1].zh;
  if (!c.docs.includes(need)) {
    renderKb();
    const el = document.querySelector(`.kcard[data-id="${id}"]`);
    if (el) { el.classList.add('needs'); setTimeout(() => el.classList.remove('needs'), 1100); }
    $('#kbnote').innerHTML = `<b>✕</b> <span>${LANG === 'zh' ? `卡住了：进「${COLS[c.stage + 1].zh}」之前必须先有「${need}」` : `Blocked: need “${REQUIRED[c.stage + 1][LANG === 'zh' ? 'en' : 'zh']}” before ${COLS[c.stage + 1].en}`}</span>`;
    toast(LANG === 'zh' ? `缺「${need}」，这一步不能过` : `Missing “${need}”`);
    return;
  }
  c.stage = to;
  renderKb();
  $('#kbnote').innerHTML = `<b style="color:var(--green)">✓</b> <span>${LANG === 'zh' ? `${id} 进入「${COLS[to].zh}」，凭证齐` : `${id} moved to ${COLS[to].en}`}</span>`;
  toast(LANG === 'zh' ? `${id} → ${COLS[to].zh}` : `${id} → ${COLS[to].en}`);
}

function bindKb() {
  const kb = $('#kb');
  kb.addEventListener('dragstart', e => {
    const card = e.target.closest('.kcard');
    if (!card) return;
    e.dataTransfer.setData('text/plain', card.dataset.id);
    card.classList.add('drag');
  });
  kb.addEventListener('dragend', e => { const c = e.target.closest('.kcard'); if (c) c.classList.remove('drag'); });
  kb.addEventListener('dragover', e => { e.preventDefault(); const col = e.target.closest('.kcol'); if (col) col.classList.add('over'); });
  kb.addEventListener('dragleave', e => { const col = e.target.closest('.kcol'); if (col) col.classList.remove('over'); });
  kb.addEventListener('drop', e => {
    e.preventDefault();
    $$('.kcol').forEach(c => c.classList.remove('over'));
    const id = e.dataTransfer.getData('text/plain');
    const col = e.target.closest('.kcol');
    if (!id || !col) return;
    tryAdvance(id, +col.dataset.k);
  });
  kb.addEventListener('click', e => {
    if (e.target.closest('[data-add]')) { toast(LANG === 'zh' ? '演示环境不开新单；真实系统里这里接 ERP 下单' : 'Demo: new orders come from the ERP'); return; }
    const btn = e.target.closest('[data-adv]');
    if (btn) {
      const c = KCARDS.find(x => x.id === btn.dataset.adv);
      tryAdvance(btn.dataset.adv, Math.min(c.stage + 1, 4));
    }
  });
}

/* ================= 台3 船长 ================= */
const CHANNELS = [
  { id: 'xhs', zh: '小红书', en: 'Xiaohongshu', d: { zh: '家居/生活方式客户，图文为主', en: 'Home & lifestyle, image-first' }, w: 1.0, lead: 0.9 },
  { id: 'dy', zh: '抖音', en: 'Douyin', d: { zh: '工厂实拍最有说服力', en: 'Factory-floor footage works' }, w: 1.3, lead: 0.7 },
  { id: 'tt', zh: 'TikTok', en: 'TikTok', d: { zh: '欧美买家，短视频转化', en: 'EU/US buyers, short video' }, w: 1.4, lead: 0.6 },
  { id: 'wx', zh: '视频号 / 私域', en: 'WeChat / private', d: { zh: '老客户复购与转介绍', en: 'Repeat and referral' }, w: 0.7, lead: 1.3 },
  { id: 'ali', zh: '阿里国际站', en: 'Alibaba.com', d: { zh: '询盘量大，需人工筛', en: 'High volume, needs screening' }, w: 0.8, lead: 1.1 },
  { id: 'seo', zh: '独立站 SEO', en: 'Own-site SEO', d: { zh: '慢，但复利最稳', en: 'Slow, compounding' }, w: 0.5, lead: 0.8 }
];
let selCh = new Set(['xhs', 'tt']);

function renderChannels() {
  $('#chlist').innerHTML = CHANNELS.map(c => `<button class="chitem ${selCh.has(c.id) ? 'on' : ''}" data-ch="${c.id}">
    <div class="cn">${LANG === 'zh' ? c.zh : c.en}<span class="ck">${selCh.has(c.id) ? '✓' : ''}</span></div>
    <div class="cd">${t(c.d)}</div>
  </button>`).join('');
  $('#chCnt').textContent = `${selCh.size} / 6`;
}

function calc() {
  const B = +$('#budget').value; // 千元
  const n = Math.max(selCh.size, 1);
  const sel = CHANNELS.filter(c => selCh.has(c.id));
  const perPiece = 650; // 元 / 条（本地拍摄 + 剪辑）
  const pieces = Math.max(1, Math.round(B * 1000 / perPiece / (1 + 0.16 * (n - 1))));
  const heads = Math.round((0.5 + 0.3 * n) * 10) / 10;
  const wSum = sel.reduce((a, c) => a + c.w, 0) || 1;
  const leadRate = sel.reduce((a, c) => a + c.lead * c.w, 0) / wSum;
  const leads = Math.round(pieces * 0.32 * leadRate * (n > 3 ? 0.8 : 1));
  const cpl = Math.round(B * 1000 / Math.max(leads, 1));

  $('#budgetVal').textContent = '¥ ' + (B * 1000).toLocaleString();
  $('#chCnt').textContent = selCh.size + ' / 6';

  const diag = selCh.size === 0
    ? { zh: '至少选一个渠道。', en: 'Pick at least one channel.' }
    : selCh.size > 4
      ? { zh: '渠道太散：同一笔预算摊到 5 个以上渠道，单条内容很难做深。建议砍到 2–3 个。', en: 'Too fragmented — spread across 5+ channels nothing gets depth. Cut to 2–3.' }
      : cpl > 3200
        ? { zh: '单个询盘成本偏高（>¥3,200）：把预算集中到 1–2 个已验证渠道，或提高客单价。', en: 'Cost per lead is high (>¥3,200) — concentrate budget or raise order value.' }
        : { zh: '结构合理：这个组合下每条内容能覆盖的渠道数适中，询盘成本在可接受区间。', en: 'Sane mix — content can carry this many channels, cost per lead acceptable.' };

  const allocHtml = sel.map(c => {
    const share = c.w / wSum;
    return `<div class="arow"><span>${LANG === 'zh' ? c.zh : c.en}</span>
      <div class="tr"><div class="fl" style="width:${Math.round(share * 100)}%"></div></div>
      <b>¥${Math.round(B * 1000 * share).toLocaleString()}</b></div>`;
  }).join('');
  const allocEl = $('#alloc');
  if (allocEl) allocEl.innerHTML = selCh.size
    ? `<div class="alabh">${LANG === 'zh' ? '预算怎么分' : 'Budget split'}</div>${allocHtml}`
    : `<div class="alabh">${LANG === 'zh' ? '预算怎么分' : 'Budget split'}</div><div style="font-size:11px;color:#4E545C">${LANG === 'zh' ? '先勾选渠道' : 'Select a channel first'}</div>`;

  $('#calcOut').innerHTML = `
    <div class="kpi"><div class="k">${LANG === 'zh' ? '需要人力' : 'Headcount'}</div>
      <div class="v">${heads}<small>${LANG === 'zh' ? '人' : 'people'}</small></div></div>
    <div class="kpi"><div class="k">${LANG === 'zh' ? '月产内容' : 'Pieces / month'}</div>
      <div class="v">${pieces}<small>${LANG === 'zh' ? '条' : 'pcs'}</small></div></div>
    <div class="kpi"><div class="k">${LANG === 'zh' ? '预计有效询盘' : 'Qualified leads'}</div>
      <div class="v">${leads}<small>${LANG === 'zh' ? '条 / 月' : '/ mo'}</small></div></div>
    <div class="kpi"><div class="k">${LANG === 'zh' ? '单个询盘成本' : 'Cost per lead'}</div>
      <div class="v" style="color:${cpl > 3200 ? 'var(--amber)' : 'var(--acid)'}">¥${cpl.toLocaleString()}</div></div>
    <div class="bars">
      <div class="bar"><span>${LANG === 'zh' ? '人力' : 'Staff'}</span><div class="track"><div class="fill" style="width:${Math.min(heads / 3 * 100, 100)}%"></div></div><b>${heads}</b></div>
      <div class="bar"><span>${LANG === 'zh' ? '内容' : 'Content'}</span><div class="track"><div class="fill" style="width:${Math.min(pieces / 420 * 100, 100)}%"></div></div><b>${pieces}</b></div>
      <div class="bar"><span>${LANG === 'zh' ? '询盘' : 'Leads'}</span><div class="track"><div class="fill" style="width:${Math.min(leads / 40 * 100, 100)}%"></div></div><b>${leads}</b></div>
    </div>
    <div style="font-size:11.5px;color:#7D848D;line-height:1.65;border-top:1px solid var(--line);padding-top:11px">${t(diag)}</div>`;
}

function bindCaptain() {
  $('#chlist').addEventListener('click', e => {
    const b = e.target.closest('[data-ch]');
    if (!b) return;
    const id = b.dataset.ch;
    selCh.has(id) ? selCh.delete(id) : selCh.add(id);
    renderChannels(); calc();
  });
  $('#budget').addEventListener('input', calc);
}

/* ================= 台4 帆选 ================= */
const CATS = [
  { id: 'jw', zh: '饰品', en: 'Jewellery', price: 29, cogs: 6.5, freight: 3.2, ret: 6, band: [4.5, 8], retail: [25, 45], avg: 28, sup: 218, moq: 300, lead: '12 d' },
  { id: 'hm', zh: '家居收纳', en: 'Home storage', price: 68, cogs: 21, freight: 11, ret: 5, band: [15, 28], retail: [59, 99], avg: 22, sup: 164, moq: 500, lead: '15 d' },
  { id: 'tl', zh: '工具', en: 'Tools', price: 129, cogs: 48, freight: 18, ret: 3, band: [35, 62], retail: [109, 189], avg: 25, sup: 92, moq: 200, lead: '18 d' },
  { id: 'pt', zh: '宠物', en: 'Pet', price: 45, cogs: 12, freight: 7.5, ret: 8, band: [8, 16], retail: [39, 69], avg: 26, sup: 137, moq: 500, lead: '14 d' },
  { id: 'od', zh: '户外', en: 'Outdoor', price: 159, cogs: 52, freight: 24, ret: 7, band: [38, 68], retail: [139, 229], avg: 21, sup: 88, moq: 300, lead: '20 d' },
  { id: 'c3', zh: '3C 配件', en: '3C accessories', price: 39, cogs: 11, freight: 4.6, ret: 9, band: [7, 15], retail: [29, 59], avg: 19, sup: 206, moq: 1000, lead: '10 d' }
];
let curCat = 0;
let vals = { price: 29, cogs: 6.5, freight: 3.2, ret: 6, fee: 15 };

function renderCats() {
  $('#catlist').innerHTML = CATS.map((c, i) => `<button class="cat ${i === curCat ? 'on' : ''}" data-cat="${i}">
    <i>${String(i + 1).padStart(2, '0')}</i>${LANG === 'zh' ? c.zh : c.en}</button>`).join('');
}

const SLIDERS = [
  { k: 'price', zh: '售价', en: 'Price', min: 10, max: 300, step: 1, unit: '¥' },
  { k: 'cogs', zh: '采购成本', en: 'Landed cost', min: 2, max: 150, step: 0.5, unit: '¥' },
  { k: 'freight', zh: '头程运费', en: 'Freight', min: 0.5, max: 60, step: 0.5, unit: '¥' },
  { k: 'fee', zh: '平台佣金', en: 'Platform fee', min: 0, max: 30, step: 0.5, unit: '%' },
  { k: 'ret', zh: '退货率', en: 'Return rate', min: 0, max: 30, step: 0.5, unit: '%' }
];

function renderSliders() {
  $('#sliders').innerHTML = SLIDERS.map(s => `<div class="srow">
    <div class="sh"><span>${LANG === 'zh' ? s.zh : s.en}</span><b id="v_${s.k}">${s.unit === '%' ? vals[s.k] + '%' : '¥' + vals[s.k]}</b></div>
    <input type="range" data-sl="${s.k}" min="${s.min}" max="${s.max}" step="${s.step}" value="${vals[s.k]}">
  </div>`).join('');
}

function renderCatNote() {
  const c = CATS[curCat];
  const el = document.getElementById('catnote');
  if (!el) return;
  el.innerHTML = `<b>${LANG === 'zh' ? '义乌采购价' : 'Yiwu cost'}</b> ¥${c.band[0]}–${c.band[1]}
    &nbsp;·&nbsp; <b>${LANG === 'zh' ? '建议零售' : 'Retail'}</b> ¥${c.retail[0]}–${c.retail[1]}
    &nbsp;·&nbsp; <b>${LANG === 'zh' ? '同类目均毛利' : 'Category margin'}</b> ${c.avg}%`;
  let sum = document.getElementById('catsum');
  if (!sum) { sum = document.createElement('div'); sum.id = 'catsum'; sum.className = 'catsum'; document.getElementById('catlist').after(sum); }
  sum.innerHTML = `<div><b>${c.sup}</b>${LANG === 'zh' ? '在册供应商' : 'suppliers'}</div>
    <div><b>${c.moq}</b>${LANG === 'zh' ? '典型起订' : 'MOQ'}</div>
    <div><b>${c.lead}</b>${LANG === 'zh' ? '平均交期' : 'lead time'}</div>`;
}

function renderWaterfall() {
  const p = vals.price, cogs = vals.cogs, fr = vals.freight;
  const fee = p * vals.fee / 100;
  const retLoss = p * vals.ret / 100 * 0.55;
  const net = p - cogs - fr - fee - retLoss;
  const pct = net / p * 100;
  const p2 = p * 0.9;
  const sensPct = ((p2 - cogs - fr - p2 * vals.fee / 100 - p2 * vals.ret / 100 * 0.55) / p2 * 100).toFixed(1);
  const rows = [
    { lab: LANG === 'zh' ? '售价' : 'Price', amt: p, w: 100, c: 'var(--acid)' },
    { lab: LANG === 'zh' ? '采购' : 'Cost', amt: -cogs, w: cogs / p * 100, c: '#6D747C' },
    { lab: LANG === 'zh' ? '头程' : 'Freight', amt: -fr, w: fr / p * 100, c: '#7A828C' },
    { lab: LANG === 'zh' ? '佣金' : 'Fee', amt: -fee, w: fee / p * 100, c: '#8A9199' },
    { lab: LANG === 'zh' ? '退货损耗' : 'Returns', amt: -retLoss, w: retLoss / p * 100, c: '#9AA1AA' }
  ];
  $('#waterfall').innerHTML = rows.map(r => `<div class="wf">
      <span class="lab">${r.lab}</span>
      <div class="tr"><div class="fl" style="width:${Math.min(Math.abs(r.w), 100)}%;background:${r.c}"></div></div>
      <span class="amt" style="color:${r.amt < 0 ? '#8A9199' : 'var(--acid)'}">${r.amt < 0 ? '−' : ''}¥${Math.abs(r.amt).toFixed(1)}</span>
    </div>`).join('') + `
    <div class="wf net" style="margin-top:6px;padding-top:9px;border-top:1px solid var(--line)">
      <span class="lab">${LANG === 'zh' ? '净利' : 'Net'}</span>
      <div class="tr"><div class="fl" style="width:${Math.max(pct, 0)}%;background:${pct < 12 ? 'var(--red)' : 'var(--acid)'}"></div></div>
      <span class="amt">¥${net.toFixed(1)}</span>
    </div>
    <div class="bigpct"><div class="p ${pct < 8 ? 'bad' : pct < 12 ? 'warn' : ''}">${pct.toFixed(1)}<span style="font-size:20px">%</span></div>
      <div class="l">${pct < 8 ? (LANG === 'zh' ? '不建议做：一退货就亏' : 'Do not do this — one return wipes it out') : pct < 12 ? (LANG === 'zh' ? '偏薄：只能靠走量' : 'Thin — volume only') : (LANG === 'zh' ? '毛利健康，可以做' : 'Healthy margin')}</div>
      <div class="cmp">${LANG === 'zh' ? '同类目平均' : 'Category avg'} ${CATS[curCat].avg}% <span>·</span> ${LANG === 'zh' ? '你' : 'you'} ${pct.toFixed(1)}% <b class="${pct >= CATS[curCat].avg ? 'up' : 'down'}">${pct >= CATS[curCat].avg ? '+' : ''}${(pct - CATS[curCat].avg).toFixed(1)}</b></div>
      <div class="sens">${LANG === 'zh' ? '若降价 10% → 毛利' : 'Price −10% → margin'} <b>${sensPct}%</b>
        ${sensPct < 8 ? `<span>${LANG === 'zh' ? '· 撑不住' : '· breaks'}</span>` : ''}</div></div>`;
}

function bindFanxuan() {
  $('#catlist').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    curCat = +b.dataset.cat;
    const c = CATS[curCat];
    vals = { price: c.price, cogs: c.cogs, freight: c.freight, ret: c.ret, fee: vals.fee };
    renderCats(); renderSliders(); renderWaterfall(); renderCatNote(); renderCatNote();
  });
  $('#sliders').addEventListener('input', e => {
    const k = e.target.dataset.sl;
    if (!k) return;
    vals[k] = +e.target.value;
    const s = SLIDERS.find(x => x.k === k);
    $(`#v_${k}`).textContent = s.unit === '%' ? vals[k] + '%' : '¥' + vals[k];
    if (k === 'price') { // 约束成本不超售价
      if (vals.cogs + vals.freight > vals.price * 0.8) {
        vals.cogs = Math.min(vals.cogs, vals.price * 0.5);
        vals.freight = Math.min(vals.freight, vals.price * 0.3);
        renderSliders();
      }
    }
    renderWaterfall();
  });
}

/* ================= 台5 灯塔 ================= */
const PLATFORMS = [
  { id: 'xhs', zh: '小红书', en: 'Xiaohongshu' },
  { id: 'dy', zh: '抖音', en: 'Douyin' },
  { id: 'tt', zh: 'TikTok', en: 'TikTok' }
];
const HOOKS = [
  { zh: '同一款货，为什么欧洲卖 3 倍价', en: 'Same product, 3× the price in Europe' },
  { zh: '义乌老板不告诉你的三个报价陷阱', en: 'Three quote traps Yiwu suppliers hide' },
  { zh: '验厂到底看什么：6 分钟带你看完', en: 'What a factory audit really checks' },
  { zh: '一个柜子怎么从义乌到汉堡', en: 'How one container goes Yiwu → Hamburg' },
  { zh: '客户问「能不能再便宜」，我这样回', en: 'Reply when a buyer asks for a lower price' },
  { zh: '这批货我为什么拒收', en: 'Why I rejected this batch' },
  { zh: '打样三次才过，钱花在哪了', en: 'Three rounds of sampling — where the money went' },
  { zh: '3000 家供应商里怎么挑出一家', en: 'Picking one factory out of 3,000' },
  { zh: '退货率从 9% 降到 3% 做了什么', en: 'Getting returns from 9% down to 3%' },
  { zh: '人民币结算，避开汇率那一刀', en: 'Settling in RMB to dodge FX' },
  { zh: '清关单据缺一张，柜子压了 11 天', en: 'One missing document, 11 days stuck' },
  { zh: '小单也能做：500 件起订怎么谈', en: 'How to negotiate a 500-piece MOQ' }
];
let CAL = {};

function renderCal() {
  const days = LANG === 'zh' ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  $('#calgrid').innerHTML = PLATFORMS.map(p => {
    const cells = days.map((d, i) => {
      const key = p.id + '-' + i;
      const item = CAL[key];
      if (!item) return `<div class="slot" data-slot="${key}">${LANG === 'zh' ? '＋ 生成' : '+ add'}</div>`;
      return `<div class="slot filled ${item.fresh ? 'new' : ''}">
        <div class="dt">${d.toUpperCase()} · ${item.type}</div>
        <div class="hk">${t(item.hook)}</div>
        <div class="ft"><span>${item.fmt}</span><span>${item.cta}</span></div>
      </div>`;
    }).join('');
    return `<div class="calcol"><h4>${LANG === 'zh' ? p.zh : p.en}<span class="c">${Object.keys(CAL).filter(k => k.startsWith(p.id)).length}/7</span></h4>${cells}</div>`;
  }).join('');
}

const FMTS = ['口播 45s', '工厂实拍', '对比测评', '图文 6 图', '客户证言'];
const CTAS = ['私信报价', '评论区留言', '领样品', '看完整流程'];

function genSlot(key) {
  const hook = HOOKS[Math.floor(Math.random() * HOOKS.length)];
  CAL[key] = {
    hook, fresh: true,
    type: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
    fmt: FMTS[Math.floor(Math.random() * FMTS.length)],
    cta: CTAS[Math.floor(Math.random() * CTAS.length)]
  };
  renderCal();
  setTimeout(() => { if (CAL[key]) CAL[key].fresh = false; }, 600);
}

function bindBeacon() {
  $('#calgrid').addEventListener('click', e => {
    const s = e.target.closest('[data-slot]');
    if (!s) return;
    genSlot(s.dataset.slot);
  });
  $('#fillWeek').addEventListener('click', () => {
    let n = 0;
    PLATFORMS.forEach(p => {
      for (let i = 0; i < 7; i++) {
        const key = p.id + '-' + i;
        if (!CAL[key]) { genSlot(key); n++; }
      }
    });
    toast(n ? (LANG === 'zh' ? `补了 ${n} 条内容，一周排满` : `Added ${n} pieces — week filled`) : (LANG === 'zh' ? '这周已经满了' : 'Week already full'));
  });
}

/* ================= 导航 / 语言 / 视角 ================= */
const VIEWS = {
  anchor: { title: { zh: '锚 Anchor', en: 'Anchor' }, sub: { zh: '凭证核验台', en: 'Chain of custody' } },
  helm: { title: { zh: '舵手 Helm', en: 'Helm' }, sub: { zh: '订单流水线', en: 'Order pipeline' } },
  captain: { title: { zh: '船长 Captain', en: 'Captain' }, sub: { zh: '代运营测算', en: 'Ops calculator' } },
  fanxuan: { title: { zh: '帆选 Fanxuan', en: 'Fanxuan' }, sub: { zh: '单品毛利', en: 'Unit margin' } },
  beacon: { title: { zh: '灯塔 Beacon', en: 'Beacon' }, sub: { zh: '内容排期', en: 'Content calendar' } }
};

function goto(view, silent) {
  state.view = view;
  $$('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + view));
  $$('.navi').forEach(n => n.classList.toggle('on', n.dataset.view === view));
  $('#crumbTitle').textContent = t(VIEWS[view].title);
  $('#crumbSub').textContent = t(VIEWS[view].sub);
  if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view);
  if (!silent) $('#v-' + view).scrollTop = 0;
}

function applyLang() {
  $$('[data-zh]').forEach(el => { el.textContent = LANG === 'zh' ? el.dataset.zh : el.dataset.en; });
  $$('#langSegs button').forEach(b => b.classList.toggle('on', b.dataset.lang === LANG));
  renderAnchor(); renderKb(); renderChannels(); calc(); renderCats(); renderSliders(); renderWaterfall(); renderCal();
  $('#crumbTitle').textContent = t(VIEWS[state.view].title);
  $('#crumbSub').textContent = t(VIEWS[state.view].sub);
  $('#rfMonths').textContent = LANG === 'zh' ? '12 个月' : '12 mo';
}

function setRole(r) {
  state.role = r;
  document.body.dataset.role = r;
  $$('#roleSegs button').forEach(b => b.classList.toggle('on', b.dataset.role === r));
  renderConcl();
  const msg = r === 'buyer' ? { zh: '买家视角：只看结论与风险', en: 'Buyer view: verdict and risk only' }
    : r === 'factory' ? { zh: '工厂视角：只看你要补的单据', en: 'Factory view: documents you owe' }
      : { zh: '运营视角：看指纹、时间戳与告警', en: 'Ops view: fingerprints, timestamps, alerts' };
  toast(t(msg));
}

/* ================= 启动 ================= */
function boot() {
  const h = (location.hash || '').replace('#', '');
  if (VIEWS[h]) state.view = h;
  else goto('anchor', true);

  BATCHES[0].events[0].open = true;
  renderAnchor(); initKb(); renderChannels(); calc();
  renderCats(); renderSliders(); renderWaterfall();
  applyLang();
  goto(state.view, true);
  bindKb(); bindCaptain(); bindFanxuan(); bindBeacon();

  // 批次切换
  $('#blist').addEventListener('click', e => {
    const b = e.target.closest('.bitem');
    if (!b) return;
    state.batchIdx = +b.dataset.i;
    state.tampered = false;
    renderAnchor();
  });

  // 时间轴展开
  $('#tl').addEventListener('click', e => {
    const head = e.target.closest('.evhead');
    if (!head) return;
    const ev = head.parentElement;
    const idx = +ev.dataset.ev;
    const batch = getBatch();
    const willOpen = !batch.events[idx].open;
    batch.events.forEach(x => x.open = false);
    batch.events[idx].open = willOpen;
    renderTL();
  });

  // 篡改 / 还原（委托，因为结页面重渲染）
  $('#concl').addEventListener('click', e => {
    if (e.target.closest('#btnTamper')) doTamper();
    if (e.target.closest('#btnRestore')) doRestore();
  });

  // 导航
  $$('.navi').forEach(n => n.addEventListener('click', () => goto(n.dataset.view)));
  // 键盘
  const order = ['anchor', 'helm', 'captain', 'fanxuan', 'beacon'];
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea')) return;
    const n = +e.key;
    if (n >= 1 && n <= 5) { goto(order[n - 1]); }
    if (e.key === 'Escape') $('#helpcard').classList.remove('on');
  });
  // 语言
  $$('#langSegs button').forEach(b => b.addEventListener('click', () => { LANG = b.dataset.lang; document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en'; applyLang(); }));
  // 视角
  $$('#roleSegs button').forEach(b => b.addEventListener('click', () => setRole(b.dataset.role)));
  // 帮助
  $('#helpbtn').addEventListener('click', () => $('#helpcard').classList.toggle('on'));
  // 重置看板
  $('#kbReset').addEventListener('click', () => { initKb(); toast(LANG === 'zh' ? '看板已重置' : 'Board reset'); });

  // 状态数字轻微跳动，制造"在跑"的感觉
  setInterval(() => {
    const a = $('#stToday');
    a.textContent = 41 + Math.floor(Math.random() * 12);
  }, 5200);

  // 首次进入轻提示
  setTimeout(() => toast(LANG === 'zh' ? '点任意节点展开原始凭证，或试试点「模拟篡改」' : 'Open any node, or hit “Simulate tampering”'), 1100);
}

document.addEventListener('DOMContentLoaded', boot);
