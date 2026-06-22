<template>
    <div>
        <DashboardAdminPageHeader title="Modifier le plan" />
        <DashboardAdminPageContent class="bg-gray-100">
            <SubscriptionAdminPlanForm :plan="plan" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['admin'] });
useHead({ title: 'Modifier le plan' });

const route = useRoute();
const { getPlan } = useSubscriptionPlansAdmin();
const plan = await getPlan(Number(route.params.id));
</script>
