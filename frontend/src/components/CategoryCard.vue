<template>
  <section class="category-card">
    <header class="card-header">
      <div>
        <h2>
          <span
            class="category-icon" aria-hidden="true"
            :class="category.key === 'github' ? 'github-icon' : ''"
          >
            <img :src="category.icon" :alt="`${category.subtitle} favicon`" />
          </span>
          <span>{{ category.label }}</span>
        </h2>
        <p>{{ category.subtitle }} · Top {{ category.items.length }}</p>
      </div>
      <span class="count-pill">{{ category.items.length }}</span>
    </header>

    <ol class="news-list">
      <li v-for="(item, index) in category.items" :key="`${category.key}-${item.link}`" class="news-row">
        <p class="rank">{{ index + 1 }}</p>
        <div class="news-main" :title="item.title">
          <a
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
            class="title-link"
            :title="item.title"
          >
            {{ item.title }}
          </a>
          <p class="summary" :title="item.ai_summary">
            <span class="summary-label">AI摘要</span>
            <span>{{ item.ai_summary }}</span>
          </p>

          <div class="footer">
            <span class="published-time">{{ item.published_time }}</span>

            <div v-if="item.ai_tags?.length" class="tags-row">
              <span v-for="tag in item.ai_tags.slice(0, 3)" :key="`${item.link}-${tag}`" class="tag-chip">
                {{ tag }}
              </span>
            </div>
          </div>
          
        </div>
        <div class="meta">
          <span class="importance">★{{ item.ai_importance }}</span>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import type { CategoryView } from '@/types/news'

defineProps<{
  category: CategoryView
}>()
</script>

<style scoped>
.category-card {
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

.card-header h2 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.42rem;
  font-size: 1.08rem;
  line-height: 1.2;
}

.category-icon {
  width: 1.2rem;
  height: 1.2rem;
  display: grid;
  place-items: center;
  font-size: 0.78rem;
  color: var(--accent);
  overflow: hidden;

  &.github-icon {
   border-radius: 50%;
   overflow: hidden;
   background-color: #fff;
  }
}

.category-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-header p {
  margin: 0.24rem 0 0;
  color: var(--text-soft);
  font-size: 0.79rem;
}

.count-pill {
  min-width: 1.9rem;
  height: 1.9rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line-strong);
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 700;
  font-size: 0.83rem;
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

.news-row:hover {
  background: rgba(94, 234, 212, 0.06);
}

.rank {
  margin: 0;
  font-size: 0.86rem;
  color: var(--text-soft);
  line-height: 1.4;
  font-weight: 600;
}

.news-main {
  display: grid;
  gap: 0.42rem;
  min-width: 0;
}

.title-link {
  display: block;
  color: var(--text);
  font-size: 0.9rem;
  line-height: 1.4;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title-link:hover {
  color: var(--accent);
}

.title-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 0.2rem;
}

.summary {
  margin: 0.4rem 0 0;
  font-size: 0.79rem;
  color: var(--text-soft);
  line-height: 1.42;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.summary-label {
  display: inline-block;
  margin-right: 0.35rem;
  padding: 0.08rem 0.32rem;
  border-radius: 0.32rem;
  border: 1px solid var(--line-strong);
  color: var(--accent);
  background: var(--accent-soft);
  font-size: 0.68rem;
  font-weight: 700;
  vertical-align: baseline;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.36rem;
}

.published-time {
  font-size: 0.79rem;
  color: var(--text-soft);
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.36rem;
  margin-top: 0.08rem;
  justify-content: flex-end;
}

.tag-chip {
  font-size: 0.68rem;
  line-height: 1;
  border-radius: 999px;
  border: 1px solid var(--line);
  padding: 0.26rem 0.48rem;
}

.tag-chip:nth-child(3n + 1) {
  color: #2dd4bf;
  border-color: color-mix(in oklab, #2dd4bf, transparent 58%);
  background: color-mix(in oklab, #2dd4bf, transparent 86%);
}

.tag-chip:nth-child(3n + 2) {
  color: #a78bfa;
  border-color: color-mix(in oklab, #a78bfa, transparent 58%);
  background: color-mix(in oklab, #a78bfa, transparent 86%);
}

.tag-chip:nth-child(3n) {
  color: #f59e0b;
  border-color: color-mix(in oklab, #f59e0b, transparent 58%);
  background: color-mix(in oklab, #f59e0b, transparent 87%);
}

.meta {
  display: grid;
  gap: 0.34rem;
  justify-items: end;
}

.importance {
  font-size: 0.68rem;
  line-height: 1;
  border-radius: 999px;
  border: 1px solid var(--line);
  padding: 0.26rem 0.46rem;
  white-space: nowrap;
}

.importance {
  color: var(--accent);
  border-color: color-mix(in oklab, var(--accent), transparent 64%);
  background: color-mix(in oklab, var(--accent), transparent 86%);
}
</style>
