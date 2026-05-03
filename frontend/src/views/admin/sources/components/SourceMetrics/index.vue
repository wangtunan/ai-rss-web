<template>
  <section class="source-metrics" aria-label="RSS 源统计">
    <article
      v-for="metric in metrics"
      :key="metric.key"
      class="source-metrics__item"
      :class="`is-${metric.key}`"
    >
      <div class="source-metrics__icon">
        <el-icon>
          <component :is="metric.icon" />
        </el-icon>
      </div>
      <div class="source-metrics__copy">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
  import type { RssSourceMetric } from '@/types/rss_source'

  defineOptions({
    name: 'SourceMetrics',
  })

  defineProps<{
    metrics: RssSourceMetric[]
  }>()
</script>

<style scoped src="./index.scss" lang="scss"></style>
