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
          v-if="userData"
          key="profile"
        >
          <router-link to="/profile">Perfil</router-link>
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
      <div class="container">
        <div v-if="loadingSession"> Loading user...</div>
        <router-view v-else></router-view>
      </div>

    </a-layout-content>



  </a-layout>
</template>

<script setup>

import { ref, watch } from 'vue'
import { useUserStore } from './store/user'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

//routes
const route = useRoute()

//user store
const userStore = useUserStore()
const { logOut } = userStore
const { userData, loadingSession } = storeToRefs(userStore)

//in the navigation bar, the selected key is the route name
const selectedKeys = ref([])
watch(
  () => route.name,
  () => { selectedKeys.value = [ route.name ] }


)

</script>

<style>
.container {
  background-color: #fff;
  padding: 24px;
  min-height: calc(100vh - 64px);
}

.text-center {
  text-align: center;
}
</style>

