<template>
  <RouterView />
  <Analytics />
</template>

<script setup lang="ts">
  // ======= 第三方库 =======
  import { RouterView } from 'vue-router'
  import { Analytics } from '@vercel/analytics/vue'
</script>
