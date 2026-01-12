<template>
    <div class="mb-4">
        <div
            v-if="isAdmin"
            class="space-y-8 mb-4"
        >
            <DashboardAdminDashboard />
        </div>
        <div v-else>
            <DashboardNurseInformation
                :reports="reports.replacement"
                :tours="reports.tours"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useReports } from '~/composables/useReports';

const { reports, getReports } = useReports();

const { isAdmin } = useAuth();

useHead({ title: 'Tableau de bord' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'institution'],
});

await getReports();
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
