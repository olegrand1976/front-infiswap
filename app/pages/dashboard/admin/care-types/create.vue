<template>
    <div>
        <DashboardAdminPageHeader title="Nouvelle type de soin" />
        <DashboardAdminPageContent class="bg-gray-100">
            <CareTypesAdminModalForm />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Nouvelle type de soin' });

definePageMeta({
    layout: 'dashboard',
});
</script>
