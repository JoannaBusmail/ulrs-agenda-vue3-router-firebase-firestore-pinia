<template>
    <a-form
        :model="formValue"
        @finish="handleSubmit"
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
            <a-input
                v-model:value="formValue.url"
                @change="updateInputValue"
            ></a-input>
        </a-form-item>

        <a-form-item>
            <a-button
                type="primary"
                html-type="submit"
                :loading="loadingUrl"
                :disabled="loadingUrl"
            >{{ buttonName }}</a-button>
        </a-form-item>
    </a-form>
</template>
  
<script setup>
import { reactive } from "vue"
import { storeToRefs } from 'pinia'
import { useDataBase } from '../store/dataBase'

//store
const dataBaseStore = useDataBase()
const { loadingUrl } = storeToRefs(dataBaseStore)

//props
const props = defineProps([ "formValue", "buttonName" ])

//emits
const emit = defineEmits([ "onFinish", "update:inputValue" ])

//reactive
const formState = reactive({
    url: ""
})

//update input value
const updateInputValue = (event) =>
{
    const value = event.target.value
    emit("update:inputValue", value)
    formState.url = value
}

//submit
const handleSubmit = () =>
{
    emit("onFinish", formState.url)
    formState.url = ''
};

</script>