<script setup>
import { ref, inject, watch, computed } from 'vue';
import axios from '@/plugins/axios';
import { toast } from 'vue3-toastify';
import DetailRow from '@/components/DetailRow.vue';

const Swal = inject('$swal')

const headers = ref([
    {
        title: 'id',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Nama Role',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Modul',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Menu',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'SubMenu',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Create',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Read',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Update',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Delete',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Action',
        width: "18%",
        align: 'center',
        sortable: false
    },
]);

const detailHeaders = ref([
    {
        title: 'Modul',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Menu',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'SubMenu',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Create',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Read',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Update',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Delete',
        class: 'grey--text text--darken-4',
        sortable: false
    }
]);

 const tableHeaders = ref([
        { title: 'Create', value: 'create' },
        { title: 'Read', value: 'read' },
        { title: 'Update', value: 'update' },
        { title: 'Delete', value: 'delete' }
      ]);
// Data Table
const serverItems = ref([]);
const index_items = ref([]);
const loading = ref(true);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const search = ref('');

const modulItems = ref([]);
const menuItems = ref([]);
const subMenuItems = ref([]);
const selectedSubMenu = ref([])
const showChildren = ref(false);
const items = ref([{}]);
const loadItems = async ({ page, itemsPerPage, sortBy }) => {
    loading.value = true;
    axios.get(`/roles`).then(result => {
        serverItems.value = result.data
        totalItems.value = result.data.length;
        loading.value = false;
        let data = ref([])
        for (let index = 1; index < result.data.length+2; index++) {
            data.value.push(
                {
                    "value": index,
                    "text": index.toString()
                }
            )
        }
        index_items.value = data.value
    })
};

const selectedModul = ref(null);
const selectedMenu = ref(null);

const filteredMenuItems = computed(() => {
  if (!selectedModul.value) return [];
  const modul = modulItems.value.find(m => m.modul_id === selectedModul.value);
  return modul ? modul.children : []
});


// Gunakan watch untuk bereaksi terhadap perubahan selectedMenu
watch(selectedMenu, async (newValue) => {
  if (!newValue) {
    subMenuItems.value = [];
    return;
  }
  
  try {
    const result = await axios.get(`/menus/childrens/${newValue}`);
    subMenuItems.value = result.data;
    console.log(subMenuItems.value)
  } catch (error) {
    console.error('Failed to fetch sub menu items:', error);
    subMenuItems.value = [];
  }
}, { immediate: true }); // { immediate: true } untuk menjalankan efek ini segera pada saat pemasangan

const dialogModal = ref(false);
const dialogTitle = ref('');
const data = ref({
    name: "",
    status: "",
})
const error = ref({
    name: "",
    status: "",
})

const addData = () => {
    dialogModal.value = true;
    dialogTitle.value = "Add Role"
    data.value = {
        name: "",
    }
}

const addMore = () => {
    items.value.push({})
}

const editData = (item) => {
    dialogModal.value = true;
    dialogTitle.value = "Edit Role"
    data.value = {
        name: item.name,
    }
    const modul = axios.get(`/modules/menu/all`).then(result => {
        modulItems.value = result.data
    })
}

const detailData = (item) => {
    const roleDetail = axios.get(`/modules/role/`+item.id).then(result => {
        modulItems.value = result.data
    })
    console.log(modulItems)
    dialogModal.value = true;
    dialogTitle.value = "Detail Role"

}

const deleteData = (item) => {
    Swal.fire({
        title: "Hapus Role",
        text: "Apakah anda yakin ingin menghapus?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "orange",
        confirmButtonTextColor: "orange",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        cancelButtonColor: "yellow", //
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`/roles/`+item.id).then(result => {
                toast.success("Berhasil menghapus data", {
                    position: "top-right",
                    duration: 3000,
                    theme: "colored",
                });
            loadItems(1, itemsPerPage, 'id')
            }).catch(err => {
                toast.error("Error mengupdate data", {
                    position: "top-right",
                    duration: 3000,
                    theme: "colored",
                });
            })
        }
    });
}
function toggleChildren(item) {
    if (item.children && item.children.length > 0) {
      // Example: Toggle a property to show/hide children
      item.showChildren = !item.showChildren;
      console.log(item)
    } else {
      // Handle case where there are no children or loading children dynamically
    }
}

