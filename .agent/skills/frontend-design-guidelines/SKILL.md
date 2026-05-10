---
name: frontend-design-guidelines
description: Defines UI/UX design standards for this frontend dashboard. Use when creating or refactoring pages, cards, lists, themes, icons, typography, spacing, and interaction details to keep a consistent, high-quality, non-generic visual style.
---

# Frontend Design Guidelines

## Purpose

Ensure all frontend UI changes keep a consistent, production-grade visual language: clear hierarchy, strong readability, dark-theme-first experience, and no generic template style.

## When To Use

Use this skill when:
- Building or updating any page/component style
- Adjusting card/list layouts, typography, colors, spacing, icons
- Adding states (loading/empty/error/hover/focus)
- Optimizing responsive behavior

## Core Principles

1. Readability first
   - Primary content must be easy to scan in 3-5 seconds.
   - Keep contrast strong for dark mode and acceptable for light mode.

2. Information hierarchy
   - Title > summary > metadata > tags.
   - Use size/weight/color changes intentionally, not randomly.

3. Non-generic aesthetics
   - Avoid flat, template-like defaults.
   - Keep visual identity consistent with the dashboard tone (professional, data-centric, clean).

4. Interaction clarity
   - Hover, focus, active, loading, empty, and error states must be explicit.
   - Keyboard focus should always be visible.

## Theme Standards

- Dark mode is default; light mode is optional toggle.
- Use design tokens via CSS variables in `theme/`.
- Never hardcode random colors repeatedly in component styles.
- Scrollbar style should match current theme tokens.

## Layout Standards

- Card grid:
  - Desktop: up to 3 columns
  - Tablet: 2 columns
  - Mobile: 1 column
- Keep card height rhythm stable; avoid sudden visual jumps.
- Keep spacing system consistent (small/medium/large steps).

## Card Content Standards

For news cards:
- Category header includes icon + title + subtitle + count.
- Items default sort by importance descending.
- Title:
  - one-line ellipsis
  - tooltip for full text
- Summary:
  - max two lines
  - explicit "AI摘要" marker
  - tooltip for full text
- Tags:
  - separate final row
  - max 3 tags
  - differentiated tag colors

## Typography Standards

- Prefer system-safe font stack (no mandatory external webfont dependency).
- Use at most 3 text tiers in one card row.
- Avoid overly dense font weights and tiny metadata text.

## Icon Standards

- Category icons should use official brand favicon when feasible.
- Keep icon container size/shape consistent.
- Provide fallback icon for unknown categories.

## Responsive and A11y Checklist

- [ ] Works across desktop/tablet/mobile breakpoints
- [ ] Touch targets and spacing are usable on mobile
- [ ] Focus-visible styles are present for keyboard users
- [ ] Color contrast is acceptable in both themes
- [ ] Long text does not break layout

## Delivery Checklist

Before finishing any design-related task:
- [ ] Visual style remains consistent with existing dashboard
- [ ] No obvious "AI template" artifacts
- [ ] New styles are tokenized when reusable
- [ ] Lint/build/type-check pass
