<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Data Karyawan">
        <v-data-table :items="employees" :sort-by="[{ key: 'nama', order: 'asc' }]">
          <template v-slot:item.index="{ index }">
            <span>{{ index + 1 }}</span>
          </template>
          <template v-slot:item.aksi="{ item }">
            <v-btn
              size="small"
              class="mr-2"
              variant="tonal"
              color="#5865f2"
              icon
              @click="editItem(item)"
              v-tooltip.bottom="{ content: 'Edit' }"
            >
              <v-icon size="small">mdi-pencil</v-icon>
            </v-btn>
            <v-btn size="small" icon color="#FF5555" @click="deleteItem(item)" v-tooltip.bottom="{ content: 'Delete' }">
              <v-icon size="small">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <v-dialog v-model="dialogDelete" persistent max-width="600px">
          <v-card>
            <v-card-title class="text-h5">Konfirmasi Hapus</v-card-title>
            <v-card-text>Apakah Anda yakin ingin menghapus item ini?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Batal</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Hapus</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogConfirm" persistent max-width="600px">
          <v-card>
            <v-card-title class="text-h5">Konfirmasi Hapus</v-card-title>
            <v-card-text>Apakah Anda yakin ingin menghapus item ini?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue" @click="closeDelete">Batal</v-btn>
              <v-btn color="#5865f2" @click="deleteItemConfirm">Hapus</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogSuccess" persistent max-width="300px">
        <v-card>
          <v-card-title class="text-h5">Sukses</v-card-title>
          <v-card-text>Item berhasil dihapus.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green" text @click="closeSuccessDialog">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </UiParentCard>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, reactive, computed, shallowRef, onMounted } from 'vue';
import BaseBreadcrumb from '../../../components/shared/BaseBreadcrumb.vue';
import UiParentCard from '../../../components/shared/UiParentCard.vue';

const employees = ref([]);
const editedIndex = ref(null);
const dialogSuccess = ref(false);
const dialog = ref(false);
const dialogDelete = ref(false);
const dialogConfirm = ref(false);
const editedItem = reactive({
  nama: '',
  roles: '',
  email: '',
  bidang: '',
  aksi: true
});
const defaultItem = {
  nama: '',
  roles: '',
  email: '',
  bidang: '',
  aksi: true
};

const headers = [
  { text: 'No', value: 'index', align: 'center', sortable: false }, // Tambahkan ini
  { text: 'nama', value: 'nama', align: 'center', sortable: false },
  { text: 'Roles', value: 'roles', align: 'center' },
  { text: 'Email', value: 'email', align: 'center' },
  { text: 'Bidang', value: 'bidang', align: 'center' },
  { text: 'aksi', value: 'aksi', align: 'center', sortable: false }
];
const page = ref({ title: 'Employee Management' });
const breadcrumbs = shallowRef([
  {
    title: 'Internal Settings',
    disabled: false,
    href: '#'
  },
  {
    title: 'Users Page',
    disabled: true,
    href: '#'
  }
]);

const formTitle = computed(() => (editedIndex.value === -1 ? 'New Employee' : 'Edit Employee'));

const initialize = () => {
  employees.value = [
    { nama: 'John Doe', roles: 'Software Engineer', email: 'john.doe@example.com', bidang: 'Engineering', aksi: true },
    { nama: 'Jane Smith', roles: 'Project Manager', email: 'jane.smith@example.com', bidang: 'Product' },
    { nama: 'Emma Johnson', roles: 'Designer', email: 'emma.johnson@example.com', bidang: 'Design' },
    { nama: 'Michael Brown', roles: 'DevOps Engineer', email: 'michael.brown@example.com', bidang: 'IT Operations' },
    { nama: 'Samantha Davis', roles: 'UX Designer', email: 'samantha.davis@example.com', bidang: 'Design' },
    { nama: 'Christopher Garcia', roles: 'HR Manager', email: 'christopher.garcia@example.com', bidang: 'Human Resources' },
    { nama: 'Elizabeth Martinez', roles: 'Sales Manager', email: 'elizabeth.martinez@example.com', bidang: 'Sales' },
    { nama: 'James Wilson', roles: 'Customer Support Specialist', email: 'james.wilson@example.com', bidang: 'Customer Service' },
    { nama: 'John Doe', roles: 'Software Engineer', email: 'john.doe@example.com', bidang: 'Engineering' },
    { nama: 'Jane Smith', roles: 'Project Manager', email: 'jane.smith@example.com', bidang: 'Product' },
    { nama: 'Emma Johnson', roles: 'Designer', email: 'emma.johnson@example.com', bidang: 'Design' },
    { nama: 'Michael Brown', roles: 'DevOps Engineer', email: 'michael.brown@example.com', bidang: 'IT Operations' },
    { nama: 'Samantha Davis', roles: 'UX Designer', email: 'samantha.davis@example.com', bidang: 'Design' },
    { nama: 'Christopher Garcia', roles: 'HR Manager', email: 'christopher.garcia@example.com', bidang: 'Human Resources' },
    { nama: 'Elizabeth Martinez', roles: 'Sales Manager', email: 'elizabeth.martinez@example.com', bidang: 'Sales' },
    { nama: 'James Wilson', roles: 'Customer Support Specialist', email: 'james.wilson@example.com', bidang: 'Customer Service' }
  ].map((employee, index) => ({ no: index + 1, ...employee }));
};

onMounted(initialize);
function deleteItem(item) {
  console.log(item);
  editedIndex.value = employees.value.indexOf(item);
  Object.assign(editedItem, item);
  dialogDelete.value = true;
}

function deleteItemConfirm() {
  // Validasi editedIndex
  if (editedIndex.value !== null && editedIndex.value >= 0 && editedIndex.value < employees.value.length) {
    // Melakukan penghapusan
    employees.value.splice(editedIndex.value, 1);
    // Menampilkan dialog sukses
    dialogSuccess.value = false;
    // Menutup dialog penghapusan
    closeDelete();
    // Mengatur ulang editedIndex
    editedIndex.value = null;
  } else {
    // Handle kasus di mana editedIndex tidak valid
    console.error('Index tidak valid atau tidak ada item yang dipilih untuk dihapus.');
  }
}

function close() {
  dialog.value = false;
  Object.assign(editedItem, defaultItem);
  editedIndex.value = -1;
}

function closeDelete() {
  dialogDelete.value = false;
  Object.assign(editedItem, defaultItem);
  editedIndex.value = -1;
}

function closeSuccessDialog() {
  dialogSuccess.value = false;
}

function save() {
  if (editedIndex.value > -1) {
    Object.assign(employees.value[editedIndex.value], editedItem);
  } else {
    employees.value.push(Object.assign({}, editedItem));
  }
  close();
}
</script>
