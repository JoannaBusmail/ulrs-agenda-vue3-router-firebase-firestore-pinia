<template>
    <div>
        <h1> Editar</h1>
        <form @submit.prevent="handleUpdate">
            <input
                type="text"
                placeholder="Ingrese URL"
                v-model="url"
            >
            <button type="submit">Editar</button>
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useDataBase } from '../store/dataBase'
import { useRoute } from 'vue-router'

//RUTAS
const route = useRoute()

//databaseStore
const dataBaseStore = useDataBase()
const { readUrl, updateUrl } = dataBaseStore

const url = ref('')

//uso cilo de vida, por que quiero obtener el nombre de la URl cuando se cargue el componente
//es async porque hago una llamada a bbdd
//en laruta me viene el id del documento
//readUrl me retorna el name (es decir la url) y necesita el argumento Id para 
//saber de que documento se trata
onMounted(async () =>
{
    url.value = await readUrl(route.params.id)
})


//le pasamos el id y el name
const handleUpdate = () =>
{
    //TODO: Validaciones
    updateUrl(route.params.id, url.value)

}
</script>