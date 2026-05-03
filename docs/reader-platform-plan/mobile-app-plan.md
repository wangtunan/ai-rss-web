# Mobile App 详细计划

## 定位

`mobile` 是独立移动端阅读应用，职责与 Web 前端一致：读取已经生成好的新闻数据并展示。

它不负责：

- RSS 抓取。
- AI 摘要。
- 数据入库。
- RSS 源导入。
- 后台定时任务。

它负责：

- 移动端风格的新闻阅读体验。
- 今日精选、分类、搜索、详情展示。
- 本地缓存和弱网体验。
- 可选的收藏、已读状态、系统分享。

## 技术路线

建议使用：

```text
Expo / React Native
```

推荐原因：

- 是真正移动端应用，不是 Web 页面适配。
- 支持 iOS 和 Android。
- 可以复用 TypeScript 类型与 `packages/news-client`。
- 原生移动端组件、导航、手势、下拉刷新更自然。
- 后续可以接入通知、分享、深色模式、离线缓存。

## 目录结构

```text
mobile/
  app/
    (tabs)/
      today.tsx
      categories.tsx
      search.tsx
      saved.tsx
      settings.tsx
    article/
      [id].tsx
  src/
    components/
    hooks/
    screens/
    theme/
    storage/
    utils/
  app.json
  package.json
  tsconfig.json
```

如果不使用 Expo Router，也可以使用 React Navigation：

```text
mobile/src/navigation/
mobile/src/screens/
```

## 核心页面

### Today

今日精选页。

功能：

- 展示 curated today 数据。
- 支持下拉刷新。
- 支持空状态。
- 支持加载失败重试。
- 点击新闻进入详情页。

移动端设计重点：

- 顶部使用大标题。
- 列表使用触控友好的新闻单元。
- 摘要展示控制在合适行数。
- 分类、评分、来源、时间作为辅助信息。

### Categories

分类页。

功能：

- 展示分类入口。
- 点击分类进入分类新闻列表。
- 分类页内支持刷新和加载状态。

建议分类：

- AI
- Community
- Finance
- Blog
- Inner News
- Outer News

分类名称以 `packages/news-schema` 中的定义为准。

### Article Detail

新闻详情页。

功能：

- 标题。
- 来源。
- 发布时间。
- 评分。
- AI 摘要。
- 原文链接。
- 打开原文。
- 分享。
- 收藏，可选。

移动端设计重点：

- 阅读页要比 Web 卡片更沉浸。
- 操作按钮放在顶部导航或底部操作区。
- 长摘要需要良好排版。

### Search

搜索页。

功能：

- 按标题、摘要、来源搜索。
- 显示搜索历史，可选。
- 显示空结果。
- 点击进入详情。

初版可以使用本地数据搜索，不需要远程搜索 API。

### Saved

收藏页，可选。

功能：

- 保存文章。
- 移除收藏。
- 离线查看已缓存的收藏摘要。

如果希望第一版更小，可以暂时不做 Saved，只保留 Today、Categories、Search、Settings。

### Settings

设置页。

功能：

- 数据源模式：static JSON / Supabase。
- static JSON base URL。
- Supabase URL 和 publishable key。
- 清除缓存。
- 主题设置，可选。
- 版本信息。

设置项只影响展示端读取数据，不影响 backend 任务。

## 数据读取

Mobile 不直接读 backend 内部模块，只通过共享 client：

```text
mobile -> packages/news-client -> static JSON / Supabase
```

建议使用：

```ts
const client = createNewsClient({
  mode: "static",
  staticBaseUrl: "...",
})
```

或：

```ts
const client = createNewsClient({
  mode: "supabase",
  supabaseUrl: "...",
  supabaseKey: "...",
})
```

## 本地缓存

建议缓存：

- 最近一次今日精选。
- 最近一次全部新闻。
- 最近一次分类列表。
- 用户配置。
- 收藏和已读状态，可选。

推荐实现：

- AsyncStorage：适合配置、收藏、轻量缓存。
- SQLite：如果后续新闻量大，再引入。

缓存策略：

- 打开 App 先显示缓存。
- 后台请求最新数据。
- 成功后更新列表。
- 失败时保留缓存并提示当前是旧数据。

## 状态设计

每个页面至少处理：

- loading
- refreshing
- loaded
- empty
- error
- cached fallback

不要只做成功态，否则移动端弱网时体验会比较薄。

## 导航设计

推荐底部 Tab：

```text
Today | Categories | Search | Saved | Settings
```

如果第一版不做收藏：

```text
Today | Categories | Search | Settings
```

详情页从 Today、Categories、Search 进入，不放在 Tab 中。

## 移动端视觉原则

- 不复刻 Web 卡片布局。
- 使用原生移动端列表密度。
- 新闻标题可读性优先。
- 摘要不要过长，详情页再展开。
- 触控区域要足够大。
- 顶部导航和底部 Tab 要符合移动端习惯。
- 深色模式可以后置，但主题结构一开始要留好。

## 第一版功能清单

必做：

- Expo 应用初始化。
- 接入 `packages/news-schema`。
- 接入 `packages/news-client`。
- Today 页。
- Categories 页。
- 分类新闻列表。
- Article Detail 页。
- Search 页。
- Settings 页。
- 本地缓存最近数据。
- 加载、空状态、错误状态。

可后置：

- Saved 收藏页。
- 已读状态。
- 分享。
- 推送通知。
- 离线全文。
- 个性化推荐。

## 里程碑

### M1：移动端工程骨架

- 创建 `mobile` workspace。
- 配置 TypeScript。
- 接入共享包。
- 建立导航结构。

### M2：数据读取

- 接入 static JSON 数据源。
- 接入缓存。
- 完成数据 loading/error 状态。

### M3：核心阅读体验

- Today。
- Categories。
- Article Detail。
- Search。

### M4：设置和体验补齐

- Settings。
- 数据源配置。
- 清除缓存。
- 弱网提示。

### M5：打包验证

- Android 本地预览。
- iOS 后续按账号条件推进。
- 准备图标和启动页。

## 验收标准

- App 不依赖 Web 页面渲染。
- App 不调用 backend 抓取任务。
- App 能读取与 Web 相同的数据。
- 断网时能展示最近缓存。
- 主要页面具备 loading、empty、error 状态。
- 新闻详情、搜索、分类浏览流程完整。
