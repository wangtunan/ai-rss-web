<template>
  <ol class="subscription-list">
    <li
      v-for="item in props.items"
      :key="item.link"
      class="subscription-list__cell"
    >
      <CuratedCard
        :item="item"
        :source-label="sourceLabel(item)"
      />
    </li>
  </ol>
</template>

<script setup lang="ts">
  import CuratedCard from '@/components/CuratedCard/index.vue'
  import type { NewsItem } from '@/types/news'

  interface IProps {
    /** 订阅资讯列表 */
    items: NewsItem[]
    /** 来源标签生成函数 */
    sourceLabel: (item: NewsItem) => string
  }

  defineOptions({
    name: 'SubscriptionList',
  })

  const props = defineProps<IProps>()
</script>

<style scoped src="./index.scss" lang="scss"></style>
