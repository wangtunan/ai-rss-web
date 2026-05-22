# Docker 自部署改造计划

## 背景

当前项目线上链路采用 Supabase API：

- 前端：构建为静态站点，运行时通过 Supabase publishable key 直接请求 Supabase。
- 后端：不是常驻 API 服务，只负责定时抓取 RSS、生成 AI 摘要、执行迁移并写入 Supabase/Postgres。
- `static` 模式保留为快速体验模式，不作为正式线上部署方案。

因此 Docker 化目标不是新增后端 API，而是把前端静态托管和后端定时任务容器化。

## 目标架构

```text
服务器 Docker Compose
├── frontend
│   ├── 构建 Vue/Vite 前端
│   └── 使用 Nginx 托管 dist
└── worker
    ├── 安装 Python 后端依赖
    ├── 定时执行数据库迁移
    └── 定时执行 RSS 抓取任务并写入 Supabase/Postgres

外部服务
└── Supabase
    ├── 前端读取 public 表 / view
    └── worker 通过 DATABASE_URL 写入
```

## 需要新增的文件

```text
Dockerfile 或 frontend/Dockerfile
frontend/nginx.conf
backend/Dockerfile
backend/entrypoint.sh 或 backend/worker.sh
docker-compose.yml
.dockerignore
.env.example
```

## 前端容器方案

前端使用多阶段构建：

1. Node 阶段安装依赖并执行 `npm run build`。
2. Nginx 阶段复制 `frontend/dist` 到 `/usr/share/nginx/html`。
3. Nginx 只负责静态资源和 SPA fallback，不需要反代 `/api`。

构建参数：

```env
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

注意：Vite 的 `VITE_*` 变量会在构建时写入前端产物，因此这些变量需要在 Docker build 阶段传入。

## 后端 worker 容器方案

后端使用 Python 镜像：

1. 安装 `backend/requirements.txt`。
2. 复制 `backend` 目录。
3. 启动后按固定间隔执行：
   - `python -m alembic upgrade head`
   - `python -m app.jobs.fetch_news_to_db --max-entries 20`

运行环境变量：

```env
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:5432/postgres?sslmode=require
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=
FETCH_INTERVAL_SECONDS=21600
FETCH_MAX_ENTRIES=20
```

默认建议每 2 小时抓取一次`FETCH_INTERVAL_SECONDS=7200`。

## docker-compose 设计

Compose 只包含两个服务：

```text
frontend
worker
```

`frontend`：

- 暴露 `80:80`。
- `restart: unless-stopped`。
- 通过 build args 注入 Supabase 前端变量。

`worker`：

- 不暴露端口。
- `restart: unless-stopped`。
- 通过 environment 注入数据库和 AI 相关变量。
- 循环执行抓取任务。

## 部署流程

服务器首次部署：

```sh
git clone <repo-url>
cd ai-rss-web
cp .env.example .env
# 编辑 .env，填入 Supabase 和 OpenAI 配置
docker compose up -d --build
```

后续更新：

```sh
git pull
docker compose up -d --build
```

查看日志：

```sh
docker compose logs -f frontend
docker compose logs -f worker
```

手动触发一次抓取：

```sh
docker compose exec worker python -m app.jobs.fetch_news_to_db --max-entries 20
```

## 需要确认的实现细节

1. 前端包管理器当前 README 使用 `npm`，Dockerfile 先按 `npm ci` / `npm install` 设计。
2. worker 定时方式可选：
   - 简单 shell loop：依赖少，够用。
   - cron/supercronic：更接近传统定时任务，但多一个运行组件。
3. 是否每次抓取前都执行 `alembic upgrade head`：建议保留，方便自动部署数据库变更。
4. 是否固定开放宿主机 `80` 端口：如果服务器已有 Nginx/Caddy，可改为只暴露 `8080:80`，再由宿主机反代。

## 非目标

- 不新增后端 API 服务。
- 不移除 `static` 模式。
- 不把 Supabase 替换成本地 PostgreSQL。
- 不改变前端现有数据读取逻辑，只在 Docker 构建时指定 `supabase` 模式。
