<template>
    <div>
        <DashboardAdminPageHeader title="Modifier le plan d'accès" />
        <DashboardAdminPageContent class="bg-gray-100">
            <SubscriptionAdminPlanForm
                v-if="plan"
                :plan="plan"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { AccessPlanAdmin } from '~/composables/useSubscriptionPlansAdmin';

definePageMeta({ layout: 'dashboard', middleware: ['admin'] });
useHead({ title: 'Modifier le plan d\'accès' });

const route = useRoute();
const { getPlan } = useSubscriptionPlansAdmin();
const plan = ref<AccessPlanAdmin | null>(null);

await getPlan(Number(route.params.id)).then((response) => {
    plan.value = response;
});
</script>
