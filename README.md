# AITI - AI 使用人格测试 🤖

> **你是 Prompt 原教旨主义者，还是散装提示词野生党？**
> 26 道趣味问答，测出你的 AI 使用人格！

## 这是啥？

AITI (AI Temperament Inventory) 是一个 AI 使用人格测试，通过分析你的提示词风格、AI 关系投射、使用场景和伦理态度，匹配出 25+ 种搞笑梗风格的人格类型。

## 在线体验

[点击开始测试 →](https://your-username.github.io/aiti/)

## 人格预览

| Emoji | 人格 | 一句话 |
|-------|------|--------|
| 📋 | Prompt 原教旨主义者 | 你写提示词像写论文 |
| 🤷 | 散装提示词野生党 | "帮我写个代码"是你全部的提示词 |
| 😍 | AI 痴恋者 | 你把 AI 当恋人 |
| 🔧 | 冷血工具人 | AI 在你眼里就是个高级计算器 |
| 👨‍🏫 | 严厉父亲型 | "这都做不对？回去重写！" |
| 💰 | 付费氪佬 | ChatGPT Plus + Claude Pro + Cursor Pro...全都要 |
| 🆓 | 白嫖党终身会员 | 一分钱不花，每天用 50 次 |
| 😇 | AI 道德楷模 | 你的 GitHub 绿得发亮 |
| 😎 | 赛博混子 | AI 生成即原创 |
| ... | 还有 15+ 种等你来测 | 包括隐藏彩蛋人格 |

## 技术栈

- 纯 HTML / CSS / JavaScript
- 零依赖，单页面
- Canvas 雷达图
- 灵感来自 [SBTI](https://www.bilibili.com/)

## 本地运行

```bash
# 克隆项目
git clone https://github.com/your-username/aiti.git
cd aiti

# 直接打开即可
open index.html
# 或者
python -m http.server 8080
# 然后访问 http://localhost:8080
```

## 项目结构

```
aiti/
├── index.html           # 主页面
├── src/
│   ├── data/
│   │   ├── questions.js # 24道主题 + 2道隐藏题
│   │   └── templates.js # 25+种人格模板 + 4种彩蛋
│   └── app.js           # 核心算法 + UI 逻辑
└── README.md
```

## 算法原理

```
用户答题 → 维度计分 → 分数归档 → 向量生成 → 模板匹配 → 结果输出
  26道    12维分值    L/M/H     12维向量   25+模板   人格类型
```

**4 模型 12 维架构：**
- **P (Prompt)** - 提示词风格：结构化、详细度、迭代习惯
- **R (Relation)** - AI 关系：情感投射、权力关系、依赖程度
- **S (Scenario)** - 使用场景：主要用途、使用频率、付费意愿
- **E (Ethic)** - AI 伦理：抄作边界、替代焦虑、幻觉态度

## 贡献

欢迎贡献新的人格类型和题目！

1. Fork 本项目
2. 在 `src/data/templates.js` 中添加新人格
3. 在 `src/data/questions.js` 中添加新题目
4. 提交 PR

## 灵感来源

- [SBTI](https://www.bilibili.com/) - 赛博人格测试鼻祖
- [MBTI](https://www.myersbriggs.org/) - 经典人格测试
- 所有被 AI 折磨的开发者们

## License

MIT

---

<p align="center">
  如果觉得有趣，给个 ⭐ Star 吧！<br/>
  毕竟白嫖党终身会员也需要一点回报 🐶
</p>
