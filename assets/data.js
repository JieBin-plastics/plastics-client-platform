/* 数据合并 + 国家渠道偏好 + 自动开发词生成器（2026-08调研） */
(function () {
  var ASIA = window.COMPANY_ASIA || [];
  var EU = window.COMPANY_EUROPE || [];
  var AM = window.COMPANY_AMERICAS || [];
  var EXT = (window.COMPANY_EXT1 || []).concat(window.COMPANY_EXT2 || [], window.COMPANY_EXT3 || [], window.COMPANY_EXT4 || [],
    window.COMPANY_EXT5 || [], window.COMPANY_EXT6 || [], window.COMPANY_EXT7 || [], window.COMPANY_EXT8 || [],
    window.COMPANY_EXT9 || [], window.COMPANY_EXT10 || [], window.COMPANY_EXT11 || [], window.COMPANY_EXT12 || [],
    window.COMPANY_EXT13 || [], window.COMPANY_EXT14 || [], window.COMPANY_EXT15 || [],
    window.COMPANY_EXT16 || [], window.COMPANY_EXT17 || [], window.COMPANY_EXT18 || [],
    window.COMPANY_EXT19 || [], window.COMPANY_EXT20 || [], window.COMPANY_EXT21 || [],
    window.COMPANY_EXT22 || [], window.COMPANY_EXT23 || [], window.COMPANY_EXT24 || [],
    window.COMPANY_EXT25 || [], window.COMPANY_EXT26 || [], window.COMPANY_EXT27 || []);

  /* 去重（按公司名+国家） */
  var seen = {};
  var ALL = [];
  ASIA.concat(EU, AM, EXT).forEach(function (c) {
    var key = (c.name + "|" + c.country).toLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    ALL.push(c);
  });
  ALL.forEach(function (c, i) { c.id = i + 1; });
  window.PLASTIC_COMPANIES = ALL;

  /* ---------- 自动开发词生成器（为无手写wa/mail的公司生成定制话术） ---------- */
  function pick(arr, n) { return (arr || []).slice(0, n).join(", "); }
  function brand() {
    return "We are a Chinese compounder of modified engineering plastics (PA6/PA66, PC/ABS, FR-ABS, PBT, modified PP) with IATF 16949, UL and RoHS certification, exporting to 30+ countries.";
  }
  function genWa(c) {
    var focus = c.products && c.products.length
      ? "supplying " + pick(c.products, 3)
      : "supplying competitive modified plastics grades";
    return "Hello, we are a Chinese compounder " + focus + " at competitive prices. We noticed " + c.name + "'s business in " + c.city + " and believe there is a good fit for complementary material supply. May I send our catalog and samples?";
  }
  function genMail(c) {
    var focus = c.products && c.products.length
      ? "offering " + pick(c.products, 3)
      : "offering modified engineering plastics (PA, PC/ABS, FR grades, PP compounds)";
    var subj = "Modified plastics supply (" + pick(c.products || ["PA66", "PC/ABS", "FR-PP"], 2) + ") for " + c.name;
    var body =
      "Dear " + c.name + " team,\n\n" +
      "I learned about your operations in " + c.city + ", " + c.country + " — " + c.business + "\n\n" +
      "We are a Chinese compounder " + focus + ", with UL, RoHS/REACH certification and IATF 16949, custom color matching and flexible MOQ (from 500 kg). We provide TDS/MSDS and free samples within 7-10 days, with reliable export logistics to " + c.country + ".\n\n" +
      "May I send our catalog and the datasheet closest to your application? WhatsApp: +86 138 0000 0000.\n\nBest regards";
    return { subject: subj, body: body };
  }
  ALL.forEach(function (c) {
    if (!c.wa) c.wa = genWa(c);
    if (!c.mail) c.mail = genMail(c);
    if (!c.platforms) {
      c.platforms = [];
      if (c.b2b && /^https?:\/\//i.test(c.b2b)) c.platforms.push("B2B商铺");
      if (c.website) c.platforms.push("官网联系");
    }
  });

  /* 各国首选沟通渠道（WhatsApp渗透率口径，含新增国家） */
  window.COUNTRY_CHANNELS = {
    "巴西": { wa: "极高", note: "渗透率85-98%，WhatsApp即国民通讯：报价、寄样、催款全流程走WhatsApp，首选渠道" },
    "墨西哥": { wa: "极高", note: "渗透率>90%，商务沟通默认WhatsApp，官网常直接公开号码" },
    "尼日利亚": { wa: "极高", note: "非洲最大市场之一，WhatsApp渗透率极高，贸易商普遍用WhatsApp报价成交" },
    "肯尼亚": { wa: "极高", note: "M-PESA+WhatsApp是日常商务标配，直连最快" },
    "埃及": { wa: "极高", note: "渗透率极高，官网/B2B商铺普遍直接公开WhatsApp号码" },
    "阿联酋": { wa: "极高", note: "渗透率约90%，本地B2B平台甚至内置一键WhatsApp按钮" },
    "沙特阿拉伯": { wa: "高", note: "渗透率约84%，商务沟通首选WhatsApp" },
    "马来西亚": { wa: "高", note: "互联网用户90.7%月活，企业端采用率东南亚最高" },
    "印度尼西亚": { wa: "高", note: "渗透率65%+，WhatsApp居首，配合本地平台(Indotrading)与印尼语" },
    "土耳其": { wa: "高", note: "使用强度高（月均11.9小时），部分客户转Telegram" },
    "巴基斯坦": { wa: "极高", note: "WhatsApp是B2B默认渠道，贸易商均公开手机号" },
    "孟加拉": { wa: "极高", note: "WhatsApp渗透率极高，本地母粒/再生料厂普遍用WhatsApp对接中国供应商" },
    "斯里兰卡": { wa: "高", note: "WhatsApp+邮件并行，贸易商手机号可直接添加" },
    "尼泊尔": { wa: "中高", note: "WhatsApp常用，手机号可直接添加" },
    "菲律宾": { wa: "高", note: "WhatsApp/Viber通用，分销商多用WhatsApp+邮件" },
    "缅甸": { wa: "中", note: "本地Viber更流行，但贸易商手机号均可加WhatsApp，可直接试探" },
    "柬埔寨": { wa: "中高", note: "手机号多为WhatsApp，中文沟通也常见" },
    "印度": { wa: "中高", note: "WhatsApp+电话是B2B主流，邮件为辅；印度买家极重价格" },
    "越南": { wa: "中", note: "本土首选Zalo（85%+），与国际供应商沟通用WhatsApp/邮件" },
    "泰国": { wa: "中", note: "本土首选LINE，国际供应商沟通用WhatsApp/邮件" },
    "韩国": { wa: "中", note: "邮件+官网表单为主，WhatsApp为补充" },
    "日本": { wa: "低", note: "重邮件礼仪，先官网表单+日英双语邮件，电话直呼是大忌" },
    "新加坡": { wa: "中", note: "国际商务邮件首选，WhatsApp作跟进" },
    "澳大利亚": { wa: "中", note: "邮件+电话正式沟通，WhatsApp可用但非首选" },
    "美国": { wa: "中", note: "邮件+LinkedIn+电话为主，WhatsApp做补充" },
    "加拿大": { wa: "中", note: "邮件+电话，WhatsApp做补充" },
    "德国": { wa: "低", note: "重邮件+官网表单+LinkedIn，先正式开发信再跟进" },
    "意大利": { wa: "中", note: "邮件+电话，WhatsApp做补充" },
    "法国": { wa: "中", note: "邮件为主，WhatsApp做补充" },
    "英国": { wa: "中", note: "邮件+LinkedIn为主" },
    "荷兰": { wa: "中", note: "邮件+电话高效沟通" },
    "比利时": { wa: "中", note: "邮件为主，WhatsApp做补充" },
    "波兰": { wa: "中高", note: "WhatsApp使用度高，邮件并行" },
    "西班牙": { wa: "中", note: "邮件+LinkedIn，WhatsApp做补充" },
    "俄罗斯": { wa: "中", note: "Telegram更主流，但WhatsApp也常用；受制裁影响建议先邮件再电话" },
    "乌克兰": { wa: "中高", note: "Telegram/Viber/WhatsApp通用，手机号可直接添加" },
    "罗马尼亚": { wa: "中高", note: "WhatsApp普及，手机号可直接添加" },
    "保加利亚": { wa: "中高", note: "WhatsApp普及，手机号可直接添加" },
    "捷克": { wa: "中", note: "邮件为主，WhatsApp作补充" },
    "斯洛伐克": { wa: "中", note: "邮件为主，WhatsApp作补充" },
    "匈牙利": { wa: "中", note: "邮件+电话，WhatsApp作补充" },
    "希腊": { wa: "中高", note: "WhatsApp普及，手机号可直接添加" },
    "葡萄牙": { wa: "高", note: "WhatsApp普及度高，手机号可直接添加" },
    "塞尔维亚": { wa: "中高", note: "WhatsApp普及，手机号可直接添加" },
    "克罗地亚": { wa: "中高", note: "WhatsApp普及，手机号可直接添加" },
    "瑞典": { wa: "低", note: "邮件为主，正式商务流程" },
    "芬兰": { wa: "低", note: "邮件为主，正式商务流程" },
    "丹麦": { wa: "中", note: "邮件为主，WhatsApp作补充" },
    "挪威": { wa: "低", note: "邮件为主，正式商务流程" },
    "爱尔兰": { wa: "中", note: "邮件+电话，WhatsApp作补充" },
    "奥地利": { wa: "低", note: "邮件为主，正式商务流程" },
    "瑞士": { wa: "低", note: "邮件为主，正式商务流程" },
    "南非": { wa: "高", note: "WhatsApp渗透率高，制造业普遍使用" },
    "摩洛哥": { wa: "高", note: "法语区，WhatsApp普及，分销商公开手机号" },
    "阿尔及利亚": { wa: "高", note: "WhatsApp普及，手机号可直接添加" },
    "突尼斯": { wa: "高", note: "WhatsApp普及，手机号可直接添加" },
    "埃塞俄比亚": { wa: "中高", note: "进口商公开手机号，WhatsApp可直接试探" },
    "加纳": { wa: "高", note: "WhatsApp普及，贸易商普遍使用" },
    "坦桑尼亚": { wa: "高", note: "WhatsApp普及，手机号可直接添加" },
    "以色列": { wa: "中", note: "邮件+电话为主，WhatsApp作补充" },
    "约旦": { wa: "高", note: "WhatsApp普及，手机号可直接添加" },
    "科威特": { wa: "高", note: "海湾国家WhatsApp为首选商务工具" },
    "卡塔尔": { wa: "高", note: "海湾国家WhatsApp为首选商务工具" },
    "阿曼": { wa: "高", note: "海湾国家WhatsApp为首选商务工具" },
    "巴林": { wa: "高", note: "海湾国家WhatsApp为首选商务工具" },
    "黎巴嫩": { wa: "高", note: "WhatsApp普及，手机号可直接添加" },
    "智利": { wa: "高", note: "拉美WhatsApp渗透率高，手机号可直接添加" },
    "秘鲁": { wa: "高", note: "拉美WhatsApp渗透率高，手机号可直接添加" },
    "厄瓜多尔": { wa: "高", note: "拉美WhatsApp渗透率高，手机号可直接添加" },
    "乌拉圭": { wa: "高", note: "拉美WhatsApp渗透率高，手机号可直接添加" },
    "巴拉圭": { wa: "高", note: "拉美WhatsApp渗透率高，手机号可直接添加" },
    "多米尼加": { wa: "高", note: "加勒比/拉美WhatsApp普及，手机号可直接添加" },
    "危地马拉": { wa: "高", note: "中美洲WhatsApp普及，手机号可直接添加" },
    "哥斯达黎加": { wa: "高", note: "中美洲WhatsApp普及，手机号可直接添加" },
    "巴拿马": { wa: "高", note: "中美洲WhatsApp普及，手机号可直接添加" },
    "委内瑞拉": { wa: "高", note: "WhatsApp是主要通讯工具" },
    "玻利维亚": { wa: "高", note: "WhatsApp普及，手机号可直接添加" },
    "哥伦比亚": { wa: "高", note: "拉美WhatsApp渗透率高，电话+WhatsApp直连" },
    "阿根廷": { wa: "高", note: "WhatsApp渗透率高，注意当地进口管制，可谈分销合作" },
    "乌干达": { wa: "高", note: "东非WhatsApp普及，recycleinme等商铺明示WhatsApp联系" },
    "科特迪瓦": { wa: "高", note: "西非法语区，手机号即可加WhatsApp" },
    "喀麦隆": { wa: "高", note: "手机号即可加WhatsApp" },
    "塞内加尔": { wa: "高", note: "手机号即可加WhatsApp，西非门户" },
    "赞比亚": { wa: "高", note: "手机号即可加WhatsApp" },
    "伊朗": { wa: "中", note: "官网常引导WhatsApp询价，但注意制裁与收付款合规" },
    "伊拉克": { wa: "高", note: "库区重建需求大，手机号可加WhatsApp" },
    "叙利亚": { wa: "中", note: "注意合规，手机号可试探" },
    "也门": { wa: "中", note: "市场风险高，谨慎开发" },
    "洪都拉斯": { wa: "高", note: "中美洲WhatsApp普及，官网常公开号码" },
    "萨尔瓦多": { wa: "高", note: "中美洲WhatsApp普及" },
    "尼加拉瓜": { wa: "高", note: "中美洲WhatsApp普及" },
    "波多黎各": { wa: "高", note: "加勒比WhatsApp普及，ScrapMonster商铺可联系" },
    "老挝": { wa: "中", note: "市场小但增长快，手机号可试探WhatsApp" },
    "文莱": { wa: "中", note: "市场小竞争少，手机号可试探" },
    "马尔代夫": { wa: "中", note: "小型市场，邮件+电话为主" },
    "阿富汗": { wa: "高", note: "重建市场，官网明示WhatsApp的公司可直接开发" },
    "卢森堡": { wa: "低", note: "邮件为主，正式商务流程" },
    "爱沙尼亚": { wa: "中高", note: "数字化程度高，手机号可加WhatsApp" },
    "拉脱维亚": { wa: "中高", note: "手机号可加WhatsApp" },
    "立陶宛": { wa: "中高", note: "手机号可加WhatsApp" },
    "斯洛文尼亚": { wa: "中高", note: "手机号可加WhatsApp" },
    "马耳他": { wa: "中", note: "手机号可试探WhatsApp" },
    "塞浦路斯": { wa: "中", note: "邮件+电话为主" },
    "白俄罗斯": { wa: "中", note: "受制裁影响先邮件，注意合规" },
    "摩尔多瓦": { wa: "中高", note: "手机号可加WhatsApp" },
    "阿塞拜疆": { wa: "中高", note: "手机号（+994）可加WhatsApp" },
    "格鲁吉亚": { wa: "中高", note: "手机号（+995）可加WhatsApp" },
    "哈萨克斯坦": { wa: "中高", note: "手机号（+7）可加WhatsApp/Telegram" },
    "乌兹别克斯坦": { wa: "中高", note: "手机号（+998）可加WhatsApp/Telegram" },
    "斐济": { wa: "中", note: "南太市场，电话+邮件为主，手机号可试探WhatsApp" },
    "巴布亚新几内亚": { wa: "高", note: "手机号即可加WhatsApp，与可口可乐等合作回收商活跃" },
    "萨摩亚": { wa: "中", note: "小型市场，Facebook联系为主" },
    "东帝汶": { wa: "中", note: "小型市场，电话+邮件" },
    "津巴布韦": { wa: "高", note: "官网/黄页常公开手机号，可直接WhatsApp" },
    "卢旺达": { wa: "高", note: "手机号即可加WhatsApp" },
    "毛里求斯": { wa: "高", note: "手机号即可加WhatsApp" },
    "莫桑比克": { wa: "高", note: "手机号即可加WhatsApp" },
    "几内亚": { wa: "高", note: "手机号即可加WhatsApp，回收企业活跃" },
    "牙买加": { wa: "高", note: "加勒比手机号（+1-876）默认WhatsApp直连" },
    "圣卢西亚": { wa: "高", note: "加勒比手机号默认WhatsApp" },
    "特立尼达和多巴哥": { wa: "高", note: "加勒比手机号默认WhatsApp" },
    "巴巴多斯": { wa: "高", note: "加勒比手机号默认WhatsApp" },
    "海地": { wa: "高", note: "手机号（+509）即WhatsApp，龙头包装厂活跃" },
    "圭亚那": { wa: "高", note: "手机号（+592）即WhatsApp" },
    "多哥": { wa: "高", note: "西非手机号即WhatsApp，保税区包装厂原料全进口" },
    "贝宁": { wa: "高", note: "手机号即WhatsApp" },
    "布基纳法索": { wa: "高", note: "手机号即WhatsApp" },
    "马里": { wa: "高", note: "手机号即WhatsApp" },
    "尼日尔": { wa: "高", note: "手机号即WhatsApp" },
    "利比里亚": { wa: "中", note: "市场小，D&B目录联系" },
    "塞拉利昂": { wa: "高", note: "手机号即WhatsApp" },
    "博茨瓦纳": { wa: "高", note: "手机号即WhatsApp" },
    "纳米比亚": { wa: "高", note: "手机号即WhatsApp" },
    "安哥拉": { wa: "高", note: "手机号即WhatsApp" },
    "刚果金": { wa: "高", note: "手机号即WhatsApp，回收初创活跃" },
    "刚果布": { wa: "高", note: "手机号即WhatsApp" },
    "布隆迪": { wa: "中", note: "市场小，目录联系" },
    "马达加斯加": { wa: "高", note: "手机号即WhatsApp" },
    "塞舌尔": { wa: "高", note: "官网明示WhatsApp号码" },
    "冈比亚": { wa: "中", note: "回收初创，官网表单联系" },
    "索马里": { wa: "高", note: "手机号即WhatsApp，重建市场" },
    "苏丹": { wa: "高", note: "手机号即WhatsApp，注意风险" },
    "利比亚": { wa: "中", note: "官网表单+邮件" },
    "马拉维": { wa: "高", note: "手机号即WhatsApp" },
    "巴哈马": { wa: "高", note: "加勒比手机号默认WhatsApp" },
    "伯利兹": { wa: "高", note: "中美洲手机号默认WhatsApp" },
    "苏里南": { wa: "高", note: "手机号（+597）即WhatsApp，官网公开高管号码" },
    "古巴": { wa: "高", note: "ETECSA官方黄页公开号码，手机号即WhatsApp，市场空白大" },
    "圣基茨和尼维斯": { wa: "高", note: "加勒比手机号默认WhatsApp" },
    "阿尔巴尼亚": { wa: "中高", note: "手机号（+355）即WhatsApp/Viber" },
    "北马其顿": { wa: "中高", note: "手机号即WhatsApp" },
    "波黑": { wa: "中高", note: "手机号即WhatsApp" },
    "黑山": { wa: "中高", note: "手机号即WhatsApp" },
    "科索沃": { wa: "中高", note: "手机号即WhatsApp" },
    "冰岛": { wa: "低", note: "邮件为主，正式商务流程" },
    "泽西岛": { wa: "中", note: "英国体系，邮件+电话" },
    "根西岛": { wa: "中", note: "英国体系，邮件+电话" },
    "巴勒斯坦": { wa: "高", note: "手机号即WhatsApp，上市公司可核验" },
    "亚美尼亚": { wa: "中高", note: "手机号即WhatsApp" },
    "吉尔吉斯斯坦": { wa: "中高", note: "手机号（+996）可加WhatsApp" },
    "蒙古": { wa: "中高", note: "手机号（+976）可加WhatsApp" },
    "土库曼斯坦": { wa: "中", note: "手机号（+993）可试探WhatsApp，注意合规" },
    "塔吉克斯坦": { wa: "中", note: "minoTJ目录联系，手机号可试探" }
  };

  /* 常用B2B平台速查 */
  window.PLATFORMS = [
    { name: "Alibaba.com", desc: "全球最大B2B，买家流量最大；开通Gold Supplier+主动报RFQ", link: "https://www.alibaba.com" },
    { name: "Made-in-China", desc: "中国工厂集中，适合技术型改性塑料展示", link: "https://www.made-in-china.com" },
    { name: "Global Sources", desc: "供应商验证严格，品质背书渠道，配合线下展会", link: "https://www.globalsources.com" },
    { name: "IndiaMART", desc: "印度最大B2B（2亿+买家），免费入驻抢印度询盘", link: "https://www.indiamart.com" },
    { name: "TradeIndia", desc: "印度第二大B2B，覆盖印度渠道商/贸易商", link: "https://www.tradeindia.com" },
    { name: "ExportHub", desc: "平价替代Alibaba（约500美元/年起），竞争小", link: "https://www.exporthub.com" },
    { name: "Kompass", desc: "全球企业目录：按国家+行业筛选进口商，导出联系方式", link: "https://www.kompass.com" },
    { name: "Plastemart", desc: "塑料行业垂直B2B（107国），竞品少、询盘质量高", link: "https://www.plastemart.com" },
    { name: "Indotrading", desc: "印尼本地B2B，找印尼分销商/代理", link: "https://www.indotrading.com" },
    { name: "TradersFind", desc: "阿联酋最大B2B门户，支持一键Call/一键WhatsApp", link: "https://www.tradersfind.com" },
    { name: "eWorldTrade", desc: "人工撮合服务，适合没有外贸团队的中小企业", link: "https://www.eworldtrade.com" },
    { name: "go4WorldBusiness", desc: "全球贸易商目录，按国家+产品找买家商铺", link: "https://www.go4worldbusiness.com" },
    { name: "LookChem", desc: "化工/塑料化学品B2B，母粒与阻燃剂询盘多", link: "https://www.lookchem.com" },
    { name: "EC21", desc: "韩国起家的亚洲B2B平台，覆盖东南亚/非洲买家", link: "https://www.ec21.com" }
  ];

  /* 开发信黄金结构 */
  window.OUTREACH_TIPS = [
    { t: "Subject 3-7个词", d: "点出对方业务+价值，如 Modified PA66 for automotive connectors；避免free/guaranteed等垃圾词" },
    { t: "四段式正文（200词内）", d: "①为什么找到你（引用具体信号）→②价值主张（牌号匹配+认证）→③证据（IATF/UL/RoHS+年出口量）→④单一低门槛CTA" },
    { t: "一个CTA", d: "只问一个问题：'是否方便发产品目录+TDS？' 附上WhatsApp号作为备选回复渠道" },
    { t: "3-5天后跟进", d: "换角度跟进：送行业资讯/认证证书/样品；再隔用'Who handles material sourcing?'找对人" },
    { t: "WhatsApp首条消息", d: "3-4句内讲清身份+来源+价值点，附wa.me链接让客户一键打开产品目录，别一上来发大附件" }
  ];
})();
