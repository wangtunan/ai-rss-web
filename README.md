# AI 资讯看板

一个基于 AI 的资讯看板，支持定时抓取 RSS、生成 AI 摘要、写入 PostgreSQL，并由前端通过 API 展示分类资讯。

## 项目结构

- `frontend/`: Vue 3 前端
- `backend/`: FastAPI + SQLAlchemy 后端
- `backend/app/jobs/fetch_news.py`: 抓取与摘要任务命令
- `backend/app/main.py`: API 入口

## 前端本地开发
```sh
$ cd frontend
$ npm install
$ npm run dev
```

## 后端本地开发
```sh
$ cd backend
$ uv sync
$ python -m alembic upgrade head
$ python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 运行抓取任务（本地）

```sh
$ cd backend
$ python -m app.jobs.fetch_news --max-entries 20
```

## API 示例

- 健康检查: `GET /health`
- 新闻列表: `GET /api/v1/news?limit=100`

## 生产部署（Railway）

建议拆分两个服务，共用同一个 Postgres：

- `backend-api`
  - Root Directory: `backend`
  - Start Command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - Healthcheck: `/health`
- `backend-fetcher`
  - Root Directory: `backend`
  - Command: `python -m app.jobs.fetch_news --max-entries 20`
  - 使用 Cron Schedule 定时触发

后端服务需要的主要变量：

- `DATABASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

前端线上变量：

- `VITE_API_BASE_URL=https://<your-backend-domain>`