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

//user store
const userStore = useUserStore()
const { signInUser } = userStore
const { isLoading } = storeToRefs(userStore)


//reactive
const formValue = reactive({
    password: '',
    email: ''
})

//update input value
const updateFormValue = (value) =>
{
    formValue.email = value.email,
        formValue.password = value.password
}

//submit sign in user method from user store - firebase
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

//reset form value when component is mounted
onMounted(() =>
{
    formValue.email = ''
    formValue.password = ''
})
</script>

