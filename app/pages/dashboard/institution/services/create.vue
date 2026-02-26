<template>
    <div>
        <DashboardAdminPageHeader title="Nouveau service" />
        <DashboardAdminPageContent class="bg-gray-50">
            <ServicesAdminForm />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
useHead({ title: 'Créer un service' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});
</script>
