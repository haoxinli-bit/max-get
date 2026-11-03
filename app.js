const STORAGE_KEYS = {
  requirements: "maxget.requirements.v1",
  prd: "maxget.prd.v1",
};

const seedRequirements = [
  {
    id: "req-101",
    title: "优化新用户首次使用引导",
    description: "新注册用户进入首页后不清楚从哪里开始，关键功能发现率偏低。希望通过更轻量的引导帮助用户快速完成第一个有价值的操作。",
    source: "数据洞察",
    priority: "高",
    status: "分析中",
    owner: "林小满",
    initials: "林",
    updated: "今天",
    tags: ["新手体验", "激活"],
  },
  {
    id: "req-102",
    title: "订单状态增加进度时间线",
    description: "用户反馈订单页只能看到当前状态，不知道下一步会发生什么，也无法预估送达时间。希望提供清晰、及时的订单进展信息。",
    source: "用户反馈",
    priority: "高",
    status: "待分析",
    owner: "陈一",
    initials: "陈",
    updated: "2 小时前",
    tags: ["订单体验", "透明度"],
  },
  {
    id: "req-103",
    title: "会员权益页信息层级调整",
    description: "会员权益较多但信息分散，用户很难快速判断会员价值。希望聚合核心权益，并让开通与权益说明更加清晰。",
    source: "业务规划",
    priority: "中",
    status: "分析中",
    owner: "林小满",
    initials: "林",
    updated: "昨天",
    tags: ["会员", "转化"],
  },
  {
    id: "req-104",
    title: "收藏夹支持分类整理",
    description: "重度用户收藏内容变多后难以回找，希望支持自定义分组和更高效的整理方式。",
    source: "用户反馈",
    priority: "中",
    status: "待分析",
    owner: "周可",
    initials: "周",
    updated: "昨天",
    tags: ["效率", "收藏"],
  },
  {
    id: "req-105",
    title: "首页推荐增加兴趣偏好设置",
    description: "推荐内容不够贴合部分用户的实际兴趣，用户希望能主动调整关注主题，并看到设置带来的变化。",
    source: "竞品观察",
    priority: "中",
    status: "已完成",
    owner: "陈一",
    initials: "陈",
    updated: "周一",
    tags: ["个性化", "推荐"],
  },
  {
    id: "req-106",
    title: "消息通知增加免打扰时段",
    description: "用户希望在休息时间减少非紧急通知，同时保留重要订单和账户安全提醒。",
    source: "用户反馈",
    priority: "低",
    status: "已完成",
    owner: "周可",
    initials: "周",
    updated: "周一",
    tags: ["通知", "设置"],
  },
  {
    id: "req-107",
    title: "搜索结果支持多维筛选",
    description: "搜索结果数量较多时，用户需要更快缩小范围，当前筛选条件不足以覆盖常见决策维度。",
    source: "团队想法",
    priority: "中",
    status: "待分析",
    owner: "林小满",
    initials: "林",
    updated: "10 月 28 日",
    tags: ["搜索", "效率"],
  },
  {
    id: "req-108",
    title: "个人资料增加隐私可见范围",
    description: "用户需要更明确地控制个人资料对其他人的可见范围，并理解每种设置的影响。",
    source: "用户反馈",
    priority: "高",
    status: "已完成",
    owner: "陈一",
    initials: "陈",
    updated: "10 月 25 日",
    tags: ["隐私", "信任"],
  },
];

const defaultPrd = {
  title: "会员体验优化 · 产品需求文档",
  summary: "通过优化会员权益展示和开通流程，帮助用户更快理解会员价值，提升会员转化。",
  background: "背景：现有会员权益信息分散，用户难以快速感知核心价值。\n目标用户：有高频使用需求、正在考虑开通会员的活跃用户。\n本次目标：让用户更清楚地理解权益，并顺畅完成开通。",
  scope: "本期范围：\n- 重组权益介绍层级，突出高频权益\n- 优化会员套餐对比和开通入口\n- 增加权益使用场景说明\n\n暂不包含：\n- 会员体系与定价调整",
  flow: "1. 用户从个人中心或权益入口进入会员页\n2. 用户浏览权益亮点与套餐差异\n3. 用户选择套餐并确认支付\n4. 开通成功后查看权益使用指引",
  metrics: "核心指标：会员页到开通的转化率\n观察周期：上线后 2 周\n数据来源：产品分析事件与支付订单",
  risks: "- 待确认问题：权益信息是否需要按用户偏好个性化排序？\n- 依赖与风险：需与会员运营确认权益文案及活动规则。",
};

