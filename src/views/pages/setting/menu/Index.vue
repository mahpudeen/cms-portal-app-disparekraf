<script setup>
import { ref, inject, watch } from 'vue';
import { toast } from 'vue3-toastify';
import DetailRow from '@/components/DetailRow.vue';
import axios from '@/plugins/axios';

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
        title: 'Nama Modul',
        class: 'grey--text text--darken-4',
        sortable: false
    },
    {
        title: 'Url Modul',
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
const loading = ref(true);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const search = ref('');

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
    loading.value = true;
    axios.get(`/modules`).then(result => {
        console.log(result);
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

const data = ref({
    title: "",
    url: "",
    status: null,
    index: null,
})
const error = ref({
    title: "",
    url: "",
    status: null,
    index: null,
})
const dialogModal = ref(false);
const dialogTitle = ref('');

const addData = () => {
    dialogModal.value = true;
    dialogTitle.value = "Add Menu"
    data.value = {
        title: "",
        url: "",
        status: null,
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
        url: "",
        status: null,
        index: null,
    }
    if (data.value.title === "" ) {
        error.value.title = "Nama wajib diisi"
        return;
    }
    if (data.value.url === "" ) {
        error.value.url = "Url wajib diisi"
        return;
    }
    if (data.value.status === null ) {
        error.value.status = "Status wajib diisi"
        return;
    }
    if (data.value.index === null ) {
        error.value.index = "Index wajib diisi"
        return;
    }

    if (dialogTitle.value == "Add Menu") {
        axios.post(`/modules`, data.value).then(result => {
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
        axios.put(`/modules/`+data.value.id, data.value).then(result => {
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
            axios.delete(`/modules/`+item.id).then(result => {
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
                        <template v-slot:item="props, idx">
                            <tr style="height:48px">
                                <td>{{ props.item.title }}</td>
                                <td>{{ props.item.url }}</td>
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
                                    <router-link 
                                        :to="`/setting/menu/detail/`+props.item.id"
                                        class="btn-explore-route" 
                                        v-tooltip="'Explore'"
                                    >
                                        <v-icon color="white">mdi-rocket-launch-outline</v-icon>
                                    </router-link>
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
                        <DetailRow :name="'Nama Modul'" :value="data.title"/>
                        <DetailRow :name="'Url'" :value="data.url"/>
                        <DetailRow :name="'Status'" :value="data.status == 1 ? 'Active':'Inactive'"/>
                        <DetailRow :name="'Index'" :value="data.index"/>
                    </v-card-text>
                    <v-card-text v-else>
                        <v-text-field 
                            v-model="data.title"
                            density="compact"
                            variant="outlined" 
                            :error-messages="error.title"
                        >
                            <template v-slot:label>
                                Nama Modul<span class="text-red">*</span>
                            </template>
                        </v-text-field>
                        <v-text-field 
                            v-model="data.url" 
                            density="compact"
                            variant="outlined" 
                            :error-messages="error.url"
                        >
                            <template v-slot:label>
                                URL<span class="text-red">*</span>
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
                        >
                            <template v-slot:label>
                                Index<span class="text-red">*</span>
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
