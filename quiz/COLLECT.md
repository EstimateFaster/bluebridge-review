# 答题数据采集说明（仅评审方使用）

线上答题页在测试者无感知的情况下，记录每位测试者的答题过程数据，用于招新评测分析。
本说明面向评审方；页面上**不展示**任何逐题时长等采集数据。

## 一、默认行为：只存本机

开箱即用、无需后端：

- 每完成一关（或中途退出且已经答过题），记录一条 JSON；
- 记录保存在测试者浏览器的 `localStorage`，键名 `bb-quiz-records-v1`（最多保留 200 条）；
- 不发起任何网络请求。

**现场回收方式**（二选一，均不在 UI 中展示）：

1. 在测试者浏览器控制台执行 `window.BBQuizExport()`，会自动下载 `bb-quiz-records-*.json`；
2. 打开 `quiz/` 页面并在地址后追加 `#export`（例如 `.../quiz/#export`），页面加载后自动下载记录文件。

> 远程测试场景建议按下文配置采集端点，否则需要测试者把导出文件发给你。

## 二、配置远程采集端点（可选）

编辑 [`collect.config.js`](collect.config.js)：

```js
window.BB_COLLECT_URL = "https://你的收集端点/随机路径";
```

- 每关结束（含中途退出）自动 `POST` 一份 JSON；
- 请求体为 JSON 字符串，`Content-Type: text/plain;charset=UTF-8`（避免 CORS 预检）；
- 优先使用 `navigator.sendBeacon`，失败时回退 `fetch(..., {keepalive:true, mode:'no-cors'})`；
- 发送失败不影响答题，记录仍保存在本机。

### 最小可用收集器（Cloudflare Worker + KV 示例）

```js
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("method not allowed", { status: 405 });
    }
    const body = await request.text();
    let data;
    try {
      data = JSON.parse(body);
    } catch (e) {
      return new Response("bad json", { status: 400 });
    }
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await env.QUIZ_KV.put(`record:${key}`, JSON.stringify(data));
    return new Response("ok", { status: 200 });
  },
};
```

- 部署后在 Worker 中绑定 KV 命名空间 `QUIZ_KV`；
- 读取：`wrangler kv key list --namespace-id=<id>` 或写一个受保护的导出路由；
- 也可以把 `body` 转发到飞书 / 企业微信机器人（记得在服务端保存 webhook，不要写在前端）。

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

- 本仓库是公开仓库，`collect.config.js` 里的端点对所有人可见：请使用**随机路径**并在服务端限流；更稳妥的做法是私有部署采集服务或定期轮换端点；
- 只采集昵称，不要额外采集真实姓名、手机号等敏感信息；如需收集，请在测试前明确告知测试者；
- 采集数据仅用于招新评测，用完及时清理。
