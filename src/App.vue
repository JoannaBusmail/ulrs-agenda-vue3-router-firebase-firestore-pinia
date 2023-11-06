<template>
  <div>
    <h1>App</h1>
    <nav v-if="!loadingSession">
      <router-link
        to="/"
        v-if="userData"
      >Home</router-link> |
      <router-link
        to="/login"
        v-if="!userData"
      >Login</router-link> |
      <router-link
        to="/register"
        v-if="!userData"
      >Register</router-link> |
      <button
        @click="logOut"
        v-if="userData"
      >Logout</button>
    </nav>
    <div v-else> Loading user...</div>
    <router-view></router-view>
  </div>
</template>

<script setup>

import { useUserStore } from './store/user'
import { storeToRefs } from 'pinia'

//llamamos a la store y desestructuramos la funcion que necesitamos usar
//esta funcion la usamos en el evento click sobre el boton log out
const userStore = useUserStore()
const { logOut } = userStore
const { userData, loadingSession } = storeToRefs(userStore)

</script>

