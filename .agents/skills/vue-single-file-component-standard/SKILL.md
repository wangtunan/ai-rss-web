---
name: vue-single-file-component-standard
description: 定义本项目单个 Vue 组件的规范。创建或重构 `.vue` 组件时使用，包括块顺序、script 写法、组件命名、BEM class 命名和外部 Dart Sass 文件。
---

# Vue 单文件组件标准

## 目的

保持每个 Vue 组件在结构、命名和样式组织上的一致性。

## 何时使用

当任务包含以下内容时使用本技能：
- 创建新的 Vue 组件
- 重构现有 `.vue` 文件
- 修正样式组织方式（拆分 `scss`）
- 修正 ESLint `vue/multi-word-component-names`

## 必需结构

每个组件文件必须遵循以下顺序：

1. `<template>`
2. `<script setup lang="ts">`
3. `<style ...>`

不允许其他块顺序。

## Script 规则

1. 使用 TypeScript：`<script setup lang="ts">`。
2. 保持缩进一致（2 空格）。
3. 使用清晰的导入顺序：
   - Vue 导入
   - 内部绝对路径导入（`@/...`）
   - 适用时使用 type-only 导入

## Style 规则

1. 通过 `lang="scss"` 使用 Dart Sass。
2. 默认使用外部样式文件：

```vue
<style scoped src="./index.scss" lang="scss"></style>
```

3. 严格使用 BEM class 命名：
   - Block：`.category-card`
   - Element：`.category-card__title`
   - Modifier：`.category-card__title--active`
4. 避免在组件样式中使用非 BEM 的工具类式本地 class 名。

## 组件目录模式

对于可复用组件，使用单组件文件夹：

```text
components/CategoryCard/
  index.vue
  index.scss
```

## 提交前检查清单

- [ ] 块顺序为 template -> script -> style
- [ ] 使用了 `script setup lang="ts"`
- [ ] 缩进一致（2 空格）
- [ ] 样式使用外部 `index.scss` 并设置 `lang="scss"`
- [ ] Class 名遵循严格 BEM
- [ ] Lint 和 type-check 通过
