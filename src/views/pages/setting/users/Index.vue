<script setup>
import { ref, inject } from 'vue';
import axios from '@/plugins/axios';
import DetailRow from '@/components/DetailRow.vue';

const Swal = inject('$swal');
const currentData = ref([]);
const users = ref([]);
const itemsPerPage = ref(5);
const totalItems = ref(0);
const search = ref('');
const roleList = ref([]);
const bidangList = ref([]);
const loading = ref(false);
const usersHeader = [
  { title: 'Nama', value: 'nama_lengkap' },
  { title: 'NRK', value: 'nrk' },
  { title: 'NIP', value: 'nip' },
  { title: 'Email', value: 'email' },
  { title: 'Role', value: 'role_id' },
  { title: 'Bidang', value: 'bidang_id' },
  { title: 'Status', value: 'status' },
  {
    title: 'Action',
    width: '12%',
    align: 'center',
    sortable: false
  }
];
const data = ref({
  nama_lengkap: '',
  nrk: '',
  nip: '',
  email: '',
  address: '',
  odp: '',
  unit_kerja: '',
  atasan_langsung: '',
  jabatan: '',
  pangkat: '',
  golongan: '',
  bidang_id: '',
  bidang_name: '',
  role_id: '',
  role_name: '',
  selectedBidangId: 0,
  selectedRoleId: 0,
  status: 1
});
const error = ref({
  nama_lengkap: null,
  nip: null,
  email: null
});
const dialogModal = ref(false);
const dialogTitle = ref('');

const fetchTableData = async (options) => {
  loading.value = true;
  try {
    const params = {
      page: options.page || 1,
      limit: options.itemsPerPage || 10,
      sortBy: options.sortBy ? options.sortBy[0] : undefined,
      sortDesc: options.sortDesc ? options.sortDesc[0] : undefined
    };

    const [rolesResponse, bidangResponse, usersResponse] = await Promise.all([
      axios.get('/roles'),
      axios.get('/bidang'),
      axios.get('/user', { params })
    ]);

    const roles = rolesResponse.data;
    roleList.value = rolesResponse.data;
    const bidang = bidangResponse.data.data;
    bidangList.value = bidangResponse.data.data;
    const usersData = usersResponse.data.data

    const rolesMap = new Map(roles.map(role => [role.id, role.name]));
    const bidangMap = new Map(bidang.map(b => [b.id, b.name]));

    users.value = usersData.map(user => ({
      ...user,
      role_name: rolesMap.get(parseInt(user.role_id)) || null,
      bidang_name: bidangMap.get(parseInt(user.bidang_id)) || null,
    }));

    totalItems.value = usersResponse.data.totalItems || users.value.length;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    loading.value = false;
  }
};