let requirements = loadRequirements();
let activeFilter = "all";
let selectedRequirementId = requirements[0]?.id ?? null;
let toastTimer;
let prd = loadPrd();

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function loadRequirements() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.requirements);
    if (!saved) return structuredClone(seedRequirements);
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new Error("需求数据格式不正确");
    return parsed;
  } catch (error) {
    console.error("无法读取本地需求数据", error);
    return structuredClone(seedRequirements);
  }
}

function loadPrd() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.prd);
    return saved ? { ...defaultPrd, ...JSON.parse(saved) } : { ...defaultPrd };
  } catch (error) {
    console.error("无法读取本地文档", error);
    return { ...defaultPrd };
  }
}

function saveRequirements() {
  try {
    localStorage.setItem(STORAGE_KEYS.requirements, JSON.stringify(requirements));
  } catch (error) {
    console.error("无法保存需求数据", error);
    showToast("浏览器无法保存数据，请检查本地存储设置。");
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function initialsFor(name) {
  return (name || "我").trim().slice(0, 1);
}

function priorityClass(priority) {
  return priority === "高" ? "high" : priority === "低" ? "low" : "medium";
}

function statusPill(status) {
  return `<span class="status-pill status-${escapeAttribute(status)}">${escapeHtml(status)}</span>`;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function requirementRow(item, full = false) {
  const ownerColor = item.initials === "林" ? "" : item.initials === "陈" ? "owner-2" : "owner-3";
  const dotColor = item.priority === "高" ? "dot-rose" : item.priority === "低" ? "dot-teal" : "dot-amber";
  const cells = full
    ? `<td>${escapeHtml(item.source)}</td><td><span class="priority ${priorityClass(item.priority)}"><i></i>${escapeHtml(item.priority)}</span></td><td>${statusPill(item.status)}</td><td><span class="owner"><span class="owner-avatar ${ownerColor}">${escapeHtml(item.initials || initialsFor(item.owner))}</span>${escapeHtml(item.owner || "林小满")}</span></td><td>${escapeHtml(item.updated)}</td><td><button class="row-actions" aria-label="查看需求">···</button></td>`
    : `<td><span class="priority ${priorityClass(item.priority)}"><i></i>${escapeHtml(item.priority)}</span></td><td>${statusPill(item.status)}</td><td><span class="owner"><span class="owner-avatar ${ownerColor}">${escapeHtml(item.initials || initialsFor(item.owner))}</span>${escapeHtml(item.owner || "林小满")}</span></td><td>${escapeHtml(item.updated)}</td>`;
  return `<tr data-requirement-id="${escapeAttribute(item.id)}"><td class="req-name"><button class="req-link" type="button" aria-label="分析需求：${escapeAttribute(item.title)}"><span class="req-dot ${dotColor}"></span>${escapeHtml(item.title)}</button></td>${cells}</tr>`;
}

function renderRequirements() {
  const overview = $("#overview-requirements");
  const list = $("#requirements-list");
  const sorted = [...requirements];
  overview.innerHTML = sorted.slice(0, 4).map((item) => requirementRow(item)).join("");
  const query = ($("#requirement-search")?.value || "").trim().toLocaleLowerCase();
  const shown = sorted.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.status === activeFilter;
    const searchable = `${item.title} ${item.description} ${item.source} ${item.tags?.join(" ")}`.toLocaleLowerCase();
    return matchesFilter && searchable.includes(query);
  });
  list.innerHTML = shown.map((item) => requirementRow(item, true)).join("");
  $("#empty-requirements").classList.toggle("hidden", shown.length !== 0);
  $("#nav-count").textContent = String(requirements.length);
  $("#filter-all-count").textContent = String(requirements.length);
  $("#stat-total").textContent = String(requirements.length).padStart(2, "0");
  $("#stat-pending").textContent = String(requirements.filter((item) => item.status === "待分析").length).padStart(2, "0");
  $("#stat-prototype").textContent = String(Math.max(2, requirements.filter((item) => item.status === "分析中").length)).padStart(2, "0");
  $("#stat-doc").textContent = String(Math.max(1, requirements.filter((item) => item.status === "已完成").length)).padStart(2, "0");
  const completed = requirements.filter((item) => item.status === "已完成").length;
  const percent = requirements.length ? Math.round((completed / requirements.length) * 100) : 0;
  $("#progress-complete").textContent = String(completed);
  $("#progress-total").textContent = String(requirements.length);
  $("#progress-bar").style.width = `${percent}%`;
  $("#progress-percent").textContent = `${percent}%`;
  refreshPrototypeOptions();
}

function currentRequirement() {
  return requirements.find((item) => item.id === selectedRequirementId) || requirements[0] || null;
}

function renderAnalysis(item) {
  if (!item) {
    showView("requirements");
    showToast("需求池为空，请先创建一条需求。");
    return;
  }
  selectedRequirementId = item.id;
  const title = item.title;
  const text = item.description || "该需求暂时还没有补充问题描述。可以先与用户沟通，补充触发场景与希望达成的结果。";
  const lower = `${title} ${text}`.toLowerCase();
  let problem = "用户在当前体验中遇到阻碍，导致完成目标的时间或理解成本偏高。现阶段仍需要补充具体用户场景、发生频率及现有替代方案。";
  let opportunity = "围绕用户目标简化关键步骤，并在关键节点提供及时、易理解的反馈。先用轻量方案验证价值，再决定是否扩大投入。";
  let metrics = ["目标任务完成率", "关键流程转化率", "用户满意度"];
  if (/订单|物流|状态|进度/.test(lower)) {
    problem = "用户无法清楚判断订单当前所处阶段、接下来会发生什么以及何时可以完成，信息不确定性带来重复查询和焦虑。";
    opportunity = "提供可扫读的阶段时间线、预计时间与异常说明，在重要变化时主动告知，让用户无需反复询问也能掌握进展。";
    metrics = ["订单状态查询率", "物流咨询量", "进度信息满意度"];
  } else if (/会员|权益|开通|支付/.test(lower)) {
    problem = "用户难以快速理解不同权益与套餐的实际价值，信息比较成本偏高，可能因此推迟决策或中途退出。";
    opportunity = "按用户最关心的使用场景组织权益，突出套餐差异和开通后可立即使用的内容，并明确价格与规则。";
    metrics = ["权益页开通转化率", "套餐选择完成率", "开通后权益使用率"];
  } else if (/搜索|筛选|收藏|分类|整理/.test(lower)) {
    problem = "随着内容或选项增加，用户难以缩小范围、组织信息或重新找到目标，重复浏览增加了操作成本。";
    opportunity = "为高频任务提供清晰的分类和筛选入口，并保留用户的组织方式，帮助用户更快定位目标内容。";
    metrics = ["目标内容查找耗时", "搜索后点击率", "重复使用率"];
  } else if (/新用户|引导|首次|注册/.test(lower)) {
    problem = "首次进入的用户尚未形成产品心智，面对较多入口时难以判断第一步，未能及时体验到产品价值。";
    opportunity = "围绕一个高价值任务提供可跳过、可恢复的分步引导，让用户尽早完成首次成功体验，并逐步发现进阶功能。";
    metrics = ["新手任务完成率", "首次核心操作时长", "次日留存率"];
  } else if (/通知|消息|免打扰|提醒/.test(lower)) {
    problem = "通知频率或时机与用户预期不一致，重要消息容易被淹没，打扰感也可能削弱用户对提醒的信任。";
    opportunity = "让用户自主控制通知时段和类别，同时为安全、交易等重要消息提供清晰且稳定的例外规则。";
    metrics = ["通知关闭率", "重要通知触达率", "设置使用率"];
  } else if (/隐私|资料|可见|权限/.test(lower)) {
    problem = "用户不确定个人信息会向谁展示、如何控制，缺少可理解的选择可能影响安全感与分享意愿。";
    opportunity = "用清晰的可见范围选项、即时预览和易懂的解释帮助用户做决定，并提供随时修改的入口。";
    metrics = ["设置完成率", "隐私相关反馈量", "资料分享意愿"];
  }
  const recommendations = [
    ["01", "补充用户证据", "访谈 3–5 位目标用户，确认问题出现的场景、频率及现有解决办法。"],
    ["02", "定义最小验证方案", "明确本期必须解决的一个核心任务，列出关键流程和暂不纳入的范围。"],
    ["03", "设定可观测指标", "上线前确认基线数据、埋点口径与观察周期，便于判断方案是否有效。"],
  ];
  $("#analysis-title").textContent = "需求洞察";
  $("#analysis-summary-title").textContent = title;
  $("#analysis-description").textContent = text;
  $("#analysis-tags").innerHTML = (item.tags?.length ? item.tags : ["待补充场景", "用户价值"]).map((tag) => `<span class="summary-tag">${escapeHtml(tag)}</span>`).join("");
  $("#analysis-problem").textContent = problem;
  $("#analysis-opportunity").textContent = opportunity;
  $("#analysis-metrics").innerHTML = metrics.map((metric) => `<span class="metric-chip">${escapeHtml(metric)}</span>`).join("");
  $("#analysis-recommendations").innerHTML = recommendations.map(([number, heading, body]) => `<article class="recommendation"><span class="recommendation-number">${number} / 建议</span><h3>${heading}</h3><p>${body}</p></article>`).join("");
  $("#detail-priority").innerHTML = `<span class="priority ${priorityClass(item.priority)}"><i></i>${escapeHtml(item.priority)}</span>`;
  $("#detail-status").className = `status-pill status-${escapeAttribute(item.status)}`;
  $("#detail-status").textContent = item.status;
  $("#detail-source").textContent = item.source;
  $("#detail-owner").textContent = item.owner || "林小满";
  $("#detail-date").textContent = item.updated;
  $("#prototype-select").value = item.id;
  $("#prototype-brief").innerHTML = `<strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p>`;
  renderPrototype(item);
}

function refreshPrototypeOptions() {
  const select = $("#prototype-select");
  if (!select) return;
  const previous = select.value || selectedRequirementId;
  select.innerHTML = requirements.map((item) => `<option value="${escapeAttribute(item.id)}">${escapeHtml(item.title)}</option>`).join("");
  if (requirements.some((item) => item.id === previous)) select.value = previous;
  else if (requirements[0]) select.value = requirements[0].id;
  const selected = requirements.find((item) => item.id === select.value);
  if (selected) {
    $("#prototype-brief").innerHTML = `<strong>${escapeHtml(selected.title)}</strong><p>${escapeHtml(selected.description || "补充需求描述后，可以更准确地梳理页面结构。")}</p>`;
    renderPrototype(selected);
  } else {
    $("#prototype-brief").innerHTML = "<p>先创建一条需求，再生成原型概念稿。</p>";
  }
}

function renderPrototype(item) {
  const title = item.title.replace(/[。！？.!?].*$/, "");
  const lower = `${item.title} ${item.description}`.toLowerCase();
  const isOrders = /订单|进度|物流|状态/.test(lower);
  const isMember = /会员|权益|开通/.test(lower);
  const headline = isOrders ? "每一步进展，都清晰可见。" : isMember ? "找到真正适合你的会员权益。" : "让每个重要时刻，都简单一点。";
  const subtitle = isOrders
    ? "查看订单当前状态、预计送达时间和接下来会发生的事。"
    : isMember ? "把高频权益与使用场景放在一起，轻松了解会员价值。" : "从你的目标出发，快速找到需要的信息与下一步操作。";
  const cards = isOrders
    ? [["01", "实时进度", "了解订单当前阶段与更新时间。"], ["◷", "预计送达", "提前掌握预计时间与变化。"], ["↗", "及时提醒", "关键状态变化时主动通知。"]]
    : isMember ? [["✦", "高频权益", "突出日常最常用的会员服务。"], ["▤", "套餐对比", "快速了解不同方案的差异。"], ["✓", "开通即用", "清晰说明开通后的使用方式。"]]
      : [["◎", "快速开始", "从最重要的任务开始完成。"], ["⌕", "清晰发现", "减少查找成本，快速定位目标。"], ["↗", "及时反馈", "每一步操作都有明确结果。"]];
  $("#canvas-title").textContent = title;
  $("#prototype-preview").innerHTML = `<div class="preview-top"><div class="preview-logo"><i>m</i> maxget</div><div class="preview-links"><span>首页</span><span>发现</span><span>帮助</span></div><div class="preview-user"></div></div><div class="preview-main"><div class="preview-hero"><span class="preview-eyebrow">为你打造的体验</span><h2>${escapeHtml(headline)}</h2><p>${escapeHtml(subtitle)}</p><span class="preview-button">立即查看　→</span></div><div class="preview-section-title"><span>${escapeHtml(title)}</span><small>为你的需求设计</small></div><div class="preview-card-grid">${cards.map(([icon, heading, body]) => `<div class="preview-card"><span class="preview-card-icon">${escapeHtml(icon)}</span><strong>${escapeHtml(heading)}</strong><p>${escapeHtml(body)}</p></div>`).join("")}</div></div><div class="preview-bottom"><span>把复杂留给系统，把简单还给用户。</span><span>了解更多 →</span></div>`;
  applyPrototypeControls();
  $("#prototype-updated").textContent = `基于「${title.slice(0, 15)}${title.length > 15 ? "…" : ""}」生成`;
}

function showView(name) {
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === `view-${name}`));
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === name));
  const labels = { overview: "总览", requirements: "需求池", analysis: "需求洞察", prototype: "原型设计", prd: "需求文档" };
  $("#breadcrumb-current").textContent = labels[name] || "总览";
  $("#sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openRequirement(item) {
  renderAnalysis(item);
  showView("analysis");
}

