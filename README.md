# AI RSS Web

一个 AI RSS 聚合页面。

## 当前模式

- 本地开发默认使用静态 JSON：`frontend/public/data/news/*.json`。
- 线上使用 Supabase：前端直接读取 `public.public_news_items`。
- Python 后端只负责抓取 RSS、调用模型总结、写入 Supabase Postgres。
- 项目只保留前端页面和 Python 抓取任务这两条运行路径。

## 本地前端开发

默认不需要配置数据库，也不需要启动后端 API。

```sh
cd frontend
npm install
npm run dev
```

本地默认数据源等价于：

```env
VITE_DATA_MODE=static
VITE_STATIC_NEWS_LIST_BASE_URL=/data/news
```

## 线上前端配置

线上部署时配置 Supabase 读取模式：

```env
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

前端会读取 Supabase REST API：

```text
/rest/v1/public_news_items
```

## 抓取数据到 Supabase

后端需要配置 `backend/.env`：

```env
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:5432/postgres?sslmode=require
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=
```

全量抓取：

```sh
cd backend
sh fetch_news.sh
```

限制每个源抓取数量：

```sh
sh fetch_news.sh 5
```

只抓某个 yml：

```sh
sh fetch_news.sh community.yml
```

只抓某个 yml，并限制每个源数量：

```sh
sh fetch_news.sh 5 community.yml
```

也可以直接运行 Python 入口：

```sh
python -m app.jobs.fetch_news_to_db --max-entries 5 community.yml
```

## GitHub Actions

`.github/workflows/corn.yml` 会定时执行：

```text
alembic upgrade head
python -m app.jobs.fetch_news_to_db --max-entries 20
```

需要配置 GitHub Secrets：

```text
DATABASE_URL
OPENAI_API_KEY
OPENAI_BASE_URL
OPENAI_MODEL
```
