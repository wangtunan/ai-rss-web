# VS Code / Cursor 插件详细计划

## 定位

`ide-extension` 是编辑器内的 AI RSS 阅读器，职责与 Web 前端一致：读取已经生成好的新闻数据并展示。

它不负责：

- RSS 抓取。
- AI 摘要。
- 数据入库。
- RSS 源导入。
- 后台定时任务。

它负责：

- 在 VS Code / Cursor 中快速浏览今日精选。
- 在侧边栏查看分类新闻。
- 搜索新闻标题、摘要、来源。
- 打开原文链接。
- 管理插件自己的展示配置。

## 技术路线

建议优先使用 VS Code Extension API。

Cursor 基于 VS Code 插件生态，初版应以 VS Code 插件为主，并保持 Cursor 兼容。

推荐形态：

```text
VS Code Extension + Webview View + TypeScript
```

原因：

- 可以发布到 VS Code Marketplace。
- Cursor 通常可以安装兼容的 VS Code 插件。
- Webview View 适合做轻量阅读面板。
- 可以复用 `packages/news-schema` 和 `packages/news-client`。

## 目录结构

```text
ide-extension/
  src/
    extension.ts
    views/
      NewsPanelProvider.ts
    config/
      loadConfig.ts
    commands/
      refresh.ts
      openArticle.ts
  webview/
    src/
      main.ts
      App.ts
      components/
    index.html
  package.json
  tsconfig.json
```

如果希望减少 Webview 复杂度，第一版也可以使用 Tree View：

```text
Today
Categories
Search Results
```

但新闻摘要和详情展示更适合 Webview。

## 核心入口

### Activity Bar

新增 AI RSS 图标入口。

包含：

- Today
- Categories
- Search
- Settings

### Command Palette

命令建议：

```text
AI RSS: Open
AI RSS: Refresh
AI RSS: Search
AI RSS: Open Settings
AI RSS: Open Current Article
```

### Status Bar，可选

可选显示：

```text
AI RSS: 12 new
```

第一版可以不做新消息计数，只放一个快速入口。

## 页面设计

### Today

功能：

- 展示今日精选。
- 点击打开详情。
- 一键打开原文。
- 手动刷新。

编辑器内设计重点：

- 宽度通常较窄，列表要紧凑。
- 标题优先，摘要控制行数。
- 来源、时间、评分用小号辅助信息展示。

### Categories

功能：

- 展示分类。
- 点击分类后展示对应新闻。
- 支持返回 Today。

### Search

功能：

- 搜索标题、摘要、来源。
- 展示搜索结果。
- 支持回车搜索。

### Detail

功能：

- 展示标题、摘要、评分、来源、发布时间。
- 打开原文。
- 复制链接，可选。

## 配置设计

使用 VS Code 配置项：

```json
{
  "aiRss.mode": "static",
  "aiRss.staticBaseUrl": "https://example.com/data/news",
  "aiRss.supabaseUrl": "",
  "aiRss.supabaseKey": "",
  "aiRss.defaultLimit": 20
}
```

配置优先级：

```text
Workspace settings > User settings > 插件默认值
```

注意：这些配置只用于插件读取展示数据，不影响 backend。

## 数据读取

IDE 插件通过共享 client 读取：

```text
ide-extension -> packages/news-client -> static JSON / Supabase
```

Webview 内部不要直接散落请求逻辑，建议由 extension host 或统一 client 封装后传入。

## 安全和权限

需要注意：

- Webview 默认限制脚本和资源，需要明确 CSP。
- 外部链接使用 VS Code API 打开。
- 不在日志里输出 Supabase key。
- 只申请必要权限。
- 如果请求远程 JSON，需要处理网络失败。

## 第一版功能清单

必做：

- 插件工程初始化。
- Activity Bar 入口。
- Webview View。
- Today 列表。
- 分类列表。
- 搜索。
- 详情展示。
- 打开原文。
- 设置项。
- static JSON 数据源。

可后置：

- Supabase 数据源。
- 状态栏未读提醒。
- 收藏。
- 已读状态。
- 本地缓存。
- Tree View 版本。

## 里程碑

### M1：插件骨架

- 创建 `ide-extension` workspace。
- 注册 extension activation。
- 注册 Activity Bar view。
- 注册基础命令。

### M2：Webview 阅读面板

- 完成 Today 页面。
- 完成 Detail 页面。
- 支持打开原文。

### M3：分类和搜索

- 分类列表。
- 分类新闻。
- 搜索结果。

### M4：配置和稳定性

- VS Code settings。
- 错误提示。
- 加载状态。
- 空状态。

### M5：Cursor 兼容验证

- 在 VS Code 验证。
- 在 Cursor 验证安装和基础功能。
- 整理发布说明。

## 验收标准

- 插件不调用 backend 抓取、入库、摘要任务。
- 插件能读取与 Web 相同的数据。
- 插件能在 VS Code 中展示 Today、分类、搜索、详情。
- 插件能打开原文链接。
- 配置项清晰，并且不影响 backend。
- Cursor 中基础功能可用。
