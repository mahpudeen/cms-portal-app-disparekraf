<script setup>
import { ref, inject, watch } from 'vue';
import { toast } from 'vue3-toastify';
import DetailRow from '@/components/DetailRow.vue';
import axios from '@/plugins/axios';
import { useRoute } from 'vue-router';
const route = useRoute();

const Swal = inject('$swal')

const status_items = [
    {
        "value": 1,
        "text": "Active",
    },
    {
        "value": 0,
        "text": "Inactive",
    }
];

const headers = ref([
    {
        width: "2%",
        title: '',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        width: "30%",
        title: 'Nama Menu',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Icon Menu',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Path Menu',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Status',
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
const serverItems = ref([]);
const index_items = ref([]);
const parent_items = ref([]);
const loading = ref(true);
const isParent = ref(true);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const search = ref('');

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
    loading.value = true;
    axios.get(`/menus/bymodule/`+route.params.id).then(result => {
        serverItems.value = result.data
        let dataParent = ref([])

        serverItems.value.forEach(element => {
            element.showChildren = false;
            dataParent.value.push(
                {
                    "value": element.id,
                    "text": element.title
                }
            )
        });
        parent_items.value = dataParent.value
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

const data = ref({
    title: "",
    modules_id: route.params.id,
    path: "",
    icon: "",
    status: null,
    parent_id: null,
    index: null,
})
const error = ref({
    title: "",
    modules_id: "",
    path: "",
    icon: "",
    status: "",
    parent_id: "",
    index: "",
})
const dialogModal = ref(false);
const dialogTitle = ref('');

const addData = () => {
    dialogModal.value = true;
    dialogTitle.value = "Add Menu"
    data.value = {
        title: "",
        modules_id: route.params.id,
        path: "",
        icon: "",
        status: null,
        parent_id: null,
        index: null,
    }
}
const editData = (item) => {
    dialogModal.value = true;
    dialogTitle.value = "Edit Menu"
    data.value = {...item }
}

const detailData = (item) => {
    data.value = item
    dialogModal.value = true;
    dialogTitle.value = "Detail Menu"
}
const saveData = () => {
    error.value = {
        title: "",
        modules_id: route.params.id,
        path: "",
        icon: "",
        status: null,
        parent_id: null,
        index: null,
    }
    if (data.value.title === "" ) {
        error.value.title = "Nama wajib diisi"
        return;
    }
    if (data.value.path === "" ) {
        error.value.path = "Path wajib diisi"
        return;
    }
    if (data.value.status === null ) {
        error.value.status = "Status wajib diisi"
        return;
    }
    if (data.value.icon === null ) {
        error.value.icon = "Icon wajib diisi"
        return;
    }
    if (data.value.index === null ) {
        error.value.index = "Index wajib diisi"
        return;
    }

    if (dialogTitle.value == "Add Menu") {
        axios.post(`/menus/create`, data.value).then(result => {
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
    } else {
        axios.put(`/menus/`+data.value.id, data.value).then(result => {
            toast.success("Berhasil mengupdate data", {
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
    dialogModal.value = false;
}
const deleteData = (item) => {
    Swal.fire({
        title: "Hapus Menu",
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
            axios.delete(`/menus/`+item.id).then(result => {
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
  item.showChildren = !item.showChildren;
}
function handleCheckboxChange() {
    data.value.parent_id = null
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
                            <v-btn prepend-icon="mdi-plus-box" color="primary" elevation="0" @click="addData">
                                Add
                            </v-btn>
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
                        <template v-slot:item="props">
                            <tr style="height:48px">
                                <td>
                                    <v-icon @click="toggleChildren(props.item)" v-if="props.item.children_recursive.length != 0">
                                        {{ props.item.showChildren ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                    </v-icon>
                                </td>
                                <td>{{ props.item.title }}</td>
                                <td>{{ props.item.icon }}</td>
                                <td>{{ props.item.path }}</td>
                                <td>
                                    <div v-if="props.item.status == 1 ">
                                        <v-chip color="green" class="bg-green" density="compact" variant="flat">
                                            Active
                                        </v-chip>
                                    </div>
                                    <div v-if="props.item.status == '0' ">
                                        <v-chip color="red" class="bg-red" density="compact" variant="flat">
                                            Inactive
                                        </v-chip>
                                    </div>
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
                            <template v-if="props.item.showChildren">
                                <tr style="height:48px;background-color: #f5f5f5" v-for="(subItem, idx) in props.item.children_recursive" :key="idx">
                                    <td></td>
                                    <td style="padding-left: 40px;">{{ subItem.title }}</td>
                                    <td>{{ subItem.icon }}</td>
                                    <td>{{ subItem.path }}</td>
                                    <td>
                                        <div v-if="subItem.status == 1 ">
                                            <v-chip color="green" class="bg-green" density="compact" variant="flat">
                                                Active
                                            </v-chip>
                                        </div>
                                        <div v-if="subItem.status == '0' ">
                                            <v-chip color="red" class="bg-red" density="compact" variant="flat">
                                                Inactive
                                            </v-chip>
                                        </div>
                                    </td>
                                    <td class="btn-td">
                                        <button 
                                            class="btn-detail" 
                                            v-tooltip="'Detail'"
                                            @click="detailData(subItem)"
                                        >
                                            <v-icon color="white">mdi-file</v-icon>
                                        </button>
                                        <button 
                                            class="btn-edit"
                                            v-tooltip="'Edit'"
                                            @click="editData(subItem)"
                                        >
                                            <v-icon color="white">mdi-pencil</v-icon>
                                        </button>
                                        <button 
                                            class="btn-delete"
                                            v-tooltip="'Delete'"
                                            @click="deleteData(subItem)"
                                        >
                                            <v-icon color="white">mdi-delete</v-icon>
                                        </button>
                                    </td>
                                </tr>
                            </template>
                        </template>
                    </v-data-table-server>
                </v-card-item>
            </v-card>
            <v-dialog 
                max-width="500" 
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

                    <v-divider :class="dialogTitle=='Detail Menu'?'':'mb-4'"></v-divider>

                    <v-card-text v-if="dialogTitle=='Detail Menu'">
                        <DetailRow :name="'Nama Menu'" :value="data.title"/>
                        <DetailRow :name="'Url'" :value="data.path"/>
                        <DetailRow :name="'Status'" :value="data.status == 1 ? 'Active':'Inactive'"/>
                    </v-card-text>
                    <v-card-text v-else>
                        <v-text-field 
                            v-model="data.title"
                            density="compact"
                            variant="outlined" 
                            :error-messages="error.title"
                        >
                            <template v-slot:label>
                                Nama Menu<span class="text-red">*</span>
                            </template>
                        </v-text-field>
                        <v-text-field 
                            v-model="data.path" 
                            density="compact"
                            variant="outlined" 
                            :error-messages="error.path"
                        >
                            <template v-slot:label>
                                Path<span class="text-red">*</span>
                            </template>
                        </v-text-field>
                        <v-text-field 
                            v-model="data.icon" 
                            density="compact"
                            variant="outlined" 
                            :error-messages="error.icon"
                        >
                            <template v-slot:label>
                                Icon<span class="text-red">*</span>
                            </template>
                        </v-text-field>
                        <v-autocomplete
                            v-model="data.status"
                            :items="status_items"
                            item-title="text"
                            item-value="value"
                            density="compact"
                            variant="outlined"
                        >
                            <template v-slot:label>
                                Status<span class="text-red">*</span>
                            </template>
                        </v-autocomplete>
                        <v-autocomplete
                            v-model="data.index"
                            :items="index_items"
                            item-title="text"
                            item-value="value"
                            density="compact"
                            variant="outlined"
                            :error-messages="error.index"
                        >
                            <template v-slot:label>
                                Index<span class="text-red">*</span>
                            </template>
                        </v-autocomplete>
                        <v-checkbox 
                            label="Is Parent" 
                            v-model:model-value="isParent"
                            @change="handleCheckboxChange"
                        ></v-checkbox>
                        <v-autocomplete
                            v-model="data.parent_id"
                            :items="parent_items"
                            item-title="text"
                            item-value="value"
                            density="compact"
                            variant="outlined"
                            :disabled="isParent"
                        >
                            <template v-slot:label>
                                Parent<span class="text-red">*</span>
                            </template>
                        </v-autocomplete>
                    </v-card-text>

                    <v-divider class="mt-2"></v-divider>

                    <v-card-actions class="my-2 d-flex justify-end mr-4" v-if="dialogTitle!=='Detail Menu'">
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
