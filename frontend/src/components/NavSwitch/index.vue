<template>
  <nav class="nav-switch" :style="navStyle" aria-label="资讯分类导航">
    <span class="nav-switch__indicator" aria-hidden="true"></span>
    <button
      v-for="item in navItems"
      :key="item.key"
      type="button"
      class="nav-switch__button"
      :class="{ 'nav-switch__button--active': activeNav === item.key }"
      :aria-current="activeNav === item.key ? 'page' : undefined"
      @click="emit('changeNav', item.key)"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import type { NavItem, NavType } from '@/types/nav'

  const props = defineProps<{
    activeNav: NavType
    navItems: NavItem[]
  }>()

  const emit = defineEmits<{
    changeNav: [nav: NavType]
  }>()

  const activeNavIndex = computed(() => {
    const index = props.navItems.findIndex((item) => item.key === props.activeNav)
    return index >= 0 ? index : 0
  })

  const navStyle = computed(() => ({
    gridTemplateColumns: `repeat(${props.navItems.length}, minmax(0, 1fr))`,
    '--nav-switch-active-index': activeNavIndex.value,
    '--nav-switch-item-count': props.navItems.length,
  }))
</script>

<style scoped src="./index.scss" lang="scss"></style>
