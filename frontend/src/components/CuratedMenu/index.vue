<template>
  <aside class="curated-menu">
    <header class="curated-menu__header">
      <p class="curated-menu__eyebrow">Curated</p>
      <h2 class="curated-menu__title">精选</h2>
    </header>

    <nav class="curated-menu__nav">
      <button
        v-for="item in props.navItems"
        :key="item.period"
        type="button"
        class="curated-menu__nav-item"
        :class="{ 'curated-menu__nav-item--active': props.activePeriod === item.period }"
        @click="emits('changePeriod', item.period)"
      >
        <span class="curated-menu__nav-main">
          <span class="curated-menu__nav-title">{{ item.title }}</span>
          <span class="curated-menu__nav-subtitle">{{ item.subtitle }}</span>
        </span>
        <span class="curated-menu__nav-count">{{ item.items.length || item.limit }}</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import type { CuratedNavItem, CuratedPeriod } from '@/types/curated'

  interface IProps {
    /** 导航列表 */
    navItems: CuratedNavItem[]
    /** 当前激活导航 */
    activePeriod: CuratedPeriod
  }

  interface IEmits {
    (e: 'changePeriod', period: CuratedPeriod): void
  }

  const props = defineProps<IProps>()
  const emits = defineEmits<IEmits>()
</script>

<style scoped src="./index.scss" lang="scss"></style>