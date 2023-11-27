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

//routes
const route = useRoute()

//database store
const dataBaseStore = useDataBase()
const { readUrl, updateUrl } = dataBaseStore

//reactive
const formValue = reactive({
    url: ''
})

// read url through route params
// and update input value
onMounted(async () =>
{
    const url = await readUrl(route.params.id)
    updateInputValue(url)
})

//update input value
const updateInputValue = (value) =>
{
    formValue.url = value
}

//submit update url method from database store
const handleSubmit = async () =>
{
    const response = await updateUrl(route.params.id, formValue.url)

    if (!response) {
        return message.success("URL editada con éxito")
    }
    formValue.url = ''
}
</script>