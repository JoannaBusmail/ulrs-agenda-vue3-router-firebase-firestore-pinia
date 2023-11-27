<template>
    <h1 class="text-center">Perfil</h1>
    <div class="text-center mb-img">
        <a-avatar
            :src="userData.photoUrl"
            :size=100
        ></a-avatar>
        <p>{{ userData.displayName }}</p>
    </div>
    <a-row>
        <a-col
            :xs="{ span: 24 }"
            :sm="{ span: 18, offset: 3 }"
            :lg="{ span: 12, offset: 6 }"
        >
            <a-form
                :model="userData"
                @finish="onFinish"
                name="basicPerfil"
                layout="vertical"
                autocomplete="off"
            >

                <a-form-item
                    label="Tu Email"
                    name="email"
                    :rules="[{ required: true, whitespace: true, type: 'email', message: 'Ingrese email válido' }]"
                >
                    <a-input
                        disabled
                        v-model:value="userData.email"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    label="Nick name"
                    name="displayName"
                    :rules="[{ required: true, whitespace: true, message: 'Ingrese nick válido' }]"
                >
                    <a-input v-model:value="userData.displayName"></a-input>
                </a-form-item>


                <a-form-item>
                    <a-upload
                        v-model:file-list="fileList"
                        list-type="picture"
                        :before-upload="beforeUpload"
                        :max-count="1"
                        @change="handleChange"
                    >
                        <a-button>
                            Subir imagen
                        </a-button>
                    </a-upload>
                </a-form-item>



                <a-form-item>
                    <a-button
                        class="mb-btn"
                        type="primary"
                        html-type="submit"
                        :disabled="isLoading"
                        :loading="isLoading"
                    >Actualizar información
                    </a-button>
                </a-form-item>


            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { useUserStore } from '../store/user'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import { ref } from 'vue'

// user store
const userStore = useUserStore()
const { userData } = storeToRefs(userStore)
const { updateUserProfile, updateImage } = userStore
const { isLoading } = storeToRefs(userStore)

const fileList = ref([])

const handleChange = (info) =>
{
    if (info.file.status !== 'uploading') {

    }
}

//validate image before upload
const beforeUpload = (file) =>
{
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('Solo imágenes JPG ó PNG')
        return
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        message.error('Máximo 2MB')
        return
    }

    fileList.value = isJpgOrPng && isLt2M ? [ ...fileList.value, file ] : fileList.value

    return false
}

//update proflie from store
const onFinish = async () =>
{
    const error = await updateUserProfile(userStore.userData.displayName, fileList.value[ 0 ])

    if (!error) {
        return message.success('Perfil actualizado correctamente')
    } else {
        message.error('No se ha podido actualizar')
    }

}
</script>

<style>
.mb-img {
    margin-bottom: 5rem;
}

.mb-btn {
    margin-top: 2rem;
}
</style>