<template>
  <aside class="subscription-nav">
    <header class="subscription-nav__header">
      <p class="subscription-nav__eyebrow">Subscription</p>
      <h2 class="subscription-nav__title">我的订阅</h2>
    </header>

    <nav v-if="props.categories.length" class="subscription-nav__items">
      <button
        type="button"
        class="subscription-nav__item"
        :class="{ 'subscription-nav__item--active': props.activeMode === 'mixed' }"
        @click="emits('select-mixed')"
      >
        <span class="subscription-nav__item-main">
          <span class="subscription-nav__item-title">全部订阅</span>
          <span class="subscription-nav__item-subtitle">聚合所有已订阅分类</span>
        </span>
        <span class="subscription-nav__item-count">{{ props.categories.length }}</span>
      </button>

      <button
        v-for="category in props.categories"
        :key="category.key"
        type="button"
        class="subscription-nav__item"
        :class="{
          'subscription-nav__item--active': props.activeMode === 'single' && props.activeCategoryId === category.key,
        }"
        @click="emits('select-category', category.key)"
      >
        <img
          class="subscription-nav__item-icon"
          :src="category.icon"
          :alt="category.label"
        />
        <span class="subscription-nav__item-title">{{ category.label }}</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import type { SubscriptionCategory, SubscriptionFeedMode } from '@/types/subscription'

  interface IProps {
    /** 已订阅分类列表 */
    categories: SubscriptionCategory[]
    /** 当前订阅流模式 */
    activeMode: SubscriptionFeedMode
    /** 当前激活分类 ID */
    activeCategoryId: string | null
  }

  interface IEmits {
    (e: 'select-mixed'): void
    (e: 'select-category', category: string): void
  }

  defineOptions({
    name: 'SubscriptionNav',
  })

  const props = defineProps<IProps>()
  const emits = defineEmits<IEmits>()
</script>

<style scoped src="./index.scss" lang="scss"></style>
