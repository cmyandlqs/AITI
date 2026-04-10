/**
 * AITI - AI 使用人格测试
 * 题目数据：4 模型 × 3 维度 × 2 题 = 24 道题
 *
 * 每道题 3 个选项，分值 1/2/3
 * 维度代码：P(提示词) R(关系) S(场景) E(伦理)
 */

const QUESTIONS = [
  // ==================== P 模型 - 提示词风格 ====================

  // P1: 结构化程度
  {
    id: "P1-1",
    dimension: "P1",
    text: "你需要 AI 帮你写一段代码，你会怎么开口？",
    options: [
      { text: "帮我写个登录功能", score: 1, emoji: "🤷" },
      { text: "用 React 写一个带表单验证的登录组件", score: 2, emoji: "📝" },
      { text: "你是资深前端工程师，请用 React + TypeScript 实现一个登录组件，要求：1. 表单验证（邮箱+密码）2. 错误提示 3. 记住我 4. 响应式布局，输出完整代码", score: 3, emoji: "📋" },
    ],
  },
  {
    id: "P1-2",
    dimension: "P1",
    text: "你让 AI 帮忙写文档时，通常会怎样描述需求？",
    options: [
      { text: "帮我写个项目文档", score: 1, emoji: "🤷" },
      { text: "帮我写一个 API 接口文档，包含请求参数和返回格式", score: 2, emoji: "📝" },
      { text: "请为以下 API 编写文档，目标读者是前端开发者，需要包含：接口说明、请求方法、参数列表（类型+必填+示例）、返回格式（成功/失败）、错误码、调用示例", score: 3, emoji: "📋" },
    ],
  },

  // P2: 详细程度
  {
    id: "P2-1",
    dimension: "P2",
    text: "你发给 AI 的提示词通常有多长？",
    options: [
      { text: "一句话搞定，AI 懂的", score: 1, emoji: "💬" },
      { text: "两三句把背景和要求说一下", score: 2, emoji: "📃" },
      { text: "一段小作文，恨不得把人生经历都告诉它", score: 3, emoji: "📜" },
    ],
  },
  {
    id: "P2-2",
    dimension: "P2",
    text: "以下哪种提示词风格更像你？",
    options: [
      { text: "\"翻译这段话\" / \"总结一下\"", score: 1, emoji: "⚡" },
      { text: "\"请把这段话翻译成地道的英文，保持专业语气\"", score: 2, emoji: "✨" },
      { text: "\"你是一位精通中英双语的专业译者，擅长科技领域。请将以下中文翻译为英文，要求：1. 术语准确 2. 语句通顺 3. 保持原文的专业语气 4. 如有不确定的地方请标注\"", score: 3, emoji: "🎓" },
    ],
  },

  // P3: 迭代习惯
  {
    id: "P3-1",
    dimension: "P3",
    text: "AI 第一次给出的结果不满意，你会怎么办？",
    options: [
      { text: "继续追问、改写、调整，改到满意为止", score: 1, emoji: "🔄" },
      { text: "大概改个两三轮吧", score: 2, emoji: "🔁" },
      { text: "一次到位最好，不行就自己来", score: 3, emoji: "💪" },
    ],
  },
  {
    id: "P3-2",
    dimension: "P3",
    text: "你和 AI 的对话通常到第几轮就结束了？",
    options: [
      { text: "10 轮起步，经常聊到 token 上限", score: 1, emoji: "♾️" },
      { text: "3-5 轮，差不多就得了", score: 2, emoji: "5️⃣" },
      { text: "1-2 轮搞定，追求效率", score: 3, emoji: "⚡" },
    ],
  },

  // ==================== R 模型 - AI 关系投射 ====================

  // R1: 情感投射
  {
    id: "R1-1",
    dimension: "R1",
    text: "说真的，你觉得 AI 对你来说更像什么？",
    options: [
      { text: "一个工具，和锤子没什么区别", score: 1, emoji: "🔧" },
      { text: "一个还算靠谱的助手", score: 2, emoji: "🤝" },
      { text: "我的灵魂伴侣，它真的懂我", score: 3, emoji: "❤️" },
    ],
  },
  {
    id: "R1-2",
    dimension: "R1",
    text: "你会在对话中对 AI 说「请」或者「谢谢」吗？",
    options: [
      { text: "从来不会，它是机器又不是人", score: 1, emoji: "🤖" },
      { text: "偶尔会，毕竟习惯了", score: 2, emoji: "😊" },
      { text: "每次都说！不礼貌我会内疚的", score: 3, emoji: "🥺" },
    ],
  },

  // R2: 权力关系
  {
    id: "R2-1",
    dimension: "R2",
    text: "当你发现 AI 给了错误答案，你的第一反应是？",
    options: [
      { text: "这破玩意儿又在胡说八道！", score: 1, emoji: "😡" },
      { text: "哦算错了，我来纠正一下吧", score: 2, emoji: "🤔" },
      { text: "是不是我的提示词不够清楚？让我重写一下", score: 3, emoji: "🧐" },
    ],
  },
  {
    id: "R2-2",
    dimension: "R2",
    text: "你更享受哪种和 AI 互动的方式？",
    options: [
      { text: "我下指令，它执行，别废话", score: 1, emoji: "👑" },
      { text: "和它一起讨论，合作解决问题", score: 2, emoji: "🤝" },
      { text: "让它给我建议，甚至帮我做决定", score: 3, emoji: "🙏" },
    ],
  },

  // R3: 依赖程度
  {
    id: "R3-1",
    dimension: "R3",
    text: "想象一下，如果今天所有 AI 都挂了，你会？",
    options: [
      { text: "无所谓，以前没有 AI 不也过来了", score: 1, emoji: "😑" },
      { text: "有点不方便，但凑合能过", score: 2, emoji: "😟" },
      { text: "完了，我已经不会自己写代码了", score: 3, emoji: "😱" },
    ],
  },
  {
    id: "R3-2",
    dimension: "R3",
    text: "你平均每天用 AI 多长时间？",
    options: [
      { text: "偶尔用用，加起来不到半小时", score: 1, emoji: "⏰" },
      { text: "算是常规工具，每天用个一两个小时", score: 2, emoji: "⏳" },
      { text: "除了吃饭睡觉都在和 AI 对话", score: 3, emoji: "♾️" },
    ],
  },

  // ==================== S 模型 - 使用场景 ====================

  // S1: 主要用途
  {
    id: "S1-1",
    dimension: "S1",
    text: "你用 AI 干得最多的事是什么？",
    options: [
      { text: "写代码、改 Bug、做 Code Review", score: 1, emoji: "💻" },
      { text: "写文案、翻译、整理资料", score: 2, emoji: "✍️" },
      { text: "陪聊、玩梗、让 AI 扮演各种角色", score: 3, emoji: "🎭" },
    ],
  },
  {
    id: "S1-2",
    dimension: "S1",
    text: "你觉得 AI 最厉害的能力是什么？",
    options: [
      { text: "写代码，省了我大量 Stack Overflow 时间", score: 1, emoji: "🧑‍💻" },
      { text: "文字处理，写东西又快又好", score: 2, emoji: "📖" },
      { text: "什么都能聊，比人类朋友还靠谱", score: 3, emoji: "🫂" },
    ],
  },

  // S2: 使用频率
  {
    id: "S2-1",
    dimension: "S2",
    text: "你手机里装了几个 AI 相关的 APP？",
    options: [
      { text: "就一两个，够用就行", score: 1, emoji: "📱" },
      { text: "三五个吧，不同场景用不同的", score: 2, emoji: "📲" },
      { text: "手机里全是 AI，ChatGPT、Claude、Gemini、豆包、Kimi...", score: 3, emoji: "🏪" },
    ],
  },
  {
    id: "S2-2",
    dimension: "S2",
    text: "你打开 AI 对话框的频率是？",
    options: [
      { text: "偶尔需要的时候才打开", score: 1, emoji: "📅" },
      { text: "每天都有固定的使用时间", score: 2, emoji: "⏰" },
      { text: "它就是我的浏览器首页，随时在用", score: 3, emoji: "🏠" },
    ],
  },

  // S3: 付费意愿
  {
    id: "S3-1",
    dimension: "S3",
    text: "你为 AI 工具花过钱吗？",
    options: [
      { text: "一分钱没花过，白嫖使我快乐", score: 1, emoji: "🆓" },
      { text: "订阅了一个主力用的，其他白嫖", score: 2, emoji: "💳" },
      { text: "ChatGPT Plus、Claude Pro、Cursor Pro...全都要！", score: 3, emoji: "💰" },
    ],
  },
  {
    id: "S3-2",
    dimension: "S3",
    text: "如果 GPT-5 定价 299 元/月，你会？",
    options: [
      { text: "告辞，免费的 GPT-3.5 也不是不能用", score: 1, emoji: "👋" },
      { text: "看情况，要是真有用可以考虑", score: 2, emoji: "🤔" },
      { text: "首发预定！信用卡已经准备好了", score: 3, emoji: "🏎️" },
    ],
  },

  // ==================== E 模型 - AI 伦理态度 ====================

  // E1: 抄作边界
  {
    id: "E1-1",
    dimension: "E1",
    text: "AI 帮你生成的代码，你会怎么处理？",
    options: [
      { text: "直接复制粘贴，能用就行", score: 1, emoji: "📋" },
      { text: "大概看看，改改变量名和注释", score: 2, emoji: "✏️" },
      { text: "必须逐行理解，确认没问题才用", score: 3, emoji: "🔍" },
    ],
  },
  {
    id: "E1-2",
    dimension: "E1",
    text: "你觉得用 AI 写的代码署自己名字，算不算作弊？",
    options: [
      { text: "有什么问题？我提的需求，它只是我的打字员", score: 1, emoji: "😎" },
      { text: "灰色地带吧，看具体情况", score: 2, emoji: "🤷" },
      { text: "有点心虚，至少应该标注 AI 辅助", score: 3, emoji: "😅" },
    ],
  },

  // E2: 替代焦虑
  {
    id: "E2-1",
    dimension: "E2",
    text: "你担心 AI 会抢你的饭碗吗？",
    options: [
      { text: "完全不担心，AI 懂个锤子", score: 1, emoji: "😏" },
      { text: "说不焦虑是假的，但还能应付", score: 2, emoji: "😰" },
      { text: "已经在学 AI 相关技能转型了，真的怕", score: 3, emoji: "🏃" },
    ],
  },
  {
    id: "E2-2",
    dimension: "E2",
    text: "你觉得 5 年后你的工作还存在吗？",
    options: [
      { text: "当然存在，AI 是工具不是替代", score: 1, emoji: "💪" },
      { text: "大概率在，但工作内容会变很多", score: 2, emoji: "🤔" },
      { text: "不确定，所以我一直在学新东西", score: 3, emoji: "📚" },
    ],
  },

  // E3: 幻觉态度
  {
    id: "E3-1",
    dimension: "E3",
    text: "当你发现 AI 在一本正经胡说八道时，你会？",
    options: [
      { text: "骂它一顿，然后换个模型试试", score: 1, emoji: "😤" },
      { text: "纠正它，然后继续聊", score: 2, emoji: "🙂" },
      { text: "研究一下为什么会出错，记录下来", score: 3, emoji: "🧪" },
    ],
  },
  {
    id: "E3-2",
    dimension: "E3",
    text: "你会完全信任 AI 给出的答案吗？",
    options: [
      { text: "基本信，方便嘛", score: 1, emoji: "👍" },
      { text: "信一半，重要的会核实", score: 2, emoji: "🔎" },
      { text: "从不完全信任，验证是基本素养", score: 3, emoji: "✅" },
    ],
  },
];

// 隐藏检测题（不计入维度分数，用于触发彩蛋人格）
const HIDDEN_QUESTIONS = [
  {
    id: "H1",
    triggerType: "patriot",
    text: "你最常用的 AI 是哪一个？",
    options: [
      { text: "ChatGPT", score: 0, emoji: "🌍" },
      { text: "Claude", score: 0, emoji: "🟠" },
      { text: "文心一言 / 豆包 / Kimi", score: 1, emoji: "🇨🇳" },
      { text: "Gemini", score: 0, emoji: "💎" },
    ],
  },
  {
    id: "H2",
    triggerType: "slave",
    text: "如果非要定义你和 AI 的关系，你觉得你们是？",
    options: [
      { text: "我是老板，它是打工人", score: 0, emoji: "👔" },
      { text: "平等的合作关系", score: 0, emoji: "🤝" },
      { text: "它是我的导师/老板，我听它的", score: 1, emoji: "🙇" },
      { text: "说不清，反正很依赖它", score: 0, emoji: "🌀" },
    ],
  },
];
