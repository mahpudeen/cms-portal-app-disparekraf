<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCustomizerStore } from '../../../stores/customizer';

import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import Logo from '../logo/LogoMain.vue';

const customizer = useCustomizerStore();
const { menu } = useAuthStore();
// const sidebarMenu = shallowRef(sidebarItems);
const sidebarMenu:any = ref([
  { header: 'Dashboard' },
  {
    title: 'Welcome',
    icon: 'mdi-monitor-dashboard',
    to: '/'
  },
]);
if (menu && menu.length > 0) {
  // Iterate over menu items and push them to sidebarMenu
  menu.forEach((item:any) => {
    sidebarMenu.value.push({ divider: true });
    sidebarMenu.value.push({ header: item.title });
    item.menu.forEach((sub_item:any) => {
      sidebarMenu.value.push(sub_item);
    });
  });
}

</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="75"
    mobile-breakpoint="lg"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <!---Logo part -->

    <div class="pa-5">
      <Logo />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4">
        <!---Menu Loop -->
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <!---Item Sub Header -->
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <!---Item Divider -->
          <v-divider class="my-3" v-else-if="item.divider" />
          <!---If Has Child -->
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
          <!---Single Item-->
          <NavItem :item="item" v-else class="leftPadding" />
          <!---End Single Item-->
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
