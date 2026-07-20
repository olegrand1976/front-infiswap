<template>
    <div class="mb-4">
        <DashboardAdminSkeleton
            v-if="(pending || loading) && (isAdmin || isCommunityManager)"
        />
        <DashboardNurseSkeleton
            v-else-if="pending || loading"
        />

        <template v-else>
            <div
                v-if="canAccessMarketingAnalytics"
                class="mb-4"
            >
                <NuxtLink
                    to="/dashboard/admin/marketing-analytics"
                    class="flex items-center justify-between gap-3 rounded-md border border-gray-100 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-gray-50"
                >
                    <span class="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <BarChart3
                            class="size-4 shrink-0 text-primary"
                            aria-hidden="true"
                        />
                        Suivi marketing & fréquentation
                    </span>
                    <span class="text-xs font-medium text-primary">
                        Ouvrir →
                    </span>
                </NuxtLink>
            </div>
            <div
                v-if="isAdmin || isCommunityManager"
                class="mb-4 space-y-4"
            >
                <DashboardAdminDashboard />
            </div>
            <div v-else-if="reports">
                <DashboardNurseInformation
                    :reports="reports.replacement"
                    :tours="reports.tours"
                />
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { BarChart3 } from 'lucide-vue-next';
import { useReports } from '~/composables/useReports';

const { reports, getReports, loading } = useReports();
const { isAdmin, isCommunityManager, canAccessMarketingAnalytics } = useAuth();

useHead({ title: 'Tableau de bord' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified', 'institution'],
});

const { pending } = useAsyncData('dashboard-reports', () => getReports(), {
    server: false,
    lazy: true,
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 1px;
}

.no-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.no-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.no-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
</style>