const userAPI = {
  async fetchUserById(userId) {
    try {
      // TODO: Need to put on env file, dont use hardcode
      const response = await fetch(`http://sso.sanctum.my.id/api/user/${userId}/detail`, {
        method: 'GET',
        headers: {
          'X-Channel': 'disparekraf_api',
          Authorization: 'Bearer 3|ocvzaHGgxQdkqgfAveJ49RgWKfeQONouNuIXI4Fs89b20484'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  },
  async updateUser(userId, userData) {
    const url = `http://sso.sanctum.my.id/api/user/${userId}/update`;
    const headers = {
      'X-Channel': 'disparekraf_api',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer 3|ocvzaHGgxQdkqgfAveJ49RgWKfeQONouNuIXI4Fs89b20484'
    };
    const data = new URLSearchParams(userData).toString();

    try {
      const response = await axios.put(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};

const addData = () => {
  dialogModal.value = true;
  dialogTitle.value = 'Add User';
  data.value = {
    nama_lengkap: '',
    nrk: '',
    nip: '',
    email: '',
    address: '',
    bidang_id: '',
    role_id: '',
    status: 1
  };
};

const saveData = () => {
  let isValid = true;
  error.value = {
    nama_lengkap: null,
    nip: null,
    email: null
  };
  if (data.value.nama_lengkap === '') {
    error.value.nama_lengkap = 'Nama wajib diisi';
    isValid = false;
  }
  if (isValid && data.value.nip === '') {
    error.value.nip = 'NIP wajib diisi';
    isValid = false;
  }
  if (isValid && data.value.nip.length < 8) {
    error.value.nip = 'NIP minimal 8 karakter';
    isValid = false;
  }
  if (isValid && data.value.email === '') {
    error.value.email = 'Email wajib diisi';
    isValid = false;
  }
  if (isValid) {
    currentData.value = { ...data.value };
    if (dialogTitle.value === 'Add User') {
      // Add new user
      axios({
        method: 'post',
        url: 'http://sso.sanctum.my.id/api/auth/register',
        headers: {
          'X-Channel': 'disparekraf_api',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer 3|ocvzaHGgxQdkqgfAveJ49RgWKfeQONouNuIXI4Fs89b20484'
        },
        data: new URLSearchParams(data.value).toString()
      })
        .then((response) => {
          Swal.fire('Success', 'User added successfully', 'success').then(() => {
            window.location.reload();
          });
          dialogModal.value = false;
        })
        .catch((error) => {
          Swal.fire('Error', 'Failed to add user', 'error');
        });
    } else {    
    userAPI
      .updateUser(currentData.value.id, currentData.value)
      .then((response) => {
        Swal.fire('Success', 'User updated successfully', 'success').then(() => {
          window.location.reload();
        });
        dialogModal.value = false;
      })
      .catch((error) => {
        Swal.fire('Error', 'Failed to update user', 'error');
      });
    }
  }
};

const detailData = async (item) => {
  const userData = await userAPI.fetchUserById(item.id);
  data.value = { ...userData };
  dialogModal.value = true;
  dialogTitle.value = 'Detail User';
};

const editData = async (item) => {
  const userData = await userAPI.fetchUserById(item.id);
  data.value = { ...userData };
  dialogModal.value = true;
  dialogTitle.value = 'Edit User';
  currentData.value = data.value;
};
const deleteData = (item) => {
  Swal.fire({
    title: 'Menonaktifkan User',
    text: 'Apakah anda yakin ingin menonaktifkan?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      axios({
        method: 'put',
        url: `http://sso.sanctum.my.id/api/user/${item.id}/disable`,
        headers: {
          'X-Channel': 'disparekraf_api',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer 3|ocvzaHGgxQdkqgfAveJ49RgWKfeQONouNuIXI4Fs89b20484'
        }
      })
        .then((response) => {
          Swal.fire('Berhasil menghapus data');
        })
        .catch((error) => {
          Swal.fire('Gagal menghapus data', 'Terjadi kesalahan saat menonaktifkan user.', 'error');
        });
    }
  });
};
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
              <v-btn prepend-icon="mdi-plus-box" color="primary" elevation="0" @click="addData"> Add </v-btn>
            </slot>
          </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-item>
          <v-data-table :headers="usersHeader" :items="users" :loading="loading"  @update:options="fetchTableData">
            <template v-slot:item="props">
              <tr style="height: 48px">
                <td>{{ props.item.nama_lengkap }}</td>
                <td>{{ props.item.nrk }}</td>
                <td>{{ props.item.nip }}</td>
                <td>{{ props.item.email }}</td>
                <td>{{ props.item.role?.name || ''}}</td>
                <td>{{ props.item.bidang?.name || ''}}</td>
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
                  <button class="btn-detail" v-tooltip="'Detail'" @click="detailData(props.item)">
                    <v-icon color="white">mdi-file</v-icon>
                  </button>
                  <button class="btn-edit" v-tooltip="'Edit'" @click="editData(props.item)">
                    <v-icon color="white">mdi-pencil</v-icon>
                  </button>
                  <button class="btn-delete" v-tooltip="'Delete'" @click="deleteData(props.item)">
                    <v-icon color="white">mdi-delete</v-icon>
                  </button>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-item>
        <v-dialog v-model="dialogModal" max-width="500">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <div class="text-h3 text-medium-emphasis ps-2">
                {{ dialogTitle }}
              </div>
              <v-btn icon="mdi-close" variant="text" @click="dialogModal = false"></v-btn>
            </v-card-title>

            <v-divider :class="dialogTitle == 'Detail User' ? '' : 'mb-4'"></v-divider>

            <v-card-text>
              <div v-if="dialogTitle !== 'Detail User'">
                <span v-if="error.nama_lengkap" style="color: red">{{ error.nama_lengkap }}</span>
                <v-text-field
                  v-model="data.nama_lengkap"
                  label="Nama"
                  density="compact"
                  variant="outlined"
                  :error="error.nama_lengkap"
                ></v-text-field>
                <v-text-field v-model="data.nrk" label="NRK" density="compact" variant="outlined"></v-text-field>
                <!-- <span v-if="error.nip" style="color: red">{{ error.nip }}</span> -->
                <v-text-field v-model="data.nip" label="NIP" density="compact" variant="outlined" :error="error.nip"></v-text-field>
                <!-- <span v-if="error.email" style="color: red">{{ error.email }}</span> -->
                <v-text-field v-model="data.email" label="Email" density="compact" variant="outlined" :error="error.email"></v-text-field>
                <!-- dialog.title == Add User -->
                <!-- create password -->
                <v-text-field v-if="dialogTitle === 'Add User'" type="Password" v-model="data.password" label="Password" density="compact" variant="outlined"></v-text-field>
                <v-text-field v-model="data.pangkat" label="Pangkat" density="compact" variant="outlined"></v-text-field>
                <v-text-field v-model="data.jabatan" label="Jabatan" density="compact" variant="outlined"></v-text-field>
                <v-text-field v-model="data.unit_kerja" label="Unit Kerja" density="compact" variant="outlined"></v-text-field>
                <v-text-field v-model="data.odp" label="ODP" density="compact" variant="outlined"></v-text-field>
                <v-text-field v-model="data.golongan" label="Golongan" density="compact" variant="outlined"></v-text-field>
                <v-text-field v-model="data.atasan" label="Atasan" density="compact" variant="outlined"></v-text-field>
                <v-textarea v-model="data.address" label="Alamat" density="compact" variant="outlined" rows="3" auto-grow></v-textarea>
                <v-select
                  v-model="data.role_id"
                  :items="roleList"
                  item-value="id"
                  item-title="name"
                  label="Select Role"
                  density="compact"
                  variant="outlined"
                  outlined
                ></v-select>
                <v-select
                  v-model="data.bidang_id"
                  :items="bidangList"
                  item-value="id"
                  item-title="name"
                  label="Select Bidang"
                  density="compact"
                  variant="outlined"
                  outlined
                ></v-select>
              </div>
              <div v-else-if="dialogTitle === 'Detail User'">
                <DetailRow :name="'Nama Lengkap'" :value="data.nama_lengkap" />
                <DetailRow :name="'NRK'" :value="data.nrk" />
                <DetailRow :name="'NIP'" :value="data.nip" />
                <DetailRow :name="'Jabatan'" :value="data.jabatan" />
                <DetailRow :name="'Pangkat'" :value="data.pangkat" />
                <DetailRow :name="'Golongan'" :value="data.golongan" />
                <DetailRow :name="'ODP'" :value="data.odp" />
                <DetailRow :name="'Unit Kerja'" :value="data.unit_kerja" />
                <DetailRow :name="'Atasan'" :value="data.atasan_langsung" />
                <DetailRow :name="'Email'" :value="data.email" />
                <DetailRow :name="'Alamat'" :value="data.address" />
                <DetailRow :name="'Bidang'" :value="data.bidang_id" />
                <DetailRow :name="'Role'" :value="data.role_id" />
                <DetailRow :name="'Status'" :value="data.status === 1 ? 'Aktif' : 'Tidak Aktif'" />
              </div>
            </v-card-text>
            <v-divider class="mt-2"></v-divider>
            <v-card-actions class="my-2 d-flex justify-end mr-4" v-if="dialogTitle !== 'Detail User'">
              <v-btn class="text-none" text="Cancel" variant="outlined" color="primary" @click="dialogModal = false"></v-btn>
              <v-btn class="text-none" color="primary" text="Save" variant="flat" @click="saveData"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-col>
  </v-row>
</template>
