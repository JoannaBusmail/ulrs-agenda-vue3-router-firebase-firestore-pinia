<template>
    <a-form
        :model="formState"
        @finish="onFinish"
        name="addForm"
        layout="vertical"
        autocomplete="off"
    >

        <a-form-item
            label="URL"
            name="url"
            :rules="[{
                required: true, whitespace: true, pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                message: 'Ingrese url válida'
            }]"
        >
            <a-input v-model:value="formState.url"></a-input>
        </a-form-item>

        <a-form-item>
            <a-button
                type="primary"
                html-type="submit"
                :loading="loadingUrl"
                :disabled="loadingUrl"
            >Agregar
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { reactive } from "vue"
import { storeToRefs } from 'pinia'
import { message } from "ant-design-vue"
import { useDataBase } from '../store/dataBase'


const formState = reactive({
    url: ''
})




const dataBaseStore = useDataBase()
const { addUrl } = dataBaseStore
const { loadingUrl } = storeToRefs(dataBaseStore)

const onFinish = async () =>
{
    const response = await addUrl(formState.url)
    formState.url = ''
    if (!response) {
        return message.success("URL agregada con éxito")
    }

}
</script>