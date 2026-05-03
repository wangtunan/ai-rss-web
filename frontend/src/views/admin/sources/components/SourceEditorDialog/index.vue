<template>
  <el-dialog
    :model-value="visible"
    :title="editingId ? '编辑 RSS 源' : '新增 RSS 源'"
    width="34rem"
    class="source-editor-dialog"
    :style="dialogStyle"
    destroy-on-close
    @closed="emit('closed')"
    @update:model-value="emit('update:visible', $event)"
  >
    <el-form class="source-editor-dialog__form" label-position="top" @submit.prevent>
      <div class="source-editor-dialog__head">
        <p>{{ editingId ? '编辑源配置' : '创建源配置' }}</p>
        <h2>{{ form.name || '未命名 RSS 源' }}</h2>
      </div>

      <el-form-item label="名称" required>
        <el-input
          :model-value="form.name"
          placeholder="OpenAI"
          @update:model-value="patchForm({ name: String($event).trim() })"
        />
      </el-form-item>

      <el-form-item label="分类" required>
        <el-input
          :model-value="form.category"
          placeholder="openai"
          @update:model-value="patchForm({ category: String($event).trim() })"
        />
      </el-form-item>

      <el-form-item label="RSS URL" required>
        <el-input
          :model-value="form.url"
          placeholder="https://example.com/feed.xml"
          @update:model-value="patchForm({ url: String($event).trim() })"
        />
      </el-form-item>

      <div class="source-editor-dialog__grid">
        <el-form-item label="排序">
          <el-input-number
            :model-value="form.sort_order"
            :min="0"
            controls-position="right"
            @update:model-value="patchForm({ sort_order: Number($event ?? 0) })"
          />
        </el-form-item>

        <el-form-item label="单源上限">
          <el-input-number
            :model-value="form.max_entries"
            :min="1"
            controls-position="right"
            placeholder="默认"
            @update:model-value="patchForm({ max_entries: $event === undefined ? null : $event })"
          />
        </el-form-item>
      </div>

      <el-form-item>
        <el-checkbox
          :model-value="form.enabled"
          @update:model-value="patchForm({ enabled: Boolean($event) })"
        >
          启用这个 RSS 源
        </el-checkbox>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="source-editor-dialog__actions">
        <el-button :icon="Close" @click="emit('update:visible', false)">取消</el-button>
        <el-button type="primary" :icon="Check" :loading="saving" @click="emit('save')">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import { Check, Close } from '@element-plus/icons-vue'

  import type { RssSourceInput } from '@/types/rss_source'

  defineOptions({
    name: 'SourceEditorDialog',
  })

  const props = defineProps<{
    visible: boolean
    saving: boolean
    editingId: string
    form: RssSourceInput
  }>()

  const emit = defineEmits<{
    save: []
    closed: []
    'update:visible': [value: boolean]
    'update:form': [value: RssSourceInput]
  }>()

  const dialogStyle: CSSProperties = {
    '--el-dialog-bg-color': 'color-mix(in srgb, var(--surface-2) 74%, white 26%)',
    background: 'var(--el-dialog-bg-color)',
  }

  const patchForm = (patch: Partial<RssSourceInput>) => {
    emit('update:form', { ...props.form, ...patch })
  }
</script>

<style scoped src="./index.scss" lang="scss"></style>
