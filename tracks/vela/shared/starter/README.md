# Vela 评测 Starter（极简版）

蓝桥工作室招新评测用的 Vela 快应用极简脚手架，适配 **336 × 480** 小米 Vela 手表。
题目 1（一屏天气）与题目 3（打地鼠）可以直接基于本 starter 开发。

## 环境要求

- Node.js ≥ 20
- 首次使用先安装依赖：

```bash
npm install
```

## 开发与构建

```bash
# 开发模式（带 watch，具体行为依赖 aiot-toolkit）
npm run start

# 构建 rpk
npm run build
```

构建产物在 `dist/` 下，例如 `dist/com.bluebridge.review.starter.debug.0.1.0.rpk`。

> 也可以直接用 **AIoT-IDE / Vela 开发者工具** 打开本目录进行开发、模拟器运行与 rpk 打包。

## 目录结构

```
starter/
├── package.json          # 依赖与脚本
├── quickapp.config.js    # 构建配置
├── scripts/run-jsc.cjs   # 构建入口（封装 aiot-toolkit）
└── src/
    ├── manifest.json     # 包名、版本、页面路由、设备类型、designWidth
    ├── app.ux            # 应用入口（全局对象）
    ├── common/           # 公共资产（图标等）
    └── pages/index/index.ux   # 唯一页面（单页）
```

## 修改入口

- 页面 UI / 逻辑：`src/pages/index/index.ux`（`template` / `style` / `script` 三段）；
- 新增页面：在 `src/pages/` 下建目录，并在 `src/manifest.json` 的 `router.pages` 注册；
- 设计基准：`manifest.json` 中 `config.designWidth = 336`，按 336 × 480 画布设计。

## 说明

- 本 starter 仅用于招新评测，不要用于商业分发；
- 构建会使用 `@aiot-toolkit` 自带的调试签名，足够模拟器/真机调试使用；
- 题目与提交要求见上级目录题面。

© 蓝桥工作室 · 仅供招新评测使用
