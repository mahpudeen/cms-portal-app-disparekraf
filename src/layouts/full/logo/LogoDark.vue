<template>
  <div class="logo">
    <RouterLink to="/">
      <img height="35" src="/img/jaya-raya-logo.png" alt="">
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
const primary = ref('rgb(var(--v-theme-primary))');
const secondary = ref('rgb(var(--v-theme-secondary))');
</script>