const saveData = () => {
    error.value = {
        name: "",
    }
    if (data.value.name === "" ) {
        error.value.name = "Role wajib diisi"
        return;
    }

    if (dialogTitle.value == "Add Role") {
        axios.post(`/roles`, data.value).then(result => {
            toast.success("Berhasil menyimpan data", {
                position: "top-right",
                duration: 3000,
                theme: "colored",
            });
            loadItems(1, itemsPerPage, 'id')
        }).catch(err => {
            toast.error("Error menyimpan data", {
                position: "top-right",
                duration: 3000,
                theme: "colored",
            });
        })
    }
    dialogModal.value = false;
}

// Contoh untuk men-debug
watch(selectedMenu, (newValue, oldValue) => {
  console.log(`selectedMenu changed from ${oldValue} to ${newValue}`);
});

watch(selectedSubMenu, (newValue, oldValue) => {
  console.log(`selectedSubMenu changed from ${oldValue} to ${newValue}`);
});


</script>
<template>
    <v-row>
        <v-col>
            <v-card variant="flat">
                <v-card-item>
                    <div class="d-sm-flex align-center justify-space-between">
                        <v-row>
                        <v-col cols="12" sm="4">
                            <v-text-field
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
                        <v-btn prepend-icon="mdi-plus-box" color="primary" elevation="0" @click="addData"> Add </v-btn>
                        </slot>
                    </div>
                </v-card-item>
                <v-divider></v-divider>
                <v-card-item>
                    <v-data-table-server 
                        v-model:items-per-page="itemsPerPage" 
                        :headers="headers" 
                        :items="serverItems"
                        :items-length="totalItems" 
                        :loading="loading" 
                        item-value="name" 
                        @update:options="loadItems"
                    >
                        <template v-slot:item="props, idx">
                            <tr style="height:48px">
                                <td>{{ props.item.id }}</td>
                                <td>{{ props.item.name }}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <v-checkbox
                                        v-model="props.item.status"
                                        color="primary"
                                        hide-details
                                        dense disabled></v-checkbox>
                                </td>
                                <td>
                                    <v-checkbox
                                        v-model="props.item.status"
                                        color="primary"
                                        hide-details
                                        dense disabled></v-checkbox>
                                </td>
                                <td>
                                    <v-checkbox
                                        v-model="props.item.status"
                                        color="primary"
                                        hide-details
                                        dense disabled></v-checkbox>
                                </td>
                                <td>
                                    <v-checkbox
                                        v-model="props.item.status"
                                        color="primary"
                                        hide-details
                                        dense disabled></v-checkbox>
                                </td>
                                <td class="btn-td">
                                    <button 
                                        class="btn-detail" 
                                        v-tooltip="'Detail'"
                                        @click="detailData(props.item)"
                                    >
                                        <v-icon color="white">mdi-file</v-icon>
                                    </button>
                                    <button 
                                        class="btn-edit"
                                        v-tooltip="'Edit'"
                                        @click="editData(props.item)"
                                    >
                                        <v-icon color="white">mdi-pencil</v-icon>
                                    </button>
                                    <button 
                                        class="btn-delete"
                                        v-tooltip="'Delete'"
                                        @click="deleteData(props.item)"
                                    >
                                        <v-icon color="white">mdi-delete</v-icon>
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </v-data-table-server>
                </v-card-item>
            </v-card>
            <v-dialog 
                max-width="1000" 
                v-model="dialogModal"
            >
                <v-card>
                    <v-card-title class="d-flex justify-space-between align-center">
                        <div class="text-h3 text-medium-emphasis ps-2">
                            {{ dialogTitle }}
                        </div>
                        <v-btn
                            icon="mdi-close"
                            variant="text"
                            @click="dialogModal = false"
                        ></v-btn>
                    </v-card-title>

                    <v-divider :class="dialogTitle=='Detail Role'?'':'mb-4'"></v-divider>

                    <v-card-text v-if="dialogTitle=='Detail Role'">
                        <DetailRow :name="'Nama Role'" :value="data.name"/>
                        <v-data-table :headers="detailHeaders" :items="modulItems" class="elevation-1">
                            <template v-slot:item="{ item }">
                                <tr>
                                    <td>{{ item.modul_title }}</td>
                                    <td>{{ item.modul_path }}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <v-icon @click="toggleChildren(item)">
                                        {{ item.children ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                        </v-icon>
                                    </td>
                                </tr>
                                    <template v-if="item.children">
                                        <tr v-for="subItem in item.children" :key="subItem.menuCode">
                                            <td></td>
                                            <td>{{ subItem.menu_title }}</td>
                                            <td>{{ subItem.menu_path }}</td>
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
                                            <td>
                                                <v-icon @click="toggleChildren(subItem)">
                                                {{ subItem.children ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                                </v-icon>
                                            </td>
                                        </tr>
                                    </template>
                                </template>
                            
                            <template #bottom></template>
                        </v-data-table>
                    </v-card-text>
                    <v-card-text v-else>
                        <v-text-field 
                            v-model="data.name"
                            density="compact"
                            variant="outlined" 
                            :error-messages="error.name"
                        >
                            <template v-slot:label>
                                Nama Role<span class="text-red">*</span>
                            </template>
                        </v-text-field>
                        <v-btn class="mb-5" color="primary"  density="compact"
                        variant="outlined" @click="addMore">Add More</v-btn>
                        <v-spacer></v-spacer>
                        <div v-for="(item, index) in items" :key="index">
                        <v-autocomplete
                            v-model="selectedModul"
                            :items="modulItems"
                            item-title="modul_title"
                            item-value="modul_id"
                            density="compact"
                            variant="outlined"
                        >
                            <template v-slot:label>
                                Modul<span class="text-red">*</span>
                            </template>
                        </v-autocomplete>

                        <v-autocomplete
                            v-model="selectedMenu"
                            :items="filteredMenuItems"
                            item-title="menu_title"
                            item-value="menu_id"
                            density="compact"
                            variant="outlined"
                            :disabled="!selectedModul">
                            <template v-slot:label>
                                Nama Menu<span class="text-red">*</span>
                            </template>
                        </v-autocomplete>

                        <v-autocomplete
                            v-model="selectedSubMenu"
                            :items="subMenuItems"
                            item-title="title"
                            item-value="id"
                            density="compact"
                            variant="outlined"
                            :disabled="!selectedMenu">
                            <template v-slot:label>
                                Nama SubMenu<span class="text-red">*</span>
                            </template>
                        </v-autocomplete>

                        <template v-if:="selectedSubMenu">
                            <tr>
                                <td>
                                    <v-checkbox class="px-2" label="Create"></v-checkbox>
                                </td>
                                <td>
                                    <v-checkbox class="px-2" label="Read"></v-checkbox>
                                </td>
                                <td>
                                    <v-checkbox class="px-2" label="Update"></v-checkbox>
                                </td>
                                <td>
                                    <v-checkbox class="px-2" label="Delete"></v-checkbox>
                                </td>
                            </tr>
                        </template>
                        <!-- tambahkan button 'Add more' untuk bisa memilih modul dan menu lagi yang sama-->
                        </div>
                    </v-card-text>

                    <v-divider class="mt-2"></v-divider>

                    <v-card-actions class="my-2 d-flex justify-end mr-4" v-if="dialogTitle!=='Detail Role'">
                        <v-btn
                            class="text-none"
                            text="Cancel"
                            variant="outlined"
                            color="primary"
                            @click="dialogModal = false"
                        ></v-btn>
                        <v-btn
                            class="text-none"
                            color="primary"
                            text="Save"
                            variant="flat"
                            @click="saveData"
                        ></v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>