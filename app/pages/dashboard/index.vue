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
                v-if="isAdmin || isCommunityManager"
                class="mb-4 space-y-8"
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
import { useReports } from '~/composables/useReports';

const { reports, getReports, loading } = useReports();
const { isAdmin, isCommunityManager } = useAuth();

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
