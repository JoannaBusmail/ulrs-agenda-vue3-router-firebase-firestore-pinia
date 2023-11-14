<template>
    <AddForm
        :formValue="formValue"
        buttonName="Editar"
        @onFinish="handleSubmit"
        @update:inputValue="updateInputValue"
    ></AddForm>
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

const formValue = reactive({
    url: ''
})



//uso cilo de vida, por que quiero obtener el nombre de la URl cuando se cargue el componente
//es async porque hago una llamada a bbdd
//en laruta me viene el id del documento
//readUrl me retorna el name (es decir la url) y necesita el argumento Id para 
//saber de que documento se trata
onMounted(async () =>
{
    const url = await readUrl(route.params.id)
    console.log('Retrieved URL:', url)
    updateInputValue(url)
})


const updateInputValue = (value) =>
{
    console.log('Updating input value with:', value)
    formValue.url = value

}


const handleSubmit = async () =>
{
    const response = await updateUrl(route.params.id, formValue.url)

    if (!response) {
        return message.success("URL editada con éxito")
    }
    formValue.url = ''
}
</script>