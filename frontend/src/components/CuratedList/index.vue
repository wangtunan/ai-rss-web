<template>
  <div class="curated-list">
    <!-- skeleton -->
    <CuratedCardSkeleton
      v-if="props.activeSection.loading"
      :count="props.activeSection.limit"
    />

    <!-- error -->
    <CuratedCardError
      v-else-if="props.activeSection.error"
      :message="props.activeSection.error"
      @retry="emits('retry')"
    />

    <!-- list -->
    <ol v-else ref="listRef" class="curated-list__items">
      <li
        v-for="item in props.activeSection.items"
        :key="item.link"
        class="curated-list__cell"
      >
        <CuratedCard
          :item="item"
          :source-label="props.sourceLabel(item)"
        />
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import CuratedCard from '@/components/CuratedCard/index.vue'
  import CuratedCardError from '@/components/CuratedCardError/index.vue'
  import CuratedCardSkeleton from '@/components/CuratedCardSkeleton/index.vue'

  import type { NewsItem } from '@/types/news'
  import type { CuratedSection } from '@/types/curated'

  interface IProps {
    /** 当前激活区域 */
    activeSection: CuratedSection
    /** 源标签 */
    sourceLabel: (item: NewsItem) => string
  }

  interface IEmits {
    (e: 'retry'): void
  }

  const props = defineProps<IProps>()
  const emits = defineEmits<IEmits>()

  const listRef = ref<HTMLOListElement | null>(null)

  defineExpose({
    listRef,
  })
</script>

<style scoped src="./index.scss" lang="scss"></style>
