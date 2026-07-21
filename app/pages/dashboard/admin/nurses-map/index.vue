<template>
    <div class="w-full min-w-0">
        <DashboardAdminPageHeader title="Carte des infirmières" />

        <DashboardAdminPageContent>
            <div class="px-4 sm:px-5 py-4 space-y-4 min-w-0">
                <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <p class="text-sm text-gray-600">
                        Positionnement par code postal de résidence
                        <span
                            v-if="!loading"
                            class="text-gray-500"
                        >
                            — {{ placedCount }} placé{{ placedCount > 1 ? 's' : '' }}
                            <template v-if="unresolvedCount > 0">
                                · {{ unresolvedCount }} CP inconnu{{ unresolvedCount > 1 ? 's' : '' }}
                            </template>
                        </span>
                    </p>
                    <div
                        class="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5"
                        role="group"
                        aria-label="Pays"
                    >
                        <button
                            v-for="option in COUNTRY_OPTIONS"
                            :key="option.value"
                            type="button"
                            class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                            :class="selectedCountry === option.value
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-gray-600 hover:bg-white'"
                            :aria-pressed="selectedCountry === option.value"
                            @click="onCountryChange(option.value)"
                        >
                            {{ option.label }}
                        </button>
                    </div>
                </div>

                <p
                    v-if="error"
                    class="text-sm text-red-600"
                    role="alert"
                >
                    {{ error }}
                </p>

                <div
                    v-if="loading"
                    class="h-[min(70vh,640px)] w-full rounded-md border border-gray-200 bg-gray-50 animate-pulse"
                    aria-busy="true"
                    aria-label="Chargement de la carte"
                />

                <ClientOnly v-else>
                    <AdminNursesResidenceMap
                        :points="points"
                        :country-label="countryLabel"
                    />
                </ClientOnly>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import AdminNursesResidenceMap from '@/components/admin/NursesResidenceMap.vue';
import {
    type NursesMapCountry,
    type NursesMapPoint,
    useNursesMap,
} from '@/composables/useNursesMap';
import { getErrorMessage } from '~/lib/utils';

useHead({ title: 'Carte des infirmières' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const COUNTRY_OPTIONS = [
    { value: 'be' as const, label: 'Belgique' },
    { value: 'fr' as const, label: 'France' },
];

const { fetchMap } = useNursesMap();

const selectedCountry = ref<NursesMapCountry>('be');
const points = ref<NursesMapPoint[]>([]);
const unresolvedCount = ref(0);
const loading = ref(true);
const error = ref<string | null>(null);

const countryLabel = computed(
    () => COUNTRY_OPTIONS.find((o) => o.value === selectedCountry.value)?.label ?? '',
);

const placedCount = computed(() =>
    points.value.reduce((sum, p) => sum + p.count, 0),
);

const load = async () => {
    loading.value = true;
    error.value = null;
    try {
        const data = await fetchMap(selectedCountry.value);
        points.value = data.points ?? [];
        unresolvedCount.value = data.unresolved_count ?? 0;
    } catch (e) {
        points.value = [];
        unresolvedCount.value = 0;
        error.value = getErrorMessage(e) || 'Impossible de charger la carte.';
    } finally {
        loading.value = false;
    }
};

const onCountryChange = (country: NursesMapCountry) => {
    if (selectedCountry.value === country) {
        return;
    }
    selectedCountry.value = country;
    void load();
};

onMounted(() => {
    void load();
});
</script>
