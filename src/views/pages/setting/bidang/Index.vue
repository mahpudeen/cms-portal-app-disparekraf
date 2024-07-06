<script setup lang="ts">
import { ref } from 'vue';
const search = ref('');

</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card variant="flat">
        <v-card-item>
          <div class="d-sm-flex align-center justify-space-between">
            <div class="search-width">
              <v-text-field
                v-model="search"
                label="Search"
                density="compact"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field>
            </div>
            <slot name="action">
              <v-btn
                prepend-icon="mdi-plus-box"
                color="primary"
                elevation="0"
              >
                Add
              </v-btn>
            </slot>
          </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-item>
          123
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>
