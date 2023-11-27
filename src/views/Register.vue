<template>
    <UserForm
        title="Register"
        buttonText="Registrarse"
        :formValue="formValue"
        :showConfirmPassword=true
        :confirmPasswordRules="confirmPasswordRules"
        @onFinish="handleSubmit"
        @update:formValue="updateFormValue"
    ></UserForm>
</template>

<script setup>
import UserForm from '../components/UserForm.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../store/user'
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'


// user store
const userStore = useUserStore()
const { registerUser } = userStore
const { isLoading } = storeToRefs(userStore)

//reactive
const formValue = reactive({
    password: '',
    email: '',
    checkPass: ''
})

//update input value including checkpassword
const updateFormValue = (value) =>
{
    formValue.email = value.email,
        formValue.password = value.password,
        formValue.checkPass = value.checkPass
}

//validate password
const validatePassword = async (_rule, value) =>
{
    if (value == '') {
        return Promise.reject('repita contraseña')
    }

    if (value !== formValue.password) {
        return Promise.reject('La contraseña no coincide')
    }
    return Promise.resolve()
}

//antdesign validation rules
const confirmPasswordRules = ref({ validator: validatePassword })


//submit register user method from user store - firebase
const handleSubmit = async () =>
{
    const error = await registerUser(formValue.email, formValue.password)
    if (!error) {
        return message.success('Bienvenido, verifica tu email')
    }
    switch (error) {
        case 'auth/email-already-in-use':
            message.error('Email ya registrado')
            break
        default:
            message.error('fallo algo desde firebase, intentelo de nuevo')
            break

    }
}

</script>

