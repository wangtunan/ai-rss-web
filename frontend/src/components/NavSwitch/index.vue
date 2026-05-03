<template>
  <nav class="nav-switch" aria-label="资讯分类导航">
    <RouterLink
      v-for="item in navItems"
      :key="item.key"
      v-slot="{ href }"
      custom
      replace
      :to="getNavTo(item.key)"
    >
      <a
        :href="href"
        class="nav-switch__link"
        :class="{ 'nav-switch__link--active': activeNav === item.key }"
        :aria-current="activeNav === item.key ? 'page' : undefined"
        @click="handleNavClick($event, item.key)"
      >
        {{ item.label }}
      </a>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'

  import type { NavItem, NavType } from '@/types/nav'

  defineProps<{
    activeNav: NavType
    navItems: NavItem[]
  }>()

  const emit = defineEmits<{
    changeNav: [nav: NavType]
  }>()

  const route = useRoute()

  const getNavTo = (nav: NavType) => ({
    name: 'dashboard',
    query: {
      ...route.query,
      nav,
    },
  })

  const handleNavClick = (event: MouseEvent, nav: NavType) => {
    if (event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return
    }

    event.preventDefault()
    emit('changeNav', nav)
  }
</script>

<style scoped src="./index.scss" lang="scss"></style>
