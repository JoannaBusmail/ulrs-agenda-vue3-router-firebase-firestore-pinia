<template>
    <div>
        <h3>{{ `Hola ${userData?.email}` }}</h3>
        <AddForm></AddForm>
        <a-spin v-if="loadingDoc"></a-spin>

        <a-space
            v-if="!loadingDoc"
            direction="vertical"
            style=" width: 100%"
        >
            <a-card
                mb="100px"
                v-for="item of documents"
                :key="item.id"
                :title="item.short"
            >
                <template #extra>
                    <a-space>
                        <a-popconfirm
                            title="Seguro que quieres eliminar esta url"
                            ok-text="si"
                            cancel-text="no"
                            @confirm="confirm(item.id)"
                            @cancel="cancel"
                        >
                            <a-button
                                danger
                                :loading="loadingUrl"
                                :disabled="loadingUrl"
                            >Eliminar
                            </a-button>

                        </a-popconfirm>

                        <a-button
                            @click="item.id && router.push(`editar/${item.id}`)"
                        >Editar
                        </a-button>

                        <a-button @click="copiarPortapapeles(item.id)">Copiar
                        </a-button>
                    </a-space>
                </template>
                <p> {{ item.name }}</p>
            </a-card>

        </a-space>
    </div>
</template>

<script setup>
import { useUserStore } from '../store/user'
import { storeToRefs } from 'pinia'
import { useDataBase } from '../store/dataBase'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AddForm from '../components/AddForm.vue'
import { message } from 'ant-design-vue'

//router
// Para el boton edita necesito pushear la ruta a editar y coger el ID del usuario
const router = useRouter()


//user store
const userStore = useUserStore()
const { userData } = storeToRefs(userStore)

//database store
const dataBaseStore = useDataBase()
const { getUrls, addUrl, deleteUrl } = dataBaseStore
const { loadingDoc, loadingUrl, documents } = storeToRefs(dataBaseStore)

onMounted(() =>
{
    getUrls()
})


const url = ref('')

/*const handleSubmit = () =>
{//TO DO: validaciones de url
    //le pasamos como argumento la ref url que es el v-model del formulario
    addUrl(url.value)
    //limpio input
    url.value = ''
    console.log('formulario')
}*/

/*const handleDeleteDoc = (id) =>
{
    deleteUrl(id)
}*/

const confirm = async (id) =>
{
    const error = await deleteUrl(id)
    if (!error) {
        return message.success('se elimino con éxito')
    }
    if (error) {
        return message.error(error)
    }

}
const cancel = e =>
{
    message.error('No se elimino')
}

const copiarPortapapeles = async (id) =>
{//windo.location me da toda la info de la url, origin me da localhost../ ó nuestro hosting
    //id es el short name
    const path = `${window.location.href}${id}`
    //opcion async await
    const err = await navigator.clipboard.writeText(path)
    if (err) {
        message.error(err)
    } else {
        message.success('Se copio en el portapapeles')
    }

    //opcion then
    /* 
     navigator.clipboard
         .writeText(path)
         .then(() =>
         {
             message.success('Se copio en el portapapeles')
         })
         .catch((err) =>
         {
             message.error(err)
         })*/

}
</script>

