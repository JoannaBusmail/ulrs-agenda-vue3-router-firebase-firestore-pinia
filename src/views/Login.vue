<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="handleSubmit">
            <input
                type="email"
                placeholder="Ingrese Email"
                v-model="email"
            >
            <input
                type="password"
                placeholder="Ingrese contraseña"
                v-model="password"
            >
            <button
                :disabled="isLoading"
                class="btn btn-outline-primary"
                type="submit"
            >
                Acceso
            </button>
        </form>

    </div>
</template>

<script setup>

import { storeToRefs } from 'pinia'
import { useUserStore } from '../store/user'
import { ref } from 'vue'


const userStore = useUserStore()
const { signInUser } = userStore
//agrego ref is loading del sore y la uso para deshabilitar el boton
// se deshabilita siempre que sea true
const { isLoading } = storeToRefs(userStore)

const email = ref('')
const password = ref('')

//creo el handleSubmit y aqui llamo a la funcion signInUser de mi store
//con los parametros que necesito
const handleSubmit = async () =>
{
    if (!email.value || password.value.length < 6) { return alert('faltan datos') }
    await signInUser(email.value, password.value)
}


</script>

