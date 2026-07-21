<template>
    <div class="w-full min-w-0">
        <DashboardAdminPageHeader title="Carte soignants & prospects" />

        <DashboardAdminPageContent>
            <div class="px-4 sm:px-5 py-4 space-y-4 min-w-0">
                <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div class="space-y-1">
                        <p class="text-sm text-gray-600">
                            Positionnement par code postal
                            <span
                                v-if="!loading"
                                class="text-gray-500"
                            >
                                —
                                <span class="inline-flex items-center gap-1.5 ml-1">
                                    <span
                                        class="inline-block size-2.5 rounded-full bg-teal-500"
                                        aria-hidden="true"
                                    />
                                    {{ placedNurses }} soignant{{ placedNurses > 1 ? 's' : '' }}
                                </span>
                                <span class="inline-flex items-center gap-1.5 ml-2">
                                    <span
                                        class="inline-block size-2.5 rounded-full bg-red-600"
                                        aria-hidden="true"
                                    />
                                    {{ placedInstitutions }} prospect{{ placedInstitutions > 1 ? 's' : '' }}
                                </span>
                                <template v-if="unresolvedCount + institutionUnresolvedCount > 0">
                                    · {{ unresolvedCount + institutionUnresolvedCount }} CP inconnu{{ unresolvedCount + institutionUnresolvedCount > 1 ? 's' : '' }}
                                </template>
                            </span>
                        </p>
                    </div>
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

                <form
                    class="flex flex-col sm:flex-row gap-2 sm:items-end"
                    @submit.prevent="onSearchAddress"
                >
                    <div class="flex-1 min-w-0 space-y-1">
                        <Label
                            for="map-address-search"
                            class="text-sm text-gray-500"
                        >
                            Adresse ou lieu (zoom ~25 km)
                        </Label>
                        <Input
                            id="map-address-search"
                            v-model="addressQuery"
                            type="search"
                            placeholder="Ex. 1000 Bruxelles, Rue de la Loi…"
                            class="w-full"
                            autocomplete="off"
                        />
                    </div>
                    <div class="flex gap-2 shrink-0">
                        <Button
                            type="submit"
                            :disabled="searchingAddress || !addressQuery.trim() || loading"
                        >
                            {{ searchingAddress ? 'Recherche…' : 'Centrer' }}
                        </Button>
                        <Button
                            v-if="hasFocus"
                            type="button"
                            variant="outline"
                            @click="onClearFocus"
                        >
                            Réinitialiser
                        </Button>
                    </div>
                </form>

                <p
                    v-if="error"
                    class="text-sm text-red-600"
                    role="alert"
                >
                    {{ error }}
                </p>
                <p
                    v-else-if="addressError"
                    class="text-sm text-red-600"
                    role="alert"
                >
                    {{ addressError }}
                </p>
                <p
                    v-else-if="addressHint"
                    class="text-sm text-gray-500"
                >
                    {{ addressHint }}
                </p>

                <div
                    v-if="loading"
                    class="h-[min(70vh,640px)] w-full rounded-md border border-gray-200 bg-gray-50 animate-pulse"
                    aria-busy="true"
                    aria-label="Chargement de la carte"
                />

                <ClientOnly v-else>
                    <AdminNursesResidenceMap
                        ref="mapRef"
                        :points="points"
                        :institution-points="institutionPoints"
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

useHead({ title: 'Carte soignants & prospects' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const COUNTRY_OPTIONS = [
    { value: 'be' as const, label: 'Belgique' },
    { value: 'fr' as const, label: 'France' },
];

type MapExpose = {
    focusAround: (lat: number, lng: number, radiusKm?: number) => Promise<void>;
    clearFocus: () => Promise<void>;
};

const { fetchMap, geocode } = useNursesMap();

const selectedCountry = ref<NursesMapCountry>('be');
const points = ref<NursesMapPoint[]>([]);
const institutionPoints = ref<NursesMapPoint[]>([]);
const unresolvedCount = ref(0);
const institutionUnresolvedCount = ref(0);
const loading = ref(true);
const error = ref<string | null>(null);

const addressQuery = ref('');
const searchingAddress = ref(false);
const addressError = ref<string | null>(null);
const addressHint = ref<string | null>(null);
const hasFocus = ref(false);
const mapRef = ref<MapExpose | null>(null);

const countryLabel = computed(
    () => COUNTRY_OPTIONS.find((o) => o.value === selectedCountry.value)?.label ?? '',
);

const placedNurses = computed(() =>
    points.value.reduce((sum, p) => sum + p.count, 0),
);

const placedInstitutions = computed(() =>
    institutionPoints.value.reduce((sum, p) => sum + p.count, 0),
);

const load = async () => {
    loading.value = true;
    error.value = null;
    hasFocus.value = false;
    addressHint.value = null;
    addressError.value = null;
    try {
        const data = await fetchMap(selectedCountry.value);
        points.value = data.points ?? [];
        unresolvedCount.value = data.unresolved_count ?? 0;
        institutionPoints.value = data.institution_points ?? [];
        institutionUnresolvedCount.value = data.institution_unresolved_count ?? 0;
    } catch (e) {
        points.value = [];
        institutionPoints.value = [];
        unresolvedCount.value = 0;
        institutionUnresolvedCount.value = 0;
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

const onSearchAddress = async () => {
    const query = addressQuery.value.trim();
    if (!query) {
        return;
    }

    if (!mapRef.value) {
        addressError.value = 'Carte pas encore prête, réessaie dans un instant.';
        return;
    }

    searchingAddress.value = true;
    addressError.value = null;
    addressHint.value = null;

    try {
        const result = await geocode(query, selectedCountry.value);

        if (!Number.isFinite(result.latitude) || !Number.isFinite(result.longitude)) {
            addressError.value = 'Coordonnées invalides pour ce lieu.';
            return;
        }

        await mapRef.value.focusAround(result.latitude, result.longitude, 25);
        hasFocus.value = true;
        addressHint.value = `Vue centrée (~25 km) : ${result.label}`;
    } catch (e) {
        addressError.value = getErrorMessage(e) || 'Recherche d\'adresse impossible.';
    } finally {
        searchingAddress.value = false;
    }
};

const onClearFocus = async () => {
    await mapRef.value?.clearFocus();
    hasFocus.value = false;
    addressHint.value = null;
    addressError.value = null;
};

onMounted(() => {
    void load();
});
</script>
