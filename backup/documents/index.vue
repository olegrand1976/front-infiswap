<template>
    <ErrorUnderConstructDashboard />
</template>

<script setup>
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

useHead({
    title: 'Documents',
});
</script>
