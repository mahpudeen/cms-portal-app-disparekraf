<script setup>
import { ref, inject } from 'vue';
import axios from '@/plugins/axios';
import DetailRow from '@/components/DetailRow.vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const Swal = inject('$swal');

const modulHeaders = ref([
  {
    width: '2%',
    title: 'ID',
    class: 'grey--text text--darken-4',
    sortable: false
  },
  {
    width: '25%',
    title: 'Nama Menu',
    class: 'grey--text text--darken-4',
    sortable: false
  },
  {
    width: '25%',
    title: 'URL',
    class: 'grey--text text--darken-4',
    sortable: false
  },
  {
    width: '10%',
    title: 'Create',
    class: 'grey--text text--darken-4',
    sortable: false
  },
  {
    width: '10%',
    title: 'Read',
    class: 'grey--text text--darken-4',
    sortable: false
  },
  {
    width: '10%',
    title: 'Update',
    class: 'grey--text text--darken-4',
    sortable: false
  },
  {
    width: '10%',
    title: 'Delete',
    class: 'grey--text text--darken-4',
    sortable: false
  },
  {
    title: '',
    width: '8%',
    align: 'center',
    sortable: false
  }
]);

const serverItems = ref([]);
const index_items = ref([]);
const loading = ref(true);
const itemsPerPage = ref(10);
const totalItems = ref(0);

const loadItems = async () => {
  loading.value = true;
  try {
    const result = await axios.get(`/modules/menu/all`);
    serverItems.value = result.data;
    totalItems.value = result.data.length;
    loading.value = false;
    index_items.value = []; // Reset index_items before populating
    for (let index = 1; index <= result.data.length; index++) {
      index_items.value.push({
        value: index,
        text: index.toString()
      });
    }
    // Initialize checkboxStates for each item
    result.data.forEach((item) => {
      if (item.children) {
        // Assuming there's an `isSelected` property
        selectedMenuData.value.push(item.children);
      }
    });
  } catch (error) {
    console.error('Failed to load items:', error);
    loading.value = false;
  }
};

const data = ref([]);
const selectedMenuData = ref([]);

const addData = (item) => {
  // Filter modules that have any menu with permissions
  const modulesWithSelectedMenus = serverItems.value.filter((module) =>
    module.children.some((menu) => menu.create === true || menu.read === true || menu.update === true || menu.delete === true)
  );

  if (modulesWithSelectedMenus.length > 0) {
    // Initialize the data structure
    data.value = {
      role_id: route.params.id,
      module: []
    };

    // Iterate over each module to process its menus
    modulesWithSelectedMenus.forEach((module) => {
      // Filter menus within the module that have permissions
      const selectedMenus = module.children.filter((menu) => menu.create || menu.read || menu.update || menu.delete);

      // Construct the module and its access array
      const moduleAccess = {
        module_id: module.modul_id,
        access: selectedMenus.map((menu) => ({
          menu_id: menu.menu_id,
          create: menu.create ?? false,
          read: menu.read ?? false,
          update: menu.update ?? false,
          delete: menu.delete ?? false
        }))
      };

      // Add the module with its menus to the data structure
      data.value.module.push(moduleAccess);
    });
    console.log(data.value);
  } else {
    console.log('No modules or menus found with the specified permissions');
  }
};

const saveData = () => {
  axios
    .post(`/role-menu`, data.value)
    .then((result) => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data saved successfully'
      });
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save data'
      });
    });
};

function toggleChildren(item) {
  item.showChildren = !item.showChildren;
}
</script>
<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card variant="flat">
        <v-card-item>
          <div class="d-sm-flex align-center justify-space-between">
            <v-row>
              <v-col cols="12" sm="4"></v-col>
            </v-row>
            <slot name="action">
              <v-btn prepend-icon="mdi-content-save" color="primary" elevation="0" @click="saveData"> Save </v-btn>
            </slot>
          </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-item>
          <DetailRow :name="'Nama Role'" :value="roleName" />
          <v-data-table-server
            v-model:items-per-page="itemsPerPage"
            :headers="modulHeaders"
            :items="serverItems"
            :items-length="totalItems"
            :loading="loading"
            item-value="name"
            @update:options="loadItems"
          >
            <template v-slot:item="props">
              <tr style="height: 48px">
                <td>{{ props.item.modul_id }}</td>
                <td>{{ props.item.modul_title }}</td>
                <td>{{ props.item.modul_url }}</td>
                <td>
                  <v-checkbox v-if="props.item.create" v-model="props.item.create"></v-checkbox>
                </td>
                <td>
                  <v-checkbox v-if="props.item.read" v-model="props.item.read"></v-checkbox>
                </td>
                <td>
                  <v-checkbox v-if="props.item.update" v-model="props.item.update"></v-checkbox>
                </td>
                <td>
                  <v-checkbox v-if="props.item.delete" v-model="props.item.delete"></v-checkbox>
                </td>
                <td>
                  <v-icon v-if="props.item.children.length > 0" @click="toggleChildren(props.item)">
                    {{ props.item.showChildren ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </td>
              </tr>
              <tr v-if="props.item.showChildren" v-for="child in props.item.children" :key="child.menu_id">
                <td></td>
                <td>{{ child.menu_title }}</td>
                <td>{{ child.menu_path }}</td>
                <td>
                  <v-checkbox v-model="child.create"></v-checkbox>
                </td>
                <td>
                  <v-checkbox v-model="child.read"></v-checkbox>
                </td>
                <td>
                  <v-checkbox v-model="child.update"></v-checkbox>
                </td>
                <td>
                  <v-checkbox v-model="child.delete"></v-checkbox>
                </td>
                <td>
                  <v-icon v-if="child.children.length > 0" @click="toggleChildren(child)">
                    {{ child.showChildren ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </td>
              </tr>
            </template>
            <template #bottom></template>
          </v-data-table-server>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="addData">Add</v-btn>
          </v-card-actions>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <div v-for="(item, index) in data.module" :key="`role-${index}`">
        <v-card class="mt-3">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <div>Module ID: {{ item.module_id }}</div>
                <!-- Assuming item has an access object with properties -->
                <!-- <v-text-field v-model="item.module_id" label="Module ID" dense></v-text-field> -->
                <div v-for="subItem in item.access" :key="`access-${index}`">
                  <v-row>
                    <v-col cols="12" sm="2">
                      <div>Menu ID {{ subItem.menu_id }}</div>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-checkbox :label="`Create`" v-model="subItem.create"></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-checkbox :label="`Read`" v-model="subItem.read"></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-checkbox :label="`Update`" v-model="subItem.update"></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-checkbox :label="`Delete`" v-model="subItem.delete"></v-checkbox>
                    </v-col>
                  </v-row>
                </div>
                <!-- <v-btn color="error" @click="deleteSelectedData">Delete Selected</v-btn> -->
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>
