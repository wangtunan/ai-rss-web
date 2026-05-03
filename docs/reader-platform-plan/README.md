# AI RSS 多端展示计划

## 目标

本计划用于把当前 AI RSS 项目扩展为 monorepo 结构下的多端展示产品：

- `backend`：数据生产端，继续负责 RSS 抓取、AI 摘要、入库、导出 JSON。
- `frontend`：Web 展示端，继续承担浏览器访问场景。
- `mobile`：真正移动端风格的 App，不从 Web 页面简单适配。
- `cli`：终端阅读器，只负责读取和展示新闻。
- `packages`：共享展示数据协议、类型定义和只读数据 client。

App 和 CLI 的定位与 Web 前端一致，都是“展示端”。它们不负责抓取、入库、AI 摘要、RSS 源导入等后台生产任务。

## 推荐目录结构

```text
ai-rss-web/
  backend/
  frontend/
  mobile/
  cli/
  packages/
    news-schema/
    news-client/
  docs/
    reader-platform-plan/
      README.md
      mobile-app-plan.md
      cli-reader-plan.md
```

## 应用职责

### backend

`backend` 继续作为数据生产层存在：

- 抓取 RSS。
- 调用 AI 生成摘要、评分、分类等展示字段。
- 写入 Supabase/Postgres。
- 导出 static JSON。
- 维护 RSS 源数据。

`backend` 不需要为了 App 或 CLI 增加额外展示逻辑。它只需要保证输出的数据格式稳定。

### frontend

`frontend` 继续作为 Web 阅读端：

- 读取 static JSON 或 Supabase。
- 展示今日精选、分类新闻、新闻卡片、来源信息。
- 后续逐步切换到共享的 `packages/news-client`。

### mobile

`mobile` 是独立移动端应用，不是 WebView 套壳，也不是 Web 页面缩放版：

- 使用原生移动端导航、列表、详情页、下拉刷新、搜索等交互。
- 读取与 Web 相同的数据协议。
- 支持本地缓存最近新闻。
- 可选支持收藏、已读状态、系统分享。

详细计划见 [mobile-app-plan.md](./mobile-app-plan.md)。

### cli

`cli` 是终端阅读器：

- 支持今日精选、列表、分类、搜索、来源查看。
- 支持表格、纯文本、JSON 输出。
- 只读取数据，不执行抓取、入库、摘要等任务。

详细计划见 [cli-reader-plan.md](./cli-reader-plan.md)。

## 共享包设计

### packages/news-schema

负责定义展示端共同遵守的数据契约。

建议包含：

- `NewsItem`
- `NewsCategory`
- `CuratedNews`
- `RssSource`
- `NewsRating`
- `DataMode`
- static JSON 文件结构定义
- Supabase 返回数据结构映射

建议使用 TypeScript 类型，并可选引入 Zod 做运行时校验。

### packages/news-client

负责提供只读数据访问能力。

建议包含：

```text
createNewsClient()
getAllNews()
getTodayNews()
getCategoryNews(category)
searchNews(keyword)
getSources()
```

数据来源可以支持：

- static JSON URL
- Supabase
- 后续可选 HTTP API

三端调用关系：

```text
frontend -> packages/news-client
mobile   -> packages/news-client
cli      -> packages/news-client
```

## 数据流

```text
RSS 源
  -> backend 抓取和摘要
  -> Supabase/Postgres 或 static JSON
  -> packages/news-client
  -> frontend / mobile / cli
```

展示端不反向调用抓取任务，也不直接修改生产数据。

## 阶段计划

### 阶段 1：稳定展示数据协议

目标：

- 明确展示端需要的字段。
- 确认 static JSON 与 Supabase 两种来源的数据结构。
- 抽出 `packages/news-schema`。

交付物：

- `packages/news-schema`
- 新闻条目、分类、来源、今日精选等类型定义
- 示例数据文件或 fixture

### 阶段 2：抽出只读数据 client

目标：

- 抽出 `packages/news-client`。
- 统一封装 static JSON 和 Supabase 读取逻辑。
- 让 Web、Mobile、CLI 都调用同一套读取能力。

交付物：

- `packages/news-client`
- static JSON reader
- Supabase reader
- 搜索、分类过滤、排序等纯展示端能力

### 阶段 3：调整 Web 前端

目标：

- 让 `frontend` 从共享 client 读取数据。
- 保持现有 Web 展示体验不退化。

交付物：

- `frontend` 接入 `packages/news-client`
- 删除或收敛重复的数据读取逻辑

### 阶段 4：实现 CLI 阅读器

目标：

- 新增 `cli` 应用。
- 完成非交互式命令。
- 支持终端友好的新闻展示。

交付物：

- `cli today`
- `cli list`
- `cli category`
- `cli search`
- `cli sources`
- `--json` 输出

### 阶段 5：实现真正移动端 App

目标：

- 新增 `mobile` 应用。
- 使用移动端原生交互模型设计页面。
- 接入共享数据 client。

交付物：

- 底部 Tab
- 今日精选
- 分类列表
- 新闻详情
- 搜索
- 设置
- 本地缓存

### 阶段 6：统一配置和发布

目标：

- 统一 monorepo 开发命令。
- 明确 Web、Mobile、CLI 的配置方式。
- 梳理发布流程。

交付物：

- 根目录 workspace 配置
- `.env.example`
- README 更新
- CLI 发布说明
- Mobile 打包说明

## 技术建议

### Monorepo

建议使用 npm workspaces 或 pnpm workspace。当前 `frontend` 已经使用 Node/Vite，CLI 和共享包也适合 TypeScript，因此 workspace 对项目结构比较自然。

初版可以使用 npm workspaces，降低迁移成本。后续如果 workspace 包较多，再考虑 pnpm。

### Mobile

建议使用 Expo / React Native。

原因：

- 这是独立移动端应用，不是 Web 适配或 WebView 套壳。
- 可以复用 TypeScript 类型和 `news-client`。
- 适合快速产出 Android/iOS 双端应用。
- 支持原生导航、手势、下拉刷新、系统分享、离线缓存。

### CLI

建议使用 Node.js + TypeScript。

原因：

- 可以直接复用 `news-schema` 和 `news-client`。
- 与 Web、Mobile 的展示数据模型一致。
- 适合发布为 npm 包或本地 workspace 命令。

## 最小可行版本

第一版建议收敛为：

- monorepo 目录调整完成。
- `packages/news-schema` 完成基础类型。
- `packages/news-client` 支持 static JSON。
- `frontend` 可继续正常展示。
- `cli` 支持 `today`、`list`、`category`、`search`。
- `mobile` 支持底部 Tab、今日精选、分类、详情、搜索。

暂不做：

- App 端 RSS 源管理。
- CLI 端抓取或入库。
- App 端后台定时抓取。
- 多用户账号系统。
- 复杂推荐算法。

## 风险和注意事项

- 需要先稳定展示数据协议，否则三端会重复适配数据结构。
- App 既然要是真移动端体验，就不要直接复用 Web 组件，只复用数据 client 和类型。
- CLI 应该保持只读边界，避免和 backend jobs 职责混在一起。
- static JSON 和 Supabase 两种数据源需要在 `news-client` 层统一返回结构。
- 移动端需要考虑缓存、弱网、加载失败、空状态。
- 终端展示需要考虑中文宽度、链接过长、摘要过长等问题。
