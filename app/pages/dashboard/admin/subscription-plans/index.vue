<template>
    <div class="h-fit w-full min-h-0 self-start">
        <DashboardAdminPageHeader title="Abonnement">
            <template #action>
                <Button
                    v-if="isSuperAdmin && currentTab"
                    class="rounded-lg shadow-sm"
                    :href="createHref"
                >
                    <CirclePlus class="h-4 w-4" />
                    <span class="hidden md:inline-block">Nouveau plan</span>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent class="h-fit w-full overflow-hidden">
            <div class="space-y-6 p-5 sm:p-6">
                <SubscriptionPlanSegmentTabs
                    v-if="tabs.length"
                    :model-value="selectedTabKey"
                    :tabs="tabs"
                    @update:model-value="selectTab"
                />

                <div
                    v-if="loading || loadedTabKey !== selectedTabKey"
                    class="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 py-12"
                >
                    <div class="mx-auto flex max-w-md flex-col items-center gap-3 px-4">
                        <Skeleton class="h-8 w-48 rounded-lg" />
                        <Skeleton class="h-24 w-full rounded-xl" />
                        <Skeleton class="h-10 w-32 rounded-lg" />
                    </div>
                </div>

                <SubscriptionAdminPlanTabPanel
                    v-else-if="currentTab"
                    :key="selectedTabKey"
                    :plan="activePlan"
                    :inactive-plans="inactivePlans"
                    :tab-key="currentTab.key"
                    :group="currentTab.group"
                    :feature="currentTab.feature"
                    @refresh="loadSelectedTab"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { CirclePlus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { resolveSubscriptionTab } from '~/composables/useSubscriptionPlansAdmin';

useHead({ title: 'Abonnement' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const route = useRoute();
const router = useRouter();
const { tabs, activePlan, inactivePlans, loadedTabKey, loading, loadTab } = useSubscriptionPlansAdmin();
const { isSuperAdmin } = useAuth();

function normalizeTabKey(tab: unknown): string {
    const value = typeof tab === 'string' ? tab.trim() : '';
    return value || 'access';
}

const selectedTabKey = computed(() => normalizeTabKey(route.query.tab));

const currentTab = computed(() => resolveSubscriptionTab(selectedTabKey.value));

const createHref = computed(() => {
    const params = new URLSearchParams({ tab: selectedTabKey.value });
    return `/dashboard/admin/subscription-plans/create?${params.toString()}`;
});

const loadSelectedTab = () => loadTab(selectedTabKey.value, true);

const selectTab = (key: string) => {
    router.replace({ query: { tab: key } });
};

watch(selectedTabKey, (tabKey) => {
    loadTab(tabKey);
}, { immediate: true });

onMounted(() => {
    if (!route.query.tab || String(route.query.tab).trim() === '') {
        router.replace({ query: { tab: 'access' } });
    }
});
</script>
