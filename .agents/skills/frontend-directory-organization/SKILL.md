---
name: frontend-directory-organization
description: 约束本 Vue 项目的前端目录组织。当前端代码重构、拆分页/组件、将 App.vue 调整为纯入口，或将文件组织进 views、components、types、hooks、api、constants、theme 目录时使用。
---

# 前端目录组织

## 目的

通过分离 UI、数据、有状态逻辑、契约、常量和主题资源，保持前端代码模块化且一致。

## 何时使用

当用户要求以下任务时使用本技能：
- 重构前端文件夹结构
- 拆分大型页面或组件文件
- “提取到 views/components/types/hooks/api/constants/theme”
- 规范新增前端代码的放置位置
- 让 `App.vue` 成为纯入口
- 将页面内容移动到 `views/...`

## 目标结构

`frontend/src/` 下默认使用以下结构：

```text
App.vue                     # 仅作为入口，通常只包含 RouterView
views/                      # 页面级视图（路由目标）
components/                 # 可复用 UI 组件
types/                      # TypeScript 类型/接口
hooks/                      # 可复用组合式逻辑（useXxx）
api/                        # 请求/fetch 封装
constants/                  # 展示/配置常量
theme/                      # 主题 hooks、常量、全局 CSS token
```

推荐的单组件文件夹模式：

```text
components/CategoryCard/
  index.vue
  index.scss

views/dashboard/
  index.vue
  index.scss
```

## 放置规则

1. `App.vue`
   - 保持为入口壳。
   - 优先只放 `<RouterView />`；不要在这里放页面业务 UI。

2. `views/`
   - 每个页面都是一个路由目标（`views/<page>/index.vue`）。
   - 页面作用域样式放在 `views/<page>/index.scss`。

3. `components/`
   - 可复用 UI 块放在 `components/<Name>/index.vue`。
   - 组件样式放在 `components/<Name>/index.scss`。
   - 如果使用 `index.vue`，通过 `defineOptions` 设置显式的多词组件名。

4. `types/`
   - 共享契约放在这里（DTO、视图模型、主题枚举等）。
   - 每个 interface 字段都应有简洁中文注释。

5. `hooks/`
   - 可复用有状态逻辑放在 `useXxx.ts`。
   - 示例：数据分组/排序、API 与视图状态之间的编排逻辑。

6. `api/`
   - 请求代码放在这里（`fetch/axios` 封装）。
   - 组件和 hooks 消费 `api` 函数，不要内联原始请求代码。

7. `constants/`
   - 静态配置和映射表放在这里（标签、顺序、元信息等）。
   - 示例：`SORT_CATEGORY_KEYS`、分类标签/图标映射。

8. `theme/`
   - 主题常量、主题 hook 和全局主题 CSS 放在这里。
   - 示例：存储 key、默认模式、`useTheme`、`theme.css`。

## 重构流程

重组现有页面时：

1. 将路由级 UI 从 `App.vue` 移到 `views/<page>/index.vue`。
2. 保持 `App.vue` 仅作为入口，并确保 router 将 `/` 映射到某个 view。
3. 将可复用块拆分为 `components/<Name>/index.vue` + `index.scss`。
4. 尽量将状态/数据编排放在 hooks 和 api 文件中。
5. 将导入更新为别名路径（`@/xxx`）和新的文件夹路径。
6. 保持行为不变；除非用户另有要求，否则只调整结构。

## 质量检查清单

- [ ] 新代码遵循目标结构。
- [ ] `App.vue` 仅作为入口（优先 RouterView）。
- [ ] 页面放在 `views/` 下。
- [ ] 可复用组件使用单组件文件夹模式。
- [ ] 没有跨文件重复定义类型。
- [ ] `types/` 中字段包含中文注释。
- [ ] `hooks/` 中是可复用逻辑，不包含表现层 CSS 关注点。
- [ ] `api/` 包含请求实现细节。
- [ ] `constants/` 和 `theme/` 边界清晰。
- [ ] `index.vue` 组件定义显式多词组件名。
- [ ] 重构后 lint、build/type-check 通过。

## 备注

- 优先增量重构，避免大规模重写。
- 保持命名一致（`useXxx`、`xxx.ts`、`index.vue`、`index.scss`）。
- 如果文件夹名称冲突，优先使用 `constants`（不要使用拼错的变体）。
- 单组件编码规则（块顺序、BEM、scss）另见 `vue-single-file-component-standard`。
