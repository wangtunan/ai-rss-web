<template>
  <section class="category-card-skeleton" aria-hidden="true">
    <header class="category-card-skeleton__header">
      <div class="category-card-skeleton__header-main">
        <div class="category-card-skeleton__line category-card-skeleton__line--title"></div>
        <div class="category-card-skeleton__line category-card-skeleton__line--subtitle"></div>
      </div>
      <div class="category-card-skeleton__pill"></div>
    </header>

    <ol class="category-card-skeleton__list">
      <li v-for="index in rowCount" :key="index" class="category-card-skeleton__row">
        <div class="category-card-skeleton__line category-card-skeleton__line--rank"></div>
        <div class="category-card-skeleton__content">
          <div class="category-card-skeleton__line category-card-skeleton__line--item-title"></div>
          <div class="category-card-skeleton__line category-card-skeleton__line--summary"></div>
          <div class="category-card-skeleton__line category-card-skeleton__line--summary-short"></div>
          <div class="category-card-skeleton__footer">
            <div class="category-card-skeleton__line category-card-skeleton__line--time"></div>
            <div class="category-card-skeleton__line category-card-skeleton__line--tag"></div>
          </div>
        </div>
        <div class="category-card-skeleton__line category-card-skeleton__line--importance"></div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      rowCount?: number
    }>(),
    {
      rowCount: 4,
    },
  )
</script>

<style scoped src="./index.scss" lang="scss"></style>
