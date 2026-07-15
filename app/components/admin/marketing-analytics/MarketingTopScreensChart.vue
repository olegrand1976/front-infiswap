<template>
    <div class="h-full">
        <h3 class="mb-2 font-semibold text-sm text-gray-800">
            Écrans les plus consultés
        </h3>
        <div
            v-if="loading"
            class="h-72 rounded-md bg-gray-100 animate-pulse"
        />
        <div
            v-else-if="chartData.length === 0"
            class="rounded-md border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500 h-72 flex items-center justify-center"
        >
            Aucune page vue sur la période.
        </div>
        <ClientOnly v-else>
            <BarChart
                :data="chartData"
                index="label"
                :categories="['views']"
                :colors="['var(--chart-1, #2563eb)']"
                :legend-labels="['Vues']"
                :x-tick-rotation="-35"
                class="w-full bg-white rounded-md shadow-sm border border-gray-100 p-2 h-72"
            />
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { BarChart } from '@/components/ui/chart-bar';
import type { MarketingTopScreen } from '@/composables/useMarketingAnalytics';
import { shortenRoutePath } from '@/utils/analyticsRoutePath';

const props = defineProps<{
    screens: MarketingTopScreen[];
    loading?: boolean;
}>();

const chartData = computed(() => props.screens.map(screen => ({
    label: shortenRoutePath(screen.route_path, 36),
    route_path: screen.route_path,
    views: screen.views,
    unique_users: screen.unique_users,
})));
</script>
