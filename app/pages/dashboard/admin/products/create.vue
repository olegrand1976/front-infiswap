<template>
    <div>
        <DashboardAdminPageHeader title="Nouveau produit" />
        <DashboardAdminPageContent class="bg-gray-100">
            <ProductsAdminModalForm />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
useHead({ title: 'Nouveau produit' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