function openModal() {
  $("#requirement-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => $("#input-title").focus(), 30);
}

function closeModal() {
  $("#requirement-modal").classList.add("hidden");
  document.body.style.overflow = "";
  $("#requirement-form").reset();
}

function bindNavigation() {
  $$(".nav-item, [data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      if (view) showView(view);
    });
  });
  $("#mobile-menu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $("#analysis-back").addEventListener("click", () => showView("requirements"));
  $("#analysis-to-prototype").addEventListener("click", () => showView("prototype"));
  $("#aside-to-prototype").addEventListener("click", () => showView("prototype"));
  $("#detail-status").addEventListener("click", () => {
    const item = currentRequirement();
    if (!item) return;
    const statuses = ["待分析", "分析中", "已完成"];
    item.status = statuses[(statuses.indexOf(item.status) + 1) % statuses.length];
    item.updated = "刚刚";
    saveRequirements();
    renderRequirements();
    renderAnalysis(item);
    showToast(`需求状态已更新为「${item.status}」。`);
  });
}

function bindRequirements() {
  $("#new-requirement").addEventListener("click", openModal);
  $("#new-requirement-top").addEventListener("click", openModal);
  $("#quick-new").addEventListener("click", openModal);
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-cancel").addEventListener("click", closeModal);
  $("#requirement-modal").addEventListener("click", (event) => {
    if (event.target === $("#requirement-modal")) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("#requirement-modal").classList.contains("hidden")) closeModal();
  });
  $("#requirement-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "").trim();
    if (!title) {
      $("#input-title").focus();
      return;
    }
    const description = String(formData.get("description") || "").trim();
    const item = {
      id: `req-${Date.now()}`,
      title,
      description,
      source: String(formData.get("source")),
      priority: String(formData.get("priority")),
      status: "待分析",
      owner: "林小满",
      initials: "林",
      updated: "刚刚",
      tags: [],
    };
    requirements.unshift(item);
    selectedRequirementId = item.id;
    saveRequirements();
    renderRequirements();
    closeModal();
    showView("requirements");
    showToast("新需求已添加到需求池。");
  });
  $("#requirement-search").addEventListener("input", renderRequirements);
  $$(".filter-tab").forEach((tab) => tab.addEventListener("click", () => {
    activeFilter = tab.dataset.filter;
    $$(".filter-tab").forEach((button) => button.classList.toggle("active", button === tab));
    renderRequirements();
  }));
  document.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-requirement-id]");
    if (!row) return;
    const item = requirements.find((requirement) => requirement.id === row.dataset.requirementId);
    if (item) openRequirement(item);
  });
}

