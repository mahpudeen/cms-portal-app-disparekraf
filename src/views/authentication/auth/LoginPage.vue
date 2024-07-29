<script setup lang="ts">
import Logo from '@/layouts/full/logo/LogoDark.vue';
import AuthLogin from '../authForms/AuthLogin.vue';
import { ref } from 'vue';

const items = ref([
  {
    src: '/img/monas.png',
  },
  {
    src: '/img/dufan.jpg',
  },
],);
</script>

<template>
  <v-row class="h-screen" no-gutters>
    <!---Left Part-->
    <v-col cols="12" class="d-flex align-center bg-login">
      <v-container>
        <div>
          <v-row justify="center">
            <v-col cols="12">
              <v-card elevation="0" class="loginBox">
                <v-card variant="outlined">
                  <v-card-text class="pa-6">
                    <!---Left Part Logo -->
                    <v-row>
                      <v-col cols="12" md="6" class="text-center">
                        <!-- <img width="100px" height="100px" src="" alt=""> -->
                        <v-img
                          :width="50"
                          class="ml-auto mr-auto"
                          aspect-ratio="1/1"
                          cover
                          src="/img/jaya-raya-logo.png"
                        ></v-img>
                        <!-- <Logo /> -->
                        <h2 class="text-facebook text-h2">CMS Portal</h2>
                        <h4 class="text-h4 mt-1">Dinas Pariwisata dan Ekonomi Kreatif <br> Provinsi DKI Jakarta</h4>

                        <!---Left Part Form-->
                        <AuthLogin />
                        <!---Left Part Form-->
                      </v-col>
                      <v-col cols="12" md="6" >
                        <v-carousel 
                          height="350"
                          hide-delimiters
                        >
                          <v-carousel-item
                            v-for="(item,i) in items"
                            style="border-radius: 10px;"
                            :key="i"
                            :src="item.src"
                            cover
                            id="login"
                          ></v-carousel-item>
                        </v-carousel>
                        <v-img src="/img/bottom-login.png" class="mt-6"></v-img>
                        <!-- <img  alt=""> -->
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card>
              <v-row class="mt-6">
                <v-col cols="12" class="text-center">
                  <p>Copyright © 2024 Dinas Pariwisata dan Ekonomi Kreatif (Disparekraf) Daerah Khusus Jakarta</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <!---Left Part-->
  </v-row>
</template>
<style lang="scss">
.loginBox {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}
.bg-login {
  background: url(/img/bg-login.png) no-repeat;
  background-size: 100% 100%;
}
#login .v-img__img {
  border-radius: 8px;
}
</style>
