<template>
    <ErrorUnderConstructDashboard />
</template>

<script>
definePageMeta({
    layout: 'dashboard',
    middleware: 'verified',
});

useHead({
    title: 'Documents',
});
</script>
