<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Commissions BC institution" />

        <DashboardAdminPageContent>
            <Tabs
                v-model="activeTab"
                :default-value="defaultTab"
                class="w-full"
            >
                <TabsList class="mx-4 mt-2">
                    <TabsTrigger
                        v-if="canManageSettings"
                        value="settings"
                    >
                        Paramètres
                    </TabsTrigger>
                    <TabsTrigger
                        v-if="canManageSettings"
                        value="tracking"
                    >
                        Suivi vendeurs
                    </TabsTrigger>
                    <TabsTrigger
                        v-if="isSaleRepresentative && !canManageSettings"
                        value="my-tracking"
                    >
                        Mon suivi
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    v-if="canManageSettings"
                    value="settings"
                >
                    <CommissionRatePeriodsForm
                        v-model="settingsForm"
                        :saving="savingSettings"
                        @save="saveSettings"
                    />
                </TabsContent>

                <TabsContent
                    v-if="canManageSettings"
                    value="tracking"
                >
                    <CommissionVendorTracking is-admin-view />
                </TabsContent>

                <TabsContent
                    v-if="isSaleRepresentative && !canManageSettings"
                    value="my-tracking"
                >
                    <CommissionVendorTracking />
                </TabsContent>
            </Tabs>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommissionRatePeriodsForm from '@/components/commissions/CommissionRatePeriodsForm.vue';
import CommissionVendorTracking from '@/components/commissions/CommissionVendorTracking.vue';
import type { InstitutionCommissionSettingsPayload } from '@/composables/useInstitutionCommissionTracking';

useHead({ title: 'Commissions BC institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const route = useRoute();
const { isAdmin, isSuperAdmin, isSaleRepresentative } = useAuth();
const { getCommissionSettings, updateCommissionSettings } = useInstitutionCommissionTracking();
const { $toast } = useNuxtApp();

const canManageSettings = computed(() => isSuperAdmin.value || isAdmin.value);
const settingsForm = ref<InstitutionCommissionSettingsPayload | null>(null);
const savingSettings = ref(false);

const defaultTab = computed(() => {
    if (canManageSettings.value) {
        return 'settings';
    }
    return 'my-tracking';
});

const activeTab = ref(defaultTab.value);

watch(defaultTab, (value) => {
    if (!canManageSettings.value) {
        activeTab.value = value;
    }
});

watch(
    () => route.query.tab,
    (tab) => {
        if (typeof tab === 'string' && ['settings', 'tracking', 'my-tracking'].includes(tab)) {
            activeTab.value = tab;
        }
    },
    { immediate: true },
);

onMounted(async () => {
    if (canManageSettings.value) {
        settingsForm.value = await getCommissionSettings();
    }
    else if (isSaleRepresentative.value) {
        activeTab.value = 'my-tracking';
    }
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
