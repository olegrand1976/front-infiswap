<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Suivi commercial" />

        <DashboardAdminPageContent>
            <CommissionVendorTracking
                v-if="canAccessTracking"
                :is-admin-view="canManageSettings"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import CommissionVendorTracking from '@/components/commissions/CommissionVendorTracking.vue';

useHead({ title: 'Suivi commercial' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { isAdmin, isSuperAdmin, isSaleRepresentative } = useAuth();

const canManageSettings = computed(() => isSuperAdmin.value || isAdmin.value);
const canAccessTracking = computed(() => canManageSettings.value || isSaleRepresentative.value);

onMounted(() => {
    if (!canAccessTracking.value) {
        navigateTo('/dashboard/admin/users/crm', { replace: true });
    }
});
</script>
