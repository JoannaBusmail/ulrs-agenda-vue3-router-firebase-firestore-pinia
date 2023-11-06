<template>
    <div>
        <h1>Home </h1>
        <p>{{ userData?.email }}</p>
    </div>
</template>

<script setup>
import { useUserStore } from '../store/user'
import { storeToRefs } from 'pinia'


const userStore = useUserStore()
const { userData } = storeToRefs(userStore)
//necesito saber que usuario esta logeado
</script>

