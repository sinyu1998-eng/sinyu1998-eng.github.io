/* SINOWAYS · 来华指南（外国人来华板块）独立页
   数据 + 渲染独立成文件，不与主站 i18n 耦合；
   语言切换复用主站的 sw-lang 存储与 Assistant。 */
(function () {
  "use strict";

  const PHRASES = [
    ["你好", "nǐ hǎo"], ["谢谢", "xièxie"], ["多少钱？", "duōshao qián?"],
    ["太贵了", "tài guì le"], ["可以便宜一点吗？", "kěyǐ piányi yīdiǎn ma?"],
    ["干杯", "gānbēi"], ["不要辣", "bú yào là"], ["我不吃猪肉", "wǒ bù chī zhūròu"]
  ];

  window.TRAVEL = {
    en: {
      meta: { title: "SINOWAYS — China Entry Guide for Foreign Visitors", desc: "Visas, payments, SIM cards, trains and apps — the practical side of coming to China, sorted before you fly." },
      backSite: "← SINOWAYS.COM",
      hero: {
        eyebrow: "FOREIGN VISITORS' HUB",
        t1: "Coming to China?",
        t2: "Start here.",
        sub: "Entry rules, payments, SIM cards, trains and apps — the practical side of your journey, sorted before you fly."
      },
      sections: [
        {
          n: "01", id: "entry", title: "Entry & visas", sub: "Most travellers don't need a visa at all.",
          cards: [
            { h: "30-day visa-free entry", p: "Citizens of 50+ countries — most of the EU, the UK, Ireland, Switzerland, Australia, New Zealand, Japan, South Korea, Singapore, Malaysia, Brazil, Russia and the Gulf states — can enter China for up to 30 days without a visa (trial policy, valid through end of 2026)." },
            { h: "240-hour transit visa-free", p: "Travellers from 57 countries holding an onward ticket to a third country or region (Hong Kong and Macao count) may enter via 65 designated ports and stay up to 10 days within the permitted areas — enough for a deep-dive or a sourcing trip." },
            { h: "Hainan, 30 days", p: "Citizens of 61 countries entering Hainan island through approved ports may stay up to 30 days visa-free, for business or tourism." },
            { h: "Need a visa anyway?", p: "We issue invitation letters, itinerary documents and agent support for business visas, port visas and group entries — tell the assistant your purpose and we respond within 48 hours." }
          ],
          note: "Policies change — always confirm with your nearest Chinese embassy or the National Immigration Administration. Current as of November 2026."
        },
        {
          n: "02", id: "money", title: "Money & payments", sub: "China is QR-first, and foreign cards work.",
          cards: [
            { h: "Alipay & WeChat Pay take foreign cards", p: "Link Visa, Mastercard, Amex or JCB in minutes. QR payment covers almost everything, from street food to wholesale deposits." },
            { h: "Cash still matters", p: "Carry some RMB for small towns and markets. Exchange at airport banks, or withdraw from ATMs that accept foreign cards." },
            { h: "No tipping", p: "Tipping is not expected in restaurants, taxis or hotels." },
            { h: "Prices & invoices", p: "Wholesale and retail are different worlds — tell us what you are buying and in what volume. For import, official invoices (fapiao) matter; we make sure you get them." }
          ],
          note: ""
        },
        {
          n: "03", id: "connect", title: "Staying connected", sub: "Set it up before you fly.",
          cards: [
            { h: "eSIM before departure", p: "International eSIMs (Airalo, Holafly, etc.) work on arrival. Or buy a tourist SIM from China Unicom / China Telecom at the airport with your passport." },
            { h: "Public Wi-Fi everywhere", p: "Hotels, cafés, high-speed trains and airports are well covered." },
            { h: "Some global apps are restricted", p: "Google, WhatsApp, Instagram and others do not work on mainland networks. Download maps, translations and documents before departure — we brief every guest on what works and what to prepare." },
            { h: "Translation is solved", p: "Alipay and WeChat have built-in translation; so does your phone keyboard. Menus and price tags are one tap away from English." }
          ],
          note: ""
        },
        {
          n: "04", id: "around", title: "Getting around", sub: "The world's best trains, plus our cars.",
          cards: [
            { h: "High-speed rail", p: "37,000 km of track. Beijing–Shanghai in under 4.5 hours. Book with your passport on 12306, China's official rail app." },
            { h: "Metro & DiDi", p: "Every major city takes QR entry at metro gates. DiDi is the local ride-hailing app — set it up with Alipay." },
            { h: "Private car with driver", p: "Included in all our journeys for market runs, kiln towns and mountain tea routes." },
            { h: "Domestic flights", p: "Cheap and frequent. We book them for you and keep the schedule honest." }
          ],
          note: ""
        }
      ],
      apps: {
        n: "05", title: "Apps to install before you fly", sub: "Six apps cover 95% of travel friction.",
        items: [
          ["Alipay", "Payments + translation + ride-hailing + rail tickets in one place."],
          ["WeChat", "The default way Chinese partners communicate — and how you'll stay in touch with your guide."],
          ["12306", "Official rail booking. Register with your passport number."],
          ["Amap (高德地图)", "Chinese maps, far more accurate than foreign ones inside China."],
          ["DiDi", "Ride-hailing with English interface."],
          ["Your bank's app", "Enable international payments and notify your bank before departure."]
        ],
        note: "Install before departure — some app stores switch content by region."
      },
      phrases: {
        n: "06", title: "Etiquette & quick phrases", sub: "Eight phrases and five habits that open doors.",
        cols: ["Phrase", "Pinyin", "What it means"],
        meanings: ["Hello", "Thank you", "How much?", "Too expensive", "Can you come down a bit?", "Cheers — bottoms up", "No chili, please", "I don't eat pork"],
        tips: [
          "When clinking glasses, keep your rim slightly lower than your host's — a quiet sign of respect.",
          "Give and receive business cards and gifts with both hands.",
          "Never leave chopsticks standing upright in a bowl of rice.",
          "In business: add each other on WeChat first, negotiate second — the relationship comes before the transaction.",
          "Halal food is easy to find in major cities — just tell us in advance and we plan menus accordingly."
        ]
      },
      faq: {
        n: "07", title: "Frequently asked", sub: "What our guests ask before every trip.",
        items: [
          ["Do I really need cash?", "Barely. Once Alipay is linked, 95% of places accept QR. Carry ¥300–500 for small towns and markets."],
          ["Will my credit card work everywhere?", "Hotels and big malls, yes. Small merchants, markets and rural areas are QR or cash only."],
          ["Is English widely spoken?", "In tier-1 city hotels and attractions, yes. In markets and factory towns, no — which is exactly what your bilingual guide is for."],
          ["Can you help with invitation letters?", "Yes. Tell the assistant your travel purpose and dates — we issue letters within 48 hours."],
          ["When should I book?", "Avoid Golden Week (Oct 1–7) and Chinese New Year if you can. For custom journeys, 8+ weeks ahead is ideal."]
        ]
      },
      cta: {
        eyebrow: "READY?",
        title: "Practical side sorted? Now design the journey.",
        sub: "Tell the assistant your interests, dates and budget — a real planner reads every answer and replies within 24 hours.",
        btn1: "Open the assistant",
        btn2: "Back to SINOWAYS"
      },
      foot: { rights: "© 2026 SINOWAYS 深行中国. All rights reserved.", note: "Policy information is for reference only; official announcements prevail." }
    },

    zh: {
      meta: { title: "SINOWAYS — 外国游客来华指南", desc: "签证、支付、电话卡、火车与应用——行前把来华的实际事务全部理清。" },
      backSite: "← 返回官网",
      hero: {
        eyebrow: "来华实用指南",
        t1: "要来中国？",
        t2: "从这里开始。",
        sub: "入境政策、支付、电话卡、火车与应用——行前把实际事务全部理清。"
      },
      sections: [
        {
          n: "01", id: "entry", title: "入境与签证", sub: "大多数旅客根本不需要签证。",
          cards: [
            { h: "30 天免签入境", p: "50 多个国家的公民——含欧盟大部分国家、英国、爱尔兰、瑞士、澳大利亚、新西兰、日本、韩国、新加坡、马来西亚、巴西、俄罗斯与海湾多国——可免签入境停留 30 天（试行政策，目前至 2026 年底有效）。" },
            { h: "240 小时过境免签", p: "57 国旅客持前往第三国（地区）的联程客票（含中国香港、中国澳门），可经 65 个指定口岸入境，在规定区域内停留不超过 10 天——足够一次深度游或找货行程。" },
            { h: "海南 30 天入境免签", p: "61 国公民经海南批准口岸入境，可免签停留 30 天，适用商务与旅游。" },
            { h: "仍需签证？", p: "我们提供商务签证邀请函、行程单据与代办支持，也协助口岸签证与团组入境——在助手里说明目的，48 小时内响应。" }
          ],
          note: "政策会调整，出发前请以就近的中国使领馆或国家移民管理局公告为准（信息截至 2026 年 11 月）。"
        },
        {
          n: "02", id: "money", title: "支付与货币", sub: "中国以扫码为主，外卡已可直接绑定。",
          cards: [
            { h: "支付宝 / 微信支付支持外卡", p: "几分钟即可绑定 Visa、Mastercard、Amex 或 JCB。从街头小吃到批发订金，扫码几乎万能。" },
            { h: "现金仍然有用", p: "在小镇与市场备些人民币；可在机场银行兑换，或用支持外卡的 ATM 取现。" },
            { h: "没有小费文化", p: "餐厅、出租车、酒店都不需要给小费。" },
            { h: "价格与发票", p: "批发与零售是两个世界——提前告诉我们你要什么、要多少。进口需要正规发票（fapiao），我们确保你拿到。" }
          ],
          note: ""
        },
        {
          n: "03", id: "connect", title: "通讯与网络", sub: "出发前把这些配好。",
          cards: [
            { h: "出发前买好 eSIM", p: "国际 eSIM（Airalo、Holafly 等）落地即用；也可凭护照在机场柜台办理中国联通 / 电信游客卡。" },
            { h: "公共 Wi-Fi 遍布", p: "酒店、咖啡馆、高铁与机场覆盖良好。" },
            { h: "部分国际应用受限", p: "Google、WhatsApp、Instagram 等在内地网络不可用。地图、翻译与所需文件请提前下载——我们会在行前为每位客人做详细说明。" },
            { h: "翻译不是问题", p: "支付宝、微信内置翻译，手机键盘同样支持；菜单与价签一键译成英文。" }
          ],
          note: ""
        },
        {
          n: "04", id: "around", title: "市内与城际交通", sub: "世界最好的高铁网，加上我们的专车。",
          cards: [
            { h: "高铁", p: "3.7 万公里运营里程，北京到上海 4.5 小时以内；12306 官方 App 支持护照注册购票。" },
            { h: "地铁与滴滴", p: "大城市地铁支持扫码进站；滴滴是本地打车应用，用支付宝即可叫车。" },
            { h: "专车随行", p: "我们的行程均含司兼导专车，直达市场、窑口与茶山。" },
            { h: "国内航班", p: "便宜且密集，由我们代订，行程安排不绕路。" }
          ],
          note: ""
        }
      ],
      apps: {
        n: "05", title: "出发前必装应用", sub: "六个应用解决 95% 的旅行摩擦。",
        items: [
          ["支付宝 Alipay", "支付 + 翻译 + 打车 + 火车票，一站搞定。"],
          ["微信 WeChat", "与中国伙伴沟通的默认工具，也与你的导游保持联系。"],
          ["12306", "火车票官方购票，支持护照注册。"],
          ["高德地图 Amap", "中文地图，在华精度远高于境外地图。"],
          ["滴滴 DiDi", "打车，带英文界面。"],
          ["你的银行 App", "开通国际支付，并在出发前告知银行行程。"]
        ],
        note: "出发前装好：部分应用商店会随账号区域改变内容。"
      },
      phrases: {
        n: "06", title: "礼仪与常用语", sub: "八句话、五个习惯，帮你打开局面。",
        cols: ["短语", "拼音", "适用场景"],
        meanings: ["打招呼", "道谢", "问价", "砍价起手", "继续砍价", "举杯共饮", "点菜忌口", "饮食禁忌"],
        tips: [
          "碰杯时杯沿略低于主人或长辈，是不动声色的敬意。",
          "收递名片与礼品用双手。",
          "筷子不要竖插在米饭里。",
          "谈生意先加微信、后谈价——关系先于交易。",
          "大城市清真餐饮容易找——提前告诉我们，菜单照此安排。"
        ]
      },
      faq: {
        n: "07", title: "常见问题", sub: "每次出发前客人最关心的几件事。",
        items: [
          ["一定要带现金吗？", "不必多。绑定支付宝后 95% 的场景都能扫码；备 300–500 元现金应对小镇与市场。"],
          ["信用卡到处能用吗？", "酒店与大商场可以；小商户、市场与乡村基本只收扫码或现金。"],
          ["英语通用吗？", "一线城市酒店与景区可以；市场与工厂不行——这正是双语导游的价值所在。"],
          ["能帮忙办邀请函吗？", "可以。在助手里说明行程与目的，我们 48 小时内出函。"],
          ["什么时候订最合适？", "尽量避开国庆（10.1–7）与春节；定制行程建议提前 8 周以上。"]
        ]
      },
      cta: {
        eyebrow: "准备好了？",
        title: "行前事项都清楚了？现在开始设计行程。",
        sub: "把你的兴趣、时间与预算告诉预约助手，真实策划人阅读每一项回答并在 24 小时内回应。",
        btn1: "打开预约助手",
        btn2: "返回官网"
      },
      foot: { rights: "© 2026 SINOWAYS 深行中国 · 保留所有权利", note: "政策信息仅供参考，以官方发布为准。" }
    },

    pt: {
      meta: { title: "SINOWAYS — Guia de entrada na China", desc: "Vistos, pagamentos, chip, trens e apps — o lado prático da sua viagem, resolvido antes de embarcar." },
      backSite: "← SINOWAYS.COM",
      hero: {
        eyebrow: "GUIA PRÁTICO DE ENTRADA",
        t1: "Vindo para a China?",
        t2: "Comece aqui.",
        sub: "Regras de entrada, pagamentos, chip, trens e apps — o lado prático da viagem, resolvido antes de embarcar."
      },
      sections: [
        {
          n: "01", id: "entry", title: "Entrada e vistos", sub: "A maioria dos viajantes não precisa de visto.",
          cards: [
            { h: "Entrada sem visto por 30 dias", p: "Cidadãos de mais de 50 países — a maioria da UE, Reino Unido, Irlanda, Suíça, Austrália, Nova Zelândia, Japão, Coreia do Sul, Singapura, Malásia, Brasil, Rússia e países do Golfo — podem entrar na China por até 30 dias sem visto (política em vigor até o fim de 2026)." },
            { h: "Trânsito sem visto de 240 horas", p: "Viajantes de 57 países com bilhete para um terceiro país ou região (Hong Kong e Macau contam) podem entrar por 65 portos designados e ficar até 10 dias nas regiões permitidas — suficiente para uma imersão ou uma viagem de compras no atacado." },
            { h: "Hainan: 30 dias", p: "Cidadãos de 61 países podem ficar até 30 dias em Hainan, a negócios ou a turismo, entrando pelos portos aprovados." },
            { h: "Precisa de visto mesmo assim?", p: "Emitimos cartas-convite, comprovantes de itinerário e apoio a vistos de negócios, vistos de porto e entradas em grupo — diga ao assistente o propósito e respondemos em 48 horas." }
          ],
          note: "As políticas mudam — confirme com o consulado chinês mais próximo ou a Administração Nacional de Imigração. Atualizado em novembro de 2026."
        },
        {
          n: "02", id: "money", title: "Pagamentos", sub: "A China é QR-first, e cartões estrangeiros funcionam.",
          cards: [
            { h: "Alipay e WeChat Pay aceitam cartões estrangeiros", p: "Vincule Visa, Mastercard, Amex ou JCB em minutos. QR paga quase tudo, do street food ao sinal de encomenda no atacado." },
            { h: "Dinheiro ainda conta", p: "Leve RMB para cidades pequenas e mercados; troque no aeroporto ou saque em caixas que aceitam cartões estrangeiros." },
            { h: "Sem gorjetas", p: "Não se espera gorjeta em restaurantes, táxis ou hotéis." },
            { h: "Preços e notas fiscais", p: "Atacado e varejo são mundos diferentes — diga-nos o que vai comprar e em que volume. Para importar, a fapiao (nota oficial) é essencial; garantimos que você a receba." }
          ],
          note: ""
        },
        {
          n: "03", id: "connect", title: "Conectividade", sub: "Configure antes de embarcar.",
          cards: [
            { h: "eSIM antes da partida", p: "eSIMs internacionais (Airalo, Holafly etc.) funcionam na chegada; ou compre um chip turístico da China Unicom / Telecom no aeroporto com o passaporte." },
            { h: "Wi-Fi público por toda parte", p: "Hotéis, cafés, trens de alta velocidade e aeroportos bem cobertos." },
            { h: "Alguns apps globais são restritos", p: "Google, WhatsApp, Instagram e outros não funcionam na rede continental. Baixe mapas, traduções e documentos antes de embarcar — orientamos cada hóspede sobre o que funciona." },
            { h: "Tradução resolvida", p: "Alipay e WeChat têm tradutor embutido; o teclado do celular também. Menus e etiquetas a um toque do inglês." }
          ],
          note: ""
        },
        {
          n: "04", id: "around", title: "Deslocamento", sub: "Os melhores trens do mundo, mais nossos carros.",
          cards: [
            { h: "Trem-bala", p: "37.000 km de malha; Pequim–Xangai em menos de 4h30. Compre com o passaporte no 12306, o app oficial de trens." },
            { h: "Metrô e DiDi", p: "Entrada por QR nas grandes cidades; DiDi é o aplicativo local de corridas — configure com o Alipay." },
            { h: "Carro privativo", p: "Incluído em todas as nossas jornadas para mercados, cidades dos fornos de cerâmica e rotas do chá." },
            { h: "Voos domésticos", p: "Baratos e frequentes; reservamos para você, sem rodeios no roteiro." }
          ],
          note: ""
        }
      ],
      apps: {
        n: "05", title: "Apps para instalar antes de embarcar", sub: "Seis apps resolvem 95% do atrito da viagem.",
        items: [
          ["Alipay", "Pagamentos + tradução + corridas + bilhetes de trem num só lugar."],
          ["WeChat", "A forma padrão de comunicação dos parceiros chineses — e com o seu guia."],
          ["12306", "Bilheteria oficial de trens. Registre-se com o passaporte."],
          ["Amap (高德地图)", "Mapas em chinês, muito mais precisos que os estrangeiros dentro da China."],
          ["DiDi", "Chame carros com interface em inglês."],
          ["O app do seu banco", "Ative pagamentos internacionais e avise o banco antes de viajar."]
        ],
        note: "Instale antes de embarcar; algumas lojas mudam o conteúdo por região."
      },
      phrases: {
        n: "06", title: "Etiqueta e frases rápidas", sub: "Oito frases e cinco hábitos que abrem portas.",
        cols: ["Frase", "Pinyin", "Significado"],
        meanings: ["Olá", "Obrigado", "Quanto custa?", "Muito caro", "Pode dar um desconto?", "Saúde — até a última gota", "Sem pimenta, por favor", "Não como carne de porco"],
        tips: [
          "Ao brindar, mantenha a borda do seu copo um pouco abaixo da do anfitrião — um sinal discreto de respeito.",
          "Dê e receba cartões de visita e presentes com as duas mãos.",
          "Nunca deixe os hashi espetados em pé na tigela de arroz.",
          "Nos negócios: adicionem-se no WeChat primeiro, negociem depois — o relacionamento vem antes da transação.",
          "Comida halal é fácil nas grandes cidades — avise com antecedência e planejamos os menus."
        ]
      },
      faq: {
        n: "07", title: "Perguntas frequentes", sub: "O que nossos hóspedes perguntam antes de cada viagem.",
        items: [
          ["Preciso mesmo de dinheiro vivo?", "Quase não. Com o Alipay vinculado, 95% dos lugares aceitam QR. Leve ¥300–500 para cidades pequenas e mercados."],
          ["Meu cartão funciona em todo lugar?", "Em hotéis e shoppings, sim. Comerciantes pequenos, mercados e áreas rurais: só QR ou dinheiro."],
          ["Inglês é falado por aí?", "Em hotéis e pontos turísticos das grandes cidades, sim. Em mercados e polos fabris, não — para isso existe o seu guia bilíngue."],
          ["Vocês emitem carta-convite?", "Sim. Diga ao assistente o propósito e as datas — emitimos em 48 horas."],
          ["Quando devo reservar?", "Evite a Semana Dourada (1–7/out) e o Ano Novo Chinês. Para jornadas sob medida, 8+ semanas antes é o ideal."]
        ]
      },
      cta: {
        eyebrow: "PRONTO?",
        title: "A parte prática está resolvida? Agora desenhe a jornada.",
        sub: "Conte ao assistente seus interesses, datas e orçamento — um planejador real lê cada resposta e responde em 24 horas.",
        btn1: "Abrir o assistente",
        btn2: "Voltar ao site"
      },
      foot: { rights: "© 2026 SINOWAYS 深行中国. Todos os direitos reservados.", note: "Informações de política apenas para referência; prevalecem os comunicados oficiais." }
    },

    ar: {
      meta: { title: "SINOWAYS — دليل الدخول إلى الصين", desc: "التأشيرات، المدفوعات، شرائح الاتصال، القطارات والتطبيقات — نرتّب الجانب العملي قبل سفرك." },
      backSite: "← SINOWAYS.COM",
      hero: {
        eyebrow: "دليل عملي للقادمين إلى الصين",
        t1: "قادم إلى الصين؟",
        t2: "ابدأ من هنا.",
        sub: "قواعد الدخول، المدفوعات، شرائح الاتصال، القطارات والتطبيقات — نرتّبها قبل أن تسافر."
      },
      sections: [
        {
          n: "01", id: "entry", title: "الدخول والتأشيرات", sub: "معظم المسافرين لا يحتاجون تأشيرة أصلاً.",
          cards: [
            { h: "دخول بدون تأشيرة لـ 30 يوماً", p: "مواطنو أكثر من 50 دولة — معظم دول الاتحاد الأوروبي وبريطانيا وأيرلندا وسويسرا وأستراليا ونيوزيلندا واليابان وكوريا الجنوبية وسنغافورة وماليزيا والبرازيل وروسيا ودول الخليج — يمكنهم دخول الصين حتى 30 يوماً بدون تأشيرة (سياسة سارية حتى نهاية 2026)." },
            { h: "العبور بدون تأشيرة 240 ساعة", p: "مسافرو 57 دولة يحملون تذكرة إلى بلد أو إقليم ثالث (هونغ كونغ وماكاو تُحتسبان) يمكنهم الدخول عبر 65 ميناً معتمداً والبقاء حتى 10 أيام في المناطق المسموح بها — وقت كافٍ لرحلة معمّقة أو رحلة توريد." },
            { h: "هاينان: 30 يوماً", p: "مواطنو 61 دولة يمكنهم البقاء حتى 30 يوماً في جزيرة هاينان للعمل أو السياحة عبر المنافذ المعتمدة." },
            { h: "تحتاج تأشيرة رغم ذلك؟", p: "نصدر خطابات الدعوة ومستندات الرحلة وندعم تأشيرات الأعمال والموانئ ودخول المجموعات — أخبر المساعد بغرض رحلتك ونرد خلال 48 ساعة." }
          ],
          note: "السياسات تتغير — تأكد دائماً من أقرب سفارة صينية أو إدارة الهجرة الوطنية. محدّث حتى نوفمبر 2026."
        },
        {
          n: "02", id: "money", title: "المدفوعات", sub: "التعامل في الصين بالرموز (QR)، والبطاقات الأجنبية مدعومة.",
          cards: [
            { h: "Alipay وWeChat Pay يقبلان البطاقات الأجنبية", p: "اربط Visa أو Mastercard أو Amex أو JCB في دقائق. رمز QR يدفع كل شيء تقريباً، من طعام الشارع إلى عربونات الجملة." },
            { h: "النقد لا يزال مهماً", p: "خذ معك يوانات للمدن الصغيرة والأسواق؛ بدّل في مطار أو اسحب من أجهزة تقبل البطاقات الأجنبية." },
            { h: "لا بقشيش", p: "لا يُتوقع بقشيش في المطاعم أو التاكسي أو الفنادق." },
            { h: "الأسعار والفواتير", p: "الجملة والتجزئة عالمان مختلفان — أخبرنا ماذا ستشتري وبأي كمية. للاستيراد، الفاتورة الرسمية (fapiao) ضرورية؛ نضمن حصولك عليها." }
          ],
          note: ""
        },
        {
          n: "03", id: "connect", title: "الاتصال والإنترنت", sub: "رتّبها قبل السفر.",
          cards: [
            { h: "eSIM قبل المغادرة", p: "شرائح eSIM الدولية (Airalo وHolafly وغيرها) تعمل فور الوصول؛ أو اشترِ شريحة سياحية من China Unicom / Telecom في المطار بجواز سفرك." },
            { h: "واي فاي عام في كل مكان", p: "الفنادق والمقاهي وقطارات السرعة العالية والمطارات مغطاة جيداً." },
            { h: "بعض التطبيقات العالمية محجوبة", p: "جوجل وواتساب وإنستغرام وغيرها لا تعمل داخل الشبكة. حمّل الخرائط والترجمة ومستنداتك قبل السفر — نوجّه كل ضيف بما يحتاج تحضيره." },
            { h: "الترجمة محلولة", p: "داخل Alipay وWeChat ترجمة مدمجة، ولوحة مفاتيح هاتفك كذلك. القوائم والأسعار على بُعد لمسة من الإنجليزية." }
          ],
          note: ""
        },
        {
          n: "04", id: "around", title: "التنقل", sub: "أفضل شبكة قطارات في العالم، مع سياراتنا.",
          cards: [
            { h: "القطار السريع", p: "37 ألف كم من الخطوط؛ بكين–شنغهاي في أقل من 4.5 ساعات. احجز بجواز سفرك عبر 12306، تطبيق القطارات الرسمي." },
            { h: "المترو وDiDi", p: "دخول المترو برمز QR في المدن الكبرى؛ DiDi هو تطبيق المشاوير المحلي — اربطه بـ Alipay." },
            { h: "سيارة خاصة مع سائق", p: "مشمولة في جميع رحلاتنا لتنقلك إلى الأسواق ومدن الأفران ومسارات الشاي." },
            { h: "رحلات داخلية", p: "رخيصة ومتكررة؛ نحجزها لك ونحافظ على جدول واقعي." }
          ],
          note: ""
        }
      ],
      apps: {
        n: "05", title: "تطبيقات تثبّتها قبل السفر", sub: "ستة تطبيقات تزيل 95% من متاعب السفر.",
        items: [
          ["Alipay", "المدفوعات + الترجمة + المشاوير + تذاكر القطارات في مكان واحد."],
          ["WeChat", "الوسيلة الافتراضية للتواصل مع الشركاء الصينيين — ومع مرشدك."],
          ["12306", "حجز القطارات الرسمي. سجّل برقم جواز سفرك."],
          ["Amap (高德地图)", "خرائط صينية أدق بكثير من الخرائط الأجنبية داخل الصين."],
          ["DiDi", "اطلب سيارة بواجهة إنجليزية."],
          ["تطبيق بنكك", "فعّل المدفوعات الدولية وأخبر بنكك قبل السفر."]
        ],
        note: "ثبّتها قبل المغادرة؛ بعض متاجر التطبيقات تغيّر محتواها حسب المنطقة."
      },
      phrases: {
        n: "06", title: "آداب التعامل وعبارات سريعة", sub: "ثماني عبارات وخمسة عادات تفتح الأبواب.",
        cols: ["العبارة", "Pinyin", "المعنى"],
        meanings: ["مرحباً", "شكراً", "كم السعر؟", "غالٍ جداً", "هل يمكن تخفيض السعر؟", "في صحتك — حتى آخر قطرة", "بدون فلفل حار", "لا آكل لحم الخنزير"],
        tips: [
          "عند النداء، اجعل حافة كأسك أدنى قليلاً من كأس المضيف — علامة احترام صامتة.",
          "سلّم واستلم بطاقات العمل والهدايا باليدين معاً.",
          "لا تترك أعواد الطعام مغروسة في صحن الأرز أبداً.",
          "في العمل: أضف الطرف الآخر على WeChat أولاً ثم تفاوض — العلاقة قبل الصفقة.",
          "الطعام الحلال سهل الوجود في المدن الكبرى — أخبرنا مسبقاً ونرتّب القوائم وفقاً لذلك."
        ]
      },
      faq: {
        n: "07", title: "أسئلة متكررة", sub: "ما يسأل عنه ضيوفنا قبل كل رحلة.",
        items: [
          ["هل أحتاج نقداً فعلاً؟", "بالكاد. بعد ربط Alipay يقبل 95% من الأماكن رموز QR. خذ 300–500 يوان للمدن الصغيرة والأسواق."],
          ["هل تعمل بطاقتي في كل مكان؟", "في الفنادق والمولات نعم؛ التجار الصغار والأسواق والمناطق الريفية: QR أو نقد فقط."],
          ["هل الإنجليزية شائعة؟", "في فنادق ومعالم المدن الكبرى نعم؛ في الأسواق والمدن الصناعية لا — ولهذا يرافقك مرشد ثنائي اللغة."],
          ["هل تصدرون خطاب دعوة؟", "نعم. أخبر المساعد بغرض رحلتك ومواعيدها — نصدره خلال 48 ساعة."],
          ["متى أحجز؟", "تجنّب الأسبوع الذهبي (1–7 أكتوبر) ورأس السنة الصينية؛ للرحلات المخصصة، 8 أسابيع قبلها هو المثالي."]
        ]
      },
      cta: {
        eyebrow: "جاهز؟",
        title: "انتهى الجانب العملي؟ صمّم رحلتك الآن.",
        sub: "أخبر المساعد باهتماماتك ومواعيدك وميزانيتك — مخطط حقيقي يقرأ كل إجابة ويرد خلال 24 ساعة.",
        btn1: "افتح المساعد",
        btn2: "عودة إلى الموقع"
      },
      foot: { rights: "© 2026 SINOWAYS 深行中国. جميع الحقوق محفوظة.", note: "معلومات السياسات للاسترشاد فقط؛ تعتمد الإعلانات الرسمية." }
    }
  };

  /* ---------- 渲染 ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let lang = "en";

  function getInitialLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && window.TRAVEL[q]) return q;
    const saved = localStorage.getItem("sw-lang");
    if (saved && window.TRAVEL[saved]) return saved;
    return "en";
  }

  function render(l) {
    lang = l;
    const d = window.TRAVEL[l] || window.TRAVEL.en;
    const meta = window.LANG_META[l];
    document.documentElement.lang = l;
    document.documentElement.dir = meta.dir;
    document.documentElement.dataset.lang = l;
    localStorage.setItem("sw-lang", l);
    document.title = d.meta.title;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.content = d.meta.desc;

    document.querySelectorAll("[data-lang-btn]").forEach((b) => b.classList.toggle("active", b.dataset.langBtn === l));

    const back = document.getElementById("tv-back");
    if (back) back.textContent = d.backSite;

    const main = document.getElementById("tv-main");
    if (!main) return;
    const sec = (s) => `
      <section class="tv-section" id="${esc(s.id || "")}">
        <div class="tv-head reveal">
          <p class="eyebrow">${esc(s.n)} /</p>
          <h2>${esc(s.title)}</h2>
          <p class="tv-sub">${esc(s.sub)}</p>
        </div>
        <div class="tv-cards">
          ${s.cards.map((c) => `<article class="tv-card reveal"><h3>${esc(c.h)}</h3><p>${esc(c.p)}</p></article>`).join("")}
        </div>
        ${s.note ? `<p class="tv-note reveal">${esc(s.note)}</p>` : ""}
      </section>`;

    const a = d.apps;
    const p = d.phrases;
    const f = d.faq;

    main.innerHTML = `
      <header class="tv-hero">
        <div class="tv-hero-inner">
          <p class="eyebrow light reveal">${esc(d.hero.eyebrow)}</p>
          <h1 class="reveal">${esc(d.hero.t1)}<br><em>${esc(d.hero.t2)}</em></h1>
          <p class="tv-hero-sub reveal">${esc(d.hero.sub)}</p>
        </div>
        <span class="tv-hero-mark reveal" aria-hidden="true">入境指南<br>ENTRY HUB</span>
      </header>

      ${d.sections.map(sec).join("")}

      <section class="tv-section" id="apps">
        <div class="tv-head reveal"><p class="eyebrow">${esc(a.n)} /</p><h2>${esc(a.title)}</h2><p class="tv-sub">${esc(a.sub)}</p></div>
        <ul class="tv-check reveal">
          ${a.items.map((x) => `<li><b>${esc(x[0])}</b><span>${esc(x[1])}</span></li>`).join("")}
        </ul>
        ${a.note ? `<p class="tv-note reveal">${esc(a.note)}</p>` : ""}
      </section>

      <section class="tv-section" id="phrases">
        <div class="tv-head reveal"><p class="eyebrow">${esc(p.n)} /</p><h2>${esc(p.title)}</h2><p class="tv-sub">${esc(p.sub)}</p></div>
        <div class="tv-phrase-wrap reveal">
          <table class="tv-phrases">
            <thead><tr>${p.cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
            <tbody>
              ${PHRASES.map((ph, i) => `<tr><td class="cn">${esc(ph[0])}</td><td class="pi">${esc(ph[1])}</td><td>${esc(p.meanings[i])}</td></tr>`).join("")}
            </tbody>
          </table>
          <ul class="tv-tips">
            ${p.tips.map((x) => `<li>${esc(x)}</li>`).join("")}
          </ul>
        </div>
      </section>

      <section class="tv-section" id="faq">
        <div class="tv-head reveal"><p class="eyebrow">${esc(f.n)} /</p><h2>${esc(f.title)}</h2><p class="tv-sub">${esc(f.sub)}</p></div>
        <div class="tv-faq reveal">
          ${f.items.map((x) => `<details><summary>${esc(x[0])}<i>+</i></summary><p>${esc(x[1])}</p></details>`).join("")}
        </div>
      </section>

      <section class="tv-cta">
        <div class="reveal">
          <p class="eyebrow light">${esc(d.cta.eyebrow)}</p>
          <h2>${esc(d.cta.title)}</h2>
          <p>${esc(d.cta.sub)}</p>
          <div class="tv-cta-btns">
            <button type="button" class="btn btn-solid btn-lg" data-open-assistant><span>${esc(d.cta.btn1)}</span><span class="btn-arrow">↗</span></button>
            <a class="btn btn-ghost btn-lg" href="index.html"><span>${esc(d.cta.btn2)}</span></a>
          </div>
        </div>
      </section>`;

    const foot = document.getElementById("tv-foot");
    if (foot) foot.innerHTML = `<span>${esc(d.foot.rights)}</span><span>${esc(d.foot.note)}</span>`;

    /* 入场动效（复用主站的 .reveal 语义，切换语言时直接可见） */
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }), { threshold: 0.06 });
      main.querySelectorAll(".reveal:not(.in)").forEach((n) => io.observe(n));
      setTimeout(() => main.querySelectorAll(".reveal").forEach((n) => n.classList.add("in")), 4000);
    } else {
      main.querySelectorAll(".reveal").forEach((n) => n.classList.add("in"));
    }
  }

  function init() {
    render(getInitialLang());
    if (window.Assistant) window.Assistant.init(lang);
    document.querySelectorAll("[data-lang-btn]").forEach((b) => b.addEventListener("click", () => {
      render(b.dataset.langBtn);
      if (window.Assistant) window.Assistant.setLang(b.dataset.langBtn);
    }));
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open-assistant]");
      if (btn && window.Assistant) { e.preventDefault(); window.Assistant.open(); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
