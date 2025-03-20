<template>
    <ErrorUnderConstructDashboard />
</template>

<script setup>
definePageMeta({
    layout: 'dashboard',
    middleware: ['verified'],
});

useHead({
    title: 'Paramètres',
});
</script>
