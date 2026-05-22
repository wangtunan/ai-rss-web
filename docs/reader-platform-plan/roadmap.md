# 多端展示 Roadmap

## 排序原则

本 Roadmap 按产品推进优先级排序，不按实现难度从低到高排序。

当前优先级：

```text
Mobile App
  -> VS Code / Cursor 插件
  -> CLI Reader
  -> Chrome 浏览器插件
  -> 产品首页
```

难度仍主要按以下维度判断：

- 是否能复用现有 Vue/Web 能力。
- 是否需要独立 UI 体系。
- 是否需要处理平台审核和打包。
- 是否需要处理特殊运行环境限制。
- 是否需要本地缓存、权限、配置、安全策略。
- 是否需要跨平台兼容。

本 Roadmap 只覆盖展示端，不包含 backend 抓取、入库、AI 摘要等生产任务。

## 优先级总览

| 顺序 | 渠道 | 难度 | 建议阶段 | 主要原因 |
| --- | --- | --- | --- | --- |
| 1 | Mobile App | 高 | P0 | 用户感知最强，需要尽早确定移动端交互、缓存、弱网和数据协议是否足够稳定。 |
| 2 | VS Code / Cursor 插件 | 中到高 | P1 | 面向开发者阅读场景，能验证编辑器侧边栏、Webview 安全策略和 Cursor 兼容性。 |
| 3 | CLI Reader | 低到中 | P2 | 实现成本较低，适合补齐终端阅读和 JSON 输出能力。 |
| 4 | Chrome 浏览器插件 | 中 | P3 | Popup 形态较小，但需要 Manifest V3、权限、缓存和审核准备。 |
| 5 | 产品首页 | 低 | P4 | 基于现有 Web 技术实现，主要承担统一叙事和入口展示。 |

## 共享前置能力

不管先做哪个展示端，都建议先抽出最小共享能力：

| 项目 | 内容 |
| --- | --- |
| `packages/news-schema` | 定义展示端共同使用的数据结构。 |
| `packages/news-client` | 提供 static JSON / Supabase 的只读数据读取能力。 |

最小要求：

- `NewsItem`、`NewsCategory`、`RssSource`、`CuratedNews` 等基础类型可用。
- 能从 static JSON 读取新闻列表。
- 支持今日精选、分类过滤、搜索、来源列表。
- 不调用 backend 抓取、入库、AI 摘要等生产任务。

## 推荐实施顺序

### P0：先做 Mobile App

| 项目 | 内容 |
| --- | --- |
| 渠道 | Mobile App |
| 目标 | 做一个真正移动端风格的 AI RSS 阅读 App。 |
| 前置 | `packages/news-schema`、`packages/news-client` 的最小版本。 |
| 交付 | Today、分类、搜索、详情、设置、本地缓存、弱网状态。 |
| 验收 | 不是 WebView 套壳，不调用 backend 任务，移动端交互完整。 |

为什么先做：

- App 是用户感知最强的独立产品形态。
- 可以尽早验证数据协议是否适合移动端列表、详情、缓存和弱网场景。
- 如果移动端体验能跑通，后续 CLI、插件和首页都可以围绕同一套数据能力展开。

### P1：做 VS Code / Cursor 插件

| 项目 | 内容 |
| --- | --- |
| 渠道 | VS Code / Cursor 插件 |
| 目标 | 在编辑器侧边栏中阅读 AI RSS。 |
| 前置 | `news-client` 稳定，Webview 或 Tree View 技术方案确定。 |
| 交付 | Activity Bar、Today、分类、搜索、详情、打开原文、设置项。 |
| 验收 | VS Code 可用，Cursor 基础功能可用。 |

为什么第二步做编辑器插件：

- 它是差异化较强的开发者阅读场景。
- 可以验证新闻阅读是否适合编辑器侧边栏和命令体系。
- IDE 插件的 Webview CSP、命令注册、扩展配置等限制应尽早暴露。

### P2：做 CLI Reader

| 项目 | 内容 |
| --- | --- |
| 渠道 | CLI Reader |
| 目标 | 用终端读取同一批新闻数据。 |
| 前置 | `packages/news-client` 可用。 |
| 交付 | `today`、`list`、`category`、`search`、`sources`、`--json`。 |
| 验收 | CLI 不调用 backend 任务，只从 static JSON 或 Supabase 读取展示数据。 |

为什么 CLI 放在第三步：

