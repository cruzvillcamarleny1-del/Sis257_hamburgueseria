<script setup lang="ts">
import { RouterView } from 'vue-router'

import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'
import '@/assets/js/jquery-3.4.1.min.js'
import '@/assets/js/bootstrap.js'
import '@/assets/js/custom.js'
</script>

<template>
  <main>
    <RouterView />
    <MainHeader />
    <RouterView />
  </main>
  <MainFooter />
</template>

<style scoped>
@import '@/assets/css/bootstrap.css';
@import '@/assets/css/font-awesome.min.css';
@import '@/assets/css/style.css';
@import '@/assets/css/responsive.css';
</style>
