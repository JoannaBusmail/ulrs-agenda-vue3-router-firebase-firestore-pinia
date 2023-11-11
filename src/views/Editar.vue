<template>
    <a-form
        :model="formState"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
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
            >Editar
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import AddForm from '../components/AddForm.vue'
import { onMounted, ref, reactive } from 'vue'
import { useDataBase } from '../store/dataBase'
import { useRoute } from 'vue-router'

//RUTAS
const route = useRoute()

//databaseStore
const dataBaseStore = useDataBase()
const { readUrl, updateUrl } = dataBaseStore

//const url = ref('')

const formState = reactive({
    url: ''
})



//uso cilo de vida, por que quiero obtener el nombre de la URl cuando se cargue el componente
//es async porque hago una llamada a bbdd
//en laruta me viene el id del documento
//readUrl me retorna el name (es decir la url) y necesita el argumento Id para 
//saber de que documento se trata
onMounted(async () =>
{
    formState.url = await readUrl(route.params.id)
})


//le pasamos el id y el name
/*const handleSubmit = () =>
{
    //TODO: Validaciones
    updateUrl(route.params.id, url.value)

}*/

const onFinish = async () =>
{
    const response = await updateUrl(route.params.id, formState.url)
    formState.url = ''
    if (!response) {
        return message.success("URL editada con éxito")
    }

}
</script>