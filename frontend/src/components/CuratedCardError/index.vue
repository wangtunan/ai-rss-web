<template>
  <div class="curated-card-error">
    <p class="curated-card-error__title">加载失败</p>
    <p class="curated-card-error__message">{{ props.message }}</p>
    <button
      class="curated-card-error__retry"
      type="button"
      @click="emits('retry')"
    >
      重试
    </button>
  </div>
</template>

<script setup lang="ts">
  interface IProps {
    message: string
  }
  interface IEmits {
    (e: 'retry'): void
  }
  const props = defineProps<IProps>()
  const emits = defineEmits<IEmits>()
</script>

<style scoped src="./index.scss" lang="scss"></style>