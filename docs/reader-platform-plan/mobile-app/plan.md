# Mobile App 详细计划

## 定位

`mobile` 是独立的 Expo / React Native 移动端阅读应用，职责与当前 Web Reader 一致：读取已经生成好的新闻数据并展示。

它不是 WebView 套壳，也不是把 `frontend` 页面缩放到手机屏幕。移动端需要使用原生 App 的导航、列表、详情、缓存和弱网体验。

它不负责：

- RSS 抓取。
- AI 摘要生成。
- 数据入库。
- RSS 源导入。
- 后台定时任务。
- 修改 Supabase / static JSON 中的生产数据。

它负责：

- 移动端风格的新闻阅读体验。
- 今日精选、订阅流、分类浏览、搜索、详情展示。
- 读取 static JSON 或 Supabase 数据源。
- 本地缓存、弱网兜底和用户设置。
- 可选的收藏、已读状态、系统分享。

## 当前 Web 前端现状

移动端计划需要以当前 `frontend` 为准，而不是旧版“只有分类卡片”的假设。

当前 Web Reader 已有：

- Vue 3 / Vite / TypeScript 前端。
- 路由入口：
  - `/curated`：精选页，当前默认入口。
  - `/subscription`：订阅页。
  - `/dashboard`：分类看板页。
- 顶部导航：
  - 精选
  - 订阅
  - AI
  - 社区
  - 国内
  - 海外
  - 财经
  - 博客
- 数据读取模式：
  - `VITE_DATA_MODE=static` 时读取 `frontend/public/data/news/*.json`。
  - `VITE_DATA_MODE=supabase` 时读取 Supabase 的 `public_news_items`。
- 共享类型包：
  - 当前可用包是 `@ai-rss/schema`，源码位于 `packages/schema`。
  - 类型包括 `NewsItem`、`NewsCategory`、`NewsListRequest`、`NewsListResponse`、`CuratedNewsRequest`、`CuratedNewsResponse`。
- 前端本地数据层：
  - `frontend/src/api/news/static_news.ts`
  - `frontend/src/api/news/supabase_news.ts`
  - `frontend/src/api/news/index.ts`
- 分类元信息：
  - 当前在 `frontend/src/constants/news.ts` 维护。
  - 分类是具体来源级别，例如 `openai`、`hacker_news`、`reuters`、`cls`。
  - 分类通过 `belong_to` 归属到 AI、社区、国内、海外、财经、博客等导航组。
- 订阅能力：
  - Web 已有“我的订阅”页。
  - 订阅分类保存在 `localStorage`。
  - 订阅流支持“全部订阅”和“单分类订阅”两种模式。
- 视觉基调：
  - 深色模式优先。
  - token 化颜色与主题变量位于 `frontend/src/theme/theme.css`。
  - 新闻卡片强调标题、AI 摘要、标签、来源、时间和重要度。

当前需要修正的旧计划点：

- 不再写 `packages/news-schema`，当前实际包名是 `@ai-rss/schema` / `packages/schema`。
- `packages/news-client` 不能作为已完成依赖来假设；当前可维护的数据读取逻辑仍主要在 `frontend/src/api/news`。
- Mobile 第一版不应该只有 Today / Categories / Search / Settings，还应把 Web 已经具备的 Subscription 作为核心体验之一。
- 分类名称不应只写 AI / Community / Finance / Blog / Inner News / Outer News；App 需要同时支持“导航组”和“具体来源分类”两层。

## 技术路线

建议使用：

```text
Expo / React Native / TypeScript
```

推荐原因：

- 是真正移动端应用，不是 Web 页面适配。
- 支持 iOS 和 Android。
- 可以复用 `@ai-rss/schema` 类型。
- 原生移动端导航、手势、下拉刷新、系统分享更自然。
- 后续可以接入通知、离线缓存、深色模式和原生分享。

建议核心依赖：

- Expo Router：文件路由和 Tab 导航。
- React Native Safe Area Context：安全区适配。
- AsyncStorage：配置、订阅、收藏、轻量缓存。
- Expo SQLite：后续新闻量变大后再引入。
- Supabase JS：仅在启用 Supabase 数据源时使用。
- Expo WebBrowser / Linking：打开原文链接。
- Expo Sharing / React Native Share：后续系统分享。

## 推荐目录结构

```text
mobile/
  app/
    (tabs)/
      index.tsx
      subscriptions.tsx
      categories.tsx
      search.tsx
      settings.tsx
    article/
      [id].tsx
    category/
      [category].tsx
  src/
    api/
      news/
        index.ts
        static.ts
        supabase.ts
    components/
      article/
      category/
      common/
      news/
      settings/
      subscriptions/
    constants/
      categoryMeta.ts
      navigation.ts
    hooks/
      useCachedResource.ts
      useNewsClient.ts
      useSubscriptions.ts
    screens/
      ArticleDetailScreen.tsx
      CategoriesScreen.tsx
      CategoryFeedScreen.tsx
      SearchScreen.tsx
      SettingsScreen.tsx
      SubscriptionsScreen.tsx
      TodayScreen.tsx
    storage/
      cache.ts
      settings.ts
      subscriptions.ts
    theme/
      colors.ts
      spacing.ts
      typography.ts
      index.ts
    types/
    utils/
  app.json
  package.json
  tsconfig.json
```

