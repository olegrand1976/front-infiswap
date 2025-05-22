<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Mail" />
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Mail' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
