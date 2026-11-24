# CloudCell 域名方案（2026-11-24 实测）

## 一、现状（RDAP 权威查询结果）

| 域名 | 状态 | 详情 |
|---|---|---|
| cloudcell.com | ❌ 已注册 | 2008 年注册，2027-08-20 到期；站点打不开，解析到 1.1.1.1（疑似停放/被墙策略） |
| cloudcell.ai | ❌ 已注册 | **2026-02-02 刚被抢注**（挂 Cloudflare，暂未建站），2028-02 到期 |
| cloudcell.io | ❌ 已注册 | 同名公司在用：CloudCell — Your Bioinformatics Partner（生物信息学，非竞品行业） |
| cloudcell.dev | ❌ 已注册 | 2027-09 到期 |
| cloudcell.app | ✅ 可注册 | 未注册 |
| cloudcell.co | ✅ 可注册 | 未注册 |
| cloudcell.tech | ✅ 可注册 | 未注册 |
| cloudcellhq.ai | ✅ 可注册 | 未注册 |
| getcloudcell.com / .ai | ✅ 可注册 | 未注册 |
| cloud-cell.ai | ✅ 可注册 | 未注册 |
| cloudcellos.ai | ✅ 可注册 | 未注册 |

> 另：`cloudcellhq.com` 已注册但 **2026-11-29 到期**（5 天后）。可以设置到期监控，若对方不续费可捡。不要指望它，只当彩票。

## 二、推荐方案

**首选：cloudcell.app（约 ¥100–150/年）**
- 主品牌完整保留，「.app」是 Google 运营的正规顶级域，强制 HTTPS，适合软件/SaaS
- 可以顺手把 `cloudcell.co`（约 ¥180/年）和 `getcloudcell.com`（约 ¥60/年）也注册了做防御，总共不超过 ¥400/年

**次选：cloudcell.co**——最短、最像 .com，商务感强

**如果坚持要 .ai**：只能换形态，如 `cloudcellhq.ai` / `cloud-cell.ai`；`cloudcell.ai` 本体已被注册，买二手大约要 ¥3万起（sedo/aftermarket 议价），不建议现在花这个钱

**同名风险提示**：cloudcell.io 是生物信息学公司，行业不同、商标类别大概率不冲突（你的属于软件服务 42 类）。真要长期做，建议在国内或美国把「CloudCell」文字商标注册了（美国 TEAS 约 $250/类，国内官费 ¥300/类），比纠结域名更重要。

## 三、注册步骤（10 分钟搞定）

注册域名需要付款和实名，我没有你的支付权限，需要你自己操作（或给我一个域名注册商的 API Token，我可以代注册+解析一条龙）：

1. 打开 [Cloudflare Registrar](https://dash.cloudflare.com/)（成本价、无溢价，推荐）或阿里云/腾讯云
   - 注意：`.app` 在国内注册商也可买，但解析国内访问 .app 需要备案吗？——不需要，.app 强制 HTTPS 且是国际域名，GitHub Pages 托管无需备案
2. 搜索 `cloudcell.app` → 加购 → 支付（约 $14/年）
3. 注册完成后，在 DNS 面板加 4 条记录（GitHub Pages 官方值）：
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  sinyu1998-eng.github.io
   ```
4. 加好后把域名发我，我来完成：仓库 CNAME 文件 + Pages 自定义域绑定 + 全站链接绝对化 + 强制 HTTPS + hreflang 域名重生成（脚本已在 `/workspace/域名上线包/` 备好，一条命令跑完）

## 四、上线时间线

- 域名注册：你付款后即时生效
- DNS 解析：10 分钟–2 小时
- 我这边绑定 + 全站改造：拿到域名后 30 分钟内完成
