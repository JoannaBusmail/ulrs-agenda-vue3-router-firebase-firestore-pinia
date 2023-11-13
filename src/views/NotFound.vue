<template>
    <h1> Not found - 404</h1>
    <a-form-item>
        <a-button
            type="primary"
            @click="back"
        >
            Back
        </a-button>
    </a-form-item>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const back = () =>
{
    router.push('/')
}
</script>