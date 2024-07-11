<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
import DetailRow from '@/components/DetailRow.vue';

// const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const Swal = inject('$swal')
const currentData = ref([]);
const users = ref([]);
const itemsPerPage = ref(5);
const totalItems = ref(0);
const search = ref('');
const usersHeader = [
  { title: 'Nama', value: 'name' },
  { title: 'NRK', value: 'nrk' },
  { title: 'NIP', value: 'nip' },
  { title: 'Email', value: 'email' },
  { title: 'Role', value: 'role_id' },
  { title: 'Bidang', value: 'bidang_id' },
  { title: 'Status', value: 'status' },
  {
        title: 'Action',
        width: "12%",
        align: 'center',
        sortable: false
    },
];
const data = ref({
    name: "",
    nrk: "",
    nip: "",
    email: "",
    address: "",
    bidang_id: "",
    role_id: "",
    status: 1,
})
const error = ref({
    name: null,
    nip: null,
    email: null,
})
const dialogModal = ref(false);
const dialogTitle = ref('');

const userAPI = {
  async fetchUsers() {
    try {
      // TODO: Need to put on env file, dont use hardcode
      const response = await fetch('http://sso.sanctum.my.id/api/user', {
        method: 'GET',
        headers: {
          'X-Channel': 'disparekraf_api',
          'Authorization': `Bearer 3|ocvzaHGgxQdkqgfAveJ49RgWKfeQONouNuIXI4Fs89b20484`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const filteredData = data.map(user => {
        const filteredUser = { id: user.id };
        usersHeader.forEach(header => {
          filteredUser[header.value] = user[header.value];
        });
        return filteredUser;
      });
      totalItems.value = filteredData.length;
      return filteredData;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },
  async fetchUserById(userId) {
    try {
      // TODO: Need to put on env file, dont use hardcode
      const response = await fetch(`http://sso.sanctum.my.id/api/user/${userId}/detail`, {
        method: 'GET',
        headers: {
          'X-Channel': 'disparekraf_api',
          'Authorization': 'Bearer 3|ocvzaHGgxQdkqgfAveJ49RgWKfeQONouNuIXI4Fs89b20484',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  },
  async updateUser(userId, userData) {
      const url = `http://sso.sanctum.my.id/api/user/${userId}/update`;
      const headers = {
        'X-Channel': 'disparekraf_api',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer 3|ocvzaHGgxQdkqgfAveJ49RgWKfeQONouNuIXI4Fs89b20484',
      };
      const data = new URLSearchParams(userData).toString();

      try {
        const response = await axios.put(url, data, { headers });
        console.log('Update successful', response.data);
        return response.data;
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    }
};

onMounted(async () => {
  const fetchedUsers = await userAPI.fetchUsers();
  users.value = fetchedUsers;
  itemsPerPage.value = Math.min(5, users.value.length);
});

const addData = () => {
    dialogModal.value = true;
    dialogTitle.value = "Add User"
    data.value = {
        name: "",
        nrk: "",
        nip: "",
        email: "",
        address: "",
        bidang_id: "",
        role_id: "",
        status: 1,
    }
}


const saveData = () => {
    let isValid = true; 
    error.value = {
        name: null,
        nip: null,
        email: null,
    };
    if (data.value.name === "") {
        error.value.name = "Nama wajib diisi";
        isValid = false; 
    }
    if (isValid && data.value.nip === "") {
        error.value.nip = "NIP wajib diisi";
        isValid = false;
    }
    if (isValid && data.value.nip.length < 8) {
        error.value.nip = "NIP minimal 8 karakter";
        isValid = false;
    }
    if (isValid && data.value.email === "") {
        error.value.email = "Email wajib diisi";
        isValid = false;
    }
    if (isValid) {
        const userData = { name: currentData.value.name, nip: currentData.value.nip, email: currentData.value.email };
        userAPI.updateUser(currentData.value.id, userData)
            .then(response => {
                console.log('User updated successfully', response);
                Swal.fire("Success", "User updated successfully", "success")
                  .then(() => {
                      window.location.reload();
                  });
                dialogModal.value = false;
            })
            .catch(error => {
                console.error('Failed to update user', error);
                Swal.fire("Error", "Failed to update user", "error");
        });
    }
};

const detailData = async (item) => {
    const userData = await userAPI.fetchUserById(item.id);
    data.value = userData;
    dialogModal.value = true;
    dialogTitle.value = "Detail User"
}

const editData = (item) => {
    data.value = { ...item };
    dialogModal.value = true;
    dialogTitle.value = "Edit User";
    currentData.value = data.value;
};

const deleteData = (item) => {
    Swal.fire({
        title: "Menonaktifkan User",
        text: "Apakah anda yakin ingin menonaktifkan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
    }).then((result) => {
        if (result.isConfirmed) {
            axios({
                method: 'put',
                url: `http://sso.sanctum.my.id/api/user/${item.id}/disable`,
                headers: {
                    'X-Channel': 'disparekraf_api',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer 3|ocvzaHGgxQdkqgfAveJ49RgWKfeQONouNuIXI4Fs89b20484',
                },
            }).then(response => {
                Swal.fire("Berhasil menghapus data");
            }).catch(error => {
                // Handle error
                console.error("Error deactivating user:", error);
                Swal.fire("Gagal menghapus data", "Terjadi kesalahan saat menonaktifkan user.", "error");
            });
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
            <v-data-table 
                :headers="usersHeader"
                :items="users"
            >
            <template v-slot:item="props, idx">
              <tr style="height:48px">
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.nrk }}</td>
                  <td>{{ props.item.nip }}</td>
                  <td>{{ props.item.email }}</td>
                  <td>{{ props.item.role_id }}</td>
                  <td>{{ props.item.bidang_id }}</td>
                  <td>{{ props.item.status === 1 ? 'Aktif' : 'Tidak Aktif' }}</td>
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
            </v-data-table>
        </v-card-item>
        <v-dialog v-model="dialogModal" max-width="500" >
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

            <v-divider :class="dialogTitle=='Detail User'?'':'mb-4'"></v-divider>

            <v-card-text>
              <div v-if="dialogTitle !== 'Detail User'">
                <span v-if="error.name" style="color: red;">{{ error.name }}</span>
                <v-text-field 
                    v-model="data.name" 
                    label="Nama" 
                    density="compact"
                    variant="outlined" 
                    :error.message="error.name"
                ></v-text-field>
                <v-text-field 
                    v-model="data.nrk" 
                    label="NRK" 
                    density="compact"
                    variant="outlined" 
                ></v-text-field>
                <span v-if="error.nip" style="color: red;">{{ error.nip }}</span>
                <v-text-field 
                    v-model="data.nip" 
                    label="NIP" 
                    density="compact"
                    variant="outlined" 
                    :error.message="error.nip"
                ></v-text-field>
                <span v-if="error.email" style="color: red;">{{ error.email }}</span>
                <v-text-field 
                    v-model="data.email" 
                    label="Email" 
                    density="compact"
                    variant="outlined" 
                    :error.message="error.email"
                ></v-text-field>
                <v-textarea 
                    v-model="data.address" 
                    label="Alamat" 
                    density="compact"
                    variant="outlined" 
                    rows="3"
                    auto-grow
                ></v-textarea>
                
              </div>
              <div v-else-if="dialogTitle === 'Detail User'">
                <DetailRow :name="'Name'" :value="data.name"/>
                <DetailRow :name="'NRK'" :value="data.nrk"/>
                <DetailRow :name="'NIP'" :value="data.nip"/>
                <DetailRow :name="'Email'" :value="data.email"/>
                <DetailRow :name="'Alamat'" :value="data.address"/>
                <DetailRow :name="'Bidang'" :value="data.bidang_id"/>
                <DetailRow :name="'Role'" :value="data.role_id"/>
                <DetailRow :name="'Status'" :value="data.status === 1 ? 'Aktif' : 'Tidak Aktif'"/>
              </div>
            </v-card-text>
            <v-divider class="mt-2"></v-divider>
              <v-card-actions class="my-2 d-flex justify-end mr-4" v-if="dialogTitle!=='Detail User'">
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
      </v-card>
    </v-col>
  </v-row>
</template>