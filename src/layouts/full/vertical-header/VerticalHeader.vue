<script setup>
import { useCustomizerStore } from '../../../stores/customizer';
import { usePermissionStore } from '@/stores/permission';
import { useAuthStore } from '@/stores/auth';

import { SettingsIcon, Menu2Icon } from 'vue-tabler-icons';
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify'

const permission = usePermissionStore()
const { menu } = useAuthStore();

const { mobile } = useDisplay()
const route = useRoute();
const title = ref(route.meta.title);
const breadcrumbs = ref(route.meta.breadcrumbs);

const setPermissions = () => {
  let defPermission = {
    read: false,
    create: false,
    delete: false,
    update: false,
  }
  if (menu && menu.length > 0) {
    menu.forEach((item) => {
      item.menus.forEach((sub_item) => {
        if (sub_item.path == route.path) {
          defPermission = {
              read: sub_item.read,
              create: sub_item.create,
              delete: sub_item.delete,
              update: sub_item.update
          }
        }
        if (sub_item.children_recursive.length > 0) {
          sub_item.children_recursive.forEach((element) => {
            if (element.path == route.path) {
              defPermission = {
                  read: element.read,
                  create: element.create,
                  delete: element.delete,
                  update: element.update
              }
            }
          });
        }
      });
    });
  }
  permission.setPermission(defPermission)
}
watchEffect(() => {
  title.value = route.meta.title;
  breadcrumbs.value = route.meta.breadcrumbs;
  setPermissions();
});

// dropdown imports
import ProfileDD from './ProfileDD.vue';

const customizer = useCustomizerStore();
</script>

<template>
  <v-app-bar elevation="0" height="80">
    <v-btn
      class="hidden-md-and-down text-secondary"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
      size="small"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>
    <v-btn
      class="hidden-lg-and-up text-secondary ms-3"
      color="lightsecondary"
      icon
      rounded="sm"
      variant="flat"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
      size="small"
    >
      <Menu2Icon size="20" stroke-width="1.5" />
    </v-btn>

    <v-col v-if="!mobile">
      <v-card variant="flat" class="px-4 py-3">
        <v-row no-gutters class="align-center">
          <v-col>
            <h3 class="text-h3">{{ title }}</h3>
            <v-breadcrumbs :items="breadcrumbs" class="text-h5 pa-1">
              <template v-slot:divider>
                <div class="d-flex align-center">
                  <ChevronRightIcon size="17" />
                </div>
              </template>
              <template v-slot:prepend>
                <v-icon size="small" icon="mdi-home" class="text-secondary mr-2"></v-icon>
                <div class="d-flex align-center">
                  <ChevronRightIcon size="17" />
                </div>
              </template>
            </v-breadcrumbs>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-spacer />

    <!-- ---------------------------------------------- -->
    <!-- User Profile -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn class="profileBtn text-primary" color="lightprimary" variant="flat" rounded="pill" v-bind="props">
          <!-- <v-avatar size="30" class="mr-2 py-2">
            <img src="@/assets/images/profile/user-round.svg" alt="Julia" />
          </v-avatar> -->
          <SettingsIcon stroke-width="1.5" />
        </v-btn>
      </template>
      <v-sheet rounded="md" width="330" elevation="12">
        <ProfileDD />
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>
