# Mobile App 设计稿

## 设计目标

Mobile App 需要延续 Web Reader 的专业、清晰、数据感，但不能照搬 Web 的卡片看板。

目标体验：

- 打开 App 后能在 3-5 秒内扫到今日最重要内容。
- 标题优先，AI 摘要辅助判断是否值得打开。
- 来源、时间、标签、重要度清楚但不抢主层级。
- 深色模式是默认体验，浅色模式后续可补。
- 弱网、缓存和加载失败状态要清楚可见。
- 所有主操作都符合移动端手指操作习惯。

## 设计基调

关键词：

- 深色优先
- 清晰阅读
- 克制科技感
- 信息密度适中
- 原生移动端
- 可信的数据仪表感

避免：

- 复制 Web 多列卡片。
- 过重的渐变背景。
- 大面积装饰图形。
- 过多发光、玻璃拟态和浮夸阴影。
- 用 marketing landing page 方式设计阅读 App。
- 用 tiny metadata 牺牲可读性。

## 信息架构

底部 Tab：

```text
Today | Subscriptions | Categories | Search | Settings
```

路由层级：

```text
Today
  -> Article Detail

Subscriptions
  -> Article Detail

Categories
  -> Category Feed
    -> Article Detail

Search
  -> Article Detail

Settings
```

页面定位：

| 页面 | 角色 | 对应 Web |
| --- | --- | --- |
| Today | 默认首页，展示精选 Top 20 | `/curated` |
| Subscriptions | 用户自己的聚合阅读流 | `/subscription` |
| Categories | 来源目录和分类入口 | `/dashboard` 的导航能力 |
| Category Feed | 单来源新闻流 | `fetchNewsList({ category })` |
| Article Detail | 沉浸式阅读页 | Web 卡片详情化 |
| Search | 本地搜索新闻 | 新增移动端能力 |
| Settings | 数据源、缓存、主题 | 新增移动端能力 |

## 主题 Token

Web 当前主题变量位于 `frontend/src/theme/theme.css`。移动端应保留同一视觉语义，但转成 React Native token。

### 深色主题

```ts
export const darkColors = {
  bg: '#0A0D14',
  bgSoft: '#101626',
  surface: '#0F172A',
  surfaceRaised: '#1A2438',
  line: 'rgba(123, 148, 197, 0.22)',
  lineStrong: 'rgba(124, 153, 216, 0.50)',
  text: '#E9EFFF',
  textSoft: '#93A3C6',
  textMuted: '#697894',
  accent: '#5EEAD4',
  accentSoft: 'rgba(94, 234, 212, 0.15)',
  danger: '#F87171',
  warning: '#FBBF24',
  success: '#34D399',
}
```

### 浅色主题

浅色模式可作为第二阶段补齐，但 token 结构需要先预留：

```ts
export const lightColors = {
  bg: '#F6F8FC',
  bgSoft: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceRaised: '#EEF6F8',
  line: 'rgba(36, 57, 94, 0.12)',
  lineStrong: 'rgba(15, 118, 110, 0.24)',
  text: '#172033',
  textSoft: '#66758D',
  textMuted: '#8793A8',
  accent: '#0F9F95',
  accentSoft: 'rgba(15, 159, 149, 0.10)',
  danger: '#DC2626',
  warning: '#B45309',
  success: '#059669',
}
```

### 间距

```ts
export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pageX: 18,
  pageTop: 14,
  pageBottom: 24,
}
```

### 圆角

Web 卡片圆角约 8px，移动端保持克制：

```ts
export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  pill: 999,
}
```

使用原则：

- 列表项和设置组：`md`。
- 图标容器：`sm`。
- 标签、chip、按钮：`pill`。
- 不使用大圆角卡片堆叠。

### 字体

使用系统字体，不引入强制外部字体。

```ts
export const typography = {
  screenTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '760',
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '720',
  },
  itemTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '680',
  },
  itemSummary: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  chip: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '650',
  },
}
```

注意：

- 不用 viewport 缩放字体。
- 小屏也不把正文降到不可读。
- 列表标题最多两行。
- 列表摘要最多两到三行。

## 核心组件

### AppHeader

用于 Today、Subscriptions、Categories、Search、Settings 顶部。

内容：

- eyebrow：例如 `Today`、`Subscription`。
- title：中文主标题。
- subtitle：更新时间、数据源或当前状态。
- actions：图标按钮，例如刷新、管理订阅、清缓存。

视觉：

- 不做大 hero。
- 背景与页面融为一体。
- 标题靠左。
- action 使用圆形 icon button。

触控：

- action touch target 不小于 44x44。
- 顶部适配 safe area。

### NewsListItem

主新闻列表单元，用于 Today、Subscriptions、Category Feed、Search。

结构：

```text
[source icon]  来源 · 时间                 重要度
标题，最多 2 行
AI摘要  摘要内容，最多 2-3 行
[tag] [tag] [tag]
```

