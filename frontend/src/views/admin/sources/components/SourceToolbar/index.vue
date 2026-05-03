<template>
  <section class="source-toolbar" aria-label="RSS 源筛选">
    <el-input
      :model-value="keyword"
      clearable
      :prefix-icon="Search"
      placeholder="搜索名称、分类或 URL"
      @update:model-value="emit('update:keyword', String($event).trim())"
    />

    <el-select
      :model-value="activeCategory"
      clearable
      placeholder="全部分类"
      @update:model-value="emit('update:activeCategory', String($event ?? ''))"
    >
      <el-option v-for="category in categoryOptions" :key="category" :label="category" :value="category" />
    </el-select>

    <el-radio-group
      :model-value="activeStatus"
      @update:model-value="emit('update:activeStatus', $event as RssSourceStatusFilter)"
    >
      <el-radio-button v-for="status in statusOptions" :key="status.value" :label="status.value">
        {{ status.label }}
      </el-radio-button>
    </el-radio-group>
  </section>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'

  import type { RssSourceStatusFilter, RssSourceStatusOption } from '@/types/rss_source'

  defineOptions({
    name: 'SourceToolbar',
  })

  defineProps<{
    keyword: string
    activeCategory: string
    activeStatus: RssSourceStatusFilter
    categoryOptions: string[]
    statusOptions: RssSourceStatusOption[]
  }>()

  const emit = defineEmits<{
    'update:keyword': [value: string]
    'update:activeCategory': [value: string]
    'update:activeStatus': [value: RssSourceStatusFilter]
  }>()
</script>

<style scoped src="./index.scss" lang="scss"></style>
