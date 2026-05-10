<template>
  <div v-if="renderTags.length" class="news-tags">
    <span
      v-for="tag in renderTags"
      :key="tag"
      class="news-tags__item"
    >
      {{ tag }}
    </span>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue'

  interface IProps {
    /** 标签列表 */
    tags: string[]
    /** 最大显示数量 */
    maxCount: number
  }
  const props = defineProps<IProps>()

  const renderTags = computed(() => {
    return props.tags?.slice(0, props.maxCount)
  })
</script>

<style scoped src="./index.scss" lang="scss"></style>