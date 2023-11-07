<template>
    <div>
        <h1>Home </h1>
        <p>{{ userData?.email }}</p>
        <form @submit.prevent="handleSubmit">
            <input
                type="text"
                placeholder="Ingrese URL"
                v-model="url"
            >
            <button type="submit">Agregar</button>
        </form>
        <p v-if="loadingDoc">Loading docs...</p>
        <ul v-else>
            <li
                v-for="item of dataBaseStore.documents"
                :key="item.id"
            >
                {{ item.id }} <br>
                {{ item.name }} <br>
                {{ item.short }}<br>
                <button @click="handleDeleteDoc(item.id)">Eliminar</button>
                <button
                    @click="item.id && router.push(`editar/${item.id}`)">Editar</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useUserStore } from '../store/user'
import { storeToRefs } from 'pinia'
import { useDataBase } from '../store/dataBase'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

//router
// Para el boton edita necesito pushear la ruta a editar y coger el ID del usuario
const router = useRouter()


//user store
const userStore = useUserStore()
const { userData } = storeToRefs(userStore)

//database store
const dataBaseStore = useDataBase()
const { getUrls, addUrl, deleteUrl } = dataBaseStore
const { loadingDoc } = storeToRefs(dataBaseStore)

onMounted(() =>
{
    getUrls()
})


const url = ref('')

const handleSubmit = () =>
{//TO DO: validaciones de url
    //le pasamos como argumento la ref url que es el v-model del formulario
    addUrl(url.value)
    //limpio input
    url.value = ''
    console.log('formulario')
}

const handleDeleteDoc = (id) =>
{
    deleteUrl(id)
}

</script>

