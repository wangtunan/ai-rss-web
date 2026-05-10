<template>
  <div class="curated-card-skeleton">
    <article
      v-for="index in props.count"
      :key="index"
      class="curated-card-skeleton__item"
    >
      <div class="curated-card-skeleton__accent"></div>
      <div class="curated-card-skeleton__line curated-card-skeleton__line--title"></div>
      <div class="curated-card-skeleton__line curated-card-skeleton__line--title-short"></div>
      <div class="curated-card-skeleton__reason">
        <div class="curated-card-skeleton__line curated-card-skeleton__line--reason"></div>
        <div class="curated-card-skeleton__line curated-card-skeleton__line--reason"></div>
        <div class="curated-card-skeleton__line curated-card-skeleton__line--reason-short"></div>
      </div>
      <div class="curated-card-skeleton__tags">
        <div class="curated-card-skeleton__pill curated-card-skeleton__pill--teal"></div>
        <div class="curated-card-skeleton__pill curated-card-skeleton__pill--blue"></div>
        <div class="curated-card-skeleton__pill curated-card-skeleton__pill--amber"></div>
      </div>
      <div class="curated-card-skeleton__footer">
        <div class="curated-card-skeleton__source">
          <div class="curated-card-skeleton__icon"></div>
          <div class="curated-card-skeleton__line curated-card-skeleton__line--meta"></div>
        </div>
        <div class="curated-card-skeleton__stars">
          <span v-for="star in 5" :key="star" class="curated-card-skeleton__star"></span>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
  interface IProps {
    count: number
  }
  const props = defineProps<IProps>()
</script>

<style scoped src="./index.scss" lang="scss"></style>