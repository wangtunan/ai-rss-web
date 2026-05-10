<template>
  <RouterView />
  <Toast />
</template>

<script setup lang="ts">
  // ======= 第三方库 =======
  import { RouterView } from 'vue-router'

  // ======= 组件 =======
  import Toast from '@/components/Toast/index.vue'
</script>
