<template>
  <main class="curated-page">
    <!-- menu -->
    <CuratedMenu
      :nav-items="navItems"
      :active-period="activePeriod"
      @change-period="activePeriod = $event"
    />

    <!-- content -->
    <section class="curated-page__content">
      <!-- header -->
      <CuratedHeader :active-section="activeSection">
        <template #actions>
          <ShareAction
            :disabled="activeSection.loading"
            :items="activeSection.items"
            :target-ref="curatedListRef?.listRef ?? null"
          />
        </template>
      </CuratedHeader>

      <!-- list -->
      <CuratedList
        ref="curatedListRef"
        :active-section="activeSection"
        :source-label="sourceLabel"
        @retry="loadSection(activeSection)"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
  // ======= 第三方库 =======
  import { computed, onMounted, ref } from 'vue'

  // ======= 组件 =======
  import CuratedHeader from '@/components/CuratedHeader/index.vue'
  import CuratedMenu from '@/components/CuratedMenu/index.vue'
  import CuratedList from '@/components/CuratedList/index.vue'
  import ShareAction from '@/components/ShareAction/index.vue'

  // ======= 其它 =======
  import { fetchCuratedNewsPayload } from '@/api/news'
  import { CATEGORY_META } from '@/constants/news'
  import type { NewsItem } from '@/types/news'
  import type { CuratedNavItem, CuratedSection, CuratedPeriod } from '@/types/curated'

  const emit = defineEmits<{
    loaded: []
  }>()

  const activePeriod = ref<CuratedPeriod>('today')
  const curatedListRef = ref<InstanceType<typeof CuratedList> | null>(null)

  const sections = ref<CuratedSection[]>([
    {
      period: 'today',
      title: '当日精选',
      subtitle: '今日 Top 20',
      badge: 'Today',
      limit: 20,
      loading: true,
      error: '',
      items: [],
    },
  ])

  const activeSection = computed<CuratedSection>(() => {
    return sections.value.find((s) => s.period === activePeriod.value) ?? sections.value[0]!
  })

  const navItems = computed<CuratedNavItem[]>(() =>
    sections.value.map((s) => ({
      period: s.period,
      title: s.title,
      subtitle: s.subtitle,
      badge: s.badge,
      limit: s.limit,
      items: s.items,
    }))
  )

  const sourceMeta = (item: NewsItem) => CATEGORY_META[item.category]
  const sourceLabel = (item: NewsItem) => sourceMeta(item)?.subtitle ?? item.source ?? item.category

  const loadSection = async (section: CuratedSection) => {
    section.loading = true
    section.error = ''

    try {
      const result = await fetchCuratedNewsPayload({
        period: section.period,
        limit: section.limit,
        offset: 0,
      })
      section.items = result.items
    } catch (e) {
      section.error = e instanceof Error ? e.message : '未知错误'
      section.items = []
    } finally {
      section.loading = false
    }
  }

  const loadAll = async () => {
    await Promise.all(sections.value.map((s) => loadSection(s)))
    emit('loaded')
  }

  onMounted(loadAll)
</script>

<style scoped src="./index.scss" lang="scss"></style>
