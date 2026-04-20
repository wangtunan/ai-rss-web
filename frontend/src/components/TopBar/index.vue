<template>
  <header class="top-bar">
    <div class="top-bar__brand">
      <p class="top-bar__brand-tag">AI RSS Monitor</p>
      <h1 class="top-bar__title">智能资讯看板</h1>
    </div>

    <div class="top-bar__toolbar">
      <p class="top-bar__updated">
        <span class="top-bar__updated-label">更新时间</span>
        <strong class="top-bar__updated-value">{{ lastUpdated }}</strong>
      </p>
      <button type="button" class="top-bar__theme-switch" @click="emit('toggleTheme')">
        {{ theme === 'dark' ? '切换亮色' : '切换暗色' }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
  import type { ThemeMode } from '@/types/news'

  defineProps<{
    lastUpdated: string
    theme: ThemeMode
  }>()

  const emit = defineEmits<{
    toggleTheme: []
  }>()
</script>

<style scoped src="./index.scss" lang="scss"></style>
