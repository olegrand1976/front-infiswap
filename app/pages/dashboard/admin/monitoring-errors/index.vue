<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Logs">
            <template #action>
                <Button
                    class="rounded cursor-pointer"
                    @click="refresh"
                >
                    <Icon name="RefreshCw" />
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent class="space-y-6">
            <div class="bg-white rounded-lg border p-4 text-sm text-gray-600">
                <span class="font-medium text-gray-800">Laravel.log:</span>
                {{ laravelLogsTotal }} entree(s) trouvee(s),
                {{ laravelLogs.length }} affichee(s).
            </div>

            <div class="relative min-h-[220px]">
                <div
                    v-if="isLoadingLaravelLogs"
                    class="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]"
                >
                    <RollingLoader :loading="isLoadingLaravelLogs" />
                </div>

                <div
                    class="space-y-4 transition-opacity"
                    :class="{ 'opacity-60': isLoadingLaravelLogs }"
                >
                    <div
                        v-for="item in laravelLogs"
                        :key="item.id"
                        class="bg-white rounded-lg border p-4"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <div class="font-semibold">
                                {{ formatToDMY(item.datetime, true) }}
                            </div>
                            <span
                                class="text-xs px-2 py-1 rounded border uppercase"
                                :class="getLevelClass(item.level)"
                            >
                                {{ item.level }}
                            </span>
                        </div>
                        <div class="mt-2 text-sm">
                            <div class="font-medium">
                                {{ item.message }}
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                Env: {{ item.environment }}
                            </div>
                        </div>
                        <pre
                            v-if="item.details"
                            class="mt-3 text-xs bg-gray-50 border rounded p-3 overflow-x-auto whitespace-pre-wrap break-words"
                        >{{ item.details }}</pre>
                    </div>

                    <div
                        v-if="laravelLogs.length === 0"
                        class="bg-white rounded-lg border p-8 text-center text-gray-500"
                    >
                        Aucune entree detectee dans laravel.log.
                    </div>
                </div>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import RollingLoader from '~/components/RollingLoader.vue';
import { formatToDMY } from '~/composables/useDate';

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

useHead({ title: 'logs - Laravel' });

const { isAdmin, isDeveloper } = useAuth();
const {
    laravelLogs,
    laravelLogsTotal,
    isLoadingLaravelLogs,
    getLaravelLogErrors,
} = useMonitoring();

if (!isAdmin.value && !isDeveloper.value) {
    await navigateTo('/dashboard/admin', { replace: true });
}

const fetchData = async () => {
    await getLaravelLogErrors(50);
};

const refresh = async () => {
    await fetchData();
};

const getLevelClass = (level?: string | null) => {
    const normalized = (level ?? '').toString().toLowerCase();
    if (
        normalized.includes('error')
        || normalized.includes('critical')
        || normalized.includes('alert')
    ) {
        return 'bg-destructive text-destructive-foreground border-destructive/60';
    }

    if (normalized.includes('warning') || normalized.includes('warn')) {
        return 'bg-warning text-warning-foreground border-warning/60';
    }

    if (normalized.includes('info') || normalized.includes('notice')) {
        return 'bg-info text-info-foreground border-info/60';
    }

    if (normalized.includes('debug')) {
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }

    return 'bg-slate-50 text-slate-700 border-slate-200';
};

await fetchData();
</script>
