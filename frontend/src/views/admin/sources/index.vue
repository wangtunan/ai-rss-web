<template>
  <main class="sources-admin">
    <header class="sources-admin__header">
      <div class="sources-admin__title">
        <p class="sources-admin__eyebrow">RSS CONTROL PLANE</p>
        <h1>RSS 源维护</h1>
        <span>管理抓取入口、启停状态和单源抓取上限</span>
      </div>

      <div class="sources-admin__header-actions">
        <el-button :icon="Refresh" :loading="loading" @click="loadSources()">刷新</el-button>
        <el-button type="primary" :icon="Plus" @click="startCreate">新增源</el-button>
      </div>
    </header>

    <SourceMetrics class="sources-admin__section" :metrics="summaryMetrics" />

    <SourceToolbar
      v-model:keyword="keyword"
      v-model:active-category="activeCategory"
      v-model:active-status="activeStatus"
      class="sources-admin__section"
      :category-options="categoryOptions"
      :status-options="RSS_SOURCE_STATUS_OPTIONS"
    />

    <SourceTable
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      class="sources-admin__section"
      :sources="paginatedSources"
      :loading="loading"
      :saving-id="savingId"
      :page-sizes="RSS_SOURCE_PAGE_SIZES"
      :total="filteredSources.length"
      @edit="startEdit"
      @remove="removeSource"
      @toggle-enabled="toggleEnabled"
    />

    <SourceEditorDialog
      v-model:visible="dialogVisible"
      v-model:form="form"
      :saving="saving"
      :editing-id="editing?.id ?? ''"
      @closed="cancelEdit"
      @save="saveSource"
    />
  </main>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { CircleCheck, CircleClose, Files, Filter, Plus, Refresh } from '@element-plus/icons-vue'

  import { createRssSource, deleteRssSource, fetchRssSources, updateRssSource } from '@/api/rss_sources'
  import { DEFAULT_RSS_SOURCE_PAGE_SIZE, RSS_SOURCE_PAGE_SIZES, RSS_SOURCE_STATUS_OPTIONS } from '@/constants/rss_source'
  import { useTheme } from '@/hooks/useTheme'
  import type { RssSource, RssSourceInput, RssSourceMetric, RssSourceStatusFilter } from '@/types/rss_source'

  import SourceEditorDialog from './components/SourceEditorDialog/index.vue'
  import SourceMetrics from './components/SourceMetrics/index.vue'
  import SourceTable from './components/SourceTable/index.vue'
  import SourceToolbar from './components/SourceToolbar/index.vue'

  defineOptions({
    name: 'AdminSourcesView',
  })

  const { initializeTheme } = useTheme()
  const sources = ref<RssSource[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const savingId = ref<string | null>(null)
  const keyword = ref('')
  const activeCategory = ref('')
  const activeStatus = ref<RssSourceStatusFilter>('all')
  const editing = ref<RssSource | null>(null)
  const dialogVisible = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(DEFAULT_RSS_SOURCE_PAGE_SIZE)
  const form = ref<RssSourceInput>(createEmptyForm())

  const categoryOptions = computed(() => {
    return Array.from(new Set(sources.value.map((source) => source.category).filter(Boolean))).sort()
  })

  const enabledCount = computed(() => sources.value.filter((source) => source.enabled).length)
  const disabledCount = computed(() => sources.value.length - enabledCount.value)

  const filteredSources = computed(() => {
    const query = keyword.value.toLowerCase()

    return sources.value.filter((source) => {
      const matchesKeyword =
        !query ||
        source.name.toLowerCase().includes(query) ||
        source.category.toLowerCase().includes(query) ||
        source.url.toLowerCase().includes(query)
      const matchesCategory = !activeCategory.value || source.category === activeCategory.value
      const matchesStatus =
        activeStatus.value === 'all' ||
        (activeStatus.value === 'enabled' && source.enabled) ||
        (activeStatus.value === 'disabled' && !source.enabled)

      return matchesKeyword && matchesCategory && matchesStatus
    })
  })

  const summaryMetrics = computed<RssSourceMetric[]>(() => [
    { key: 'total', label: '源总数', value: sources.value.length, icon: Files },
    { key: 'enabled', label: '启用中', value: enabledCount.value, icon: CircleCheck },
    { key: 'disabled', label: '已停用', value: disabledCount.value, icon: CircleClose },
    { key: 'visible', label: '当前显示', value: filteredSources.value.length, icon: Filter },
  ])

  const paginatedSources = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredSources.value.slice(start, start + pageSize.value)
  })

  function createEmptyForm(): RssSourceInput {
    return {
      category: '',
      name: '',
      url: '',
      enabled: true,
      sort_order: sources.value.length,
      max_entries: null,
    }
  }

  const resetForm = () => {
    form.value = createEmptyForm()
  }

  const fillForm = (source: RssSource) => {
    form.value = {
      category: source.category,
      name: source.name,
      url: source.url,
      enabled: source.enabled,
      sort_order: source.sort_order,
      max_entries: source.max_entries,
    }
  }

  const normalizePayload = (): RssSourceInput => ({
    category: form.value.category,
    name: form.value.name,
    url: form.value.url,
    enabled: form.value.enabled,
    sort_order: Number.isFinite(form.value.sort_order) ? Number(form.value.sort_order) : 0,
    max_entries: form.value.max_entries ? Number(form.value.max_entries) : null,
  })

  const loadSources = async (silent = false) => {
    loading.value = true
    try {
      sources.value = await fetchRssSources()
      if (!silent) ElMessage.success('RSS 源已同步')
    } catch (error) {
      if (silent) throw error
      ElMessage.error(error instanceof Error ? error.message : '加载失败')
    } finally {
      loading.value = false
    }
  }

  const refreshSourcesSilently = () => {
    loadSources(true).catch((error) => {
      console.warn('[rss_sources] refresh failed after mutation:', error)
    })
  }

  const startCreate = () => {
    resetForm()
    editing.value = {
      id: '',
      created_at: '',
      updated_at: '',
      ...form.value,
    }
    dialogVisible.value = true
  }

  const startEdit = (source: RssSource) => {
    editing.value = source
    fillForm(source)
    dialogVisible.value = true
  }

  const cancelEdit = () => {
    editing.value = null
    resetForm()
  }

  const saveSource = async () => {
    saving.value = true
    try {
      const payload = normalizePayload()
      if (editing.value?.id) {
        const editingId = editing.value.id
        await updateRssSource(editingId, payload)
        sources.value = sources.value.map((source) =>
          source.id === editingId ? { ...source, ...payload } : source,
        )
        refreshSourcesSilently()
        ElMessage.success('RSS 源已更新')
      } else {
        const created = await createRssSource(payload)
        sources.value = [...sources.value, created].sort((a, b) => a.sort_order - b.sort_order)
        ElMessage.success('RSS 源已创建')
      }
      dialogVisible.value = false
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '保存失败')
    } finally {
      saving.value = false
    }
  }

  const toggleEnabled = async (source: RssSource) => {
    savingId.value = source.id
    try {
      const enabled = !source.enabled
      await updateRssSource(source.id, { enabled })
      sources.value = sources.value.map((item) => (item.id === source.id ? { ...item, enabled } : item))
      refreshSourcesSilently()
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '状态更新失败')
      refreshSourcesSilently()
    } finally {
      savingId.value = null
    }
  }

  const removeSource = async (source: RssSource) => {
    try {
      await ElMessageBox.confirm(`确认删除 ${source.name}？`, '删除 RSS 源', {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger',
      })
      await deleteRssSource(source.id)
      sources.value = sources.value.filter((item) => item.id !== source.id)
      ElMessage.success('RSS 源已删除')
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(error instanceof Error ? error.message : '删除失败')
      }
    }
  }

  watch([keyword, activeCategory, activeStatus, pageSize], () => {
    currentPage.value = 1
  })

  watch(filteredSources, () => {
    const maxPage = Math.max(1, Math.ceil(filteredSources.value.length / pageSize.value))
    if (currentPage.value > maxPage) currentPage.value = maxPage
  })

  onMounted(() => {
    initializeTheme()
    loadSources()
  })
</script>

<style scoped src="./index.scss" lang="scss"></style>