function bindPrototype() {
  $("#prototype-select").addEventListener("change", (event) => {
    const item = requirements.find((requirement) => requirement.id === event.target.value);
    if (item) {
      selectedRequirementId = item.id;
      $("#prototype-brief").innerHTML = `<strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description || "补充需求描述后，可以更准确地梳理页面结构。")}</p>`;
      renderPrototype(item);
    }
  });
  const generate = () => {
    const item = requirements.find((requirement) => requirement.id === $("#prototype-select").value);
    if (!item) {
      showToast("先创建一条需求，再生成原型预览。");
      return;
    }
    renderPrototype(item);
    showToast("已根据当前需求更新低保真预览。");
  };
  $("#generate-prototype").addEventListener("click", () => {
    const item = currentRequirement();
    if (item) $("#prototype-select").value = item.id;
    generate();
  });
  $("#refresh-prototype").addEventListener("click", generate);
  $("#prototype-expand").addEventListener("click", generate);
  $$(".canvas-tool").forEach((button, index) => button.addEventListener("click", () => {
    $$(".canvas-tool").forEach((tool) => tool.classList.toggle("active", tool === button));
    $("#browser-frame").classList.toggle("mobile-frame", index === 1);
  }));
  $$(".control-item").forEach((item) => item.addEventListener("click", () => {
    item.querySelector(".toggle").classList.toggle("on");
    applyPrototypeControls();
  }));
}

