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
sh fetch_news_to_db.sh
```

限制每个源抓取数量：

```sh
sh fetch_news_to_db.sh 5
```

只抓某个 yml：

```sh
sh fetch_news_to_db.sh community.yml
```

只抓某个 yml，并限制每个源数量：

```sh
sh fetch_news_to_db.sh 5 community.yml
```

也可以直接运行 Python 入口：

```sh
python -m app.jobs.fetch_news_to_db --max-entries 5 community.yml
```

## 导出本地 JSON

如果不需要数据库，只想抓取 RSS 并导出前端可用的静态 JSON 文件，使用 `fetch_news_to_json.sh`。该脚本会抓取 RSS、调用 AI 生成摘要，然后输出到 `frontend/public/data/news/` 目录，前端直接读取即可。

后端需要配置 `backend/.env`（不需要 `DATABASE_URL`）：

```env
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=
```

全量导出：

```sh
cd backend
sh fetch_news_to_json.sh
```

限制每个源抓取数量：

```sh
sh fetch_news_to_json.sh 5
```

只抓某个 yml：

```sh
sh fetch_news_to_json.sh community.yml
```

只抓某个 yml，并限制每个源数量：

```sh
sh fetch_news_to_json.sh 5 community.yml
```

也可以直接运行 Python 入口：

```sh
python -m app.jobs.fetch_news_to_json --max-entries 5 community.yml
```

导出完成后，启动前端即可看到最新数据：

```sh
cd frontend
npm run dev
```

### 输出文件说明

导出后 `frontend/public/data/news/` 下会生成以下文件：

| 文件 | 说明 |
| --- | --- |
| `all.json` | 全量新闻（默认最多 500 条） |
| `<category>.json` | 按分类拆分的新闻（如 `ai.json`、`community.json`） |
| `curated-today.json` | 今日精选（按重要性排序，最多 20 条） |

每条新闻包含以下字段：

```json
{
  "category": "分类标识",
  "source": "来源名称",
  "title": "标题",
  "link": "原文链接",
  "published_time": "发布时间",
  "raw_content": "原始内容摘要",
  "ai_summary": "AI 生成的中文摘要",
  "ai_tags": ["标签1", "标签2"],
  "ai_importance": 4
}
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