规则：

- 标题是主视觉。
- 摘要前保留 `AI摘要` 或 `AI推荐理由` 标记。
- 标签最多 3 个。
- 来源图标使用官方 favicon，失败时使用 fallback。
- 重要度用小型 score chip，不使用大星星抢占空间。
- 每个 item 整体可点击。

尺寸：

- 内边距：14-16。
- 最小高度：约 128。
- item 之间用 1px line 或 8px 间隔，不做厚重卡片墙。

状态：

- pressed：背景轻微变亮。
- loading：使用 skeleton。
- cached：可在列表顶部显示缓存提示，不在每条 item 上重复。

### SourceTile

用于 Categories 页面。

结构：

```text
[icon] 来源名称
       来源副标题 / 所属导航组
       最近条数或订阅状态
```

规则：

- 每个来源一个触控行。
- 已订阅来源显示轻量 accent 标记。
- 点击进入 Category Feed。
- 右侧可以放 chevron 图标。

### GroupSection

用于 Categories 的导航组。

结构：

```text
AI
OpenAI 官方动态
Hugging Face 动态
Anthropic 动态
...
```

规则：

- 分组标题固定使用中文导航名。
- 组内来源按当前 `CATEGORY_META` 顺序。
- 分组之间留足垂直间距。

### TagChip

用于新闻标签。

规则：

- 高度 24-26。
- 圆角 pill。
- 字号 12。
- 最多展示 3 个，超出可隐藏。
- 颜色不做彩虹化；用 accentSoft、surfaceRaised 和 textSoft 区分即可。

### ScoreChip

用于 AI 重要度。

形式：

```text
★ 8.6
```

规则：

- 小尺寸 pill。
- 只在列表 metadata 行或右上辅助区域出现。
- 低分不使用 danger，避免制造错误感。

### EmptyState

用于无订阅、无搜索结果、无分类数据。

规则：

- 文案短。
- 提供明确动作。
- 不使用大插画。

示例：

```text
还没有订阅
选择几个常看的来源，生成自己的新闻流。
[管理订阅]
```

### ErrorState

用于请求失败。

规则：

- 说明失败原因。
- 提供重试。
- 如果有缓存，显示缓存提示而不是全屏错误。

示例：

```text
最新数据加载失败
正在显示上次缓存的内容。
[重试]
```

### SubscriptionSheet

用于管理订阅。

形式：

- bottom sheet。
- 多选来源列表。
- 顶部显示已选数量。
- 底部固定保存按钮。

规则：

- 来源按导航组分组。
- checkbox 或 check icon 明确选中态。
- 保存后关闭 sheet 并刷新订阅流。

## 页面设计

### Today

布局：

```text
SafeArea
  AppHeader
    eyebrow: Today
    title: 今日精选
    subtitle: 今日 Top 20 · 更新时间
    action: refresh

  CachedBanner?

  FlatList
    NewsListItem x 20
```

状态：

- loading：首屏 5-8 条 skeleton。
- refreshing：下拉刷新指示器。
- empty：显示“今日暂无精选”。
- error：如果无缓存，显示全屏错误；如果有缓存，显示 cached banner。

设计重点：

- 默认首页要非常直接，不解释产品功能。
- 列表密度控制在一屏 3-4 条新闻左右。
- 顶部不使用 Web 侧栏式 curated menu；如果后续支持 today/week，再用横向 segmented control。

### Subscriptions

布局：

```text
SafeArea
  AppHeader
    eyebrow: Subscription
    title: 全部订阅 / 来源名称 / 我的订阅
    subtitle: N 个来源 · N 条更新
    action: manage

  HorizontalSourceChips
    全部订阅
    OpenAI
    Hacker News
    ...

  EmptyState? / CachedBanner?

  FlatList
    NewsListItem

  SubscriptionSheet
```

状态：

- 没有订阅：显示 EmptyState 和管理订阅按钮。
- 有订阅但聚合失败：如果部分成功，显示成功部分并提示部分来源失败。
- 全部失败：展示错误或缓存。

设计重点：

- 订阅是个人新闻流，应比 Categories 更靠前。
- 横向来源 chip 只显示已订阅来源，避免过长。
- 管理订阅入口放在 header action。

### Categories

布局：

```text
SafeArea
  AppHeader
    eyebrow: Sources
    title: 来源目录
    subtitle: AI / 社区 / 国内 / 海外 / 财经 / 博客

  SectionList
    GroupSection: AI
      SourceTile
      SourceTile
    GroupSection: 社区
      SourceTile
```

设计重点：

- 这是目录页，不是新闻流页。
- 用户在这里寻找来源、进入来源、订阅来源。
- 每个 SourceTile 可以显示已订阅状态。

### Category Feed

布局：

```text
SafeArea
  SourceHeader
    icon
    label
    subtitle
    subscribe action

  CachedBanner?

  FlatList
    NewsListItem
```

设计重点：

