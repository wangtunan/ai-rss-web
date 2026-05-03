# AI RSS Web

RSS 资讯聚合与 AI 摘要展示项目。

- `frontend`：Vue 3 + Vite，读取静态 JSON 或 Supabase 数据。
- `backend`：Python 抓取任务，读取 RSS、生成摘要，并写入 JSON 或 Supabase/Postgres。

## 1. 安装依赖

### 前端

需要 Node.js `^20.19.0 || >=22.12.0`。

```sh
cd frontend
npm install
```

### 后端

需要 Python 3.11+。

```sh
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Windows Git Bash 激活虚拟环境：

```sh
source .venv/Scripts/activate
```

如果已安装 `uv`，后端脚本会优先使用 `uv run`。

## 2. 本地开发

### 前端

本地默认使用静态 JSON 数据。创建 `frontend/.env.local`：

```env
VITE_DATA_MODE=static
VITE_STATIC_NEWS_LIST_BASE_URL=/data/news
```

```sh
cd frontend
npm run dev
```

### 后端

后端是离线抓取任务，不需要常驻 API 服务。创建 `backend/.env`：

```env
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:5432/postgres?sslmode=require
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=
RSS_SOURCE_MODE=auto
```

说明：

- 写入 Supabase/Postgres 时需要 `DATABASE_URL`。
- 生成 AI 摘要时需要 `OPENAI_API_KEY`。
- `RSS_SOURCE_MODE` 可选值：`auto`、`db`、`yml`。默认 `auto`，优先读数据库，失败或为空时回退 `backend/sources/*.yml`。

## 3. 数据获取

### 前端

前端通过 `VITE_DATA_MODE` 切换数据源：

| 模式 | 配置 | 数据来源 |
| --- | --- | --- |
| 静态 JSON | `VITE_DATA_MODE=static` | `frontend/public/data/news/*.json` |
| Supabase | `VITE_DATA_MODE=supabase` | `public.public_news_items` |

Supabase 模式还需要：

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

静态 JSON 文件：

| 文件 | 说明 |
| --- | --- |
| `all.json` | 全量资讯 |
| `<category>.json` | 分类资讯，例如 `ai.json`、`community.json` |
| `curated-today.json` | 今日精选 |

### 后端

抓取并写入 Supabase/Postgres：

```sh
cd backend
sh fetch_news_to_db.sh
```

抓取并导出静态 JSON：

```sh
cd backend
sh fetch_news_to_json.sh
```

导入 yml RSS 源到数据库：

```sh
cd backend
sh import_rss_sources.sh
```

常用参数：

```sh
sh fetch_news_to_db.sh 5
sh fetch_news_to_db.sh community.yml
sh fetch_news_to_db.sh 5 community.yml

sh fetch_news_to_json.sh 5
sh fetch_news_to_json.sh community.yml
sh fetch_news_to_json.sh 5 community.yml
```

也可以直接运行 Python 入口：

```sh
python -m app.jobs.fetch_news_to_db --max-entries 5 community.yml
python -m app.jobs.fetch_news_to_json --max-entries 5 community.yml
```

## 4. 上线

### 前端

构建前按部署方式设置环境变量：

- 静态 JSON：`VITE_DATA_MODE=static`
- Supabase：`VITE_DATA_MODE=supabase`，并配置 `VITE_SUPABASE_URL`、`VITE_SUPABASE_PUBLISHABLE_KEY`

```sh
cd frontend
npm run build
```

构建产物在 `frontend/dist`。

### 后端

推荐用定时任务运行抓取脚本。仓库已有 GitHub Actions：

```text
.github/workflows/corn.yml
```

需要配置 GitHub Secrets：

```text
DATABASE_URL
OPENAI_API_KEY
OPENAI_BASE_URL
OPENAI_MODEL
```

工作流会执行数据库迁移并抓取数据：

```sh
python -m alembic upgrade head
python -m app.jobs.fetch_news_to_db --max-entries 20
```

如果上线静态 JSON 链路，将定时任务改为：

```sh
python -m app.jobs.fetch_news_to_json --max-entries 20
```
