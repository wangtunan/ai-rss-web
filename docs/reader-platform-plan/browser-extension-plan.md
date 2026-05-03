# Chrome 浏览器插件详细计划

## 定位

`browser-extension` 是 Chrome 中的 AI RSS 阅读器，职责与 Web 前端一致：读取已经生成好的新闻数据并展示。

它不负责：

- RSS 抓取。
- AI 摘要。
- 数据入库。
- RSS 源导入。
- 后台定时任务。

它负责：

- 在浏览器弹窗中快速浏览今日精选。
- 支持分类、搜索、打开原文。
- 可选提供新标签页阅读页。
- 可选使用 Chrome Side Panel 做常驻阅读侧栏。
- 管理插件自己的展示配置和缓存。

## 技术路线

建议使用：

```text
Chrome Extension Manifest V3 + TypeScript
```

UI 可以使用：

```text
React 或 Vue
```

考虑当前 Web 前端是 Vue，浏览器插件可以使用 Vue 来减少认知切换；如果后续 mobile 使用 React Native，也可以让插件使用 React。两者都可以复用 `packages/news-schema` 和 `packages/news-client`。

第一版建议优先做 Popup，后续再扩展 Side Panel 或新标签页。

## 目录结构

```text
browser-extension/
  src/
    popup/
      main.ts
      App.vue
      components/
    options/
      main.ts
      App.vue
    background/
      serviceWorker.ts
    shared/
      storage.ts
      config.ts
  public/
    manifest.json
    icons/
  package.json
  tsconfig.json
```

如果使用 React，则把 `.vue` 替换为 `.tsx`。

## 核心形态

### Popup

点击浏览器扩展图标后打开。

功能：

- 展示今日精选。
- 支持分类切换。
- 支持搜索。
- 点击新闻打开详情或直接打开原文。

第一版重点做 Popup，因为它最符合浏览器插件的轻量入口。

### Options Page

插件设置页。

功能：

- 数据源模式。
- static JSON base URL。
- Supabase URL 和 publishable key。
- 默认展示数量。
- 清除缓存。

### Side Panel，可选

Chrome Side Panel 适合做常驻阅读侧栏。

可后置到第二版：

- 左侧分类。
- 右侧新闻列表。
- 详情页。

### New Tab，可选

如果希望每次打开新标签都看到 AI RSS，可以做新标签页。

可后置，因为它会改变用户浏览器默认体验，审核和用户接受度都更敏感。

## 数据读取

Chrome 插件通过共享 client 读取：

```text
browser-extension -> packages/news-client -> static JSON / Supabase
```

需要注意 Manifest V3 的权限：

- 如果读取远程 static JSON，需要配置 host permissions。
- 权限范围要尽量窄。
- 不申请不必要的 tabs、history、bookmarks 权限。

## 配置设计

使用 Chrome storage：

```json
{
  "mode": "static",
  "staticBaseUrl": "https://example.com/data/news",
  "supabaseUrl": "",
  "supabaseKey": "",
  "defaultLimit": 20
}
```

存储建议：

- `chrome.storage.sync`：轻量配置。
- `chrome.storage.local`：缓存新闻数据。

注意：配置只影响插件展示端读取，不影响 backend。

## 缓存策略

建议缓存：

- 最近一次今日精选。
- 最近一次全部新闻。
- 最近一次分类新闻。
- 最近一次 sources。

策略：

- Popup 打开时先显示缓存。
- 再请求最新数据。
- 成功后更新缓存。
- 失败时显示缓存并提示数据可能不是最新。

## 页面设计

### Popup Today

功能：

- 今日精选列表。
- 手动刷新。
- 打开原文。
- 进入搜索。

Popup 尺寸通常较小，建议：

- 列表紧凑。
- 标题最多两到三行。
- 摘要默认折叠或控制行数。
- 原文打开使用新标签。

### Category

功能：

- 分类切换。
- 展示分类新闻。

### Search

功能：

- 搜索标题、摘要、来源。
- 展示结果。

### Options

功能：

- 配置数据源。
- 测试连接，可选。
- 清除缓存。

## 安全和审核注意事项

需要注意：

- 使用 Manifest V3。
- 权限最小化。
- host permissions 尽量只覆盖用户配置的数据域名。
- 不注入网页内容脚本，除非确实需要。
- 不采集浏览历史。
- 不在日志中输出 key。
- 外链打开前使用安全 URL 校验。

## 第一版功能清单

必做：

- Manifest V3。
- Popup。
- Today 列表。
- 分类。
- 搜索。
- Options 配置页。
- static JSON 数据源。
- 本地缓存。
- 打开原文。

可后置：

- Supabase 数据源。
- Side Panel。
- New Tab。
- 收藏。
- 已读状态。
- 通知提醒。

## 里程碑

### M1：插件骨架

- 创建 `browser-extension` workspace。
- 配置 Manifest V3。
- 配置 Popup 页面。
- 配置 Options 页面。

### M2：数据读取和缓存

- 接入 `packages/news-client`。
- 支持 static JSON。
- 接入 Chrome storage。
- 完成缓存回退。

### M3：核心阅读体验

- Today。
- Category。
- Search。
- 打开原文。

### M4：配置和权限

- Options 配置页。
- 权限最小化。
- 错误提示。
- 加载和空状态。

### M5：发布准备

- 图标。
- Chrome Web Store 文案。
- 隐私说明。
- 打包产物验证。

## 验收标准

- 插件不调用 backend 抓取、入库、摘要任务。
- 插件能读取与 Web 相同的数据。
- Popup 能展示 Today、分类、搜索。
- Options 能配置数据源。
- 断网时能展示最近缓存。
- Manifest V3 权限保持最小化。
