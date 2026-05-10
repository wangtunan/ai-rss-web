<template>
  <div class="share-action">
    <button
      type="button"
      class="share-action__btn"
      title="复制文本到剪贴板"
      :disabled="disabled || !hasItems"
      @click="handleCopyText"
    >
      <svg
        class="share-action__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </button>

    <button
      type="button"
      class="share-action__btn"
      title="截图并复制到剪贴板"
      :disabled="disabled || !hasItems"
      @click="handleCopyScreenshot"
    >
      <svg
        class="share-action__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toPng } from 'html-to-image'

import { useToast } from '@/hooks/useToast'
import type { NewsItem } from '@/types/news'

interface IProps {
  /** 是否禁用 */
  disabled?: boolean
  /** 分享内容 */
  items?: NewsItem[]
  /** 截图目标元素 */
  targetRef?: HTMLElement | null
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  items: () => [],
})

const { success, error } = useToast()

const hasItems = computed(() => props.items.length > 0)

// 复制文本
const handleCopyText = async () => {
  try {
    const text = props.items
      .map((item, index) => {
        const source = item.source || item.category || '未知来源'
        const reason = item.ai_summary || item.raw_content || ''
        return `${index + 1}. ${item.title}\n来源: ${source}\n推荐理由: ${reason}`
      })
      .join('\n\n')

    await navigator.clipboard.writeText(text)
    success(`已复制 ${props.items.length} 条内容到剪贴板`)
  } catch {
    error('复制失败，请重试')
  }
}

// 截图复制
const handleCopyScreenshot = async () => {
  if (!props.targetRef) {
    error('截图目标不存在')
    return
  }

  try {
    const el = props.targetRef
    const dataUrl = await toPng(el, {
      backgroundColor: getComputedStyle(el).getPropertyValue('--surface').trim() || '#0f0f0f',
    })
    const blob = await (await fetch(dataUrl)).blob()
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
    success('截图已复制到剪贴板')
  } catch {
    error('截图失败，请重试')
  }
}
</script>

<style scoped lang="scss" src="./index.scss"></style>
