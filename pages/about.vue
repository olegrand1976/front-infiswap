<template>
    <ErrorUnderConstruction />
</template>

<script lang="ts" setup>
useHead({
    title: 'A-propos',
})
definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});
</script>
