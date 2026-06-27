<template>
    <div>
        <DashboardAdminPageHeader title="Abonnement">
            <template #action>
                <Button
                    v-if="isSuperAdmin && currentTab"
                    class="rounded"
                    :href="createHref"
                >
                    <CirclePlus />
                    <span class="hidden md:inline-block">Nouveau plan</span>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div
                v-if="tabs.length"
                class="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto"
            >
                <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    type="button"
                    class="px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px"
                    :class="selectedTabKey === tab.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'"
                    @click="selectTab(tab.key)"
                >
                    {{ tab.label }}
                </button>
            </div>

            <div
                v-if="loading || loadedTabKey !== selectedTabKey"
                class="flex justify-center py-16"
            >
                <Skeleton class="h-48 w-full max-w-lg rounded-xl" />
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
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { CirclePlus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
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

const selectedTabKey = computed(() => (route.query.tab as string) || 'access');
const currentTab = computed(() => resolveSubscriptionTab(selectedTabKey.value));

const createHref = computed(() => {
    const params = new URLSearchParams({ tab: selectedTabKey.value });
    return `/dashboard/admin/subscription-plans/create?${params.toString()}`;
});

const loadSelectedTab = () => loadTab(selectedTabKey.value);

const selectTab = (key: string) => {
    router.replace({ query: { tab: key } });
};

watch(selectedTabKey, (tabKey) => {
    loadTab(tabKey);
}, { immediate: true });
</script>
