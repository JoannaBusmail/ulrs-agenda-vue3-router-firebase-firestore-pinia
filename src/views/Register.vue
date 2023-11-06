<template>
    <div>
        <h1>Register</h1>
        <!--<button @click="registerUser('Joi')">Ingresar</button>-->
        <!--submit.prevent -> para que no se refresque la pagina-->
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
                Registrar usuario
            </button>
        </form>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '../store/user'
import { ref } from 'vue'


// store
const userStore = useUserStore()
const { registerUser } = userStore
const { isLoading } = storeToRefs(userStore)

const email = ref('')
const password = ref('')

const handleSubmit = async () =>
{// valido  si tengo email y el password es menor q 6
    //si cumple esa validación llamo a register user de nuestra store
    // con los dos parametro que necesitamos enviarle, mail y password
    if (!email.value || password.value < 6) {
        return alert('faltan datos')
        //tenemos que usar el await para este método porquenos devuelve una promesa
        //llamamos a registerData de nuestro store y le pasamos los parametros necesarios que son el mail y 
        //password que quedaran registrados en firebase
    } await registerUser(email.value, password.value)

    console.log(email.value)
    console.log(password.value)
    console.log('procesando formulario')
}

</script>

