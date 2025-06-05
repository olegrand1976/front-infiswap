<template>
    <div>
        <DashboardAdminPageHeader title="Nouvel texte d’accueil" />
        <DashboardAdminPageContent class="bg-gray-100">
            <HomeAdminModalForm />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Nouvel texte d’accueil' });

definePageMeta({
    layout: 'dashboard',
});
</script>
