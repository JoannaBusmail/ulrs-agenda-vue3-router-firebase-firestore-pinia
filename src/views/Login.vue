<template>
    <h1 class="text-center">Login</h1>
    <a-row>
        <a-col
            :xs="{ span: 24 }"
            :sm="{ span: 18, offset: 3 }"
            :lg="{ span: 12, offset: 6 }"
        >
            <a-form
                :model="formState"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
                name="basic"
                layout="vertical"
                autocomplete="off"
            >

                <a-form-item
                    label="Email"
                    name="email"
                    :rules="[{ required: true, type: 'email', message: 'Ingrese email válido' }]"
                >
                    <a-input v-model:value="formState.email"></a-input>
                </a-form-item>

                <a-form-item
                    label="Password"
                    name="password"
                    :rules="[{ required: true, min: 6, message: 'Ingrese contraseña con mínimo de 6 caracteres' }]"
                >
                    <a-input-password
                        v-model:value="formState.password"></a-input-password>
                </a-form-item>
                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :disabled="isLoading"
                        :loading="isLoading"
                    >Acceder
                    </a-button>
                </a-form-item>

            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>

import { storeToRefs } from 'pinia'
import { useUserStore } from '../store/user'
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'


const userStore = useUserStore()
const { signInUser } = userStore
//agrego ref is loading del sore y la uso para deshabilitar el boton
// se deshabilita siempre que sea true
const { isLoading } = storeToRefs(userStore)

//const email = ref('')
//const password = ref('')

//creo el handleSubmit y aqui llamo a la funcion signInUser de mi store
//con los parametros que necesito
/*const handleSubmit = async () =>
{
    if (!email.value || password.value.length < 6) { return alert('faltan datos') }
    await signInUser(email.value, password.value)
}*/

const formState = reactive({
    password: '',
    email: ''
})

const onFinish = async () =>
{
    const error = await signInUser(formState.email, formState.password)
    if (!error) {
        return
    }
    switch (error) {
        case 'auth/invalid-login-credentials':
            message.error('email o password inválidos')
            break
        case 'auth/wrong-password':
            message.error('error de contraseña')
            break
        default:
            message.error('fallo algo desde firebase, intentelo de nuevo')
            break

    }
}

const onFinishFailed = (error) =>
{
    console.log("failedlogin:", error)
}

onMounted(() =>
{
    // Restablece los campos de entrada a blanco cuando se carga la vista de inicio de sesión
    formState.email = ''
    formState.password = ''
})
</script>

