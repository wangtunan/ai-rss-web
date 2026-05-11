<template>
  <!-- skeleton -->
  <CategorySkeleton v-if="loading" />

  <!-- content -->
  <section
    v-else-if="error || items.length > 0"
    class="category-card-wrapper"
    ref="categorySection"
  >
    <!-- header -->
    <CategoryHeader
      :category="props.category"
      :items-count="items.length"
      :items="items"
      :target-ref="categorySection"
    />

    <!-- error -->
    <CategoryError
      v-if="error"
      :error="error"
      @retry="loadCategory"
    />

    <!-- list -->
    <ol v-else class="category-card__list">
      <CategoryCard
        v-for="(item, index) in items"
        :index="index"
        :key="`${category.key}-${item.link}`"
        :item="item"
      />
    </ol>
  </section>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import { fetchNewsListPayload } from '@/api/news'

  import CategorySkeleton from '@/components/CategorySkeleton/index.vue'
  import CategoryHeader from '@/components/CategoryHeader/index.vue'
  import CategoryError from '@/components/CategoryError/index.vue'
  import CategoryCard from '@/components/CategoryCard/index.vue'

  import { MAX_ITEMS_PER_CATEGORY } from '@/constants/news'
  import type { NewsItem, CategoryMeta } from '@/types/news'

  interface IProps {
    /** 分类元信息 */
    category: CategoryMeta
  }

  interface IEmits {
    (e: 'loaded'): void
  }

  const props = defineProps<IProps>()
  const emits = defineEmits<IEmits>()

  const loading = ref(true)
  const error = ref('')
  const items = ref<NewsItem[]>([])
  const categorySection = ref<HTMLDivElement | null>(null)

  const loadCategory = async () => {
    loading.value = true
    error.value = ''

    try {
      const result = await fetchNewsListPayload({
        category: props.category.key,
        limit: MAX_ITEMS_PER_CATEGORY,
        offset: 0,
      })
      items.value = result.items
      emits('loaded')
    } catch (e) {
      error.value = e instanceof Error ? e.message : '未知错误'
      items.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(loadCategory)
</script>

<style scoped src="./index.scss" lang="scss"></style>
