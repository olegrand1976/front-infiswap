<template>
    <div>
        <DashboardAdminPageHeader title="Nouveau tutoriel" />

        <DashboardAdminPageContent class="bg-gray-100">
            <TutorialsAdminForm />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
useHead({ title: 'Nouveau tutoriel' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
