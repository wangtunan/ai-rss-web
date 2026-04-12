<template>
  <header class="topbar">
    <div class="brand">
      <p class="brand-tag">AI RSS Monitor</p>
      <h1>智能资讯看板</h1>
    </div>

    <div class="toolbar">
      <p class="updated">
        <span>更新时间</span>
        <strong>{{ lastUpdated }}</strong>
      </p>
      <button type="button" class="theme-switch" @click="emit('toggleTheme')">
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


<style scoped>
.topbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.4rem;
}

.brand-tag {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.brand h1 {
  margin: 0;
  font-family:
    'Segoe UI',
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    sans-serif;
  font-size: clamp(1.5rem, 1.2rem + 1.4vw, 2.5rem);
  line-height: 1.1;
  letter-spacing: 0.02em;
  font-weight: 700;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.updated {
  margin: 0;
  padding: 0.58rem 0.82rem;
  border-radius: 0.7rem;
  border: 1px solid var(--line);
  background: var(--bg-soft);
  color: var(--text-soft);
  display: grid;
  gap: 0.14rem;
  box-shadow: var(--shadow);
}

.updated span {
  font-size: 0.72rem;
}

.updated strong {
  font-size: 0.92rem;
  letter-spacing: 0.01em;
  color: var(--text);
}

.theme-switch {
  border: 1px solid var(--line-strong);
  background: linear-gradient(150deg, var(--surface), var(--surface-2));
  color: var(--text);
  border-radius: 0.75rem;
  padding: 0.62rem 0.94rem;
  cursor: pointer;
  font-size: 0.86rem;
  font-weight: 600;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.2s ease;
}

.theme-switch:hover {
  transform: translateY(-1px);
  border-color: var(--accent);
  background: linear-gradient(145deg, var(--surface-2), var(--surface));
}

@media (max-width: 820px) {
  .topbar {
    align-items: start;
    flex-direction: column;
  }

  .toolbar {
    width: 100%;
    justify-content: space-between;
  }

  .updated {
    flex: 1;
  }
}
</style>
