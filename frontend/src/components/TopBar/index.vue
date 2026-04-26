<template>
  <header class="top-bar">
    <div class="top-bar__identity">
      <span class="top-bar__logo" aria-hidden="true">
        <span class="top-bar__logo-orbit"></span>
        <span class="top-bar__logo-core"></span>
      </span>
      <div class="top-bar__brand">
        <p class="top-bar__brand-tag">AI RSS Monitor</p>
        <h1 class="top-bar__title">智能资讯看板</h1>
      </div>
    </div>

    <NavSwitch :active-nav="activeNav" :nav-items="navItems" @change-nav="emit('changeNav', $event)" />

    <div class="top-bar__actions">
      <p class="top-bar__updated">
        <span class="top-bar__updated-label">更新时间：</span>
        <strong class="top-bar__updated-value">{{ lastUpdated }}</strong>
      </p>
      <ThemeSwitch :theme="theme" @toggle-theme="emit('toggleTheme')" />
      <a
        href="https://github.com/wangtunan/ai-rss-web"
        target="_blank"
        rel="noopener noreferrer"
        class="top-bar__github-link"
        title="GitHub 仓库"
        aria-label="打开 GitHub 仓库"
      >
        <svg class="top-bar__github-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.51.47-3.16-.63-3.36-1.21-.11-.3-.6-1.21-1.03-1.45-.35-.19-.85-.66-.01-.67.79-.01 1.35.74 1.54 1.05.9 1.55 2.34 1.11 2.91.85.09-.67.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.11.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.26 9.26 0 0 1 12 6.97c.85 0 1.7.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.1 10.1 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z"></path>
        </svg>
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
  import NavSwitch from '@/components/NavSwitch/index.vue'
  import ThemeSwitch from '@/components/ThemeSwitch/index.vue'

  import type { NavItem, NavType } from '@/types/nav'
  import type { ThemeMode } from '@/types/theme'

  defineProps<{
    activeNav: NavType
    lastUpdated: string
    navItems: NavItem[]
    theme: ThemeMode
  }>()

  const emit = defineEmits<{
    changeNav: [nav: NavType]
    toggleTheme: []
  }>()
</script>

<style scoped src="./index.scss" lang="scss"></style>
