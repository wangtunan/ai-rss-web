<template>
  <section class="subscription-empty">
    <p class="subscription-empty__title">还没有订阅任何分类</p>
    <p class="subscription-empty__description">选择你感兴趣的分类后，这里会展示聚合资讯流。</p>
    <button class="subscription-empty__button" type="button" @click="emits('open-modal')">
      去订阅
    </button>
  </section>
</template>

<script setup lang="ts">
  interface IEmits {
    (e: 'open-modal'): void
  }

  defineOptions({
    name: 'SubscriptionEmpty',
  })

  const emits = defineEmits<IEmits>()
</script>

<style scoped src="./index.scss" lang="scss"></style>
