<template>
    <UserForm
        title="Login"
        buttonText="Acceder"
        :formValue="formValue"
        @onFinish="handleSubmit"
        @update:formValue="updateFormValue"
    ></UserForm>
</template>

<script setup>
import UserForm from '../components/UserForm.vue'
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

const formValue = reactive({
    password: '',
    email: ''
})

const updateFormValue = (value) =>
{
    formValue.email = value.email,
        formValue.password = value.password

}


const handleSubmit = async () =>
{
    const error = await signInUser(formValue.email, formValue.password)
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
    formValue.email = ''
    formValue.password = ''
})
</script>

