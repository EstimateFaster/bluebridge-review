# Vela 快应用方向 · 评测总说明

本轮评测只针对 **Vela 快应用（rpk）**，Android 方向暂缓开放。

## 环境准备

| 项 | 要求 |
|---|---|
| 运行目标 | 小米 Vela 手表（模拟器或真机均可） |
| 设计基准 | **336 × 480**（`designWidth: 336`，竖屏） |
| 构建产物 | `.rpk` |
| 开发方式 | [AIoT-IDE / Vela 开发者工具](https://iot.mi.com/vela/quickapp/zh/guide/start/use-ide.html)，或本仓库 `shared/starter` + `aiot-toolkit` |
| Node.js | ≥ 20 |

题 1、题 3 可以直接使用 [`shared/starter/`](shared/starter/) 极简脚手架开始。
题 2 使用题目自带的静态壳工程 [`task-2-restyle/starter/`](task-2-restyle/starter/)。

> 没有真机的同学：请使用 Vela 模拟器完成，提交模拟器截图；有真机的同学优先真机验证。

## 提交结构

在仓库 `submissions/` 下新建目录：

```
submissions/<github-id>-<task>/
├── README.md          # 构建/运行方法 + 设计说明 + AI 使用说明 + 迭代日志
├── src/               # 源码
├── *.rpk              # 构建产物
└── screenshots/       # 3–5 张截图
```

> 目前提交通过 PR 或直接联系评审方均可，具体以通知为准。提交物默认公开（本仓库为 public），不愿公开请提前说明。

## 评审口径

| 维度 | 通用权重 |
|---|---|
| 功能/玩法完成度 | 25% |
| UI 设计 / 信息层级 | 25%（题 1、题 2 更侧重） |
| 交互与反馈细节 | 20% |
| 工程结构与可运行 | 15% |
| 说明、AI 使用与答辩 | 15% |

**P0 必过项**：能跑起来 + 能讲清楚自己的实现 + 现场改得动。
现场环节会临时加一个小需求或改一个限制——这正是 vibecoding 时代真正拉开差距的地方。

## 通用规则

1. **允许并鼓励 vibecoding**：AI 工具随便用；
2. 提交时请写清：哪些部分由 AI 生成、你改了哪里、怎么验证的；
3. 题面按批次轮换，已发布题面不保证长期有效；
4. 所有代码与数据仅用于评测，不要用于商业分发。

## 三道题

- [题 1 · 一屏挑战：手环天气](task-1-weather/)
- [题 2 · 改版题：静态壳 + 三块新功能](task-2-restyle/)
- [题 3 · 完整 rpk：打地鼠](task-3-whack-a-mole/)
