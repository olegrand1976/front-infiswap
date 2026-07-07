<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Paramètres BC institution" />

        <DashboardAdminPageContent>
            <div
                v-if="loading && !settingsForm"
                class="p-8 text-center text-sm text-muted-foreground"
            >
                Chargement…
            </div>

            <Tabs
                v-else-if="settingsForm"
                :model-value="selectedTab"
                class="w-full"
                @update:model-value="selectTab"
            >
                <TabsList class="mb-4 w-full justify-start">
                    <TabsTrigger
                        value="periods"
                        class="md:w-40"
                    >
                        Périodes
                    </TabsTrigger>
                    <TabsTrigger
                        value="general"
                        class="md:w-40"
                    >
                        Général
                    </TabsTrigger>
                    <TabsTrigger
                        value="grades"
                        class="md:w-40"
                    >
                        Grades
                    </TabsTrigger>
                    <TabsTrigger
                        value="commercials"
                        class="md:w-40"
                    >
                        Commerciaux
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="periods">
                    <CommissionRatePeriodsForm
                        v-model="periodsForm"
                        :saving="saving"
                        @save="saveSettings('periods')"
                    />
                </TabsContent>

                <TabsContent value="general">
                    <InstitutionCrmGeneralTab
                        v-model="settingsForm.general"
                        :saving="saving"
                        @save="saveSettings('general')"
                    />
                </TabsContent>

                <TabsContent value="grades">
                    <InstitutionCrmCareerGradesTab
                        v-model="settingsForm.grades"
                        :saving="saving"
                        @save="saveSettings('grades')"
                    />
                </TabsContent>

                <TabsContent value="commercials">
                    <InstitutionCrmCommercialsTab :grades="settingsForm.grades" />
                </TabsContent>
            </Tabs>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import CommissionRatePeriodsForm from '@/components/commissions/CommissionRatePeriodsForm.vue';
import InstitutionCrmCareerGradesTab from '@/components/crm/InstitutionCrmCareerGradesTab.vue';
import InstitutionCrmCommercialsTab from '@/components/crm/InstitutionCrmCommercialsTab.vue';
import InstitutionCrmGeneralTab from '@/components/crm/InstitutionCrmGeneralTab.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { InstitutionCommissionSettingsPayload } from '@/composables/useInstitutionCommissionTracking';
import type { InstitutionCrmSettingsPayload, InstitutionCrmSettingsSection } from '@/composables/useInstitutionCrmSettings';

useHead({ title: 'Paramètres BC institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const route = useRoute();
const router = useRouter();
const { isAdmin, isSuperAdmin } = useAuth();
const { getSettings, updateSettings, loading } = useInstitutionCrmSettings();
const { $toast } = useNuxtApp();

const VALID_TABS = ['periods', 'general', 'grades', 'commercials'] as const;
type SettingsTab = typeof VALID_TABS[number];

const canManageSettings = computed(() => isSuperAdmin.value || isAdmin.value);
const settingsForm = ref<InstitutionCrmSettingsPayload | null>(null);
const saving = ref(false);

const selectedTab = computed<SettingsTab>(() => {
    const tab = typeof route.query.tab === 'string' ? route.query.tab : 'periods';
    return VALID_TABS.includes(tab as SettingsTab) ? tab as SettingsTab : 'periods';
});

const periodsForm = computed<InstitutionCommissionSettingsPayload | null>({
    get: () => (settingsForm.value ? { periods: settingsForm.value.periods } : null),
    set: (value) => {
        if (settingsForm.value && value) {
            settingsForm.value.periods = value.periods;
        }
    },
});

function selectTab(tab: string | number) {
    router.replace({ query: { tab: String(tab) } });
}

async function loadSettings() {
    settingsForm.value = await getSettings();
}

async function saveSettings(section: InstitutionCrmSettingsSection) {
    if (!settingsForm.value) return;
    saving.value = true;
    try {
        const payload: Partial<InstitutionCrmSettingsPayload> = {
            [section]: settingsForm.value[section],
        };
        settingsForm.value = await updateSettings(payload);
        $toast({ description: 'Paramètres enregistrés.' });
    }
    catch {
        $toast({ description: 'Erreur lors de l\'enregistrement.', variant: 'destructive' });
    }
    finally {
        saving.value = false;
    }
}

onMounted(async () => {
    if (!canManageSettings.value) {
        await navigateTo('/dashboard/admin/institution-commission-tracking', { replace: true });
        return;
    }

    if (!route.query.tab) {
        router.replace({ query: { tab: 'periods' } });
    }

    await loadSettings();
});
</script>