- SourceHeader 比 AppHeader 更强调来源身份。
- 订阅按钮是 icon button 或小型 pill button。
- 列表排序以时间为主，重要度辅助。

### Article Detail

布局：

```text
SafeArea
  TopNav
    back
    open original
    share / save

  ScrollView
    source row
    title
    metadata row
    tag chips
    AI Summary section
    raw content preview, optional
    original link button
```

设计重点：

- 标题字号 24-28，行高宽松。
- AI 摘要作为正文内容展示，不能像列表里那样过短。
- 标签放在标题下方或摘要上方。
- 原文按钮使用明确 action，不自动跳转。
- 长文本左右留白 18-20。

### Search

布局：

```text
SafeArea
  SearchInput

  RecentSearches?

  FlatList results
```

交互：

- 输入关键词后 debounce。
- 空输入显示最近搜索或推荐来源。
- 无结果显示 EmptyState。
- 搜索范围：title、ai_summary、source、ai_tags。

设计重点：

- 搜索框在顶部，键盘弹起后仍保持自然。
- 结果列表复用 NewsListItem。
- 不做复杂筛选，第一版保持快。

### Settings

布局：

```text
SafeArea
  AppHeader
    eyebrow: Settings
    title: 设置

  SettingGroup: 数据源
    Data mode segmented control
    Static base URL input
    Supabase URL input
    Supabase key input

  SettingGroup: 阅读
    Theme mode
    Clear cache
    Clear subscriptions

  SettingGroup: About
    Version
```

设计重点：

- 设置页是工具页，密度可以略高。
- 输入项要有 label 和错误提示。
- 清除缓存、清除订阅需要二次确认。
- 不把 backend 抓取、RSS 导入等生产能力放进 App 设置。

## 导航与图标

底部 Tab 图标建议使用 `lucide-react-native`：

| Tab | Icon |
| --- | --- |
| Today | `Sparkles` 或 `Newspaper` |
| Subscriptions | `Inbox` 或 `Rss` |
| Categories | `LayoutGrid` |
| Search | `Search` |
| Settings | `Settings` |

详情页 action：

| 操作 | Icon |
| --- | --- |
| 返回 | `ChevronLeft` |
| 打开原文 | `ExternalLink` |
| 分享 | `Share2` |
| 收藏 | `Bookmark` |
| 刷新 | `RefreshCw` |
| 订阅 | `Plus` / `Check` |

规则：

- 图标按钮需要可访问 label。
- 不用自绘 SVG。
- 不用文字按钮代替清晰图标。

## 交互状态

### Loading

- 首屏用 skeleton。
- skeleton 高度接近真实 NewsListItem。
- 不用全屏 spinner 作为唯一加载反馈。

### Refreshing

- 使用原生 pull-to-refresh。
- 刷新失败时保留旧数据。
- 顶部显示短提示。

### Cached Fallback

形式：

```text
正在显示上次缓存 · 刷新失败
```

规则：

- 放在列表顶部。
- 使用 warning 文本色或 accentSoft 背景。
- 不阻挡阅读。

### Empty

- 空状态只在确实没有内容时出现。
- 如果是配置问题，要引导去 Settings。

### Error

- 无缓存时显示错误状态。
- 有缓存时显示缓存提示并继续展示内容。
- 错误按钮最多两个：重试、去设置。

## 可访问性

要求：

- 触控区域不小于 44x44。
- 文本对比度满足深色模式阅读。
- icon button 有 accessibilityLabel。
- 新闻 item 可点击区域完整。
- Tab label 保留，不只显示图标。
- 长标题不会溢出容器。
- 动态字体放大时布局不重叠。

## 与 Web 的一致性

需要保持一致：

- 资讯字段：`title`、`ai_summary`、`ai_tags`、`ai_importance`、`published_time`、`source`、`category`、`link`。
- 来源元信息：label、subtitle、icon、belong_to。
- 导航组：精选、订阅、AI、社区、国内、海外、财经、博客。
- 数据源：static JSON / Supabase。
- 深色主题与 accent 语义。
- AI 摘要、标签、重要度的表达方式。

需要移动端重设：

- Web 顶部导航改为底部 Tab。
- Web 侧栏 curated menu 改为 Today 单页或 segmented control。
- Web 分类网格改为来源目录和来源新闻流。
- Web hover 状态改为 pressed / focused / disabled 状态。
- Web localStorage 改为 AsyncStorage。

## 第一版设计验收

- Today 首屏不需要说明文字也能开始阅读。
- Subscriptions 能清楚表达“全部订阅”和“单来源订阅”。
- Categories 能覆盖所有当前 Web 来源。
- Article Detail 比列表有明显更好的阅读排版。
- Search 输入、空结果、结果列表完整。
- Settings 能配置数据源并清除缓存。
- 深色模式下标题、摘要、metadata、标签层级清楚。
- 断网时不会出现空白页。
- 所有主要触控目标足够大。
