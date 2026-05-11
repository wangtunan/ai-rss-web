<template>
  <div class="category-error__panel">
    <p class="category-error__title">加载失败</p>
    <p class="category-error__message">{{ props.error }}</p>
    <button class="category-error__retry-button" @click="emits('retry')">重试</button>
  </div>
</template>

<script setup lang="ts">
  interface IProps {
    /** 加载失败的消息 */
    error: string
  }
  interface IEmits {
    (e: 'retry'): void
  }


  const props = defineProps<IProps>()
  const emits = defineEmits<IEmits>()
</script>

<style scoped src="./index.scss" lang="scss"></style>