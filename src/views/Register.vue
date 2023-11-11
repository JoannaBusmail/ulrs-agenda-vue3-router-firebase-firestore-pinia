<template>
    <h1 class="text-center">Register</h1>
    <!--<button @click="registerUser('Joi')">Ingresar</button>-->
    <!--submit.prevent -> para que no se refresque la pagina-->
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
                name="basicTwo"
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
                <a-form-item
                    has-feedback
                    label="Confirm"
                    name="checkPass"
                    :rules="{ validator: validatePassword }"
                >
                    <a-input
                        v-model:value="formState.checkPass"
                        type="password"
                        autocomplete="off"
                    />
                </a-form-item>
                <a-form-item>
                    <a-button
                        :disabled="isLoading"
                        :loading="isLoading"
                        type="primary"
                        html-type="submit"
                    > Registrar usuario
                    </a-button>
                </a-form-item>

            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '../store/user'
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'


// store
const userStore = useUserStore()
const { registerUser } = userStore
const { isLoading } = storeToRefs(userStore)

const formState = reactive({
    password: '',
    email: '',
    checkPass: ''
})


const onFinish = async () =>
{
    const error = await registerUser(formState.email, formState.password)
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



const onFinishFailed = (error) =>
{
    console.log("failedlogin:", error)
}


//documentacion antdesign vue
const validatePassword = async (_rule, value) =>
{
    //cheque que la contraseña no este vacía
    if (value == '') {
        return Promise.reject('repita contraseña')
    }
    //chequeo que la contraseña coincida con password
    if (value !== formState.password) {
        return Promise.reject('La contraseña no coincide')
    }
    Promise.resolve

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