说明：

- `app/` 负责 Expo Router 路由。
- `src/screens/` 负责页面组合。
- `src/components/` 负责可复用 UI。
- `src/theme/` 复刻并移动端化 Web token。
- `src/api/news/` 初期可从 `frontend/src/api/news` 抽取思路，后续再沉淀到 `packages/client` 或新的共享 client 包。

## 数据读取策略

Mobile 不直接读 backend 内部模块，只读展示数据。

当前可落地路径：

```text
mobile -> @ai-rss/schema
mobile -> mobile/src/api/news -> static JSON / Supabase
```

后续理想路径：

```text
frontend / mobile / cli / extension
  -> packages/client
  -> static JSON / Supabase
```

第一版建议先做一个移动端本地 client，接口保持接近未来共享 client：

```ts
type NewsClientConfig =
  | {
      mode: 'static'
      staticBaseUrl: string
    }
  | {
      mode: 'supabase'
      supabaseUrl: string
      supabaseKey: string
    }

interface NewsClient {
  getCuratedToday(limit?: number): Promise<CuratedNewsResponse>
  getNewsList(params: NewsListRequest): Promise<NewsListResponse>
  searchNews(keyword: string): Promise<NewsListResponse>
}
```

static JSON 对齐 Web 当前路径：

```text
{staticBaseUrl}/curated-today.json
{staticBaseUrl}/all.json
{staticBaseUrl}/{category}.json
```

Supabase 对齐 Web 当前表：

```text
public_news_items
```

排序规则尽量保持一致：

- 精选：`ai_importance` 降序，其次 `published_time` 降序。
- 分类：`published_time` 降序，其次 `ai_importance` 降序。
- 订阅聚合：跨分类去重后按发布时间倒序。

## 核心页面

### Today

对应 Web 的 `/curated`。

功能：

- 展示 `curated-today` Top 20。
- 支持下拉刷新。
- 支持缓存兜底。
- 支持 loading、empty、error、cached fallback。
- 点击新闻进入详情页。
- 后续可支持分享今日精选。

设计重点：

- 顶部使用移动端大标题和更新时间。
- 列表使用紧凑但可读的新闻单元。
- 新闻单元展示标题、AI 推荐理由、标签、来源、时间、重要度。
- 不复刻 Web 的网格卡片。

### Subscriptions

对应 Web 的 `/subscription`。

功能：

- 管理已订阅的具体来源分类。
- 支持“全部订阅”聚合流。
- 支持进入单个订阅来源。
- 订阅选择保存到 AsyncStorage。
- 无订阅时显示引导空状态。

设计重点：

- 订阅是移动端核心页，不后置。
- 顶部展示当前模式：全部订阅 / 单分类。
- 订阅入口应比 Web 侧栏更轻，适合横向 chip 或底部 sheet。
- 管理订阅使用 bottom sheet 或 modal。

### Categories

对应 Web 的 `/dashboard` 分类导航能力，但移动端需要重组。

功能：

- 展示导航组：AI、社区、国内、海外、财经、博客。
- 每个导航组下展示具体来源分类。
- 点击具体来源进入分类新闻列表。
- 分类列表支持刷新、缓存和错误重试。

设计重点：

- 移动端不展示 Web 的多列看板。
- Categories 更像“来源目录”，用于进入某个新闻源。
- 每个来源展示 favicon、标题、副标题和最近条数。

### Category Feed

功能：

- 展示某一具体来源分类的新闻。
- 支持下拉刷新。
- 支持进入详情。
- 支持从该页快速订阅 / 取消订阅该来源。

设计重点：

- 顶部展示来源图标、来源名、所属导航组。
- 新闻列表比 Today 更偏时间线。
- 重要度作为辅助信息，不抢标题层级。

### Article Detail

功能：

- 标题。
- 来源、发布时间、重要度。
- AI 摘要。
- 标签。
- 原文链接。
- 打开原文。
- 收藏，可选。
- 分享，可选。

设计重点：

- 详情页要比 Web 卡片更沉浸。
- AI 摘要作为正文核心内容，不只是一行辅助说明。
- 顶部导航提供返回、打开原文、分享或收藏。
- 长文本排版优先保证阅读舒适度。

### Search

功能：

- 按标题、AI 摘要、来源、标签搜索。
- 初版使用本地已加载或 `all.json` 数据搜索。
- 显示搜索历史，可选。
- 显示空结果和错误状态。
- 点击进入详情。

设计重点：

- 搜索框固定在顶部安全区下方。
- 搜索结果使用与普通新闻列表一致的 NewsListItem。
- 空状态给出可操作建议，例如更换关键词或清除筛选。

### Settings

功能：

- 数据源模式：static JSON / Supabase。
- static JSON base URL。
- Supabase URL 和 publishable key。
- 清除缓存。
- 清除订阅。
- 主题设置。
- 版本信息。

