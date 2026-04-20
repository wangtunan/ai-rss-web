---
name: frontend-directory-organization
description: Enforces frontend directory organization for this Vue project. Use when restructuring frontend code, splitting pages/components, moving App.vue to entry-only mode, or organizing files into views, components, types, hooks, api, constants, and theme directories.
---

# Frontend Directory Organization

## Purpose

Keep frontend code modular and consistent by separating UI, data, stateful logic, contracts, constants, and theme assets.

## When To Use

Use this skill when the user asks to:
- Refactor frontend folder structure
- Split a large page/component file
- "提取到 views/components/types/hooks/api/constants/theme"
- Standardize where new frontend code should live
- Make `App.vue` a pure entry
- Move page content into `views/...`

## Target Structure

Use this default structure under `frontend/src/`:

```text
App.vue                     # Entry only, usually just RouterView
views/                      # Page-level views (route targets)
components/                 # Reusable UI components
types/                      # TypeScript types/interfaces
hooks/                      # Reusable composition logic (useXxx)
api/                        # Request/fetch wrappers
constants/                  # Display/config constants
theme/                      # Theme hooks/constants/global css tokens
```

Recommended folder-per-component pattern:

```text
components/CategoryCard/
  index.vue
  index.scss

views/dashboard/
  index.vue
  index.scss
```

## Placement Rules

1. `App.vue`
   - Keep it as entry shell only.
   - Prefer `<RouterView />`; do not place page business UI here.

2. `views/`
   - Each page is a route target (`views/<page>/index.vue`).
   - Page-scoped style lives in `views/<page>/index.scss`.

3. `components/`
   - Reusable UI blocks live in `components/<Name>/index.vue`.
   - Component style lives in `components/<Name>/index.scss`.
   - If using `index.vue`, set explicit multi-word name via `defineOptions`.

4. `types/`
   - Put shared contracts here (DTO/view models/theme enums).
   - Every interface field should have concise Chinese comments.

5. `hooks/`
   - Put reusable stateful logic in `useXxx.ts`.
   - Examples: grouping/sorting data, orchestration between API and view state.

6. `api/`
   - Put request code here (`fetch/axios` wrapper).
   - Components/hooks consume `api` functions, not raw request code inline.

7. `constants/`
   - Put static config and mapping tables here (labels/order/meta).
   - Example: `SORT_CATEGORY_KEYS`, category label/icon mapping.

8. `theme/`
   - Put theme constants, theme hook, and global theme css here.
   - Example: storage key/default mode, `useTheme`, `theme.css`.

## Refactor Workflow

When reorganizing an existing page:

1. Move route-level UI from `App.vue` into `views/<page>/index.vue`.
2. Keep `App.vue` entry-only and ensure router maps `/` to a view.
3. Split reusable blocks into `components/<Name>/index.vue` + `index.scss`.
4. Keep state/data orchestration in hooks and api files when possible.
5. Update imports to alias paths (`@/xxx`) and new folder paths.
6. Preserve behavior; only change structure unless user asks otherwise.

## Quality Checklist

- [ ] New code follows target structure.
- [ ] `App.vue` is entry-only (RouterView-first).
- [ ] Pages are under `views/`.
- [ ] Reusable components use folder-per-component pattern.
- [ ] No duplicated type definitions across files.
- [ ] `types/` fields include comments.
- [ ] `hooks/` has reusable logic, not presentational CSS concerns.
- [ ] `api/` contains request implementation details.
- [ ] `constants/` and `theme/` are clearly separated.
- [ ] `index.vue` components define explicit multi-word component names.
- [ ] Lint and build/type-check pass after refactor.

## Notes

- Prefer incremental refactor over large rewrites.
- Keep naming consistent (`useXxx`, `xxx.ts`, `index.vue`, `index.scss`).
- If a folder name conflict exists, prefer `constants` (not misspelled variants).
- For single component coding rules (block order, BEM, scss), also use `vue-single-file-component-standard`.
