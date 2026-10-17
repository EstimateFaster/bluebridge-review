# bluebridge-review · 蓝桥工作室招新评测

公开的招新评测仓库：线上答题、题面、候选人提交与评审记录都在这里。

## 📝 线上答题测试

**👉 [https://estimatefaster.github.io/bluebridge-review/](https://estimatefaster.github.io/bluebridge-review/)**

编程与计算机基础术语知识，三关难度递进，**题库全部公开**：

| 关卡 | 内容 | 规则 |
|---|---|---|
| 第一关 · 入门常识 | 计算机、编程、网络基础 | 随机 10 题，答对 6 题通关 |
| 第二关 · 进阶辨析 | 术语辨析与常见操作 | 解锁后同上 |
| 第三关 · 深水区 | 底层概念、工程实践与 AI 协作 | 解锁后同上 |

- 答题后立即显示正确答案与解析，边测边学；
- 选项顺序随机打乱——背固定选项没有意义，但题目本身公开，欢迎提前学习；
- 题库文件：[`quiz/questions.json`](quiz/questions.json)（v1.0.0，90 题）；
- 纯静态页面（HTML/CSS/原生 JS，无依赖），本地预览：`cd quiz && python3 -m http.server 8000`。

## 🧭 两条独立评测线

| 方向 | 技术栈 | 主要考察 |
|---|---|---|
| Vela 快应用 | Vela OS、快应用框架（JS + `.ux`）、rpk 打包 | 小屏 UI 还原、状态管理、性能与内存、原生能力调用 |
| Android | Kotlin / Jetpack Compose（含 Java） | 常规 App 的 UI、数据存储、生命周期、稳定性与性能 |

> 两条线**独立出题、独立评分**，不涉及跨端 / 跨设备通信类题目。

## 🤖 关于 vibecoding 与 AI

我们鼓励 vibecoding：你可以、也应该使用 AI 工具完成作品。

但评测的重点是 **你是否真的理解、能改、能讲清楚**——所以作品类考题会包含现场演示、追问与现场改动，这些是 AI 无法替你完成的部分。

## 📁 仓库结构

```
index.html      # 站点首页（GitHub Pages）
quiz/           # 线上答题测试
  questions.json  # 公开题库
tracks/
├── vela/        # Vela 快应用方向：题面、素材、模板
└── android/     # Android 方向：题面、素材、模板
submissions/     # 候选人提交：submissions/<github-id>-<track>/
docs/            # 流程、规范、评分说明
```

## 🚀 候选人怎么用

1. 先做[线上答题测试](https://estimatefaster.github.io/bluebridge-review/)；
2. 选择你要挑战的方向（Vela 快应用 / Android）；
3. 阅读对应 `tracks/` 下的题面与提交要求；
4. 在 `submissions/<github-id>-<track>/` 下提交作品；
5. 参加约 30 分钟的现场 review：演示、讲思路、回答问题、现场改一小段代码。

## 说明

- 题面按批次轮换，已发布题面不保证长期有效；
- 本仓库为 public，你的提交物默认公开，不愿公开请提前说明；
- 评测规则以每道题面内的「提交要求」为准。

## 状态

- ✅ 线上答题测试 v1.0 已上线
- 🚧 第一批创造类题面整理中
