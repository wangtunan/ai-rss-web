---
name: vue-single-file-component-standard
description: Defines standards for a single Vue component in this project. Use when creating or refactoring `.vue` components, including block order, script style, component naming, BEM class naming, and external Dart Sass files.
---

# Vue Single File Component Standard

## Purpose

Keep every Vue component consistent in structure, naming, and styling.

## When To Use

Use this skill when the task includes:
- Creating a new Vue component
- Refactoring an existing `.vue` file
- Fixing style organization (`scss` split-out)
- Fixing ESLint `vue/multi-word-component-names`

## Required Structure

Each component file must follow this order:

1. `<template>`
2. `<script setup lang="ts">`
3. `<style ...>`

No other block order is allowed.

## Script Rules

1. Use TypeScript: `<script setup lang="ts">`.
2. Keep consistent indentation (2 spaces).
3. Use clear imports order:
   - Vue imports
   - internal absolute imports (`@/...`)
   - type-only imports where applicable

## Style Rules

1. Use Dart Sass via `lang="scss"`.
2. Use external style file by default:

```vue
<style scoped src="./index.scss" lang="scss"></style>
```

3. Use strict BEM class naming:
   - Block: `.category-card`
   - Element: `.category-card__title`
   - Modifier: `.category-card__title--active`
4. Avoid non-BEM utility-like local class names in component styles.

## Component Directory Pattern

For reusable components, use folder-per-component:

```text
components/CategoryCard/
  index.vue
  index.scss
```

## Pre-Submit Checklist

- [ ] Block order is template -> script -> style
- [ ] `script setup lang="ts"` is used
- [ ] Indentation is consistent (2 spaces)
- [ ] Style uses external `index.scss` with `lang="scss"`
- [ ] Class names follow strict BEM
- [ ] Lint and type-check pass
