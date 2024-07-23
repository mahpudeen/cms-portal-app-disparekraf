<script setup>
import { ref, inject, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { toast } from 'vue3-toastify';
import { useRoute } from 'vue-router';
const route = useRoute();

const Swal = inject('$swal');

const modulHeaders = ref([
  {
    width: '25%',
    title: 'Nama Menu',
    class: 'grey--text text--darken-4',
    sortable: false
  },
  {
    width: '25%',
    title: 'Path',
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
  }
]);

const moduleItems = ref([]);
const menuItems = ref([]);
const detailItems = ref({});
const modulId = ref(null);
const modulSelected = ref({});
const checkAll = ref(true);
const updateData = ref(false);
const dataRole = ref({
  "role_id": route.params.id,
  "module": []
});


const loadDetail = async (id) => {
  try {
    const result = await axios.get(`/role-menu/`+id);
    detailItems.value = result.data.data;

    const resultModul = await axios.get(`/modules`);
    moduleItems.value = resultModul.data.map((item) => ({
      value: item.id,
      text: item.title
    }));

    const data = result.data.data
    const data2 = {
        role_id: data.role_id,
        module: []
    };

    if (detailItems.value.module.length > 0) {
      updateData.value = true
    }

    detailItems.value.module.forEach(module => {
        const newModule = {
            module_id: module.id,
            title: module.title,
            access: []
        };

        module.menus.forEach(menu => {
            const newMenu = {
                menu_id: menu.id,
                title: menu.title,
                path: menu.path,
                create: menu.create,
                read: menu.read,
                update: menu.update,
                delete: menu.delete,
                children: []
            };

            menu.children_recursive.forEach(child => {
                const newChild = {
                    menu_id: child.id,
                    title: child.title,
                    path: child.path,
                    create: child.create,
                    read: child.read,
                    update: child.update,
                    delete: child.delete
                };
                newMenu.children.push(newChild);
            });

            newModule.access.push(newMenu);
        });

        data2.module.push(newModule);
    });

    dataRole.value = data2;


  } catch (error) {
    console.error('Failed to load items:', error);
  }
};
const loadMenu = async (id) => {
  try {
    const result = await axios.get(`/menus/bymodule/`+id);
    console.log(result.data);
    menuItems.value = result.data.map((item) => ({
      menu_id: item.id,
      title: item.title,
      path: item.path,
      create: true,
      read: true,
      update: true,
      delete: true,
      children: item.children_recursive.map((child) => ({
        menu_id: child.id,
        title: child.title,
        path: child.path,
        create: true,
        read: true,
        update: true,
        delete: true,
      }))
    }));
    console.log(menuItems)
  } catch (error) {
    console.error('Failed to load items:', error);
  }
};
const handleModuleUpdate = (value) => {
  modulSelected.value = moduleItems.value.find(item => item.value === value);
  loadMenu(value)
}
const changeCheckBox = (value) => {
  menuItems.value.forEach(element => {
    element.create = value
    element.read = value
    element.update = value
    element.delete = value
    if (element.children.length > 0) {
      element.children.forEach(child => {
        child.create = value
        child.read = value
        child.update = value
        child.delete = value
      });
    }
  });
}
const addData = () => {
  const newRoleMenu = menuItems.value
  const newModule = {
    "module_id": modulId.value,
    "title": modulSelected.value.text,
    "access": newRoleMenu
  };

  // Find the index of the existing module with the same module_id
  const existingModuleIndex = dataRole.value.module.findIndex(module => module.module_id === modulId.value);

  if (existingModuleIndex !== -1) {
    // If a module with the same module_id exists, replace it
    dataRole.value.module[existingModuleIndex] = newModule;
  } else {
    // If no such module exists, push the new module
    dataRole.value.module.push(newModule);
  }
  modulId.value = null;
  menuItems.value = []
  modulSelected.value = {}
  console.log(dataRole.value);
}
const deleteData = (item) => {
  const newRoleMenu = menuItems.value.filter(item => item.menu_id!== item.menu_id);
  dataRole.value.module.forEach((module, index) => {
    if (module.module_id === item.module_id) {
      dataRole.value.module.splice(index, 1);
    }
  });
  menuItems.value = newRoleMenu;
}

const editData = (item) => {
  modulId.value = item.module_id;
  modulSelected.value = moduleItems.value.find(module => module.value === item.module_id);
  menuItems.value = JSON.parse(JSON.stringify(item.access))
}

const saveData = async () => {
  Swal.fire({
        title: "Assign Modul",
        text: "Apakah anda yakin ingin assign role?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "orange",
        confirmButtonTextColor: "orange",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        cancelButtonColor: "yellow", //
    }).then((result) => {
      if (result.isConfirmed) {
        if (updateData.value) {
          axios.put(`/role-menu/`+route.params.id, dataRole.value).then(result => {
            toast.success("Berhasil assign data", {
                position: "top-right",
                duration: 3000,
                theme: "colored",
            });
          }).catch(err => {
            toast.error("Error assign data", {
                position: "top-right",
                duration: 3000,
                theme: "colored",
            });
          })
        } else {
          axios.post(`/role-menu`, dataRole.value).then(result => {
            toast.success("Berhasil assign data", {
                position: "top-right",
                duration: 3000,
                theme: "colored",
            });
          }).catch(err => {
            toast.error("Error assign data", {
                position: "top-right",
                duration: 3000,
                theme: "colored",
            });
          })
        }
      }
    });
}
onMounted(() => {
  loadDetail(route.params.id)
})
</script>
<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card>
        <v-card-item>
          <div class="d-sm-flex align-center justify-space-between">
            <v-row>
              <v-col cols="12" sm="4">
                <h2 class="">Pilih modul dan assign</h2>
              </v-col>
            </v-row>
            <slot name="action">
              <v-btn prepend-icon="mdi-content-save" color="primary" elevation="0" @click="saveData"> Assign </v-btn>
            </slot>
          </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-item>
          <v-col class="p-0">
            Nama Role : {{ detailItems.role_name }}
          </v-col>
          <v-row class="mt-4">
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="modulId"
              :items="moduleItems"
              label="Pilih Modul"
              placeholder="Pilih Modul"
              density="compact"
              variant="outlined"
              item-title="text"
              item-value="value"
              clearable
              @update:model-value="handleModuleUpdate"
            ></v-autocomplete>
          </v-col>

          <v-col cols="5" class="p-1" v-if="menuItems.length > 0">
              <v-checkbox v-model="checkAll" label="Check/Uncheck All" @update:model-value="changeCheckBox"></v-checkbox>
            </v-col>
            
          </v-row>
          <div>
            <v-data-table
              :headers="modulHeaders"
              :items="menuItems"
              :no-data-text="'Data tidak tersedia, pilih modul terlebih dahulu'"
            >
            <template v-slot:item="props">
                <tr style="height: 48px">
                  <td>{{ props.item.title }}</td>
                  <td>{{ props.item.path }}</td>
                  <td>
                    <v-checkbox v-model="props.item.create"></v-checkbox>
                  </td>
                  <td>
                    <v-checkbox v-model="props.item.read"></v-checkbox>
                  </td>
                  <td>
                    <v-checkbox v-model="props.item.update"></v-checkbox>
                  </td>
                  <td>
                    <v-checkbox v-model="props.item.delete"></v-checkbox>
                  </td>
                </tr>
                <tr v-if="props.item.children" v-for="child in props.item.children" style="height: 48px;background-color: #f5f5f5" :key="child.menu_id">
                    <td style="padding-left: 40px;">{{ child.title }}</td>
                    <td>{{ child.path }}</td>
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
                </tr>
              </template>
              <template #bottom></template>
            </v-data-table>
          </div>
          <v-row v-if="menuItems.length > 0">
            <v-col cols="2" >
              <v-btn color="primary" variant="outlined" @click="addData">Add</v-btn>
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-card class="mt-3" variant="flat">
          <v-card-text>
            <h2>
              List modul yang di Assign ke role '{{ detailItems.role_name }}' :
            </h2>
          </v-card-text>
      </v-card>
      <div v-for="(item, index) in dataRole.module" :key="`role-${index}`">
        <v-card class="mt-3" variant="flat">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col>
                    <h2 class=" pb-4">- Modul: {{ item.title }}</h2>
                  </v-col>
                  <v-spacer></v-spacer>

                  <button 
                      class="btn-edit mr-2"
                      v-tooltip="'Edit'"
                      @click="editData(item)"
                  >
                      <v-icon color="white">mdi-pencil</v-icon>
                  </button>
                  <button 
                      class="btn-delete mr-3"
                      v-tooltip="'Delete'"
                      @click="deleteData(item)"
                  >
                      <v-icon color="white">mdi-delete</v-icon>
                  </button>
                </v-row>
                <v-divider></v-divider>
                <div>
                  <v-data-table
                    :headers="modulHeaders"
                    :items="item.access"
                  >
                  <template v-slot:item="props">
                      <tr style="height: 48px">
                        <td>{{ props.item.title }}</td>
                        <td>{{ props.item.path }}</td>
                        <td>
                          <v-checkbox disabled v-model="props.item.create"></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox disabled v-model="props.item.read"></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox disabled v-model="props.item.update"></v-checkbox>
                        </td>
                        <td>
                          <v-checkbox disabled v-model="props.item.delete"></v-checkbox>
                        </td>
                      </tr>
                      <tr v-if="props.item.children" v-for="child in props.item.children" style="height: 48px;background-color: #f5f5f5" :key="child.menu_id">
                          <td style="padding-left: 40px;">{{ child.title }}</td>
                          <td>{{ child.path }}</td>
                          <td>
                            <v-checkbox disabled v-model="child.create"></v-checkbox>
                          </td>
                          <td>
                            <v-checkbox disabled v-model="child.read"></v-checkbox>
                          </td>
                          <td>
                            <v-checkbox disabled v-model="child.update"></v-checkbox>
                          </td>
                          <td>
                            <v-checkbox disabled v-model="child.delete"></v-checkbox>
                          </td>
                      </tr>
                    </template>
                    <template #bottom></template>
                  </v-data-table>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
      <pre>{{ dataRole }}</pre>
    </v-col>
  </v-row>
</template>
