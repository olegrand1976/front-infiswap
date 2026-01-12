<template>
    <div>
        <DashboardAdminPageHeader title="Nouvelle mission" />
        <DashboardAdminPageContent class="bg-gray-50">
            <MissionsAdminForm />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
useHead({ title: 'Créer une mission' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});
</script>
