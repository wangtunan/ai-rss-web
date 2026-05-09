# @ai-rss/cli

AI RSS 的只读终端阅读器。CLI 只负责展示现有数据，不负责抓取、入库、RSS 源管理或 AI 摘要生产。

## 本地使用

先构建 CLI：

```sh
pnpm build:cli
```

配置静态展示数据地址：

```sh
pnpm cli -- config set static-base-url http://localhost:5173/data/news
pnpm cli -- config set default-limit 20
pnpm cli -- config get
```

读取新闻：

```sh
pnpm cli -- today
pnpm cli -- list
pnpm cli -- list --category openai --limit 5
pnpm cli -- list --compact --limit 10
pnpm cli -- category hacker_news --limit 10
pnpm cli -- search openai --limit 10
pnpm cli -- search openai --compact
pnpm cli -- sources
```

检查当前配置和静态数据可访问性：

```sh
pnpm cli -- doctor
pnpm cli -- doctor --json
```

`doctor` 会检查 `all.json`、`curated-today.json` 和 `sources.json`。如果某个文件返回 HTML，通常表示静态目录里缺少对应 JSON，或 dev server 把缺失文件回退到了网页入口。

输出 JSON：

```sh
pnpm cli -- today --json
pnpm cli -- --json list --limit 5
```

发布前 smoke test：

```sh
pnpm smoke:cli
```

本地链接为 `ai-rss` 命令：

```sh
pnpm --filter @ai-rss/cli link --global
ai-rss --help
ai-rss doctor
```

配置文件默认写入：

```text
~/.ai-rss/config.json
```

## 环境变量

环境变量会覆盖配置文件：

```text
AI_RSS_DATA_MODE
AI_RSS_STATIC_BASE_URL
AI_RSS_SUPABASE_URL
AI_RSS_SUPABASE_KEY
AI_RSS_DEFAULT_LIMIT
```

当前阶段已接入 `static` 数据模式。`supabase` 模式保留配置入口，但 client 侧尚未实现读取。
