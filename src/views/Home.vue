<template>
    <div>
        <h3>{{ `Hola ${userData?.email}` }}</h3>
        <AddForm
            :formValue="formValue"
            buttonName="Agregar"
            @onFinish="handleSubmit"
            @update:inputValue="updateInputValue"
        ></AddForm>

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
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AddForm from '../components/AddForm.vue'
import { message } from 'ant-design-vue'

//router

const router = useRouter()

//user store
const userStore = useUserStore()
const { userData } = storeToRefs(userStore)

//database store
const dataBaseStore = useDataBase()
const { getUrls, addUrl, deleteUrl } = dataBaseStore
const { loadingDoc, loadingUrl, documents } = storeToRefs(dataBaseStore)

// geturls from database store when component is mounted
onMounted(() =>
{
    getUrls()
})


//const url = ref('')
const formValue = reactive({
    url: ''
})

//update input value
const updateInputValue = (value) =>
{
    formValue.url = value
}

//submit add url method from database store
const handleSubmit = async () =>
{
    const response = await addUrl(formValue.url)
    console.log(formValue.url)
    formValue.url = ''
    if (!response) {
        return message.success("URL agregada con éxito")
    }

    console.log('formulario')
}

//confirm delete url method from database store
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
//cancel delete url method from database store
const cancel = e =>
{
    message.error('No se elimino')
}

//copiar portapapeles
const copiarPortapapeles = async (id) =>
{
    const path = `${window.location.href}${id}`
    const err = await navigator.clipboard.writeText(path)
    if (err) {
        message.error(err)
    } else {
        message.success('Se copio en el portapapeles')
    }

}
</script>

