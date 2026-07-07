<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Suivi commercial" />

        <DashboardAdminPageContent>
            <CollaborationContractBanner
                v-if="!canManageSettings && collaborationStatus"
                class="mb-6 mx-4"
                :status="collaborationStatus"
            />
            <CommercialCareerStatusCard
                v-if="!canManageSettings"
                class="mb-6 mx-4"
                :status="careerStatus"
                :loading="careerLoading"
            />
            <CommissionVendorTracking
                v-if="canAccessTracking"
                :is-admin-view="canManageSettings"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import CommissionVendorTracking from '@/components/commissions/CommissionVendorTracking.vue';
import CommercialCareerStatusCard from '@/components/crm/CommercialCareerStatusCard.vue';
import CollaborationContractBanner from '@/components/crm/CollaborationContractBanner.vue';

const { getMyCareerStatus } = useInstitutionCrmSettings();
const { fetchMyCollaboration, status: collaborationStatus } = useCommercialCollaboration();
const careerStatus = ref<Awaited<ReturnType<typeof getMyCareerStatus>> | null>(null);
const careerLoading = ref(false);

useHead({ title: 'Suivi commercial' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { isAdmin, isSuperAdmin, isSaleRepresentative } = useAuth();

const canManageSettings = computed(() => isSuperAdmin.value || isAdmin.value);
const canAccessTracking = computed(() => canManageSettings.value || isSaleRepresentative.value);

onMounted(async () => {
    if (!canAccessTracking.value) {
        navigateTo('/dashboard/admin/users/crm', { replace: true });
        return;
    }

    if (!canManageSettings.value) {
        careerLoading.value = true;
        try {
            await fetchMyCollaboration();
            careerStatus.value = await getMyCareerStatus();
        }
        finally {
            careerLoading.value = false;
        }
    }
});
</script>
