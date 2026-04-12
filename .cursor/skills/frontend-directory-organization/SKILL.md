---
name: frontend-directory-organization
description: Enforces frontend directory organization for Vue projects. Use when restructuring frontend code, extracting logic from large components, or when the user asks to organize files into components, types, hooks, api, constants, and theme directories.
---

# Frontend Directory Organization

## Purpose

Keep frontend code modular and consistent by separating UI, data, stateful logic, contracts, constants, and theme assets.

## When To Use

Use this skill when the user asks to:
- Refactor frontend folder structure
- Split a large page/component file
- "提取到 components/types/hooks/api/constants/theme"
- Standardize where new frontend code should live

## Target Structure

Use this default structure under `frontend/src/`:

```text
components/   # UI components (.vue)
types/        # TypeScript types/interfaces
hooks/        # Reusable composition logic (useXxx)
api/          # Request/fetch wrappers
constants/    # Display/config constants
theme/        # Theme hooks/constants/global css tokens
```

## Placement Rules

1. `components/`
   - Only rendering + interaction logic for a specific UI block.
   - Avoid embedding data-fetching implementation details.

2. `types/`
   - Put shared contracts here (DTO/view models/theme enums).
   - Every interface field should have concise Chinese comments.

3. `hooks/`
   - Put reusable stateful logic in `useXxx.ts`.
   - Examples: grouping/sorting data, orchestration between API and view state.

4. `api/`
   - Put request code here (`fetch/axios` wrapper).
   - Components/hooks consume `api` functions, not raw request code inline.

5. `constants/`
   - Put static config and mapping tables here (labels/order/meta).
   - Example: `SORT_CATEGORY_KEYS`, category label/icon mapping.

6. `theme/`
   - Put theme constants, theme hook, and global theme css here.
   - Example: storage key/default mode, `useTheme`, `theme.css`.

## Refactor Workflow

When reorganizing an existing page:

1. Identify concerns in current file:
   - View template/styles
   - Types
   - Data loading
   - State/computed logic
   - Theme logic
   - Constants/mappings
2. Move concerns into target folders above.
3. Keep `App.vue` or page file as a thin orchestrator:
   - import components
   - call hooks
   - pass props/events
4. Update imports to alias paths (`@/xxx`).
5. Preserve behavior; only change structure unless user asks otherwise.

## Quality Checklist

- [ ] New code follows target structure.
- [ ] No duplicated type definitions across files.
- [ ] `types/` fields include comments.
- [ ] `hooks/` has reusable logic, not presentational CSS concerns.
- [ ] `api/` contains request implementation details.
- [ ] `constants/` and `theme/` are clearly separated.
- [ ] Lint and build/type-check pass after refactor.

## Notes

- Prefer incremental refactor over large rewrites.
- Keep naming consistent (`useXxx`, `xxx.ts`, `Xxx.vue`).
- If a folder name conflict exists, prefer `constants` (not misspelled variants).
