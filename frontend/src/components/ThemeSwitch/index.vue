<template>
  <button
    type="button"
    class="theme-switch"
    :class="{ 'theme-switch--dark': theme === 'dark' }"
    :title="theme === 'dark' ? '切换亮色' : '切换暗色'"
    :aria-label="theme === 'dark' ? '切换亮色' : '切换暗色'"
    @click="emit('toggleTheme')"
  >
    <span class="theme-switch__track">
      <span class="theme-switch__thumb">
        <svg
          v-if="theme === 'dark'"
          class="theme-switch__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20.2 15.6A8.4 8.4 0 0 1 8.4 3.8 7.4 7.4 0 1 0 20.2 15.6Z"></path>
        </svg>
        <svg v-else class="theme-switch__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2.4M12 19.6V22M4.93 4.93l1.7 1.7M17.37 17.37l1.7 1.7M2 12h2.4M19.6 12H22M4.93 19.07l1.7-1.7M17.37 6.63l1.7-1.7"></path>
        </svg>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
  import type { ThemeMode } from '@/types/theme'

  defineProps<{
    theme: ThemeMode
  }>()

  const emit = defineEmits<{
    toggleTheme: []
  }>()
</script>

<style scoped src="./index.scss" lang="scss"></style>
