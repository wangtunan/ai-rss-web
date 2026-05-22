<template>
  <header class="subscription-header">
    <div class="subscription-header__left">
      <p class="subscription-header__eyebrow">{{ props.eyebrow }}</p>
      <h2 class="subscription-header__title">{{ props.title }}</h2>
    </div>
    <div class="subscription-header__actions">
      <span v-if="props.hasSubscriptions" class="subscription-header__count">
        {{ props.loading ? props.feedLimit : props.itemCount }} 条
      </span>
      <ShareAction
        :disabled="props.loading"
        :items="props.items"
        :target-ref="props.targetRef"
      />
      <button
        class="subscription-header__button"
        type="button"
        title="管理订阅"
        aria-label="管理订阅"
        @click="emits('open-modal')"
      >
        <svg
          class="subscription-header__button-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
  import ShareAction from '@/components/ShareAction/index.vue'
  import type { NewsItem } from '@/types/news'

  interface IProps {
    /** 顶部辅助标题 */
    eyebrow: string
    /** 顶部主标题 */
    title: string
    /** 是否已有订阅分类 */
    hasSubscriptions: boolean
    /** 是否正在加载 */
    loading: boolean
    /** 加载中显示的条数 */
    feedLimit: number
    /** 当前资讯条数 */
    itemCount: number
    /** 分享资讯列表 */
    items: NewsItem[]
    /** 截图分享目标元素 */
    targetRef: HTMLElement | null
  }

  interface IEmits {
    (e: 'open-modal'): void
  }

  defineOptions({
    name: 'SubscriptionHeader',
  })

  const props = defineProps<IProps>()
  const emits = defineEmits<IEmits>()
</script>

<style scoped src="./index.scss" lang="scss"></style>
