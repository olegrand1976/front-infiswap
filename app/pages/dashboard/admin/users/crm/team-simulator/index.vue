<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Simulateur équipe MLM" />

        <DashboardAdminPageContent>
            <TeamIntegrationSimulator v-if="canAccess" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import TeamIntegrationSimulator from '@/components/crm/TeamIntegrationSimulator.vue';

useHead({ title: 'Simulateur équipe MLM' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { isAdmin, isSuperAdmin, isSaleRepresentative, isCommunityManager } = useAuth();

const canAccess = computed(() =>
    isSuperAdmin.value
    || isAdmin.value
    || isSaleRepresentative.value
    || isCommunityManager.value,
);

onMounted(() => {
    if (!canAccess.value) {
        navigateTo('/dashboard/admin/users/crm', { replace: true });
    }
});
</script>
