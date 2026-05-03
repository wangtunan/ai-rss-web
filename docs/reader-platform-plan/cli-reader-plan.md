# CLI Reader 详细计划

## 定位

`cli` 是终端新闻阅读器，职责与 Web 前端一致：读取已经生成好的新闻数据并展示。

它不负责：

- RSS 抓取。
- AI 摘要。
- 数据入库。
- RSS 源导入。
- 数据迁移。
- 后台定时任务。

它负责：

- 在终端展示今日精选、新闻列表、分类新闻。
- 搜索标题、摘要、来源。
- 输出适合人看的文本。
- 输出适合脚本消费的 JSON。
- 管理 CLI 自己的展示配置。

## 技术路线

建议使用：

```text
Node.js + TypeScript
```

推荐原因：

- 可以复用 `packages/news-schema`。
- 可以复用 `packages/news-client`。
- 与 frontend、mobile 的展示数据模型一致。
- 方便发布为 npm 包或 workspace 命令。

推荐库：

- `commander` 或 `cac`：命令解析。
- `picocolors`：终端颜色。
- `cli-table3`：表格输出，可选。
- `ora`：加载提示，可选。
- `open`：打开原文链接，可选。

## 目录结构

```text
cli/
  src/
    commands/
      today.ts
      list.ts
      category.ts
      search.ts
      sources.ts
      config.ts
    output/
      formatNews.ts
      formatTable.ts
      formatJson.ts
    config/
      loadConfig.ts
      saveConfig.ts
    index.ts
  package.json
  tsconfig.json
```

## 命令设计

### today

展示今日精选。

```sh
ai-rss today
ai-rss today --limit 10
ai-rss today --json
```

输出内容：

- 标题。
- 分类。
- 来源。
- 发布时间。
- 评分。
- 摘要。
- 原文链接。

### list

展示全部新闻。

```sh
ai-rss list
ai-rss list --limit 20
ai-rss list --category ai
ai-rss list --source "OpenAI Blog"
ai-rss list --json
```

初版只需要支持 `--limit` 和 `--category`。

### category

展示指定分类新闻。

```sh
ai-rss category ai
ai-rss category community --limit 15
ai-rss category finance --json
```

分类值应来自 `packages/news-schema`。

### search

搜索新闻。

```sh
ai-rss search openai
ai-rss search "model release" --limit 10
ai-rss search openai --json
```

搜索范围：

- 标题。
- 摘要。
- 来源名称。
- 分类，可选。

初版可以做本地内存搜索。

### sources

展示新闻来源。

```sh
ai-rss sources
ai-rss sources --category ai
ai-rss sources --json
```

只展示来源，不修改来源。

### open

打开某条新闻原文，可选。

```sh
ai-rss open <id>
```

如果终端环境不适合打开浏览器，可以只输出 URL。

### config

管理 CLI 自己的数据源配置。

```sh
ai-rss config get
ai-rss config set mode static
ai-rss config set static-base-url https://example.com/data/news
ai-rss config set mode supabase
ai-rss config set supabase-url https://example.supabase.co
ai-rss config set supabase-key <publishable-key>
```

注意：这里管理的是 CLI 读取配置，不是 backend `.env`。

## 配置设计

建议配置文件位置：

```text
~/.ai-rss/config.json
```

配置结构：

```json
{
  "mode": "static",
  "staticBaseUrl": "https://example.com/data/news",
  "supabaseUrl": "",
  "supabaseKey": "",
  "defaultLimit": 20
}
```

也可以支持环境变量覆盖：

```text
AI_RSS_DATA_MODE
AI_RSS_STATIC_BASE_URL
AI_RSS_SUPABASE_URL
AI_RSS_SUPABASE_KEY
```

优先级建议：

```text
命令行参数 > 环境变量 > 配置文件 > 默认值
```

## 输出格式

### 默认文本输出

示例：

```text
AI RSS Today

1. OpenAI 发布新模型能力
   AI | OpenAI Blog | 2026-05-03 | 4.6
   摘要内容展示两到三行，超出部分截断。
   https://example.com/article
```

### 紧凑输出

可选：

```sh
ai-rss list --compact
```

适合快速扫标题。

### JSON 输出

```sh
ai-rss today --json
```

用于脚本、管道和其他工具消费。JSON 输出应该尽量保持原始结构，不加颜色和额外文本。

## 数据读取

CLI 不直接读取 backend 内部 Python 模块，只通过共享 client：

```text
cli -> packages/news-client -> static JSON / Supabase
```

初版优先支持 static JSON，因为部署和调试最简单。

后续再支持 Supabase：

```text
createNewsClient({
  mode: "supabase",
  supabaseUrl,
  supabaseKey,
})
```

## 错误处理

需要明确处理：

- 未配置数据源。
- static JSON URL 不可访问。
- Supabase 配置缺失。
- 网络超时。
- 数据结构不符合 schema。
- 分类不存在。
- 搜索无结果。

错误文案应该简短清楚，并给出下一步命令提示，例如：

```text
未配置 staticBaseUrl。请运行：
ai-rss config set static-base-url <url>
```

## 第一版功能清单

必做：

- `ai-rss today`
- `ai-rss list`
- `ai-rss category <category>`
- `ai-rss search <keyword>`
- `ai-rss sources`
- `ai-rss config get`
- `ai-rss config set`
- `--json`
- `--limit`
- static JSON 数据源

可后置：

- 交互式 TUI。
- `ai-rss open <id>`。
- Supabase 数据源。
- 收藏和已读状态。
- 本地缓存。

## 交互式 TUI 方向

后续可以增加：

```sh
ai-rss
```

进入交互式阅读界面。

能力：

- 方向键浏览新闻。
- 回车查看详情。
- `/` 搜索。
- `o` 打开原文。
- `c` 切换分类。
- `q` 退出。

这部分建议等非交互命令稳定后再做。

## 里程碑

### M1：CLI 工程骨架

- 创建 `cli` workspace。
- 配置 TypeScript。
- 配置命令入口。
- 接入共享 schema。

### M2：数据读取

- 接入 `packages/news-client`。
- 支持 static JSON。
- 完成配置读取。

### M3：基础命令

- today。
- list。
- category。
- search。
- sources。

### M4：输出优化

- 默认文本格式。
- JSON 格式。
- limit、category 参数。
- 错误提示。

### M5：发布准备

- package bin 配置。
- README 使用说明。
- 本地安装验证。

## 验收标准

- CLI 不调用 backend 抓取、入库、摘要任务。
- CLI 能读取与 Web 相同的数据。
- CLI 支持至少 static JSON 数据源。
- 主要命令具备正常输出和 JSON 输出。
- 错误提示可理解，并能引导用户修复配置。
- 中文标题、摘要、来源展示基本可读。
