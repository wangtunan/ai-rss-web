<template>
  <section class="source-table">
    <el-table
      v-loading="loading"
      :data="sources"
      row-key="id"
      empty-text="没有匹配的 RSS 源"
      class="source-table__table"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="状态" width="118">
        <template #default="{ row }">
          <div class="source-table__state">
            <el-switch
              :model-value="row.enabled"
              :loading="savingId === row.id"
              inline-prompt
              active-text="启用"
              inactive-text="停用"
              @change="emit('toggle-enabled', row)"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="名称" min-width="210">
        <template #default="{ row }">
          <div class="source-table__source-name">
            <strong>{{ row.name }}</strong>
            <span>{{ hostFromUrl(row.url) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="分类" width="180">
        <template #default="{ row }">
          <el-tag effect="plain" round>{{ row.category }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="URL" min-width="320">
        <template #default="{ row }">
          <el-link :href="row.url" target="_blank" :underline="false" type="primary">
            {{ row.url }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column prop="sort_order" label="排序" width="92" align="right" />
      <el-table-column label="上限" width="92" align="right">
        <template #default="{ row }">{{ row.max_entries ?? '-' }}</template>
      </el-table-column>

      <el-table-column label="操作" width="178" fixed="right" align="right">
        <template #default="{ row }">
          <div class="source-table__row-actions">
            <el-button size="small" :icon="EditPen" @click="emit('edit', row)">编辑</el-button>
            <el-button size="small" type="danger" :icon="Delete" @click="emit('remove', row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <footer class="source-table__pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @update:current-page="emit('update:currentPage', $event)"
        @update:page-size="emit('update:pageSize', $event)"
      />
    </footer>
  </section>
</template>

<script setup lang="ts">
  import { Delete, EditPen } from '@element-plus/icons-vue'

  import type { RssSource } from '@/types/rss_source'

  defineOptions({
    name: 'SourceTable',
  })

  defineProps<{
    sources: RssSource[]
    loading: boolean
    savingId: string | null
    currentPage: number
    pageSize: number
    pageSizes: number[]
    total: number
  }>()

  const emit = defineEmits<{
    edit: [source: RssSource]
    remove: [source: RssSource]
    'toggle-enabled': [source: RssSource]
    'update:currentPage': [value: number]
    'update:pageSize': [value: number]
  }>()

  const hostFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  const tableRowClassName = ({ row }: { row: RssSource }) => {
    return row.enabled ? '' : 'is-disabled'
  }
</script>

<style scoped src="./index.scss" lang="scss"></style>
