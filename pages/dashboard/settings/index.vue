<template>
    <ErrorUnderConstructDashboard />
</template>

<script setup>
definePageMeta({
    layout: 'dashboard',
    middleware: ['verified', 'subscribed'],
});

useHead({
    title: 'Paramètres',
});
</script>
