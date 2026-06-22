<template>
    <div>
        <DashboardAdminPageHeader title="Modifier le plan" />
        <DashboardAdminPageContent class="bg-gray-100">
            <SubscriptionAdminPlanForm
                v-if="plan"
                :plan="plan"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { StripePlan } from '~/composables/useSubscriptionPlansAdmin';

definePageMeta({ layout: 'dashboard', middleware: ['admin'] });
useHead({ title: 'Modifier le plan' });

const route = useRoute();
const { getPlan } = useSubscriptionPlansAdmin();
const plan = ref<StripePlan | null>(null);

await getPlan(Number(route.params.id)).then((response) => {
    plan.value = response;
});
</script>
