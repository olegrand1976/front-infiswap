<template>
    <div class="h-full">
        <h3 class="mb-2 font-semibold text-sm text-gray-800">
            Écrans les plus consultés
        </h3>
        <p class="mb-3 text-xs text-gray-500">
            Pages produit les plus vues (hors espace admin), classées par nombre de consultations.
        </p>
        <div
            v-if="loading"
            class="h-40 rounded-md bg-gray-100 animate-pulse"
        />
        <div
            v-else-if="screens.length === 0"
            class="rounded-md border border-dashed border-gray-200 p-6 text-sm text-gray-500 flex items-center justify-center"
        >
            Aucune page vue sur la période.
        </div>
        <template v-else>
            <ul class="divide-y divide-gray-100 rounded-md border border-gray-200 bg-white">
                <li
                    v-for="(screen, rank) in visibleScreens"
                    :key="screen.route_path"
                    class="flex items-start justify-between gap-3 px-3 py-2 text-sm"
                >
                    <div class="min-w-0">
                        <p class="font-medium text-gray-800 truncate" :title="screen.route_path">
                            <span class="mr-2 text-xs text-gray-400">{{ rank + 1 }}.</span>
                            {{ screen.route_path }}
                        </p>
                        <p class="text-xs text-gray-500">
                            {{ screen.unique_users }} utilisateur{{ screen.unique_users > 1 ? 's' : '' }} unique{{ screen.unique_users > 1 ? 's' : '' }}
                        </p>
                    </div>
                    <span class="shrink-0 font-semibold tabular-nums text-gray-900">
                        {{ screen.views }} vues
                    </span>
                </li>
            </ul>

            <button
                v-if="canExpand"
                type="button"
                class="mt-3 text-sm font-medium text-teal-700 hover:text-teal-800 hover:underline"
                @click="expanded = !expanded"
            >
                {{ expanded ? 'Réduire la liste' : `Afficher plus (${hiddenCount} routes)` }}
            </button>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { MarketingTopScreen } from '@/composables/useMarketingAnalytics';

const PREVIEW_COUNT = 10;

const props = defineProps<{
    screens: MarketingTopScreen[];
    loading?: boolean;
}>();

const expanded = ref(false);

const canExpand = computed(() => props.screens.length > PREVIEW_COUNT);
const hiddenCount = computed(() => Math.max(0, props.screens.length - PREVIEW_COUNT));

const visibleScreens = computed(() => (
    expanded.value ? props.screens : props.screens.slice(0, PREVIEW_COUNT)
));

watch(() => props.screens, () => {
    expanded.value = false;
});
</script>
