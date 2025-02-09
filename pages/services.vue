<template>
    <ErrorUnderConstruction />
</template>

<script lang="ts" setup>
useHead({
    title: 'Services',
})
definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});
</script>
