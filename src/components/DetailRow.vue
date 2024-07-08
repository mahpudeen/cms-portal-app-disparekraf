<template>
    <div class="second-color">
        <div v-if="align== true">
            <v-row>
                <v-col class="text-gray">{{name}} :</v-col>
            </v-row>
            <v-row style="margin-top:-16px">
                <v-col class="text-black">{{value}}</v-col>
            </v-row>
            <v-divider class="my-3"/>
        </div>
        <div v-else>
            <v-row>
                <v-col cols="3" class="text-gray">{{name}} :</v-col>
                <v-col class="d-flex justify-end text-black">{{value}}</v-col>
            </v-row>
            <v-divider class="my-3"/>
        </div>
    </div>
    </template>
    <script>
    export default {
        name : "DetailRow",
        props : {
            name : "",
            value : "",
            align : true
        }
    }
    </script>