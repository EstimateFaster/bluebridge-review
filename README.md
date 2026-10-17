# bluebridge-review · 蓝桥工作室招新评测

公开的招新评测仓库：线上答题、Vela 快应用题面、候选人提交与评审记录都在这里。

## 📝 线上答题测试 · v2.0

**👉 [https://estimatefaster.github.io/bluebridge-review/](https://estimatefaster.github.io/bluebridge-review/)**

编程与计算机基础术语知识，三关难度递进，**题库全部公开**：

| 关卡 | 内容 | 规则 |
|---|---|---|
| 第一关 · 入门常识 | 计算机、编程、网络基础 | 随机 10 题，答对 6 题通关 |
| 第二关 · 进阶 | 常见概念与操作辨析 | 解锁后同上 |
| 第三关 · 挑战 | 更高一档基础概念与工具常识 | 解锁后同上 |

- **难度已整体下调**：最高难度约为原第二关水平，题目重新分散到三关，梯度更平缓；
- 开始前需要输入**昵称**；答题后立即显示正确答案与解析，边测边学；
- 选项顺序随机打乱——背固定选项没有意义，但题目本身公开，欢迎提前学习；
- 答题过程数据（每题作答时长等）只保存在测试者本机、**不在页面上展示**，也不会发送到任何服务器；回收方式见 [`quiz/COLLECT.md`](quiz/COLLECT.md)；
- 题库文件：[`quiz/questions.json`](quiz/questions.json)（v2.0.0，90 题）；
- 纯静态页面（HTML/CSS/原生 JS，无依赖），本地预览：`cd quiz && python3 -m http.server 8000`。

## 🧭 本轮评测题目：Vela 快应用

Android 方向本轮暂缓，后续开放。

| 题号 | 题目 | 考察重点 |
|---|---|---|
| [题 1](tracks/vela/task-1-weather/) | 一屏挑战：手环天气单页排版 | UI 设计、信息层级、小屏适配 |
| [题 2](tracks/vela/task-2-restyle/) | 改版题：静态壳 + 三块新功能 | 自绘键盘、功能设计、UI、改版维护 |
| [题 3](tracks/vela/task-3-whack-a-mole/) | 完整 rpk：打地鼠 | 核心玩法、多页路由、代码结构 |

- 题 1 / 题 3 可基于 [`tracks/vela/shared/starter/`](tracks/vela/shared/starter/) 极简脚手架开始；
- 题 2 使用题目自带的静态壳工程 [`tracks/vela/task-2-restyle/starter/`](tracks/vela/task-2-restyle/starter/)（由「股市大亨」裁剪而来，包名 `com.bluebridge.review`，现金固定 80000）；
- 提交与评分规则见 [`tracks/README.md`](tracks/README.md) 与 [`tracks/vela/README.md`](tracks/vela/README.md)。

## 🤖 关于 vibecoding 与 AI

我们鼓励 vibecoding：你可以、也应该使用 AI 工具完成作品。

但评测的重点是 **你是否真的理解、能改、能讲清楚**——所以作品类考题会包含现场演示、追问与现场改动，这些是 AI 无法替你完成的部分。

## 📁 仓库结构

```
index.html      # 站点首页（GitHub Pages）
quiz/           # 线上答题测试
  questions.json  # 公开题库
  COLLECT.md      # 答题数据采集说明（评审方）
tracks/
├── README.md   # 题目总览与提交规则
└── vela/
    ├── README.md
    ├── shared/starter/          # 极简 Vela starter（题 1 / 题 3）
    ├── task-1-weather/          # 题 1 题面
    ├── task-2-restyle/          # 题 2 题面 + 静态壳工程
    └── task-3-whack-a-mole/     # 题 3 题面
submissions/     # 候选人提交：submissions/<github-id>-<task>/
```

## 🚀 候选人怎么用

1. 先做[线上答题测试](https://estimatefaster.github.io/bluebridge-review/)；
2. 按评审方通知选择 Vela 题目（题 1 / 题 2 / 题 3）；
3. 阅读对应题面，按题面要求完成并构建 `.rpk`；
4. 在 `submissions/<github-id>-<task>/` 下提交源码、rpk、截图与 README；
5. 参加现场 review：演示、讲思路、回答问题、**现场改一个小需求**。

## 说明

- 题面按批次轮换，已发布题面不保证长期有效；
- 本仓库为 public，你的提交物默认公开，不愿公开请提前说明；
- 评测规则以每道题面内的「提交要求」为准。

## 状态

- ✅ 线上答题测试 v2.0 已上线（昵称登录 + 数据采集 + 难度下调）
- ✅ Vela 三道题面已发布（题 1 / 题 2 / 题 3 + 两套 starter）
- 🚧 候选提交与题目轮换持续更新
