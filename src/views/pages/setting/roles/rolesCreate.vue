<script>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

// interface
interface MenuItem {
  title: string;
  moduleId: string;
  children: SubMenuItem[];
  showChildren: boolean;
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
}

interface SubMenuItem {
  submenu: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface Module {
  modul: string;
  menu: MenuItem[];
}

type ModuleOption = string[];

interface Form {
  roleCode: string;
  roleName: string;
  module: string[];
  menuName: string;
  menuChoices: string;
  formErrors: {
    roleCode: string;
    roleName: string;
  };
}

interface FormError {
  roleCode: string;
  roleName: string;
  module: string;
  Permissions: string | boolean;
}

interface Card {
  roleName: string;
  roleCode: string;
  selectedData: SelectedDataItem[];
}

interface SelectedDataItem {
  moduleName: string;
  menuName: string;
  hasChildren: boolean;
  permissions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  submenuName?: string;
}

// Module Table
const tableHeaders = ref([
  { title: 'Nama Module', key: 'moduleName' },
  { title: 'Nama Menu', key: 'moduleName' },
  { title: 'SubMenu', key: 'submenu' },
  { title: 'Create', key: 'create', sortable: false },
  { title: 'Read', key: 'read', sortable: false },
  { title: 'Update', key: 'update', sortable: false },
  { title: 'Delete', key: 'delete', sortable: false },
  { title: ' ', key: 'action', sortable: false }
]);

const menuChoices = ref<MenuItem[]>([]);
const moduleOptions = ref<ModuleOption[]>([]);
const filteredMenuChoices = ref<MenuItem[]>([]);
const selectedData = ref<SelectedDataItem[]>([]);
const cards = ref<Card[]>([]);
const form = ref<Form>({
  roleCode: '',
  roleName: '',
  module: [],
  menuName: '',
  menuChoices: '',
  formErrors: {
    roleCode: '',
    roleName: ''
  }
});
const formErrors = ref<FormError>({
  roleCode: '',
  roleName: '',
  module: '',
  Permissions: false
});
const dialog = ref(false);
const validationMessage = ref('');

async function fetchModul() {
  try {
    const response = await axios.get('http://sso.sanctum.my.id/api/menu', {
      headers: {
        'X-Channel': 'disparekraf_api'
      }
    });
    const data = response.data.data;
    menuChoices.value = data.flatMap((item: Module) =>
      item.menu.map((menuItem: MenuItem) => ({
        title: menuItem.title,
        moduleId: item.modul,
        children: menuItem.children,
        showChildren: false
      }))
    );
    moduleOptions.value = data.map((item: Module) => item.modul);
  } catch (error) {
    console.error('Error fetching modul:', error);
  }
}
onMounted(fetchModul);

watch(
  () => form.value.module,
  (newModule) => {
    filteredMenuChoices.value = menuChoices.value.filter((menu) => newModule.includes(menu.moduleId));
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getModuleNameById = (item: any) => {
  const module = moduleOptions.value.find((m) => m === item.moduleId);
  return module ? module : 'Modul tidak ditemukan';
};

function toggleChildren(item: MenuItem) {
  item.showChildren = !item.showChildren;
}

function tempSubmit() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collectedData: any = [];
  filteredMenuChoices.value.forEach((menu) => {
    const moduleName = getModuleNameById(menu);
    if (menu.create || menu.read || menu.update || menu.delete) {
      collectedData.push({
        moduleName,
        menuName: menu.title,
        hasChildren: false,
        permissions: {
          create: menu.create,
          read: menu.read,
          update: menu.update,
          delete: menu.delete
        }
      });
    }
    if (menu.showChildren) {
      menu.children.forEach((child) => {
        if (child.create || child.read || child.update || child.delete) {
          collectedData.push({
            moduleName,
            menuName: menu.title,
            submenuName: child.submenu,
            hasChildren: true,
            permissions: {
              create: child.create,
              read: child.read,
              update: child.update,
              delete: child.delete
            }
          });
        }
      });
    }
  });
  selectedData.value = collectedData;
}

function submitForm() {
  if (validateForm()) {
    tempSubmit();
    cards.value.push({
      roleName: form.value.roleName,
      roleCode: form.value.roleCode,
      selectedData: selectedData.value
    });
    form.value.roleName = '';
    form.value.roleCode = '';
    form.value.module = [];
    selectedData.value = [];
    formErrors.value = {
      roleCode: '',
      roleName: '',
      module: '',
      Permissions: ''
    };
  } else {
    console.log('Form is invalid');
  }
}

function validateForm() {
  const errors = {
    roleCode: '',
    roleName: '',
    module: '',
    Permissions: ''
  };
  let isValid = true;

  if (!form.value.roleCode.trim()) {
    formErrors.value.roleCode = 'Role Code is required';
    isValid = false;
  }
  if (!form.value.roleName.trim()) {
    formErrors.value.roleName = 'Role Name is required';
    isValid = false;
  }

  if (!form.value.module) {
    formErrors.value.module = 'At least one Module is required';
    isValid = false;
  }
  if (selectedData.value.some((item) => !Object.values(item.permissions).some((permission) => permission))) {
    formErrors.value.Permissions = 'At least one Permission must be selected';
    isValid = false;
  }
  if (!isValid) {
    console.error('Form validation failed:', errors);
    return false;
  }
  validationMessage.value = 'Form berhasil disubmit';
  dialog.value = true;
  return true;
}
</script>

<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-item class="mb-3">
          <div class="d-sm-flex align-center justify-space-between">
            <div class="search-width">Form Penambahan Role</div>
            <slot name="action">
              <v-btn prepend-icon="mdi-content-save" class="btn-detail"> Save </v-btn>
            </slot>
          </div>
        </v-card-item>
        <v-card-item>
          <v-form @submit.prevent="submitForm">
            <!-- Form Fields -->
            <v-text-field
              label="Role Code"
              density="compact"
              variant="outlined"
              v-model="form.roleCode"
              :error-messages="formErrors.roleCode"
              class="mt-3"
              required
            ></v-text-field>
            <v-text-field
              label="Role Name"
              density="compact"
              variant="outlined"
              v-model="form.roleName"
              :error-messages="formErrors.roleName"
              required
            ></v-text-field>
            <v-select
              label="Module"
              :items="moduleOptions"
              density="compact"
              variant="outlined"
              v-model="form.module"
              :error-messages="formErrors.module"
              :multiple="true"
              :required="true"
            ></v-select>
            <!-- Data Table -->
            <v-data-table v-if="filteredMenuChoices.length > 0" :headers="tableHeaders" :items="filteredMenuChoices" item-key="menuCode">
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ getModuleNameById(item) }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <v-icon @click="toggleChildren(item)">
                      {{ item.showChildren ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                  </td>
                </tr>
                <template v-if="item.showChildren">
                  <tr v-for="subItem in item.children" :key="subItem.menuCode" style="background-color: #f5f5f5">
                    <td>{{ getModuleNameById(item) }}</td>
                    <td>{{ item.title }}</td>
                    <td>{{ subItem.submenu }}</td>
                    <td>
                      <v-checkbox v-model="subItem.create"></v-checkbox>
                    </td>
                    <td>
                      <v-checkbox v-model="subItem.read"></v-checkbox>
                    </td>
                    <td>
                      <v-checkbox v-model="subItem.update"></v-checkbox>
                    </td>
                    <td>
                      <v-checkbox v-model="subItem.delete"></v-checkbox>
                    </td>
                    <td></td>
                  </tr>
                </template>
              </template>
              <template #bottom></template>
            </v-data-table>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary" class="mt-3">Submit</v-btn>
          </v-form>
          <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
              <v-card-title>Validasi Form</v-card-title>
              <v-card-text>{{ validationMessage }}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" @click="dialog = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-item>
      </v-card>
      <v-card v-for="(card, index) in cards" :key="index" class="mb-3 mt-3" flat>
        <v-card-item>
          <v-card-title>Nama Role: {{ card.roleName }}</v-card-title>
          <v-card-subtitle>Role Code: {{ card.roleCode }}</v-card-subtitle>
          <v-card-text>
            <v-data-table :headers="tableHeaders" :items="card.selectedData" class="full-width-table" hide-default-footer>
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.moduleName }}</td>
                  <td>{{ item.menuName }}</td>
                  <td>{{ item.submenuName }}</td>
                  <td>
                    <v-checkbox v-model="item.permissions.create" disabled></v-checkbox>
                  </td>
                  <td>
                    <v-checkbox v-model="item.permissions.read" disabled></v-checkbox>
                  </td>
                  <td>
                    <v-checkbox v-model="item.permissions.update" disabled></v-checkbox>
                  </td>
                  <td>
                    <v-checkbox v-model="item.permissions.delete" disabled></v-checkbox>
                  </td>
                </tr>
              </template>
              <template #bottom></template>
            </v-data-table>
          </v-card-text>
        </v-card-item>
      </v-card>
    </v-col>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="text-h5">Validasi Form</v-card-title>
        <v-card-text>{{ validationMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
