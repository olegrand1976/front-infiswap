<template>
    <div>
        <DashboardAdminPageHeader title="Nouveau plan d'abonnement" />
        <DashboardAdminPageContent class="bg-gray-100">
            <SubscriptionAdminPlanForm />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['admin'] });
useHead({ title: 'Nouveau plan d\'abonnement' });
</script>
