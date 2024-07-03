<script setup lang="ts">
import Logo from '@/layouts/full/logo/LogoDark.vue';
import AuthLogin from '../authForms/AuthLogin.vue';
</script>

<template>
  <v-row class="h-screen" no-gutters>
    <!---Left Part-->
    <v-col cols="12" class="d-flex align-center bg-lightprimary">
      <v-container>
        <div class="pa-7 pa-sm-12">
          <v-row justify="center">
            <v-col cols="12" lg="10" xl="6" md="7">
              <v-card elevation="0" class="loginBox">
                <v-card variant="outlined">
                  <v-card-text class="pa-9">
                    <!---Left Part Logo -->
                    <v-row>
                      <v-col cols="12" class="text-center">
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
                      </v-col>
                    </v-row>
                    <!---Left Part Logo -->

                    <!---Left Part Form-->
                    <AuthLogin />
                    <!---Left Part Form-->
                  </v-card-text>
                </v-card>
              </v-card>
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
  max-width: 475px;
  margin: 0 auto;
}
</style>
