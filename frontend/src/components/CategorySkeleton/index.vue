<template>
  <section class="category-skeleton" aria-hidden="true">
    <header class="category-skeleton__header">
      <div class="category-skeleton__header-main">
        <div class="category-skeleton__line category-skeleton__line--title"></div>
        <div class="category-skeleton__line category-skeleton__line--subtitle"></div>
      </div>
      <div class="category-skeleton__pill"></div>
    </header>

    <ol class="category-skeleton__list">
      <li v-for="index in props.rowCount" :key="index" class="category-skeleton__row">
        <div class="category-skeleton__line category-skeleton__line--rank"></div>
        <div class="category-skeleton__content">
          <div class="category-skeleton__line category-skeleton__line--item-title"></div>
          <div class="category-skeleton__line category-skeleton__line--summary"></div>
          <div class="category-skeleton__line category-skeleton__line--summary-short"></div>
          <div class="category-skeleton__footer">
            <div class="category-skeleton__line category-skeleton__line--time"></div>
            <div class="category-skeleton__line category-skeleton__line--tag"></div>
          </div>
        </div>
        <div class="category-skeleton__line category-skeleton__line--importance"></div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
  interface IProps {
    /** 行数 */
    rowCount?: number
  }
  const props = withDefaults(defineProps<IProps>(), {
    rowCount: 10,
  })
</script>

<style scoped src="./index.scss" lang="scss"></style>