function applyPrototypeControls() {
  $$(".control-item").forEach((control) => {
    const target = $(control.dataset.target, $("#prototype-preview"));
    if (target) target.classList.toggle("hidden", !control.querySelector(".toggle").classList.contains("on"));
  });
}

function prdMarkdown() {
  const value = getPrdFromForm();
  const sections = [
    ["需求概述", value.summary],
    ["背景与目标", value.background],
    ["范围与方案", value.scope],
    ["核心流程", value.flow],
    ["成功指标", value.metrics],
    ["风险与待确认", value.risks],
  ];
  return `# ${value.title}\n\n> 产品需求文档 · MVP v1.0 · 林小满\n\n${sections.map(([heading, body], index) => `## ${String(index + 1).padStart(2, "0")} ${heading}\n\n${body || "待补充。"}\n`).join("\n")}\n`;
}

function getPrdFromForm() {
  return {
    title: $("#prd-title").value.trim() || "未命名产品需求文档",
    summary: $("#prd-summary").value.trim(),
    background: $("#prd-background-text").value.trim(),
    scope: $("#prd-scope-text").value.trim(),
    flow: $("#prd-flow-text").value.trim(),
    metrics: $("#prd-metrics-text").value.trim(),
    risks: $("#prd-risks-text").value.trim(),
  };
}