- 实现成本低，适合在 App 和 IDE 插件之后补齐开发者工具链。
- 可以进一步验证 `news-client` 在非 UI 环境下是否足够纯粹。
- `--json` 输出也方便后续自动化和脚本集成。

### P3：做 Chrome 浏览器插件

| 项目 | 内容 |
| --- | --- |
| 渠道 | Chrome 浏览器插件 |
| 目标 | 在浏览器 Popup 中快速阅读 AI RSS。 |
| 前置 | `news-client` 稳定，static JSON 数据源可用。 |
| 交付 | Popup Today、分类、搜索、Options、缓存、打开原文。 |
| 验收 | Manifest V3 权限最小化，断网可显示最近缓存。 |

为什么 Chrome 插件排在 CLI 后：

- 浏览器插件需要处理 Manifest V3、跨域请求、权限和审核。
- Popup 产品边界较小，但平台限制比 CLI 更多。
- 等 App、IDE、CLI 的数据读取方式稳定后再做，返工更少。

### P4：最后做产品首页

| 项目 | 内容 |
| --- | --- |
| 渠道 | 产品首页 |
| 目标 | 让用户一眼理解 AI RSS Web 的能力和支持渠道。 |
| 前置 | App、IDE 插件、CLI、浏览器插件的方向基本确定。 |
| 交付 | Hero、渠道矩阵、能力展示、数据流、进入 Web Reader 的入口。 |
| 验收 | 首页明确展示 Web、App、CLI、VS Code / Cursor、Chrome 五个渠道。 |

为什么最后做：

- 首页主要承担对外叙事，适合在产品形态更明确后统一包装。
- 前面几个端的真实能力可以反哺首页文案和渠道矩阵。
- 避免首页先承诺过多还没验证的能力。

## 详细 Roadmap 表

| 阶段 | 渠道 | 难度 | 预计工作重点 | 前置依赖 | 主要交付物 |
| --- | --- | --- | --- | --- | --- |
| P0-A | `packages/news-schema` | 中 | 统一展示数据协议 | 现有 JSON/Supabase 数据结构 | 类型定义、分类定义、示例数据 |
| P0-B | `packages/news-client` | 中 | 统一只读数据读取 | `news-schema` | static JSON reader、搜索、分类过滤 |
| P0-C | Mobile App | 高 | 原生移动端体验、缓存、弱网、打包 | `news-client` | Expo App、底部 Tab、详情、搜索、设置 |
| P1 | VS Code / Cursor 插件 | 中到高 | Extension API、Webview、命令、兼容性 | `news-client` | Activity Bar、侧边栏、详情、设置 |
| P2 | CLI Reader | 低到中 | 命令行展示、配置、JSON 输出 | `news-client` | `today/list/category/search/sources` |
| P3 | Chrome 插件 | 中 | Manifest V3、Popup、Options、缓存 | `news-client` | Popup、分类、搜索、设置页 |
| P4 | 产品首页 | 低 | 产品叙事、视觉、渠道展示、数据流说明 | 多端方向确定 | 首页路由、Hero、渠道矩阵、数据流展示 |
| P5 | Web Reader 整理 | 中 | 路由调整、接入共享 client | `news-client` | `/` 首页、`/reader` 阅读器 |

## 版本节奏建议

### v0.1：App 和共享协议

- `news-schema`。
- `news-client` static JSON 读取。
- Expo Mobile App。
- 移动端 Today、分类、搜索、详情。
- 本地缓存和弱网体验。

### v0.2：IDE 插件

- VS Code Activity Bar。
- Webview 阅读面板。
- Today、分类、搜索、详情。
- Cursor 兼容验证。

### v0.3：CLI 可用

- CLI 基础命令。
- CLI 配置。
- CLI JSON 输出。

### v0.4：浏览器插件

- Chrome Popup。
- Options。
- 缓存。
- 打开原文。

### v0.5：首页和 Web Reader 整理

- 产品首页。
- 渠道矩阵。
- 数据流展示。
- Web Reader 路由整理。
- Web Reader 接入共享 client。

## 优先级结论

建议顺序：

```text
news-schema / news-client
  -> Mobile App
  -> VS Code / Cursor 插件
  -> CLI Reader
  -> Chrome 浏览器插件
  -> 产品首页
  -> Web Reader 整理
```

如果目标是最快得到一个用户可感知的独立产品，可以先做：

```text
news-schema / news-client -> Mobile App
```

如果目标是优先覆盖开发者阅读场景，可以先做：

```text
news-schema / news-client -> VS Code / Cursor 插件 -> CLI Reader
```
