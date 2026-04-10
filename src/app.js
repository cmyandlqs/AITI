/**
 * AITI - AI 使用人格测试
 * 核心算法与交互逻辑 — Mac-style UI
 */

// ==================== 状态管理 ====================
const state = {
  currentQuestion: 0,
  answers: {},        // { dimension: totalScore }
  hiddenAnswers: {},  // { triggerType: score }
  userVector: [],
  result: null,
  shuffledQuestions: [], // randomized question order
};

// ==================== 题目随机化 ====================

/**
 * Fisher-Yates 洗牌
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 按维度分组打乱：维度间顺序随机，同维度内两题顺序随机
 */
function shuffleQuestions() {
  // Group questions by dimension
  const groups = {};
  for (const q of QUESTIONS) {
    if (!groups[q.dimension]) groups[q.dimension] = [];
    groups[q.dimension].push(q);
  }

  // Shuffle dimension order, then shuffle within each group
  const dimOrder = shuffle(Object.keys(groups));
  const result = [];
  for (const dim of dimOrder) {
    result.push(...shuffle(groups[dim]));
  }

  // Hidden questions stay at the end
  result.push(...HIDDEN_QUESTIONS);
  return result;
}

// ==================== 算法引擎 ====================

/**
 * 计算单个维度的总分并归档
 * @param {number} score1 第一题分数 (1-3)
 * @param {number} score2 第二题分数 (1-3)
 * @returns {number} 归档值 1(L) / 2(M) / 3(H)
 */
function normalize(score1, score2) {
  const total = score1 + score2;
  if (total <= 3) return 1; // L
  if (total === 4) return 2; // M
  return 3; // H (5-6)
}

/**
 * 生成用户的 12 维向量
 * @param {Object} answers - { "P1-1": 2, "P1-2": 3, ... }
 * @returns {number[]} 12 维向量 [P1,P2,P3,R1,R2,R3,S1,S2,S3,E1,E2,E3]
 */
function generateVector(answers) {
  const dimensions = ["P1", "P2", "P3", "R1", "R2", "R3", "S1", "S2", "S3", "E1", "E2", "E3"];
  const vector = [];

  for (const dim of dimensions) {
    const q1Key = `${dim}-1`;
    const q2Key = `${dim}-2`;
    const score1 = answers[q1Key] || 2;
    const score2 = answers[q2Key] || 2;
    vector.push(normalize(score1, score2));
  }

  return vector;
}

/**
 * 计算用户向量与模板的距离
 */
function calculateDistance(userVec, templateVec) {
  let totalDiff = 0;
  let exactMatches = 0;

  for (let i = 0; i < 12; i++) {
    const diff = Math.abs(userVec[i] - templateVec[i]);
    totalDiff += diff;
    if (diff === 0) exactMatches++;
  }

  const maxDiff = 12 * 2;
  const similarity = ((maxDiff - totalDiff) / maxDiff) * 100;

  return { totalDiff, exactMatches, similarity };
}

/**
 * 匹配用户的人格类型
 */
function matchPersonality(userVec) {
  const scores = PERSONALITY_TEMPLATES.map((template) => ({
    template,
    ...calculateDistance(userVec, template.vector),
  }));

  scores.sort((a, b) => {
    if (a.totalDiff !== b.totalDiff) return a.totalDiff - b.totalDiff;
    if (b.exactMatches !== a.exactMatches) return b.exactMatches - a.exactMatches;
    return b.similarity - a.similarity;
  });

  return {
    primary: scores[0].template,
    topMatches: scores.slice(0, 5),
    allScores: scores,
  };
}

/**
 * 检查彩蛋人格触发
 */
function checkEasterEggs(hiddenAnswers, matchResult) {
  if (hiddenAnswers["patriot"] === 1) {
    return EASTER_EGG_TEMPLATES.find((t) => t.id === "EE-PATRIOT");
  }
  if (hiddenAnswers["slave"] === 1) {
    return EASTER_EGG_TEMPLATES.find((t) => t.id === "EE-SLAVE");
  }
  const userVec = state.userVector;
  if (userVec[7] === 3 && userVec[8] === 1) {
    return EASTER_EGG_TEMPLATES.find((t) => t.id === "EE-FREERIDER");
  }
  if (matchResult.primary && matchResult.topMatches[0].similarity < 50) {
    return EASTER_EGG_TEMPLATES.find((t) => t.id === "EE-NATIVE");
  }
  return null;
}

