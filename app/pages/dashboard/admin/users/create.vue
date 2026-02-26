<template>
    <div>
        <DashboardAdminPageHeader title="Nouvel utilisateur" />
        <DashboardAdminPageContent class="bg-gray-100">
            <UsersAdminForm />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Nouvel utilisateur' });

definePageMeta({
    layout: 'dashboard',
});
</script>
