<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Attribuer un bon de commande"
        />

        <DashboardAdminPageContent class="bg-gray-100">
            <ContractsAdminForm />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
useHead({ title: 'Attribuer un bon de commande' });
definePageMeta({ layout: 'dashboard', middleware: ['auth', 'verified'] });
</script>
