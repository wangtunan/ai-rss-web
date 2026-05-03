# 多端展示 Roadmap

## 难度划分原则

难度主要按以下维度判断：

- 是否能复用现有 Vue/Web 能力。
- 是否需要独立 UI 体系。
- 是否需要处理平台审核和打包。
- 是否需要处理特殊运行环境限制。
- 是否需要本地缓存、权限、配置、安全策略。
- 是否需要跨平台兼容。

本 Roadmap 只覆盖展示端，不包含 backend 抓取、入库、AI 摘要等生产任务。

## 难易程度总览

| 顺序 | 渠道 | 难度 | 建议阶段 | 主要原因 |
| --- | --- | --- | --- | --- |
| 1 | 产品首页 | 低 | P0 | 基于现有 Web 技术实现，主要是信息架构和视觉设计，不涉及新平台能力。 |
| 2 | CLI Reader | 低到中 | P1 | 只读数据并格式化输出，UI 简单；需要处理配置、终端输出和中文宽度。 |
| 3 | Web Reader 整理 | 中 | P1 | 已有基础，但需要接入共享 `news-client`，并与首页路由共存。 |
| 4 | Chrome 浏览器插件 | 中 | P2 | Popup 形态较小，展示逻辑简单；但需要 Manifest V3、权限、缓存和审核准备。 |
| 5 | VS Code / Cursor 插件 | 中到高 | P2 | 需要 VS Code Extension API、Webview 安全策略和 Cursor 兼容验证。 |
| 6 | Mobile App | 高 | P3 | 真移动端 App 需要独立 UI、导航、缓存、弱网、打包和跨平台适配。 |

## 推荐实施顺序

### P0：先做产品入口

| 项目 | 内容 |
| --- | --- |
| 渠道 | 产品首页 |
| 目标 | 让用户一眼理解 AI RSS Web 的能力和支持渠道。 |
| 前置 | 无，只需要现有前端项目。 |
| 交付 | Hero、渠道矩阵、能力展示、数据流、进入 Web Reader 的入口。 |
| 验收 | 首页明确展示 Web、App、CLI、VS Code / Cursor、Chrome 五个渠道。 |

为什么先做：

- 它最简单，收益也最高。
- 后续所有渠道都能从首页获得统一叙事。
- 可以先用 mock 展示未来多端能力，不阻塞真实实现。

### P1：打通共享数据读取和最轻展示端

| 项目 | 内容 |
| --- | --- |
| 渠道 | CLI Reader |
| 目标 | 用终端读取同一批新闻数据。 |
| 前置 | `packages/news-schema`、`packages/news-client` 的最小版本。 |
| 交付 | `today`、`list`、`category`、`search`、`sources`、`--json`。 |
| 验收 | CLI 不调用 backend 任务，只从 static JSON 或 Supabase 读取展示数据。 |

| 项目 | 内容 |
| --- | --- |
| 渠道 | Web Reader 整理 |
| 目标 | 让现有 Web Reader 使用共享数据 client。 |
| 前置 | `packages/news-client` 可用。 |
| 交付 | Web Reader 继续可用，数据读取逻辑收敛。 |
| 验收 | 首页和阅读器路由共存，阅读器体验不退化。 |

为什么这一步做 CLI：

- CLI 的界面复杂度最低。
- 能最快验证 `news-schema` 和 `news-client` 是否设计合理。
- 如果 CLI 都不好用，说明共享数据协议还不够稳定。

### P2：做插件渠道

| 项目 | 内容 |
| --- | --- |
| 渠道 | Chrome 浏览器插件 |
| 目标 | 在浏览器 Popup 中快速阅读 AI RSS。 |
| 前置 | `news-client` 稳定，static JSON 数据源可用。 |
| 交付 | Popup Today、分类、搜索、Options、缓存、打开原文。 |
| 验收 | Manifest V3 权限最小化，断网可显示最近缓存。 |

