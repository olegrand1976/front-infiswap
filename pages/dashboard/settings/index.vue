<template>
    <ErrorUnderConstructDashboard />
</template>

<script>
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
});

useHead({
    title: 'Paramètres',
});
</script>
