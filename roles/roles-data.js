/* SellerPilot 角色系统 — 数据（真实能力，不夸大；无后端时用 mailto 报名） */
window.ROLES_DATA = [
  {
    "id": "factory", "cat": "supply", "num": "01", "icon": "厂",
    "zh": {
      "name": "工厂 / 供应商", "sub": "有货、有产线、想直接接到海外订单",
      "who": "你有工厂或稳定货源，想跳过层层压价，直接把货摆到海外买家面前。",
      "does": "上架货品、报价、按单生产、接受验货、发货。",
      "system": "系统把你的货变成结构化商品档案，接询盘、先算 CIF 保本价再报价，避免卖一单亏一单；生产与验货节点进九段状态机，买家能查进度。",
      "earn": "按成交订单的供货款结算，账目清楚。",
      "join": "登记你的品类、产能和联系方式，我们把你接进入网流程。", "status": "可加入"
    },
    "en": {
      "name": "Factory / Supplier", "sub": "You have goods and a line, and want overseas orders directly",
      "who": "You run a factory or have reliable supply, and want to reach overseas buyers without layers of middlemen.",
      "does": "List goods, quote, produce to order, accept inspection, ship.",
      "system": "The system turns your goods into structured listings, takes inquiries, calculates CIF break-even before quoting, and tracks production and inspection in the nine-stage state machine.",
      "earn": "Get paid per fulfilled order, with clear books.",
      "join": "Register your category, capacity and contact — we'll onboard you.", "status": "Open"
    }
  },
  {
    "id": "trader", "cat": "supply", "num": "02", "icon": "贸",
    "zh": {
      "name": "外贸员 / 买手", "sub": "懂询盘、懂报价、能把一单跟到底",
      "who": "你会跟客户、会算价、能把询盘变成回款，想用系统替掉 Excel 和人脑。",
      "does": "接询盘、核价报价、跟单、催回款。",
      "system": "CIF 保本报价一键算清，六项成本账本记明细，九段状态机盯节点，异常才提醒你介入——重复活交给系统。",
      "earn": "按跟成的订单提成或服务费结算。",
      "join": "登记你熟悉的市场和品类，进入角色匹配。", "status": "可加入"
    },
    "en": {
      "name": "Trader / Buyer", "sub": "You know inquiries, quotes and how to close a deal",
      "who": "You can turn an inquiry into payment, and want a system to replace your spreadsheets.",
      "does": "Take inquiries, price, follow orders, collect payment.",
      "system": "One-click CIF break-even pricing, a six-item cost ledger and a nine-stage state machine — the system does the routine, you handle exceptions.",
      "earn": "Commission or service fee per closed order.",
      "join": "Register your markets and categories to get matched.", "status": "Open"
    }
  },
  {
    "id": "buyer", "cat": "demand", "num": "03", "icon": "买",
    "zh": {
      "name": "海外买家 / 采购", "sub": "老外找货、验货、来中国",
      "who": "你是海外采购商、侨胞或第一次来中国找货的人，想找到靠谱货、又想顺便看看中国。",
      "does": "在官网看货、发询盘、来中国看样验货、下单。",
      "system": "margueritesbury 官网让你先看中国货和中国行；看图认货、AI 视觉辅助识别（技术参考方向）；注册一个账号就把你和工厂、货代接成一条工作流。",
      "earn": "作为需求方，价值在于更透明的价格和履约。",
      "join": "在官网留需求，或通过下方登记你想采购的品类。", "status": "官网入口"
    },
    "en": {
      "name": "Overseas Buyer", "sub": "Foreigners sourcing, inspecting goods, visiting China",
      "who": "You're an overseas buyer, diaspora member, or first-time visitor looking for reliable goods — and curious about China.",
      "does": "Browse goods on the site, send inquiries, visit and inspect, place orders.",
      "system": "The margueritesbury site shows goods and China trips together; vision AI assists recognition (reference direction); one account connects you to factories and freight in a workflow.",
      "earn": "As the demand side, you gain transparent pricing and fulfilment.",
      "join": "Leave a request on the site, or register your category below.", "status": "Site entry"
    }
  },
  {
    "id": "guide", "cat": "demand", "num": "04", "icon": "导",
    "zh": {
      "name": "导游 / 地接", "sub": "旅游是获客，注册是入网",
      "who": "你能带老外在义乌、在中国看市场、看工厂——你接的每一个人，都是网络里的一个新角色。",
      "does": "接待、带看市场工厂、翻译协调、把客户引进入网。",
      "system": "Singles Way（整合中）把旅游和角色注册连起来：老外来看中国，注册一个账号就能当导游、地接或买家，旅游即获客。",
      "earn": "带团服务费 + 你引入的订单贡献分成。",
      "join": "登记你所在的城市、语言和服务能力。", "status": "整合中"
    },
    "en": {
      "name": "Guide / Local Host", "sub": "Travel acquires, registration onboards",
      "who": "You show foreigners the markets and factories in Yiwu and China — every person you bring is a new role in the network.",
      "does": "Host, show markets and factories, coordinate, bring clients into the network.",
      "system": "Singles Way (integrating) links travel to role registration: a visitor registers one account and becomes a guide, host or buyer.",
      "earn": "Hosting fees + a share of orders you bring in.",
      "join": "Register your city, languages and services.", "status": "Integrating"
    }
  },
  {
    "id": "freight", "cat": "supply", "num": "05", "icon": "运",
    "zh": {
      "name": "货代 / 报关 / 海外仓", "sub": "履约的每一段都是可追踪的责任",
      "who": "你做订舱、报关、物流或海外仓——你手里的履约能力，是这张网能不能兑现的关键。",
      "does": "订舱、报关、运输、海外仓配、退货处理。",
      "system": "系统把履约拆成一段段可追踪的责任，接进九段状态机；成本进账本，异常自动预警，客户问到哪了随时可查。",
      "earn": "按每段履约服务费结算。",
      "join": "登记你覆盖的线路、口岸或海外仓位置。", "status": "可加入"
    },
    "en": {
      "name": "Freight / Customs / Warehouse", "sub": "Every leg of fulfilment is a trackable responsibility",
      "who": "You handle booking, customs, logistics or overseas warehousing — your capability is what makes the network deliver.",
      "does": "Book, clear customs, ship, warehouse, handle returns.",
      "system": "The system splits fulfilment into trackable responsibilities inside the nine-stage state machine; costs go to the ledger and exceptions trigger alerts.",
      "earn": "Service fee per fulfilment leg.",
      "join": "Register your routes, ports or warehouse locations.", "status": "Open"
    }
  },
  {
    "id": "inspector", "cat": "service", "num": "06", "icon": "检",
    "zh": {
      "name": "验货 / 质检 / 跟拍", "sub": "把线下实物变成系统里可信的信息",
      "who": "你在现场——拍照、验货、核对规格。你提供的是这张网最缺的「眼见为实」。",
      "does": "现场验货、拍照录像、核对数量质量、出验货记录。",
      "system": "你上传的现场图与记录，参考 DeepLab / YOLO 一类视觉模型做识别与归档（技术参考方向），把货变成可核验的结构化信息。",
      "earn": "按次验货服务费结算。",
      "join": "登记你常驻的城市和能覆盖的品类。", "status": "整合中"
    },
    "en": {
      "name": "Inspector / QC", "sub": "Turn physical goods into trusted information",
      "who": "You're on the ground — photos, inspection, spec checks. You provide the 'seeing is believing' this network lacks.",
      "does": "Inspect on site, photo and video, verify quantity and quality, log results.",
      "system": "Your field photos and logs are recognized and archived using vision models like DeepLab / YOLO (reference direction), turning goods into verifiable data.",
      "earn": "Per-inspection service fee.",
      "join": "Register your city and coverable categories.", "status": "Integrating"
    }
  },
  {
    "id": "live", "cat": "demand", "num": "07", "icon": "播",
    "zh": {
      "name": "主播 / 内容创作者", "sub": "直播、短视频、把货讲给世界听",
      "who": "你会拍、会讲、会带节奏——直播和内容就是把流量引进这张网的入口。",
      "does": "直播带货、拍短视频、做产品内容、引流量进网。",
      "system": "你带来的流量不是一次性消耗：观众注册成角色后，后续询盘和订单能追踪到你的贡献（数据链路设计中）。",
      "earn": "带货佣金 + 引流贡献分成。",
      "join": "登记你的平台、粉丝量和擅长品类。", "status": "整合中"
    },
    "en": {
      "name": "Creator / Livestreamer", "sub": "Stream, short video, tell the story of goods",
      "who": "You shoot, you talk, you hold attention — content is the entry that brings traffic into the network.",
      "does": "Livestream, make short videos, create product content, drive traffic.",
      "system": "The traffic you bring isn't one-off: once viewers register as roles, later inquiries and orders can be traced to you (data pipeline in design).",
      "earn": "Sales commission + traffic contribution share.",
      "join": "Register your platform, audience and categories.", "status": "Integrating"
    }
  },
  {
    "id": "finance", "cat": "service", "num": "08", "icon": "金",
    "zh": {
      "name": "支付 / 金融 / 服务商", "sub": "收款、结汇、软件、咨询",
      "who": "你做跨境收款、结汇、软件工具或企业服务——网络跑起来需要你这样的支撑角色。",
      "does": "收款结汇、提供工具软件、财税法律咨询、企业服务。",
      "system": "系统把报价、成本、回款记在账本里，服务方可以对接真实交易场景（生态合作，逐步接入）。",
      "earn": "按服务协议结算。",
      "join": "登记你的服务类型和可对接能力。", "status": "生态合作"
    },
    "en": {
      "name": "Finance / Services", "sub": "Payments, FX, software, consulting",
      "who": "You do cross-border payments, FX, tools or business services — the network needs support roles like yours.",
      "does": "Collect and settle payments, provide tools, tax/legal consulting, business services.",
      "system": "Quotes, costs and payments are recorded in the ledger, so service providers can plug into real transactions (ecosystem partnerships, phased in).",
      "earn": "Per service agreement.",
      "join": "Register your service type and capabilities.", "status": "Ecosystem"
    }
  },
  {
    "id": "community", "cat": "service", "num": "09", "icon": "商",
    "zh": {
      "name": "商会 / 政府 / 园区", "sub": "把一群人组织起来的人",
      "who": "你代表商会、协会、政府或产业园区——你手里有企业、有信任、有政策，能把一张网真正组织起来。",
      "does": "组织企业入网、对接资源、提供政策与场地支持。",
      "system": "这张网本质就是义乌式角色协作的数字化：每个人领一个角色、互相联系。组织方可以把整个产业带带进来。",
      "earn": "产业带增量、招商与服务价值。",
      "join": "登记你代表的组织和可对接的企业资源。", "status": "生态合作"
    },
    "en": {
      "name": "Chamber / Gov / Park", "sub": "Those who organize a community",
      "who": "You represent a chamber, association, government or industrial park — you have enterprises, trust and policy to organize a real network.",
      "does": "Bring enterprises on board, connect resources, provide policy and venue support.",
      "system": "This network is the digitization of Yiwu-style role collaboration: everyone takes a role and connects. Organizers can bring a whole cluster in.",
      "earn": "Cluster growth, investment and service value.",
      "join": "Register your organization and enterprises you can connect.", "status": "Ecosystem"
    }
  },
  {
    "id": "dev", "cat": "system", "num": "10", "icon": "码",
    "zh": {
      "name": "开发者 / AI 工程师", "sub": "把重复活交给系统的人",
      "who": "你会写代码、懂模型——SellerPilot OS 需要一个能把角色网络自动跑起来的系统。",
      "does": "开发状态机、报价引擎、视觉识别、CRM 与自动化。",
      "system": "已有可运行的 FastAPI + 九段状态机 + CIF 报价 + 成本账本 + 异常预警底座（github.com/sinyu1998-eng/sellerpilot-os）；视觉识别参考 DeepLab / YOLO。",
      "earn": "项目协作分成或共建股权（面议）。",
      "join": "通过下方登记你的技术栈，或直接在 GitHub 看代码。", "status": "开源可见"
    },
    "en": {
      "name": "Developer / AI Engineer", "sub": "Those who let the system do the routine",
      "who": "You code and understand models — SellerPilot OS needs a system that runs the role network automatically.",
      "does": "Build the state machine, pricing engine, vision, CRM and automation.",
      "system": "A runnable FastAPI base with nine-stage state machine, CIF pricing, cost ledger and exception alerts exists (github.com/sinyu1998-eng/sellerpilot-os); vision references DeepLab / YOLO.",
      "earn": "Project share or co-build equity (negotiable).",
      "join": "Register your stack below, or see the code on GitHub.", "status": "Open source"
    }
  }
];

window.ROLES_CATS = [
  { "id": "all", "zh": "全部角色", "en": "All roles" },
  { "id": "supply", "zh": "供货与履约", "en": "Supply & fulfilment" },
  { "id": "demand", "zh": "流量与获客", "en": "Traffic & sourcing" },
  { "id": "service", "zh": "服务与信任", "en": "Service & trust" },
  { "id": "system", "zh": "系统与自动化", "en": "System & automation" }
];
