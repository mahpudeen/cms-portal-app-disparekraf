<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const search = ref('');
const roles = ref([
  {
    roleCode: 'ADMIN',
    roleName: 'Administrator',
    module: 'User Management',
    menu: 'User List',
    subMenu: 'Create User'
  },
  {
    roleCode: 'MOD',
    roleName: 'Moderator',
    module: 'Content Management',
    menu: 'Article List',
    subMenu: 'Edit Article'
  },
  {
    roleCode: 'USR',
    roleName: 'Standard User',
    module: 'Profile',
    menu: 'View Profile',
    subMenu: 'Update Profile'
  }
]);
const loading = ref(false);
const loadingText = ref('Loading...');
const noDataText = ref('No data available');
const noResultsText = ref('No matching records found');
const footerProps = ref({ 'items-per-page-options': [5, 10, 15] });

function navigateToCreate() {
  router.push({ name: 'Roles Create' });
}

const headers = ref([
  {
    title: 'Role Code',
    key: 'roleCode'
  },
  {
    title: 'Role Name',
    key: 'roleName'
  },
  {
    title: 'Module',
    key: 'module'
  },
  {
    title: 'Menu',
    key: 'menu'
  },
  {
    title: 'Sub Menu',
    key: 'subMenu'
  }
]);
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
              <v-btn prepend-icon="mdi-plus-box" color="primary" @click="navigateToCreate"> Add </v-btn>
            </slot>
          </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-item>
          <v-data-table
            :headers="headers"
            :items="roles"
            :search="search"
            :loading="loading"
            :loading-text="loadingText"
            :no-data-text="noDataText"
            :no-results-text="noResultsText"
            :footer-props="footerProps"
          >
          </v-data-table>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>
