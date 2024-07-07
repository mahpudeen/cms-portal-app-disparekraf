<script setup lang="ts">
import { ref, reactive } from 'vue';

interface Employee {
  no: number;
  nama: string;
  roles: string[];
  email: string;
  bidang: string;
  nik: string;
  nip: string;
  aksi?: boolean;
}

interface EditableEmployee {
  nama?: string;
  roles?: string[];
  email?: string;
  bidang?: string;
  nik?: string;
  nip?: string;
}

interface Header {
  text: string;
  value: string;
}

const employees = ref<Employee[]>([]);
const dialogDelete = ref(false);
const dialogEdit = ref(false);
const dialogConfirm = ref(false);
const editItem = reactive<EditableEmployee>({});
const headers: Header[] = [
  {
    title: 'No',
    align: 'start',
    key: 'no'
  },
  {
    title: 'Nama',
    align: 'start',
    key: 'nama'
  },
  {
    title: 'Roles',
    align: 'start',
    key: 'roles'
  },
  {
    title: 'Email',
    align: 'start',
    key: 'email'
  },
  {
    title: 'Bidang',
    align: 'start',
    key: 'bidang'
  },
  {
    title: 'NIK',
    key: 'nik'
  },
  {
    title: 'NIP',
    key: 'nip'
  },
  {
    title: 'Aksi',
    key: 'aksi'
  }
];

function deleteItem(item) {
  const index = employees.value.indexOf(item);
  if (index !== -1) {
    editItem.nama = item.nama;
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
  console.log(editItem);
  editItem.roles = newValue;
}

function closeEdit() {
  dialogEdit.value = false;
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card variant="flat">
        <v-card-item>
          <div class="d-sm-flex align-center justify-space-between">
            <div class="search-width">
              <v-text-field
                v-model="search"
                label="Search"
                density="compact"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field>
            </div>
          </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-data-table :headers="headers" :items="employees">
          <template v-slot:header="props">
            <tr>
              <th v-for="header in props.headers" :key="header.text">
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template v-slot:[`item.roles`]="{ item }">
            <span>{{ item.roles.join(', ') }}</span>
          </template>
          <template v-slot:[`item.aksi`]="{ item }">
            <v-btn size="small" class="mr-2" color="#5865f2" @click="editForm(item, $event)" v-tooltip.bottom="{ content: 'Edit' }">
              <v-icon size="small">mdi-pencil</v-icon>
            </v-btn>
            <v-btn size="small" color="#FF5555" @click="deleteItem(item, $event)" v-tooltip.bottom="{ content: 'Delete' }">
              <v-icon size="small">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
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
              <v-text-field v-model="editItem.NIK" label="NIK" :disabled="true"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editItem.NIP" label="NIP" :disabled="true"></v-text-field>
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
