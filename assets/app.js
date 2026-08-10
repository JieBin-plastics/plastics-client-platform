/* 改性塑料海外客户开发平台 - 交互逻辑 */
(function () {
  var companies = window.PLASTIC_COMPANIES || [];
  var countryChannels = window.COUNTRY_CHANNELS || {};
  var state = { q: "", region: "全部", country: "全部" };

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ---------- 统计 ---------- */
  function renderStats() {
    var countries = {};
    companies.forEach(function (c) { countries[c.country] = true; });
    $("#stat-companies").textContent = companies.length;
    $("#stat-countries").textContent = Object.keys(countries).length;
    var withPhone = companies.filter(function (c) { return c.phone; }).length;
    var withWA = companies.filter(function (c) { return c.whatsapp; }).length;
    var withLinkedIn = companies.filter(function (c) { return c.linkedin; }).length;
    $("#stat-channels").textContent = (withPhone + withWA + withLinkedIn) + "+";
  }

  /* ---------- 国家下拉 ---------- */
  function buildCountrySelect() {
    var regions = ["全部", "亚太", "欧洲", "中东", "非洲", "美洲"];
    var countries = {};
    companies.forEach(function (c) {
      if (state.region === "全部" || c.region === state.region) countries[c.country] = true;
    });
    var sel = $("#filter-country");
    sel.innerHTML = "";
    var opt0 = document.createElement("option");
    opt0.value = "全部"; opt0.textContent = "全部国家";
    sel.appendChild(opt0);
    Object.keys(countries).sort().forEach(function (cn) {
      var o = document.createElement("option");
      o.value = cn; o.textContent = cn;
      sel.appendChild(o);
    });
    if (!Object.keys(countries).includes(state.country)) state.country = "全部";
    sel.value = state.country;
  }

  /* ---------- 过滤 ---------- */
  function getFiltered() {
    var q = state.q.trim().toLowerCase();
    return companies.filter(function (c) {
      if (state.region !== "全部" && c.region !== state.region) return false;
      if (state.country !== "全部" && c.country !== state.country) return false;
      if (!q) return true;
      var hay = (c.name + " " + c.country + " " + c.city + " " + c.region + " " +
        c.business + " " + (c.products || []).join(" ") + " " + (c.industries || []).join(" ")).toLowerCase();
      return q.split(/\s+/).every(function (kw) { return hay.indexOf(kw) > -1; });
    });
  }

  /* ---------- 复制 ---------- */
  function copyText(text, btn) {
    var done = function () {
      var old = btn.textContent;
      btn.textContent = "✓ 已复制";
      btn.classList.add("copied");
      setTimeout(function () { btn.textContent = old; btn.classList.remove("copied"); }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallback(text, done); });
    } else { fallback(text, done); }
  }
  function fallback(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { alert("复制失败，请手动选择文本复制"); }
    document.body.removeChild(ta);
  }
  function waLink(whatsapp) {
    var d = whatsapp.replace(/[^\d]/g, "");
    return "https://wa.me/" + d;
  }

  /* ---------- 卡片渲染 ---------- */
  function tagList(arr, cls) {
    return (arr || []).map(function (t) { return '<span class="tag ' + cls + '">' + esc(t) + "</span>"; }).join("");
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
  function channelHtml(c) {
    var html = "";
    if (c.website) html += '<a class="ch chip" href="' + esc(c.website) + '" target="_blank" rel="noopener"><span class="ch-ico">🌐</span>官网</a>';
    if (c.phone) html += '<a class="ch chip" href="tel:' + esc(c.phone.replace(/[^\d+]/g, "")) + '"><span class="ch-ico">📞</span>' + esc(c.phone) + "</a>";
    if (c.whatsapp) html += '<a class="ch chip wa" href="' + waLink(c.whatsapp) + '" target="_blank" rel="noopener"><span class="ch-ico">💬</span>WhatsApp ' + esc(c.whatsapp) + "</a>";
    if (c.linkedin) html += '<a class="ch chip" href="' + esc(c.linkedin) + '" target="_blank" rel="noopener"><span class="ch-ico">🔗</span>LinkedIn</a>';
    if (c.b2b) {
      var bUrl = /^https?:\/\//i.test(c.b2b) ? c.b2b : null;
      html += bUrl
        ? '<a class="ch chip" href="' + esc(bUrl) + '" target="_blank" rel="noopener"><span class="ch-ico">🏪</span>B2B商铺</a>'
        : '<span class="ch chip"><span class="ch-ico">🏪</span>' + esc(c.b2b) + "</span>";
    }
    if (c.platforms && c.platforms.length) {
      html += '<div class="plat-line">联系平台：' + c.platforms.map(function (p) { return "<span>" + esc(p) + "</span>"; }).join("") + "</div>";
    }
    return html;
  }
  function waBlock(c, idx) {
    return '<div class="dev-item wa-item">' +
      '<div class="dev-head"><span class="dev-badge wa">💬 WhatsApp 开发词</span>' +
      '<button class="copy-btn" data-target="wa-' + idx + '">复制</button></div>' +
      '<pre class="dev-text" id="wa-' + idx + '">' + esc(c.wa) + "</pre></div>";
  }
  function mailBlock(c, idx) {
    var full = "Subject: " + c.mail.subject + "\n\n" + c.mail.body;
    return '<div class="dev-item mail-item">' +
      '<div class="dev-head"><span class="dev-badge mail">✉️ 邮箱开发信</span>' +
      '<button class="copy-btn" data-target="mail-' + idx + '">复制</button></div>' +
      '<div class="mail-subj">' + esc(c.mail.subject) + "</div>" +
      '<pre class="dev-text" id="mail-' + idx + '">' + esc(full) + "</pre></div>";
  }

  function cardHtml(c) {
    var cc = countryChannels[c.country];
    var waTag = cc ? '<span class="wa-level wa-' + (cc.wa === "极高" ? 3 : cc.wa === "高" ? 2 : 1) + '">WhatsApp渗透率：' + esc(cc.wa) + "</span>" : "";
    return '<article class="card">' +
      '<div class="card-top">' +
        '<div class="card-idx">' + String(c.id).padStart(2, "0") + "</div>" +
        '<div class="card-title-wrap">' +
          '<h3 class="card-title">' + esc(c.name) + "</h3>" +
          '<div class="card-meta"><span class="meta-region">' + esc(c.region) + '</span><span class="meta-city">📍 ' + esc(c.city) + ', ' + esc(c.country) + "</span></div>" +
        "</div>" +
      "</div>" +
      '<div class="card-channels">' + channelHtml(c) + "</div>" +
      '<p class="card-biz">' + esc(c.business) + "</p>" +
      '<div class="card-tags"><span class="tag-label">主营产品</span>' + tagList(c.products, "prod") +
        '<span class="tag-label">下游行业</span>' + tagList(c.industries, "ind") + "</div>" +
      '<div class="card-tip"><span class="tip-ico">📌</span><strong>联系提示：</strong>' + esc(c.tip) +
        (waTag ? "　" + waTag : "") + "</div>" +
      '<div class="dev-zone">' +
        '<div class="dev-title"><span class="dev-title-ico">🎯</span>定制开发词（针对' + esc(c.name) + "）</div>" +
        '<div class="kw-row">' + c.keywords.map(function (k) { return '<button class="kw-chip" data-kw="' + esc(k) + '">' + esc(k) + "</button>"; }).join("") + "</div>" +
        waBlock(c, c.id) +
        mailBlock(c, c.id) +
      "</div>" +
    "</article>";
  }

  function render() {
    var list = getFiltered();
    var wrap = $("#results");
    $("#result-count").textContent = list.length;
    $("#result-total").textContent = companies.length;
    if (!list.length) {
      wrap.innerHTML = '<div class="empty">😕 没有找到匹配的公司，试试输入其他国家/城市，例如：德国、首尔、圣保罗、曼谷、伊斯坦布尔</div>';
      return;
    }
    wrap.innerHTML = list.map(cardHtml).join("");
    /* 绑定复制 */
    $$(".copy-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var el = document.getElementById(b.getAttribute("data-target"));
        if (el) copyText(el.textContent, b);
      });
    });
    /* 开发词chip点击→填入搜索框（用于组合搜索） */
    $$(".kw-chip").forEach(function (k) {
      k.addEventListener("click", function () {
        $("#search").value = k.getAttribute("data-kw");
        state.q = k.getAttribute("data-kw");
        render();
      });
    });
  }

  /* ---------- 事件绑定 ---------- */
  function bind() {
    $("#search").addEventListener("input", function () { state.q = this.value; render(); });
    $$(".region-chip").forEach(function (ch) {
      ch.addEventListener("click", function () {
        $$(".region-chip").forEach(function (x) { x.classList.remove("active"); });
        ch.classList.add("active");
        state.region = ch.getAttribute("data-region");
        buildCountrySelect();
        render();
      });
    });
    $("#filter-country").addEventListener("change", function () { state.country = this.value; render(); });
    $("#clear-filters").addEventListener("click", function () {
      state = { q: "", region: "全部", country: "全部" };
      $("#search").value = "";
      $$(".region-chip").forEach(function (x) { x.classList.remove("active"); });
      $("#region-all").classList.add("active");
      buildCountrySelect();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    /* 平台卡片 */
    var pWrap = $("#platforms-grid");
    pWrap.innerHTML = (window.PLATFORMS || []).map(function (p) {
      return '<a class="plat-card" href="' + esc(p.link) + '" target="_blank" rel="noopener">' +
        '<div class="plat-name">' + esc(p.name) + "</div>" +
        '<div class="plat-desc">' + esc(p.desc) + "</div>" +
        '<div class="plat-go">前往平台 →</div></a>';
    }).join("");
    /* 开发信技巧 */
    var tWrap = $("#tips-list");
    tWrap.innerHTML = (window.OUTREACH_TIPS || []).map(function (t, i) {
      return '<div class="tip-item"><div class="tip-num">' + (i + 1) + "</div><div><strong>" + esc(t.t) + "</strong><p>" + esc(t.d) + "</p></div></div>";
    }).join("");
    /* 国家渠道偏好表 */
    var cTb = $("#channel-table");
    if (cTb) {
      cTb.innerHTML = Object.keys(countryChannels).sort().map(function (cn) {
        var c = countryChannels[cn];
        var cls = c.wa === "极高" ? "wa-high" : (c.wa === "高" || c.wa === "中高" ? "wa-mid" : "wa-low");
        return "<tr><td><strong>" + esc(cn) + "</strong></td>" +
          '<td><span class="wa-badge ' + cls + '">' + esc(c.wa) + "</span></td>" +
          "<td>" + esc(c.note) + "</td></tr>";
      }).join("");
    }
    /* 大市场数据报表 */
    var mkt = [
      { rank: 1, country: "中国", size: "产量占全球34.5%（≈149Mt）", feature: "全球最大生产国，向改性/高端转型", src: "PlasticsEurope/Statista" },
      { rank: 2, country: "美国", size: "产量约5900万吨；产值近3800亿美元", feature: "全球第二，树脂贸易顺差", src: "ACC/Statista" },
      { rank: 3, country: "德国", size: "行业营业额超970亿欧元", feature: "欧洲最大，高端/工程塑料为主", src: "GTAI/VCI" },
      { rank: 4, country: "日本", size: "产量839.6万吨（2024）", feature: "产量萎缩但特种/改性材料强", src: "JPIF" },
      { rank: 5, country: "印度", size: "市场规模约437-468亿美元", feature: "CAGR 6.2-6.6%，全球增速最快之一", src: "Mordor/IMARC" },
      { rank: 6, country: "韩国", size: "市场规模133-176亿美元", feature: "CAGR约7%，高端改性/电子塑料强", src: "IMARC/MRFR" },
      { rank: 7, country: "意大利", size: "市场需求457亿美元", feature: "欧洲第二，出口驱动", src: "Euromonitor" },
      { rank: 8, country: "巴西", size: "产量约700万吨；市场规模132-143亿美元", feature: "拉美最大市场，CAGR 3.8-4.5%", src: "Grand View" },
      { rank: 9, country: "土耳其", size: "产量超1000万吨；营业额约450亿美元", feature: "欧洲第2/全球第6，中国为其最大原料来源(26.6%)", src: "PLASFED" },
      { rank: 10, country: "俄罗斯", size: "市场规模119.3亿美元", feature: "CAGR 3.8%，本土石化为主", src: "MRFR" },
      { rank: 11, country: "墨西哥", size: "市场规模149亿美元", feature: "全球第11大生产国，受益近岸外包", src: "MRFR/GMI" },
      { rank: 12, country: "泰国", size: "市场规模约70亿美元；消费643万吨", feature: "东南亚配混市场第一(占25.5%)", src: "Grand View/Mordor" },
      { rank: 13, country: "印度尼西亚", size: "市场规模78.4亿美元；消费700-800万吨", feature: "东南亚最大消费国，人均17kg潜力大", src: "IMARC/Kantor" },
      { rank: 14, country: "越南", size: "行业规模320亿美元；年消费约1120万吨", feature: "东南亚最快CAGR 8.35%，80-85%原料依赖进口", src: "VPA/Mordor" },
      { rank: 15, country: "马来西亚", size: "市场规模41.9亿美元", feature: "电子/清真包装枢纽，出口导向", src: "Mordor" },
      { rank: 16, country: "菲律宾", size: "市场规模32亿美元；年进口超20亿美元", feature: "加工活跃但上游薄弱，进口依赖高", src: "Mordor/GMI" },
      { rank: 17, country: "尼日利亚", size: "消费量125万吨（2022）", feature: "非洲第二大进口国，需求CAGR 7.1%", src: "GMI/UN" },
      { rank: 18, country: "埃及", size: "塑料进口43.9亿美元", feature: "非洲最大进口国之一，初级塑料70%依赖进口", src: "ReportLinker" },
      { rank: 19, country: "巴基斯坦", size: "塑料进口29.1亿美元", feature: "高进口依赖，中国为主要供应商(部分品类86%)", src: "ReportLinker/UN Comtrade" },
      { rank: 20, country: "孟加拉", size: "市场规模约29.9亿美元；进口24亿美元", feature: "成衣/包装驱动，年增速快", src: "Invest Bangladesh" }
    ];
    var mG = $("#market-grid");
    if (mG) {
      mG.innerHTML = [
        { t: "全球改性塑料规模", d: "Plastic Compounding 2023年约672亿美元，预计2030年达1120亿美元（CAGR 7.4%）", s: "Grand View Research" },
        { t: "亚太占比第一", d: "改性塑料/配混市场亚太占40-49%，且为增速最快区域（CAGR 6-9%）", s: "Grand View/VMR" },
        { t: "东南亚首选三市场", d: "按消费量：印尼 > 越南 > 泰国；按增速：越南 > 印尼/菲律宾", s: "Mordor/IMARC" },
        { t: "进口依赖最高区域", d: "越南(80-85%)、埃及/尼日利亚(70%)、菲律宾、巴基斯坦/孟加拉——中国出口切入点", s: "VPA/MDPI/UN" }
      ].map(function (c) {
        return '<div class="mkt-card"><div class="mkt-t">' + esc(c.t) + "</div><div class='mkt-d'>" + esc(c.d) + '</div><div class="mkt-s">' + esc(c.s) + "</div></div>";
      }).join("");
    }
    var mT = $("#market-table");
    if (mT) {
      mT.innerHTML = mkt.map(function (m) {
        return "<tr><td>" + m.rank + "</td><td><strong>" + esc(m.country) + "</strong></td><td>" + esc(m.size) + "</td><td>" + esc(m.feature) + "</td><td>" + esc(m.src) + "</td></tr>";
      }).join("");
    }
    var mTips = $("#market-tips");
    if (mTips) {
      mTips.innerHTML = '<div class="mkt-note">💡 <strong>开发优先级建议：</strong>越南 &gt; 印度尼西亚 &gt; 尼日利亚/埃及 &gt; 菲律宾 &gt; 巴基斯坦/孟加拉 &gt; 巴西/墨西哥。中国已是多国最大塑料原料供应方（土耳其26.6%、巴西45.8%等），出口切入具备既有贸易基础。东南亚重点用WhatsApp直连（渗透率高），数据口径为2023-2026年公开研究机构数据，供选市场参考。</div>';
    }
  }

  renderStats();
  buildCountrySelect();
  bind();
  render();
})();
