# 候选人提交区

在这个目录下提交你的作品：每人一个目录。

## 目录结构

```
submissions/<github-id>-<task>/
├── README.md          # 构建/运行方法 + 设计说明 + AI 使用说明 + 迭代日志
├── src/               # 源码
├── *.rpk              # 构建产物（若体积过大可提供构建说明和网盘链接）
└── screenshots/       # 3–5 张运行截图
```

示例：`submissions/example-task1/`。

## 提交方式

- 通过 Pull Request 提交，或按评审方通知的方式提交；
- 提交物默认公开（本仓库为 public），不愿公开请提前向评审方说明；
- 具体要求见对应题面：`tracks/vela/task-*/README.md`。

## 注意事项

- 不要提交 `node_modules/`、构建中间目录、私钥/证书等敏感文件；
- 请确保 README 中的构建步骤可以复现；
- 允许并鼓励使用 AI 工具，但请如实写明 AI 使用情况，并确保你能讲清楚、改得动自己的代码。
