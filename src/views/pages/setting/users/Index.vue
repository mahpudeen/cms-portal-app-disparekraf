<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <UiParentCard title="Data Karyawan">
        <v-data-table :items="employees">
          <template v-slot:item.index="{ index }">
            <span>{{ index + 1 }}</span>
          </template>
          <template v-slot:item.roles="{ item }">
            <!-- Gabungkan semua roles menjadi satu string dan tampilkan -->
            <span>{{ item.roles.join(', ') }}</span>
          </template>
          <template v-slot:item.aksi="{ item }">
            <v-btn
              size="small"
              class="mr-2"
              variant="tonal"
              color="#5865f2"
              icon
              @click.stop="editForm(item)"
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
      </UiParentCard>
    </v-col>
  </v-row>
  <v-dialog v-model="dialogEdit" persistent max-width="800px">
    <v-card>
      <v-card-title class="text-h5">Edit Karyawan</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="editItem.nama" label="Nama" :disabled="true"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editItem.nik" label="NIK" :disabled="true"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editItem.nip" label="NIP" :disabled="true"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="editItem.roles"
                :items="roles"
                label="Roles"
                multiple
                attach
                chips
                small-chips
                @change="onRolesChange"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editItem.email" label="Email" :disabled="true"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select v-model="editItem.bidang" :items="bidang" label="Bidang"></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeEdit">Batal</v-btn>
        <v-btn color="blue darken-1" text @click="updateItem">Simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const employees = ref([]);
const dialogDelete = ref(false);
const dialogEdit = ref(false);
const dialogConfirm = ref(false); // Assuming you need this for another confirmation dialog
const editItem = reactive({
  nama: '',
  roles: '',
  email: '',
  bidang: '',
  nik: '',
  nip: ''
});
const page = ref({ title: 'Employee Management' });
const breadcrumbs = ref([
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

const initialize = () => {
  employees.value = [
    { nama: 'John Doe', roles: ['Software Engineer'], email: 'john.doe@example.com', bidang: 'Engineering', aksi: true },
    { nama: 'Jane Smith', roles: ['Project Manager'], email: 'jane.smith@example.com', bidang: 'Product' },
    { nama: 'Emma Johnson', roles: ['Designer'], email: 'emma.johnson@example.com', bidang: 'Design' },
    { nama: 'Michael Brown', roles: ['DevOps Engineer'], email: 'michael.brown@example.com', bidang: 'IT Operations' },
    { nama: 'Samantha Davis', roles: ['UX Designer'], email: 'samantha.davis@example.com', bidang: 'Design' },
    { nama: 'Christopher Garcia', roles: ['HR Manager'], email: 'christopher.garcia@example.com', bidang: 'Human Resources' },
    { nama: 'Elizabeth Martinez', roles: ['Sales Manager'], email: 'elizabeth.martinez@example.com', bidang: 'Sales' },
    { nama: 'James Wilson', roles: ['Customer Support Specialist'], email: 'james.wilson@example.com', bidang: 'Customer Service' },
    { nama: 'John Doe', roles: ['Software Engineer'], email: 'john.doe@example.com', bidang: 'Engineering' },
    { nama: 'Jane Smith', roles: ['Project Manager'], email: 'jane.smith@example.com', bidang: 'Product' },
    { nama: 'Emma Johnson', roles: ['Designer'], email: 'emma.johnson@example.com', bidang: 'Design' },
    { nama: 'Michael Brown', roles: ['DevOps Engineer'], email: 'michael.brown@example.com', bidang: 'IT Operations' },
    { nama: 'Samantha Davis', roles: ['UX Designer'], email: 'samantha.davis@example.com', bidang: 'Design' },
    { nama: 'Christopher Garcia', roles: ['HR Manager'], email: 'christopher.garcia@example.com', bidang: 'Human Resources' },
    { nama: 'Elizabeth Martinez', roles: ['Sales Manager'], email: 'elizabeth.martinez@example.com', bidang: 'Sales' },
    { nama: 'James Wilson', roles: ['Customer Support Specialist'], email: 'james.wilson@example.com', bidang: 'Customer Service' }
].map((employee, index) => ({ no: index + 1, ...employee }));
};
const roles = computed(() => [...new Set(employees.value.map((employee) => employee.roles))]);
const bidang = computed(() => [...new Set(employees.value.map((employee) => employee.bidang))]);

onMounted(initialize);

function deleteItem(item) {
  const index = employees.value.indexOf(item);
  if (index !== -1) {
    editItem.nama = item.nama; // Assuming 'nama' is unique or used as a key
    dialogDelete.value = true;
  }
}

function deleteItemConfirm() {
  const index = employees.value.findIndex((employee) => employee.nama === editItem.nama);
  if (index !== -1) {
    employees.value.splice(index, 1);
    dialogDelete.value = false;
    resetEditItem();
  } else {
    console.error('Item not found');
  }
}

function closeDelete() {
  dialogDelete.value = false;
  resetEditItem();
}

function editForm(item) {
  Object.assign(editItem, item);
  dialogEdit.value = true;
}

function updateItem() {
  const index = employees.value.findIndex((employee) => employee.nama === editItem.nama);
  if (index !== -1) {
    Object.assign(employees.value[index], editItem);
    dialogEdit.value = false;
    resetEditItem();
  } else {
    console.error('Item not found');
  }
}

function resetEditItem() {
  Object.keys(editItem).forEach((key) => {
    editItem[key] = '';
  });
}

function onRolesChange(newValue) {
  console.log(editItem)
  editItem.roles = newValue;
}

function closeEdit() {
  dialogEdit.value = false;
}
</script>
