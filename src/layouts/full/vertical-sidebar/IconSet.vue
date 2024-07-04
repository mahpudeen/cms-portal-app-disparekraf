<script setup>
const props = defineProps({ item: String, level: Number });
</script>

<template>
  <template v-if="props.level > 0">
    <v-icon icon="mdi-circle" size="5" class="mr32-icon"/>
  </template>
  <template v-else>
    <v-icon :icon="props.item" size="20" class="mr32-icon"/>
  </template>
</template>
<style lang="scss">
.mr32-icon {
  margin-right: -32px
}
</style>