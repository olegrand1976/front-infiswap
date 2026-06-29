<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Paramètres commissions BC institution" />

        <DashboardAdminPageContent>
            <CommissionRatePeriodsForm
                v-if="canManageSettings && settingsForm"
                v-model="settingsForm"
                :saving="savingSettings"
                @save="saveSettings"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import CommissionRatePeriodsForm from '@/components/commissions/CommissionRatePeriodsForm.vue';
import type { InstitutionCommissionSettingsPayload } from '@/composables/useInstitutionCommissionTracking';

useHead({ title: 'Paramètres commissions BC institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const route = useRoute();
const { isAdmin, isSuperAdmin } = useAuth();
const { getCommissionSettings, updateCommissionSettings } = useInstitutionCommissionTracking();
const { $toast } = useNuxtApp();

const trackingPath = '/dashboard/admin/institution-commission-tracking';

const canManageSettings = computed(() => isSuperAdmin.value || isAdmin.value);
const settingsForm = ref<InstitutionCommissionSettingsPayload | null>(null);
const savingSettings = ref(false);

function redirectToTracking() {
    return navigateTo(trackingPath, { replace: true });
}

watch(
    () => route.query.tab,
    (tab) => {
        if (typeof tab === 'string' && ['tracking', 'my-tracking'].includes(tab)) {
            redirectToTracking();
        }
    },
    { immediate: true },
);

onMounted(async () => {
    if (!canManageSettings.value) {
        await redirectToTracking();
        return;
    }

    settingsForm.value = await getCommissionSettings();
});

async function saveSettings() {
    if (!settingsForm.value) return;
    savingSettings.value = true;
    try {
        await updateCommissionSettings(settingsForm.value);
        settingsForm.value = await getCommissionSettings();
        $toast({ description: 'Paramètres enregistrés.' });
    }
    catch {
        $toast({ description: 'Erreur lors de l\'enregistrement.', variant: 'destructive' });
    }
    finally {
        savingSettings.value = false;
    }
}
</script>
