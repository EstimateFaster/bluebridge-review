# 股市大亨（评测版）· Vela 静态壳工程

> **注意**：本目录是 **蓝桥工作室招新评测** 的基底工程，不是可直接发布的完整产品。

## 工程简介

面向 336 × 480 小米 Vela 手表的快应用静态壳。保留了 7 个页面和一份固定演示数据，用于候选人完成改版类题目。

- 包名：`com.bluebridge.review`
- 版本：`0.1.0`（versionCode `1`）
- 设计基准宽度：`336`
- 设备类型：`watch`
- 构建命令：`npm run build`
- 构建产物：`dist/com.bluebridge.review.debug.0.1.0.rpk`（文件名以构建日志为准）

页面清单：

| 路由 | 说明 |
| --- | --- |
| `pages/splash` | 启动页，短暂停留后进入主页 |
| `pages/home` | 资产总览与入口 |
| `pages/market` | 静态行情列表 |
| `pages/stock-detail` | 单只股票的静态价格、走势与持仓 |
| `pages/portfolio` | 静态持仓列表 |
| `pages/settings` | 关于、版权声明、版本与数据说明 |
| `pages/about` | 工程说明、数据声明与版权声明 |

## 环境要求

- Node.js `>= 20.19`（开发与验证使用 v24.19.0）
- npm
- 如需真机/模拟器预览：可用的 Vela 设备、模拟器或 AIoT-IDE

## 安装与构建

```bash
npm install
npm run build
```

`npm run build` 会调用 `scripts/build.cjs`，清理 `dist/` 中的旧 `.rpk`，再执行 `aiot-toolkit build`，最后输出本次产物的路径和大小。构建走 development 模式，使用工具链内置的开发签名，因此产物文件名包含 `.debug.`。

产物：

```text
dist/com.bluebridge.review.debug.0.1.0.rpk
```

构建中间目录为 `build/`，与 `dist/` 一样已被 `.gitignore` 忽略。

## 预览

- 将 `dist/*.rpk` 安装到 Vela 手表或模拟器；
- 或连接设备后运行 `npx aiot start --watch` 进行调试。

本工程不附带发布签名证书，`sign/` 目录被忽略；正式发布请自行准备证书，不要在提交物中放置私钥。

## 目录结构

```text
starter/
├── package.json
├── quickapp.config.js
├── jsconfig.json
├── README.md
├── COPYRIGHT.md
├── .gitignore
├── scripts/
│   └── build.cjs              # 构建包装：清理旧包、执行 aiot build、校验产物
└── src/
    ├── manifest.json          # 包名、路由、feature 配置
    ├── app.ux                 # 应用入口
    ├── common/
    │   ├── theme.css          # 全局基础样式
    │   ├── app-logo-v4.png    # 应用图标
    │   ├── splash-logo-v4.png # 启动页图标
    │   ├── cards/             # 主页两张功能卡片
    │   └── icons/             # 保留页面实际引用的图标 + Lucide 许可
    ├── data/
    │   └── reviewStatic.js    # 唯一静态数据源与只读展示辅助函数
    └── pages/                 # 仅保留上述 7 个页面
```

## 静态演示数据

`src/data/reviewStatic.js` 是页面唯一的数据来源。页面只做读取和格式化展示，不包含任何可变状态或业务写入。

- 现金：`¥80,000`
- 股票：6 只固定虚构股票，价格与涨跌幅固定
- 持仓：5 笔固定持仓，包含固定数量与成本价
- 浮动盈亏、持仓市值、总资产均由上述固定数据按展示需要计算

所有公司名称、行情、现金、持仓与收益均为虚构演示数据，与真实公司或市场无关，不构成任何投资建议。

## 已裁剪内容清单

- **页面**：只保留 7 个页面；任务、任务详情、答题、成就、论坛、消息、礼品码、激活、购买、存档、旧档迁移、交易、教程、更新日志、颜色设置、随机事件等页面全部删除。
- **逻辑**：`src/game/`、`src/store/`、`src/utils/` 等游戏引擎、存档服务与交易/结算逻辑全部删除。
- **数据**：原股票、事件、任务、成就、答题等动态数据删除，只保留 `src/data/reviewStatic.js`。
- **入口**：收盘、每日任务、猜猜看、消息、成就、存档管理、礼品码、颜色转换、教程、更新日志等入口全部删除。
- **资产**：只保留保留页面实际引用的图片与图标；其余横幅、卡片、截图、音频、字体全部删除。
- **feature / 权限**：只保留界面与扩展功能所需的最小集合（`system.router`、`system.prompt`、`system.storage`、`system.vibrator`）。

## 候选人任务

**候选人任务请见上级目录题面。** 本 README 只说明基底工程与构建方式，不包含题目答案或实现提示。

## 版权

© 蓝桥工作室。本工程仅供招新评测使用，禁止外传或商用。完整条款见 [COPYRIGHT.md](./COPYRIGHT.md)。

图标来源：Lucide Icons（ISC License，部分图标衍生自 Feather，MIT License），许可全文见 `src/common/icons/LUCIDE-LICENSE.txt`。
