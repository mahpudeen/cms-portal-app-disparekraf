<script setup lang="ts">
import { ref, computed } from 'vue';

interface Form {
  roleCode: string;
  roleName: string;
  module: string[];
  menu: MenuItem[];
}

interface MenuItem {
  menuCode: string;
  menuName: string;
  menuURL: string;
  showSubmenu: boolean;
  subMenu: {
    menuCode: string;
    menuName: string;
    menuURL: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }[];
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

const moduleChoices = ref(['Module 1', 'Module 2', 'Module 3']);
const menuMapping = ref<{
  [key: string]: MenuItem[];
}>({
  'Module 1': [
    {
      menuCode: 'Menu 1-1',
      menuName: 'Menu 1-1',
      menuURL: '/menu-1-1',
      subMenu: [
        {
          menuCode: 'SubMenu 1-1-1',
          menuName: 'SubMenu 1-1-1',
          menuURL: '/SubMenu 1-1-1',
          create: false,
          read: false,
          update: false,
          delete: false
        },
        {
          menuCode: 'SubMenu 1-1-1',
          menuName: 'SubMenu 1-1-1',
          menuURL: '/SubMenu 1-1-1',
          create: false,
          read: false,
          update: false,
          delete: false
        }
      ],
      showSubmenu: false,
      create: false,
      read: false,
      update: false,
      delete: false
    },
    {
      menuCode: 'Menu 1-2',
      menuName: 'Menu 1-2',
      menuURL: '/menu-1-2',
      subMenu: [
        {
          menuCode: 'SubMenu 1-1-1',
          menuName: 'SubMenu 1-1-1',
          menuURL: '/SubMenu 1-1-1',
          create: false,
          read: false,
          update: false,
          delete: false
        },
        {
          menuCode: 'SubMenu 1-1-1',
          menuName: 'SubMenu 1-1-1',
          menuURL: '/SubMenu 1-1-1',
          create: false,
          read: false,
          update: false,
          delete: false
        }
      ],
      showSubmenu: false,
      create: false,
      read: false,
      update: false,
      delete: false
    }
  ]
});

const form = ref<Form>({
  roleCode: '',
  roleName: '',
  module: [],
  menu: []
});

const menuChoices = computed(() => {
  return form.value.module.flatMap((module) => menuMapping.value[module] || []);
});

const tableHeaders = ref([
  { title: 'Kode Menu', key: 'name' },
  { title: 'Nama Menu', key: 'name' },
  { title: 'URL Menu', key: 'name' },
  { title: 'Create', key: 'create', sortable: false },
  { title: 'Read', key: 'read', sortable: false },
  { title: 'Update', key: 'update', sortable: false },
  { title: 'Delete', key: 'delete', sortable: false }
]);

const formErrors = ref({
  roleCode: '',
  roleName: ''
});

function toggleSubmenu(item: MenuItem) {
  item.showSubmenu = !item.showSubmenu;
  console.log(item);
}

function validateForm() {
  formErrors.value.roleCode = form.value.roleCode ? '' : 'Role Code is required.';
  formErrors.value.roleName = form.value.roleName ? '' : 'Role Name is required.';

  return !Object.values(formErrors.value).some((error) => error !== '');
}

function handleSubmit() {
  if (validateForm()) {
    console.log(form.value);
  }
}
</script>

<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-item>
          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              label="Role Code"
              density="compact"
              variant="outlined"
              hide-details
              single-linev-model="form.roleCode"
              class="mb-3"
              :error-messages="formErrors.roleCode"
              required
            ></v-text-field>
            <v-text-field
              label="Role Name"
              density="compact"
              variant="outlined"
              hide-details
              single-linev-model="form.roleName"
              class="mb-3"
              :error-messages="formErrors.roleName"
              required
            ></v-text-field>
            <v-select
              label="Module"
              :items="moduleChoices"
              v-model="form.module"
              multiple
              density="compact"
              variant="outlined"
              hide-details
              class="mb-3"
              required
            ></v-select>
            <!-- Tabel Menu -->
            <v-data-table v-if="menuChoices.length > 0" :headers="tableHeaders" :items="menuChoices" item-key="name" class="elevation-1">
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.menuCode }}</td>
                  <td>{{ item.menuName }}</td>
                  <td>{{ item.menuURL }}</td>
                  <td>
                    <v-checkbox v-model="item.create" :value="true" :false-value="false"></v-checkbox>
                  </td>
                  <td>
                    <v-checkbox v-model="item.read" :value="true" :false-value="false"></v-checkbox>
                  </td>
                  <td>
                    <v-checkbox v-model="item.update" :value="true" :false-value="false"></v-checkbox>
                  </td>
                  <td>
                    <v-checkbox v-model="item.delete" :value="true" :false-value="false"></v-checkbox>
                  </td>
                  <td>
                    <v-icon @click.stop="toggleSubmenu(item)">{{ item.showSubmenu ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </td>
                </tr>
                <!-- Tabel SubMenu -->
                <template v-if="item.showSubmenu">
                  <tr v-for="subItem in item.subMenu" :key="subItem.name" style="background-color: #f5f5f5">
                    <td>{{ subItem.menuCode }}</td>
                    <td>{{ subItem.menuName }}</td>
                    <td>{{ subItem.menuURL }}</td>
                    <td>
                      <v-checkbox v-model="subItem.create" :value="true" :false-value="false"></v-checkbox>
                    </td>
                    <td>
                      <v-checkbox v-model="subItem.read" :value="true" :false-value="false"></v-checkbox>
                    </td>
                    <td>
                      <v-checkbox v-model="subItem.update" :value="true" :false-value="false"></v-checkbox>
                    </td>
                    <td>
                      <v-checkbox v-model="subItem.delete" :value="true" :false-value="false"></v-checkbox>
                    </td>
                  </tr>
                </template>
              </template>
            </v-data-table>
            <v-btn color="primary" elevation="0" type="button" @click="handleSubmit">Submit</v-btn>
          </v-form>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>
