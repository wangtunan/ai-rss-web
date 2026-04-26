# AI 资讯看板

一个基于 AI 的资讯看板。本地使用 FastAPI + SQLAlchemy + SQLite 练习 Python 接口服务，线上使用 GitHub Actions 定时抓取 RSS、生成静态 JSON，并由前端直接读取静态资源展示资讯。

## 项目结构

- `frontend/`: Vue 3 前端
- `backend/`: FastAPI + SQLAlchemy 后端
- `backend/app/jobs/fetch_news.py`: 抓取、摘要、入库并导出静态 JSON 的任务命令
- `backend/app/main.py`: API 入口
- `frontend/public/data/news.json`: 线上静态数据文件
- `frontend/public/data/news/*.json`: 按分类生成的静态列表接口数据

## 前端本地开发
```sh
$ cd frontend
$ npm install
$ npm run dev
```

## 后端本地开发

本地默认使用 SQLite：`sqlite:///./data/news.db`。如果需要覆盖数据库地址，可以在 `backend/.env` 中配置 `DATABASE_URL`。

```sh
$ cd backend
$ uv sync
$ python -m alembic upgrade head
$ python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 运行抓取任务（本地）

该命令会抓取 RSS、生成 AI 摘要、写入 SQLite，并导出 `frontend/public/data/news.json` 和 `frontend/public/data/news/*.json`。

```sh
$ cd backend
$ python -m app.jobs.fetch_news --max-entries 20
```

## API 示例

- 健康检查: `GET /health`
- 新闻列表: `GET /api/v1/news?limit=100`
- 分类列表: `GET /api/v1/news/list?category=openai&limit=10`

## 前端数据源模式

前端通过环境变量决定读取本地 API 还是静态 JSON。

本地 API 模式：

```env
VITE_DATA_MODE=api
VITE_API_BASE_URL=http://localhost:8000
```

线上静态模式：

```env
VITE_DATA_MODE=static
VITE_STATIC_NEWS_URL=/data/news.json
VITE_STATIC_NEWS_LIST_BASE_URL=/data/news
```

## 线上部署（GitHub + 静态 JSON）

线上不部署 Python 服务。GitHub Actions 会定时运行 `backend/app/jobs/fetch_news.py`，更新 `frontend/public/data` 下的静态 JSON 并提交回仓库。

需要在 GitHub Secrets 中配置：

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

前端部署到 GitHub Pages、Vercel 或 Cloudflare Pages 时，将数据源模式设置为：

- `VITE_DATA_MODE=static`
- `VITE_STATIC_NEWS_URL=/data/news.json`
- `VITE_STATIC_NEWS_LIST_BASE_URL=/data/news`