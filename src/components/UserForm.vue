<template>
    <h1 class="text-center">{{ title }}</h1>
    <a-row>
        <a-col
            :xs="{ span: 24 }"
            :sm="{ span: 18, offset: 3 }"
            :lg="{ span: 12, offset: 6 }"
        >
            <a-form
                :model="formValue"
                @finish="handleSubmit"
                name="basicTwo"
                layout="vertical"
                autocomplete="off"
            >

                <a-form-item
                    label="Email"
                    name="email"
                    :rules="[{ required: true, type: 'email', message: 'Ingrese email válido' }]"
                >
                    <a-input
                        v-model:value="formValue.email"
                        @change="updateFormValue({ field: 'email', value: $event })"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    label="Password"
                    name="password"
                    :rules="[{ required: true, min: 6, message: 'Ingrese contraseña con mínimo de 6 caracteres' }]"
                >
                    <a-input-password
                        v-model:value="formValue.password"
                        @change="updateFormValue({ field: 'password', value: $event })"
                    ></a-input-password>
                </a-form-item>

                <a-form-item
                    v-if="showConfirmPassword"
                    has-feedback
                    label="Confirm"
                    name="checkPass"
                    :rules="confirmPasswordRules"
                >
                    <a-input
                        v-model:value="formValue.checkPass"
                        @change="updateFormValue({ field: 'checkPass', value: $event })"
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
                    > {{ buttonText }}
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
import { defineProps, defineEmits } from "vue"



// store
const userStore = useUserStore()
const { registerUser } = userStore
const { isLoading } = storeToRefs(userStore)

const props = defineProps([ 'title', 'buttonText', 'formValue', 'showConfirmPassword', 'confirmPasswordRules' ])


const emit = defineEmits([ "onFinish", "update:formValue" ])

const formState = reactive({
    password: '',
    email: '',
    checkPass: ''
})


const updateFormValue = (field, event) =>
{
    if (event && event.target) {
        formState[ field ] = event.target.value
        console.log("Emitting data:", { [ field ]: formState[ field ] })
        emit("update:formValue", { [ field ]: formState[ field ] })
    }
}


const handleSubmit = () =>
{
    if (props.showConfirmPassword) {
        emit("onFinish", { ...formState })
    } else { emit("onFinish", formState.email, formState.password) }


}

</script>
