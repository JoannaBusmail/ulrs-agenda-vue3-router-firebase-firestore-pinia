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
    <!--<button @click="registerUser('Joi')">Ingresar</button>-->
    <!--submit.prevent -> para que no se refresque la pagina-->
</template>

<script setup>
import UserForm from '../components/UserForm.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../store/user'
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'


// store
const userStore = useUserStore()
const { registerUser } = userStore
const { isLoading } = storeToRefs(userStore)

const formValue = reactive({
    password: '',
    email: '',
    checkPass: ''
})

const updateFormValue = (value) =>
{
    console.log("Received data in parent:", value)
    formValue.email = value.email,
        formValue.password = value.password,
        formValue.checkPass = value.checkPass

}


const validatePassword = async (_rule, value) =>
{
    //cheque que la contraseña no este vacía
    if (value == '') {
        return Promise.reject('repita contraseña')
    }
    //chequeo que la contraseña coincida con password
    if (value !== formValue.password) {
        return Promise.reject('La contraseña no coincide')
    }
    return Promise.resolve()

}


const confirmPasswordRules = ref({ validator: validatePassword })

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


//validaciones antes de ant design
/*const email = ref('')
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
}*/

</script>

