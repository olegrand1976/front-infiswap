<template>
    <ErrorUnderConstructDashboard />
</template>

<script setup>
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified', 'subscribed'],
});

useHead({
    title: 'Paramètres',
});
</script>