| 项目 | 内容 |
| --- | --- |
| 渠道 | VS Code / Cursor 插件 |
| 目标 | 在编辑器侧边栏中阅读 AI RSS。 |
| 前置 | `news-client` 稳定，Webview 或 Tree View 技术方案确定。 |
| 交付 | Activity Bar、Today、分类、搜索、详情、打开原文、设置项。 |
| 验收 | VS Code 可用，Cursor 基础功能可用。 |

为什么 Chrome 插件排在 IDE 插件前：

- Popup 的产品边界更小。
- UI 可以复用 Web 技术经验。
- IDE 插件需要处理 Extension Host、Webview CSP、命令注册、编辑器兼容性，坑位更多。

### P3：最后做真正移动端 App

| 项目 | 内容 |
| --- | --- |
| 渠道 | Mobile App |
| 目标 | 做一个真正移动端风格的 AI RSS 阅读 App。 |
| 前置 | 共享数据协议稳定，核心展示体验已经被 Web/CLI/插件验证。 |
| 交付 | Today、分类、搜索、详情、设置、本地缓存、弱网状态。 |
| 验收 | 不是 WebView 套壳，不调用 backend 任务，移动端交互完整。 |

为什么最后做：

- 它不是 Web 适配版，需要独立设计。
- 需要移动端导航、手势、缓存、弱网、打包和设备测试。
- 如果太早做，容易被不稳定的数据协议拖着反复改。

## 详细 Roadmap 表

| 阶段 | 渠道 | 难度 | 预计工作重点 | 前置依赖 | 主要交付物 |
| --- | --- | --- | --- | --- | --- |
| P0 | 产品首页 | 低 | 产品叙事、视觉、渠道展示、数据流说明 | 无 | 首页路由、Hero、渠道矩阵、数据流展示 |
| P1-A | `packages/news-schema` | 中 | 统一展示数据协议 | 现有 JSON/Supabase 数据结构 | 类型定义、分类定义、示例数据 |
| P1-B | `packages/news-client` | 中 | 统一只读数据读取 | `news-schema` | static JSON reader、搜索、分类过滤 |
| P1-C | CLI Reader | 低到中 | 命令行展示、配置、JSON 输出 | `news-client` | `today/list/category/search/sources` |
| P1-D | Web Reader 整理 | 中 | 路由调整、接入共享 client | `news-client` | `/` 首页、`/reader` 阅读器 |
| P2-A | Chrome 插件 | 中 | Manifest V3、Popup、Options、缓存 | `news-client` | Popup、分类、搜索、设置页 |
| P2-B | VS Code / Cursor 插件 | 中到高 | Extension API、Webview、命令、兼容性 | `news-client` | Activity Bar、侧边栏、详情、设置 |
| P3 | Mobile App | 高 | 原生移动端体验、缓存、弱网、打包 | 稳定数据协议和展示体验 | Expo App、底部 Tab、详情、搜索、设置 |

## 版本节奏建议

### v0.1：产品入口和协议

- 产品首页。
- `news-schema`。
- `news-client` static JSON 读取。
- Web Reader 路由整理。

### v0.2：CLI 可用

- CLI 基础命令。
- CLI 配置。
- CLI JSON 输出。

### v0.3：浏览器插件

- Chrome Popup。
- Options。
- 缓存。
- 打开原文。

### v0.4：IDE 插件

- VS Code Activity Bar。
- Webview 阅读面板。
- Cursor 兼容验证。

### v0.5：移动端 App

- Expo 工程。
- 移动端 Today、分类、搜索、详情。
- 本地缓存和弱网体验。
- Android 预览包。

## 优先级结论

建议顺序：

```text
产品首页
  -> news-schema / news-client
  -> CLI Reader
  -> Web Reader 整理
  -> Chrome 浏览器插件
  -> VS Code / Cursor 插件
  -> Mobile App
```

如果目标是最快拿到用户可见成果，可以先做：

```text
产品首页 -> CLI Reader -> Chrome 插件
```

如果目标是先把长期架构打稳，可以先做：

```text
news-schema -> news-client -> Web Reader 整理 -> CLI Reader
```