// ==================== UI 渲染 ====================

function getAllQuestions() {
  return state.shuffledQuestions.length > 0
    ? state.shuffledQuestions
    : [...QUESTIONS, ...HIDDEN_QUESTIONS];
}

/**
 * 渲染欢迎/首页
 */
function renderWelcome() {
  const app = document.getElementById("app");
  const templates = PERSONALITY_TEMPLATES.slice(0, 16);

  app.innerHTML = `
    <!-- Top Banner -->
    <div class="top-banner">
      <a href="https://github.com/cmyandlqs/AITI" target="_blank" style="color:white;text-decoration:none;">GitHub 开源项目 · 欢迎 Star ⭐</a>
      <span>2026 · v1.0 · <img src="assets/images/方源大头照.jpg" class="banner-avatar" /> sikm</span>
    </div>

    <!-- Hero Card -->
    <div class="hero-card animate-fade-in">
      <div class="hero-pill">AITI 人格测试</div>
      <h1 class="hero-title">AITI 人格测试 ——<br>你是哪种AI交互人格？</h1>
      <p class="hero-subtitle">通过 26 道趣味问答，分析你的提示词风格、AI 关系投射、使用场景和伦理态度，匹配出专属的 AI 使用人格。</p>

      <div class="visit-counter">
        本站已被测试 <span id="busuanzi_value_site_pv">--</span> 次
      </div>

      <div class="hero-grid">
        <div class="hero-info-block">
          <h3>五大模型</h3>
          <ul>
            <li>提示词风格 — 结构化 vs 散装</li>
            <li>AI 关系投射 — 工具还是朋友</li>
            <li>使用场景 — 频率、用途、付费</li>
            <li>AI 伦理态度 — 抄作、焦虑、幻觉</li>
            <li>混合人格 — 多维度交叉解读</li>
          </ul>
        </div>
        <div class="hero-info-block">
          <h3>关于测试</h3>
          <ul>
            <li>共 26 道趣味选择题</li>
            <li>大约需要 3-5 分钟</li>
            <li>纯前端运行，无数据上传</li>
            <li>25+ 种搞笑人格类型</li>
            <li>含隐藏彩蛋人格等你解锁</li>
          </ul>
        </div>
      </div>

      <button onclick="startTest()" class="btn-primary">开始测试 →</button>
      <div style="margin-top:16px;text-align:center;">
        <a href="https://github.com/cmyandlqs/AITI" target="_blank" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-secondary);font-size:14px;font-weight:600;text-decoration:none;padding:6px 16px;border-radius:999px;background:var(--surface);transition:all 0.2s;" onmouseover="this.style.color='var(--primary)';this.style.background='var(--primary-light)'" onmouseout="this.style.color='var(--text-secondary)';this.style.background='var(--surface)'">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          GitHub
        </a>
      </div>
    </div>

    <!-- Personality Gallery -->
    <div class="gallery-section">
      <div class="gallery-header">
        <div class="gallery-title">全部人格图鉴 <span class="arrow">→</span></div>
        <div class="gallery-subtitle">共 ${PERSONALITY_TEMPLATES.length} 种交互人格，点击查看详情</div>
      </div>
      <div class="gallery-grid">
        ${templates.map((t, i) => `
          <div class="personality-card" style="animation-delay: ${i * 0.05}s" onclick="scrollToTop()">
            <div class="card-label">你的交互人格是：</div>
            <span class="card-emoji">${t.emoji}</span>
            <div class="card-name">${t.name}</div>
            <div class="card-code">${t.code}</div>
            <div class="card-rarity">${t.rarity}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/**
 * 渲染答题页面
 */
function renderQuestion() {
  const allQuestions = getAllQuestions();
  const q = allQuestions[state.currentQuestion];
  const total = allQuestions.length;
  const progress = ((state.currentQuestion) / total) * 100;
  const isHidden = q.triggerType !== undefined;

  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-progress-wrap">
        <div class="quiz-progress-info">
          <span class="quiz-progress-dim">${isHidden ? "🎯 特别问题" : `${q.dimension} 维度`}</span>
          <span class="quiz-progress-count">${state.currentQuestion + 1} / ${total}</span>
        </div>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>

      <div class="quiz-body">
        <div class="quiz-question-wrap animate-fade-in">
          <h2 class="quiz-question-text">${q.text}</h2>
          <div class="quiz-options">
            ${q.options.map((opt, i) => `
              <button class="quiz-option" onclick="selectAnswer('${q.id}', ${opt.score}, ${isHidden ? `'${q.triggerType}'` : 'null'})">
                <span class="opt-emoji">${opt.emoji}</span>
                <span class="opt-text">${opt.text}</span>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 选择答案
 */
function selectAnswer(questionId, score, triggerType) {
  if (triggerType) {
    state.hiddenAnswers[triggerType] = score;
  } else {
    state.answers[questionId] = score;
  }

  state.currentQuestion++;
  const allQuestions = getAllQuestions();

  if (state.currentQuestion >= allQuestions.length) {
    calculateResult();
  } else {
    renderQuestion();
  }
}

/**
 * 计算结果
 */
function calculateResult() {
  state.userVector = generateVector(state.answers);
  const matchResult = matchPersonality(state.userVector);
  const easterEgg = checkEasterEggs(state.hiddenAnswers, matchResult);

  state.result = {
    vector: state.userVector,
    match: matchResult,
    easterEgg,
  };

  renderResult();
}

/**
 * 渲染结果页面
 */
function renderResult() {
  const { vector, match, easterEgg } = state.result;
  const primary = match.primary;
  const personality = easterEgg || primary;

  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="result-container">
      <div class="result-inner">

        <!-- 主人格卡片 -->
        <div class="result-main-card animate-scale-in">
          <div class="result-emoji">${personality.emoji}</div>
          <div class="result-name">${personality.name}</div>
          <div class="result-code">${personality.code}</div>
          <div class="result-rarity-badge">${personality.rarity}${personality.rarityPercent > 0 ? ` · 仅 ${personality.rarityPercent}% 的人` : " · 隐藏人格"}</div>
          <div class="result-tagline">"${personality.tagline}"</div>
        </div>

        <!-- 详细描述 -->
        <div class="result-desc-card animate-slide-up" style="animation-delay: 0.1s">
          <p>${personality.description}</p>
        </div>

        ${!easterEgg ? `
        <!-- 优缺点 -->
        <div class="result-sw-card animate-slide-up" style="animation-delay: 0.2s">
          <div class="section-title">你的画像</div>
          <div class="result-sw-grid">
            <div class="result-sw-col">
              <h4 style="color: #16a34a;">💪 超能力</h4>
              <ul>
                ${personality.strengths.map((s) => `<li><span style="color:#16a34a;">+</span> ${s}</li>`).join("")}
              </ul>
            </div>
            <div class="result-sw-col">
              <h4 style="color: #dc2626;">😅 小毛病</h4>
              <ul>
                ${personality.weaknesses.map((w) => `<li><span style="color:#dc2626;">-</span> ${w}</li>`).join("")}
              </ul>
            </div>
          </div>
        </div>
        ` : ""}

        <!-- 雷达图 -->
        <div class="result-radar-card animate-slide-up" style="animation-delay: 0.3s">
          <div class="section-title">你的 AI 使用画像</div>
          <canvas id="radarChart" width="400" height="400" style="max-width:100%;margin:0 auto;display:block;"></canvas>
        </div>

        <!-- 维度详情 -->
        <div class="result-radar-card animate-slide-up" style="animation-delay: 0.35s">
          <div class="section-title">维度详情</div>
          <div class="result-dims-grid">
            ${renderDimensionCards(vector)}
          </div>
        </div>

        <!-- Top 5 -->
        <div class="result-match-card animate-slide-up" style="animation-delay: 0.4s">
          <div class="section-title">与你最像的人设</div>
          ${match.topMatches.map((m, i) => `
            <div class="result-match-item">
              <span class="match-emoji">${m.template.emoji}</span>
              <div class="match-info">
                <div class="match-name">${m.template.name}</div>
                <div class="match-bar"><div class="match-bar-fill" style="width: ${m.similarity}%"></div></div>
              </div>
              <span class="match-pct">${m.similarity.toFixed(0)}%</span>
            </div>
          `).join("")}
        </div>

        <!-- 操作按钮 -->
        <div class="result-actions animate-slide-up" style="animation-delay: 0.5s">
          <button onclick="generatePoster()" class="btn-share">生成分享海报</button>
          <button onclick="restartTest()" class="btn-restart">重新测试</button>
        </div>

        <!-- Footer -->
        <div class="result-footer">
          <p>AITI - AI 使用人格测试 · 仅供娱乐</p>
          <p>灵感来自 SBTI · <a href="https://mp.weixin.qq.com/s/R5PCIcL4uANCNThcqtZPag" target="_blank" style="color:var(--primary);text-decoration:none;">量子位公众号</a> · <a href="https://github.com/cmyandlqs/AITI" target="_blank" style="color:var(--primary);text-decoration:none;">开源项目欢迎 Star ⭐</a></p>
          <p><img src="assets/images/方源大头照.jpg" class="footer-avatar" /> sikm</p>
        </div>

      </div>
    </div>
  `;

  setTimeout(() => renderRadarChart(vector), 100);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * 渲染维度卡片
 */
function renderDimensionCards(vector) {
  const labels = [
    { code: "P1", name: "结构化", model: "P" },
    { code: "P2", name: "详细度", model: "P" },
    { code: "P3", name: "迭代", model: "P" },
    { code: "R1", name: "情感投射", model: "R" },
    { code: "R2", name: "权力关系", model: "R" },
    { code: "R3", name: "依赖度", model: "R" },
    { code: "S1", name: "主要用途", model: "S" },
    { code: "S2", name: "使用频率", model: "S" },
    { code: "S3", name: "付费意愿", model: "S" },
    { code: "E1", name: "抄作边界", model: "E" },
    { code: "E2", name: "替代焦虑", model: "E" },
    { code: "E3", name: "幻觉态度", model: "E" },
  ];

  const modelColors = { P: "#3b5944", R: "#dc2626", S: "#16a34a", E: "#2563eb" };
  const levelNames = { 1: "低", 2: "中", 3: "高" };

  return labels
    .map((label, i) => {
      const val = vector[i];
      const color = modelColors[label.model];
      return `
        <div class="result-dim-item">
          <div class="dim-code">${label.code}</div>
          <div class="dim-val" style="color: ${color}">${levelNames[val]}</div>
          <div class="dim-label">${label.name}</div>
        </div>
      `;
    })
    .join("");
}

/**
 * 渲染雷达图 — Mac 风格浅色主题
 */
function renderRadarChart(vector) {
  const canvas = document.getElementById("radarChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(cx, cy) - 60;

  const labels = [
    "P1 结构化", "P2 详细度", "P3 迭代",
    "R1 情感", "R2 权力", "R3 依赖",
    "S1 用途", "S2 频率", "S3 付费",
    "E1 抄作", "E2 焦虑", "E3 幻觉",
  ];
  const n = labels.length;

  ctx.clearRect(0, 0, w, h);

  // 绘制网格（浅灰）
  for (let level = 1; level <= 3; level++) {
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + r * (level / 3) * Math.cos(angle);
      const y = cy + r * (level / 3) * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 绘制轴线
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    ctx.strokeStyle = "rgba(0,0,0,0.04)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 绘制标签
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillStyle = "#9ca3af";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const lx = cx + (r + 30) * Math.cos(angle);
    const ly = cy + (r + 30) * Math.sin(angle);
    ctx.fillText(labels[i], lx, ly);
  }

  // 绘制数据区域
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
    const val = vector[idx] / 3;
    const x = cx + r * val * Math.cos(angle);
    const y = cy + r * val * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(59,89,68,0.12)";
  ctx.fill();
  ctx.strokeStyle = "rgba(59,89,68,0.6)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 绘制数据点
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = vector[i] / 3;
    const x = cx + r * val * Math.cos(angle);
    const y = cy + r * val * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#3b5944";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }
}

// ==================== 交互函数 ====================

function startTest() {
  state.currentQuestion = 0;
  state.answers = {};
  state.hiddenAnswers = {};
  state.userVector = [];
  state.result = null;
  state.shuffledQuestions = shuffleQuestions();
  renderQuestion();
}

function restartTest() {
  renderWelcome();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shareResult() {
  const personality = state.result.easterEgg || state.result.match.primary;
  const text = `我的 AITI AI使用人格是【${personality.name}】！\n${personality.emoji} "${personality.tagline}"\n\n快来测测你的 AI 使用人格 →`;

  if (navigator.share) {
    navigator.share({ title: "AITI AI使用人格测试", text });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('.btn-share');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = "已复制到剪贴板";
        setTimeout(() => { btn.innerHTML = original; }, 2000);
      }
    });
  } else {
    alert(text);
  }
}

// ==================== 分享海报 ====================

let posterDataURL = null;

function generatePoster() {
  const personality = state.result.easterEgg || state.result.match.primary;
  const container = document.getElementById("poster-container");

  // Generate QR code
  const qrCanvas = document.createElement("canvas");
  new QRious({
    element: qrCanvas,
    value: "https://cmyandlqs.github.io/AITI/",
    size: 80,
    backgroundAlpha: 0,
    foreground: "#3b5944",
    level: "M",
  });

  // Short description: first paragraph only, strip "恭喜你..."
  const descText = personality.description
    .split("\n\n")
    .filter(p => !p.startsWith("恭喜你"))
    .slice(0, 2)
    .join(" ")
    .replace(/\n/g, " ")
    .slice(0, 120);

  container.innerHTML = `
    <div class="poster-card">
      <div class="poster-brand">AITI</div>
      <div class="poster-slogan">发现你的 AI 交互基因</div>
      <div class="poster-emoji">${personality.emoji}</div>
      <div class="poster-name">${personality.name}</div>
      <div class="poster-code">${personality.code}</div>
      <div class="poster-rarity">${personality.rarity}${personality.rarityPercent > 0 ? " · 仅 " + personality.rarityPercent + "% 的人" : ""}</div>
      <div class="poster-tagline">"${personality.tagline}"</div>
      <div class="poster-desc">${descText}</div>
      <div class="poster-footer">
        <div class="poster-qr-side">
          <div id="poster-qr-slot"></div>
          <div class="poster-qr-text">长按识别二维码<br/>测试你的 AI 人格</div>
        </div>
        <div class="poster-author-side">
          <div class="author-name">by sikm</div>
          <div>cmyandlqs.github.io/AITI</div>
        </div>
      </div>
    </div>
  `;

  // Insert QR canvas
  document.getElementById("poster-qr-slot").appendChild(qrCanvas);

  // Render to image
  html2canvas(container.firstElementChild, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    width: 450,
    height: 800,
  }).then((canvas) => {
    posterDataURL = canvas.toDataURL("image/png");
    showPosterModal();
    // Clean up offscreen
    container.innerHTML = "";
  });
}

function showPosterModal() {
  const modal = document.getElementById("poster-modal");
  const preview = document.getElementById("poster-preview-wrap");
  preview.innerHTML = `<img src="${posterDataURL}" alt="分享海报" />`;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closePosterModal() {
  document.getElementById("poster-modal").style.display = "none";
  document.body.style.overflow = "";
}

function downloadPoster() {
  if (!posterDataURL) return;
  const personality = state.result.easterEgg || state.result.match.primary;
  const a = document.createElement("a");
  a.href = posterDataURL;
  a.download = `AITI-${personality.code}.png`;
  a.click();
}

// ==================== 启动 ====================
document.addEventListener("DOMContentLoaded", () => {
  renderWelcome();
});
