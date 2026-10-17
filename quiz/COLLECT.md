# 答题数据说明（仅评审方使用）

线上答题页会记录每位测试者的答题过程数据，用于招新评测分析。
本说明面向评审方；页面上**不展示**任何逐题时长等采集数据。

## 一、存储方式：只存本机

- 不配置任何服务器、不发起网络请求、不上传数据；
- 每完成一关（或中途退出且已经答过题），记录一条 JSON；
- 记录保存在测试者浏览器的 `localStorage`，键名 `bb-quiz-records-v1`（最多保留 200 条）；
- 清除浏览器缓存/换设备会丢失本机记录。

## 二、回收方式

现场评审时，二选一从测试者浏览器取回记录：

1. 在测试者浏览器控制台执行 `window.BBQuizExport()`，会自动下载 `bb-quiz-records-*.json`；
2. 打开 `quiz/` 页面并在地址后追加 `#export`（例如 `.../quiz/#export`），页面加载后自动下载记录文件。

> 远程测试场景：需要测试者自己执行上面的导出步骤，把下载到的 JSON 文件发回给评审方。

## 三、记录字段

每条记录对应「一位测试者的一关」：

| 字段 | 说明 |
|---|---|
| `schema` | 固定 `bb-quiz/telemetry/v1` |
| `quizVersion` | 题库版本（当前 `2.0.0`） |
| `sessionId` | 本次答题会话随机 ID |
| `nickname` | 测试者昵称（开始前必填） |
| `level` | `{id, name}` 关卡 |
| `startedAt` / `finishedAt` | ISO 时间 |
| `elapsedMs` | 本关总耗时 |
| `answeredCount` / `total` | 已答题数 / 本关题数 |
| `score` / `passLine` / `passed` | 得分 / 通关线 / 是否通过 |
| `completed` / `quit` | 是否答完 / 是否中途退出 |
| `meta` | UA、语言、时区、屏幕尺寸、视口、referrer、URL |
| `questions[]` | 逐题数据，见下 |

`questions[]` 每项包含：题号 `index`、题库 `id`、难度 `level`、类别 `cat`、题型 `type`、选项数 `optionCount`、选项顺序 `options`、所选序号 `chosenIndex` / 文本 `chosenText`、正确序号 `correctIndex`、是否正确 `correct`、**作答耗时 `timeMs`**、**看完解析后停留 `feedbackMs`**（未答完的题为 `null`）。

## 四、注意事项

- 只采集昵称，不要额外采集真实姓名、手机号等敏感信息；
- 采集数据仅用于招新评测，用完及时清理；
- 本机记录不会自动同步到任何地方，务必在测试结束后及时导出回收。
