<script setup lang="ts">
import { ref } from 'vue';
import { toast }  from 'vue3-toastify';
const search = ref('');
function showToast() {
  toast.success("berhasil")
}

</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card variant="flat">
        <v-card-item>
          <div class="d-sm-flex align-center justify-space-between">
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="search"
                    label="Search"
                    density="compact"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    hide-details
                    single-line
                  ></v-text-field>
                </v-col>
              </v-row>
              <slot name="action">
              <v-btn
                prepend-icon="mdi-plus-box"
                color="primary"
                elevation="0"
                @click="showToast"
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