设计重点：

- 设置项只影响展示端读取数据，不影响 backend 任务。
- 表单输入需要适配小屏和键盘弹起。
- 高风险操作使用确认弹窗。

## 导航设计

第一版推荐底部 Tab：

```text
Today | Subscriptions | Categories | Search | Settings
```

详情页和分类新闻页不放在 Tab 中：

```text
Today -> Article Detail
Subscriptions -> Article Detail
Categories -> Category Feed -> Article Detail
Search -> Article Detail
```

原因：

- Today 对应当前 Web 默认入口。
- Subscriptions 已经是当前 Web 的核心页面。
- Categories 承担来源目录，不再是默认首页。
- Search 是移动端高频辅助能力。
- Settings 负责数据源和缓存。

## 本地缓存

建议缓存：

- 最近一次 Today 列表。
- 最近一次 all 新闻列表。
- 最近一次分类新闻列表。
- 订阅分类 ID。
- 用户配置。
- 搜索历史，可选。
- 收藏和已读状态，可选。

推荐实现：

- AsyncStorage：第一版默认选择。
- SQLite：后续新闻量大、需要全文检索或更复杂离线能力时再引入。

缓存策略：

- 打开 App 先显示缓存。
- 后台请求最新数据。
- 成功后更新列表和缓存。
- 失败时保留缓存，并提示当前是旧数据。
- 用户主动下拉刷新时展示明确的刷新状态。

缓存 key 建议：

```text
ai-rss-mobile:settings
ai-rss-mobile:subscriptions
ai-rss-mobile:cache:curated:today
ai-rss-mobile:cache:news:all
ai-rss-mobile:cache:news:{category}
```

## 状态设计

每个主页面至少处理：

- `idle`
- `loading`
- `refreshing`
- `loaded`
- `empty`
- `error`
- `cachedFallback`

错误信息需要区分：

- 数据源配置缺失。
- 网络请求失败。
- JSON 结构不符合预期。
- Supabase 凭据错误。
- 当前没有缓存可用。

## 视觉原则

移动端视觉应继承 Web 的气质，而不是复制 Web 的布局。

继承：

- 深色优先。
- 专业、数据感、克制。
- 强信息层级。
- 强可读性。
- accent 使用青绿色系。
- 新闻条目包含标题、AI 摘要、标签、来源、时间、重要度。
- 来源图标优先使用官方 favicon。

移动端化：

- 使用原生列表密度。
- 触控区域不小于 44px。
- 标题优先，摘要收敛。
- 详情页再展开内容。
- 使用 bottom sheet / modal 管理订阅和设置。
- 弱网和缓存状态要比 Web 更显性。

详细视觉方案见 [design.md](./design.md)。

## 第一版功能清单

必做：

- Expo 应用初始化。
- 接入 `@ai-rss/schema`。
- 建立 mobile 本地 news client。
- 支持 static JSON 数据源。
- Today 页。
- Subscriptions 页。
- Categories 页。
- Category Feed 页。
- Article Detail 页。
- Search 页。
- Settings 页。
- AsyncStorage 缓存最近数据。
- 加载、空状态、错误状态、缓存兜底状态。
- 深色主题 token。

建议一并做：

- 订阅管理 bottom sheet。
- 分类页订阅 / 取消订阅入口。
- 打开原文。
- 清除缓存。

可后置：

- Saved 收藏页。
- 已读状态。
- 系统分享。
- Supabase 数据源完整配置 UI。
- 推送通知。
- 离线全文。
- 个性化推荐。
- SQLite 全文搜索。

## 里程碑

### M1：移动端工程骨架

- 创建 `mobile` workspace。
- 配置 Expo、TypeScript、路径别名。
- 接入 `@ai-rss/schema`。
- 建立 Expo Router Tab 和详情路由。
- 建立主题 token。

### M2：数据读取和缓存

- 实现 static JSON client。
- 实现 Settings 中的 static base URL。
- 实现 Today / Category / all 新闻缓存。
- 实现 loading、error、cached fallback 状态。

### M3：核心阅读体验

- Today。
- Categories。
- Category Feed。
- Article Detail。
- Search。

### M4：订阅和设置

- Subscriptions。
- 订阅管理。
- 数据源配置。
- 清除缓存。
- 弱网提示。

### M5：Supabase 与体验补齐

- 接入 Supabase 数据源。
- 补齐打开原文、分享、收藏等可选能力。
- Android 本地预览。
- iOS 后续按账号条件推进。
- 准备图标和启动页。

## 验收标准

- App 不依赖 Web 页面渲染。
- App 不调用 backend 抓取任务。
- App 能读取与 Web 相同的数据结构。
- Today 与 Web 的精选逻辑一致。
- Subscriptions 与 Web 的订阅概念一致。
- Categories 能覆盖当前 Web 的所有来源分类。
- 断网时能展示最近缓存。
- 主要页面具备 loading、empty、error、cached fallback 状态。
- 新闻详情、搜索、分类浏览、订阅流流程完整。
- 视觉风格与当前 Web Reader 一致，但交互符合移动端习惯。
