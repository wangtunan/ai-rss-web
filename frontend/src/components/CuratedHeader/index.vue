<template>
  <header class="curated-header">
    <div class="curated-header__left">
      <p class="curated-header__eyebrow">{{ props.activeSection.badge }}</p>
      <h2 class="curated-header__title">{{ props.activeSection.title }}</h2>
    </div>
    <div class="curated-header__actions">
      <span class="curated-header__count">
        {{ props.activeSection.loading ? props.activeSection.limit : props.activeSection.items.length }} 条
      </span>
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
  import type { CuratedSection } from '@/types/curated'

  interface IProps {
    activeSection: CuratedSection
  }
  const props = defineProps<IProps>()
</script>

<style scoped src="./index.scss" lang="scss"></style>
