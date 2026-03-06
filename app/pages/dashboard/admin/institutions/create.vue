<template>
    <div>
        <DashboardAdminPageHeader title="Nouvelle institution" />
        <DashboardAdminPageContent class="bg-gray-100">
            <InstitutionsAdminModalForm />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Nouvelle institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
