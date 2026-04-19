<template>
  <section class="category-card skeleton-card" aria-hidden="true">
    <header class="card-header">
      <div class="header-main">
        <div class="line icon-line"></div>
        <div class="line subtitle-line"></div>
      </div>
      <div class="pill"></div>
    </header>

    <ol class="news-list">
      <li v-for="index in rowCount" :key="index" class="news-row">
        <div class="line rank-line"></div>
        <div class="content">
          <div class="line title-line"></div>
          <div class="line summary-line"></div>
          <div class="line summary-line short"></div>
          <div class="footer">
            <div class="line time-line"></div>
            <div class="line tag-line"></div>
          </div>
        </div>
        <div class="line importance-line"></div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    rowCount?: number
  }>(),
  {
    rowCount: 4,
  },
)
</script>

<style scoped>
.skeleton-card {
  border: 1px solid var(--line);
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.018), transparent 35%),
    var(--surface);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  border-bottom: 1px solid var(--line);
  padding: 0.9rem 1rem;
}

.header-main {
  display: grid;
  gap: 0.35rem;
  width: 100%;
  max-width: 14rem;
}

.news-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.news-row {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  align-items: start;
  gap: 0.68rem;
  padding: 0.82rem 1rem;
  border-bottom: 1px dashed var(--line);
}

.news-row:last-child {
  border-bottom: 0;
}

.content {
  display: grid;
  gap: 0.42rem;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.36rem;
}

.line {
  border-radius: 999px;
  background: color-mix(in oklab, var(--line-strong), transparent 35%);
  position: relative;
  overflow: hidden;
}

.line::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in oklab, var(--text), transparent 85%) 48%,
    transparent 100%
  );
  animation: shimmer 1.6s ease-in-out infinite;
}

.icon-line {
  height: 1.25rem;
  width: 9.4rem;
}

.subtitle-line {
  height: 0.75rem;
  width: 7rem;
}

.pill {
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 999px;
  background: color-mix(in oklab, var(--line-strong), transparent 35%);
}

.rank-line {
  width: 1.2rem;
  height: 0.84rem;
  margin-top: 0.2rem;
}

.title-line {
  width: 90%;
  height: 0.92rem;
}

.summary-line {
  width: 100%;
  height: 0.72rem;
}

.summary-line.short {
  width: 72%;
}

.time-line {
  width: 6.8rem;
  height: 0.72rem;
}

.tag-line {
  width: 4rem;
  height: 0.72rem;
}

.importance-line {
  width: 2.2rem;
  height: 0.72rem;
  margin-top: 0.1rem;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
