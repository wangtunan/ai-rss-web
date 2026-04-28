<template>
  <span class="rating-stars" role="img" :aria-label="`评分 ${normalizedScore}/${max}`">
    <svg
      v-for="star in max"
      :key="star"
      class="rating-stars__icon"
      :class="{ 'rating-stars__icon--filled': star <= normalizedScore }"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        d="M10 1.8 12.45 6.75 17.9 7.55 13.95 11.4 14.88 16.82 10 14.25 5.12 16.82 6.05 11.4 2.1 7.55 7.55 6.75 10 1.8Z"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      score?: number
      max?: number
    }>(),
    {
      score: 0,
      max: 5,
    },
  )

  const normalizedScore = computed(() => {
    return Math.max(0, Math.min(props.max, Number(props.score) || 0))
  })
</script>

<style scoped src="./index.scss" lang="scss"></style>
