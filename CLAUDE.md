# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库中工作提供指导。

## 项目概览

本仓库是一个 AI/RSS 新闻看板，包含 Vue 前端和 Python 抓取入库后端。

- `frontend/` 是 Vue 3 + Vite + TypeScript 应用，使用 Pinia、Vue Router、Sass、Supabase 和 Vercel Analytics。
- `backend/` 负责抓取 RSS 源，通过 OpenAI 兼容 API 生成摘要，将新闻存入 Postgres/Supabase，并可为前端导出静态 JSON。
- `backend/sources/` 存放 YAML RSS 源分组；`backend/sources/sources.yml` 是默认 include 入口。
- `backend/migrations/` 存放 Alembic 迁移，用于新闻表、视图和 RLS 相关设置。
- `.github/workflows/corn.yml` 运行定时抓取任务：安装后端依赖、执行 Alembic upgrade，然后抓取新闻写入数据库。

## 常用命令

### 前端

除非特别说明，以下命令都在 `frontend/` 下运行。

```bash
pnpm install
pnpm dev
pnpm build
pnpm build-only
pnpm type-check
pnpm lint
pnpm lint:oxlint
pnpm lint:eslint
pnpm format
pnpm preview
```

说明：
- 前端要求 Node `^20.19.0 || >=22.12.0`。
- `pnpm build` 会通过 `npm-run-all2` 并行运行 `vue-tsc --build` 和 `vite build`。
- `pnpm lint` 会同时运行 Oxlint 和 ESLint，并带 `--fix`。
- `frontend/package.json` 当前未配置前端测试运行器。

### 后端

除非特别说明，以下命令都在 `backend/` 下运行。

```bash
python -m venv .venv
pip install -r requirements.txt
python -m alembic upgrade head
python -m app.jobs.fetch_news_to_db --max-entries 20
python -m app.jobs.fetch_news_to_db --max-entries 20 --source-file ai
python -m app.jobs.fetch_news_to_json --max-entries 20
```

数据库写入所需环境变量：

```bash
DATABASE_URL=...
```

AI 摘要所需环境变量：

```bash
OPENAI_API_KEY=...
OPENAI_BASE_URL=...
OPENAI_MODEL=...
```

如果未提供 `OPENAI_API_KEY`，后端摘要生成会降级为空摘要、空标签和默认重要性。

## 前端架构

- 应用入口在 `frontend/src/main.ts`，挂载 `App.vue` 前会安装 Pinia 和 router。
- 路由在 `frontend/src/router/index.ts` 中使用 hash history。`/` 渲染 `Layout` 并重定向到 `/curated`；子视图包含 `dashboard`、`curated` 和 `subscription`。
- 页面级路由目标放在 `frontend/src/views/<page>/index.vue`，样式放在同目录 `index.scss`。
- 可复用 UI 组件放在 `frontend/src/components/<Name>/index.vue`，样式放在同目录 `index.scss`。
- 数据访问集中在 `frontend/src/api/`。`frontend/src/api/news/index.ts` 根据 `VITE_DATA_MODE` 在静态 JSON 和 Supabase 之间切换（默认 `static`，支持 `supabase`）。
- Supabase 客户端在 `frontend/src/utils/supabase.ts` 中创建，读取 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_PUBLISHABLE_KEY`。
- 跨组件视图状态使用 `frontend/src/stores/` 中的 Pinia store；可复用组合式逻辑放在 `frontend/src/hooks/`。
- 静态分类元数据、排序和导航配置放在 `frontend/src/constants/`；共享 TypeScript 契约放在 `frontend/src/types/`。
- 主题 token 和主题逻辑放在 `frontend/src/theme/` 与 `frontend/src/hooks/useTheme.ts`；全局样式通过 `frontend/src/styles/index.css` 进入应用。

## 后端架构

- `app/jobs/fetch_news_to_db.py` 是定时数据库抓取流程的 CLI 入口。
- `app/jobs/fetch_news_to_json.py` 会把摘要后的新闻导出到 `frontend/public/data/news/*.json`，供前端静态模式使用。
- `app/services/source_loader.py` 加载 YAML 源入口和被 include 的源文件。
- `app/services/feed_service.py` 并发解析 RSS feed，并规范化原始条目。
- `app/services/summarize_service.py` 将条目分批发送到 OpenAI 兼容 Chat API，并合并返回的摘要、标签和重要性评分。
- `app/services/ingest_service.py` 编排源加载、feed 解析、摘要生成、数据库写入、旧数据清理和静态 JSON 导出。
- `app/repositories/news_repository.py` 负责新闻条目的 SQLAlchemy 查询和持久化。
- `app/db/models/news_item.py` 定义 `news_items` SQLAlchemy 模型；迁移会创建后端表和前端 Supabase 模式使用的 public view。

## 仓库特定前端约定

这些约定来自 `.agents/skills/`，编辑前端代码时应遵守。

### Vue 单文件组件标准

- Vue SFC 块顺序必须是：`<template>`，然后 `<script setup lang="ts">`，最后 `<style ...>`。
- 使用 TypeScript：`<script setup lang="ts">`，并保持 2 空格缩进。
- 推荐 import 顺序：Vue 相关导入、内部 `@/...` 导入、适用时再放 type-only 导入。
- 组件样式默认使用外部 Dart Sass 文件：

```vue
<style scoped src="./index.scss" lang="scss"></style>
```

- 可复用组件应使用单组件文件夹结构：

```text
components/CategoryCard/
  index.vue
  index.scss
```

- 组件本地 class 应严格遵循 BEM 命名，例如 `.category-card`、`.category-card__title`、`.category-card__title--active`。

### 前端目录组织

`frontend/src/` 下默认使用以下结构：

```text
App.vue
views/
components/
types/
hooks/
api/
constants/
theme/
```

放置规则：
- 保持 `App.vue` 作为入口壳；路由和页面 UI 应放在 `views/`。
- 页面是 `views/<page>/index.vue` 下的路由目标，页面样式放在同目录 `index.scss`。
- 可复用 UI 块放在 `components/<Name>/index.vue`，组件样式放在同目录 `index.scss`。
- 共享接口放在 `types/`；interface 字段应有简洁中文注释。
- 可复用有状态逻辑放在 `hooks/useXxx.ts`。
- 组件和 hooks 应消费 `api/` 中的请求函数，不要内联原始请求代码。
- 静态配置和映射表放在 `constants/`。
- 主题常量、hooks 和全局主题 CSS 放在 `theme/`。

### UI 设计规范

- 前端以暗色主题优先；亮色模式是可选项。
- 使用 CSS 变量或主题 token，不要在多个组件中重复硬编码颜色。
- 保持看板视觉语言一致：易读、数据导向、干净，不要像通用模板。
- 新闻卡片应保持清晰层级：标题、摘要、元数据、标签。
- 分类卡片网格应支持桌面最多 3 列、平板 2 列、移动端 1 列。
- Hover、focus、active、loading、empty 和 error 状态应明确；键盘焦点应始终可见。
- 分类图标可行时应使用官方品牌 favicon，并提供一致的兜底图标。
