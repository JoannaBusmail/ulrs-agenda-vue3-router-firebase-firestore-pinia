<template>
  <a-layout>
    <a-layout-header v-if="!loadingSession">
      <a-menu
        mode="horizontal"
        theme="dark"
        :style="{ lineHeight: '64px' }"
        v-model:selectedKeys="selectedKeys"
      >
        <a-menu-item
          v-if="userData"
          key="home"
        >
          <router-link to="/">Home</router-link>
        </a-menu-item>
        <a-menu-item
          v-if="!userData"
          key="login"
        >
          <router-link to="/login">Login</router-link>
        </a-menu-item>
        <a-menu-item
          v-if="!userData"
          key="register"
        >
          <router-link to="/register">Register</router-link>
        </a-menu-item>
        <a-menu-item
          @click="logOut"
          v-if="userData"
          key="logout"
        >Logout
        </a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout-content style="padding: 0 50px">
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <div v-if="loadingSession"> Loading user...</div>
        <router-view></router-view>
      </div>

    </a-layout-content>



  </a-layout>
</template>

<script setup>

import { ref, watch } from 'vue'
import { useUserStore } from './store/user'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const route = useRoute()
//llamamos a la store y desestructuramos la funcion que necesitamos usar
//esta funcion la usamos en el evento click sobre el boton log out
const userStore = useUserStore()
const { logOut } = userStore
const { userData, loadingSession } = storeToRefs(userStore)

const selectedKeys = ref([])
//para que en el manu de navegacion me marque en que pestaña estoy
//pongo un watch para observar cambios en la ruta
//y luego marco como selected keys = al nombre de la ruta
watch(
  () => route.name,
  () => { selectedKeys.value = [ route.name ] }


)


</script>

