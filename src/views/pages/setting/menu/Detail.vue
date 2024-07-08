<script setup>
import { ref, inject } from 'vue';
import { toast } from 'vue3-toastify';
import DetailRow from '@/components/DetailRow.vue';
const search = ref('');
const expanded = ref([]);

const Swal = inject('$swal')

const menu = [
    {
        "kode": "internal-setting",
        "nama": "Internal Setting",
        "path": "/internal-setting",
        "status": "1",
        "children": [
            {
                "kode": "cms-setting-general",
                "nama": "General Setting",
                "path": "/cms-setting-general",
                "status": "1",
            }
        ]
    },
    {
        "kode": "cms-jacation",
        "nama": "CMS Jacation",
        "path": "/cms-jacation",
        "status": "1",
        "children": [
            {
                "kode": "cms-tour-category",
                "nama": "Tour Category",
                "path": "/cms-tour-category",
                "status": "1",
            },
            {
                "kode": "cms-tour-type",
                "nama": "Tour Type",
                "path": "/cms-tour-type",
                "status": "1",
            }
        ]
    },
    {
        "kode": "cms-tour",
        "nama": "CMS Tour",
        "path": "/cms-tour",
        "status": "0",
    }
];

const status_items = [
    {
        "value": "1",
        "text": "Active",
    },
    {
        "value": "0",
        "text": "Inactive",
    }
];

const statuses = ref('')

const FakeAPI = {
    async fetch({ page, itemsPerPage, sortBy }) {
        return new Promise(resolve => {
            setTimeout(() => {
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const items = menu.slice();

                if (sortBy.length) {
                    const sortKey = sortBy[0].key;
                    const sortOrder = sortBy[0].order;
                    items.sort((a, b) => {
                        const aValue = a[sortKey];
                        const bValue = b[sortKey];
                        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
                    });
                }

                const paginated = items.slice(start, end);

                resolve({ items: paginated, total: items.length });
            }, 500);
        });
    },
};

const itemsPerPage = ref(5);
const headers = ref([
    {
        title: 'Kode Menu',
        width: "20%",
        class: 'grey--text text--darken-4',
        sortable: false,
    },
    {
        title: 'Nama Menu',
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
const loading = ref(true);
const totalItems = ref(0);

const loadItems = ({ page, itemsPerPage, sortBy }) => {
    loading.value = true;
    FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
        serverItems.value = items;
        totalItems.value = total;
        loading.value = false;
    });
};

const data = ref({
    kode: "",
    nama: "",
})
const error = ref({
    kode: "",
    nama: "",
})
const dialogModal = ref(false);
const dialogTitle = ref('');

const addData = () => {
    dialogModal.value = true;
    dialogTitle.value = "Add Menu"
    data.value = {
        kode: "",
        nama: "",
    }
}
const saveData = () => {
    error.value = {
        kode: "",
        nama: "",
    }
    if (data.value.kode === "" ) {
        error.value.kode = "Kode wajib diisi"
        return;
    }
    if (data.value.nama === "" ) {
        error.value.nama = "Nama wajib diisi"
        return;
    }

    // save item to server
    serverItems.value.push({...data.value });
    toast.success("Berhasil menyimpan data", {
        position: "top-right",
        duration: 3000,
        theme: "colored",
    });
    dialogModal.value = false;
}
const editData = (item) => {
    dialogModal.value = true;
    dialogTitle.value = "Edit Menu"
    data.value = {...item }
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
            // delete item from server
            serverItems.value = serverItems.value.filter((itm) => itm.kode!== item.kode);
            Swal.fire("Berhasil menghapus data");
        }
    });
}
const detailData = (item) => {
    data.value = item
    dialogModal.value = true;
    dialogTitle.value = "Detail Menu"
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
                        :headers="headers" :items="serverItems"
                        :items-length="totalItems" 
                        :loading="loading" 
                        item-value="name" 
                        @update:options="loadItems"
                        :expanded.sync="expanded"
                        item-key="name"
                        show-expand
                    >
                        <template v-slot:item="props, idx">
                            <tr style="height:48px">
                                <td>{{ props.item.kode }}</td>
                                <td>{{ props.item.nama }}</td>
                                <td>
                                    <div v-if="props.item.status == '1' ">
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
                                        to="/setting/menu/detail/123"
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

                        <template v-slot:expanded-item="{ item }">   
                            <td>
                            <p v-for="source in item.children">{{ source.kode }}</p>
                            </td>
                            <td>
                            <p v-for="source in item.children">{{ source.nama }}</p>
                            </td>
                            <td>
                            <p v-for="source in item.children">{{ source.status }}</p>
                            </td>
                            <td>
                            <p v-for="source in item.children">{{ source.path }}</p>
                            </td>
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
                        <DetailRow :name="'Kode'" :value="data.kode"/>
                        <DetailRow :name="'Name'" :value="data.nama"/>
                    </v-card-text>
                    <v-card-text v-else>
                        <v-text-field 
                            v-model="data.kode" 
                            label="Kode" 
                            density="compact"
                            variant="outlined" 
                            :error-messages="error.kode"
                        >
                            <template v-slot:label>
                                Kode<span class="text-red">*</span>
                            </template>
                        </v-text-field>
                        <v-text-field 
                            v-model="data.nama" 
                            label="Nama" 
                            density="compact"
                            variant="outlined" 
                            :error-messages="error.nama"
                        >
                            <template v-slot:label>
                                Nama<span class="text-red">*</span>
                            </template>
                        </v-text-field>
                        <v-autocomplete
                            v-model="statuses"
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