function savePrd() {
  prd = getPrdFromForm();
  const state = $("#save-state");
  state.textContent = "保存中";
  state.classList.add("saving");
  try {
    localStorage.setItem(STORAGE_KEYS.prd, JSON.stringify(prd));
    window.setTimeout(() => {
      state.textContent = "已保存";
      state.classList.remove("saving");
      $("#prd-edited").textContent = "刚刚";
    }, 350);
  } catch (error) {
    console.error("无法保存需求文档", error);
    state.textContent = "保存失败";
    showToast("文档未能保存到本地，请检查浏览器存储设置。");
  }
}

function bindPrd() {
  $("#prd-title").value = prd.title;
  $("#prd-summary").value = prd.summary;
  $("#prd-background-text").value = prd.background;
  $("#prd-scope-text").value = prd.scope;
  $("#prd-flow-text").value = prd.flow;
  $("#prd-metrics-text").value = prd.metrics;
  $("#prd-risks-text").value = prd.risks;
  let saveTimer;
  $$(".prd-document input, .prd-document textarea").forEach((field) => field.addEventListener("input", () => {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(savePrd, 450);
  }));
  $("#export-prd").addEventListener("click", () => {
    savePrd();
    const blob = new Blob([prdMarkdown()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${getPrdFromForm().title.replace(/[\\/:*?"<>|]/g, "-")}.md`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("PRD 已导出为 Markdown 文件。");
  });
  $$(".outline-link").forEach((link) => link.addEventListener("click", () => {
    $$(".outline-link").forEach((item) => item.classList.toggle("active", item === link));
  }));
}

function init() {
  const now = new Date();
  $("#today-label").textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(now);
  renderRequirements();
  bindNavigation();
  bindRequirements();
  bindPrototype();
  bindPrd();
  const firstItem = currentRequirement();
  if (firstItem) renderAnalysis(firstItem);
}

init();
