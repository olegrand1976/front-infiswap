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

                <div class="flex flex-wrap items-center gap-2">
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mr-1">
                        Couches
                    </p>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
                        :class="showNurses
                            ? 'border-teal-600 bg-teal-50 text-teal-800'
                            : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'"
                        :aria-pressed="showNurses"
                        @click="showNurses = !showNurses"
                    >
                        <span
                            class="inline-block size-2.5 rounded-full bg-teal-500"
                            aria-hidden="true"
                        />
                        Afficher infirmières
                    </button>
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
                        :class="showInstitutions
                            ? 'border-red-600 bg-red-50 text-red-800'
                            : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'"
                        :aria-pressed="showInstitutions"
                        @click="showInstitutions = !showInstitutions"
                    >
                        <span
                            class="inline-block size-2.5 rounded-full bg-red-600"
                            aria-hidden="true"
                        />
                        Afficher institutions
                    </button>
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
                            Adresse ou lieu
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
                    <div class="space-y-1 shrink-0">
                        <Label
                            id="map-radius-label"
                            class="text-sm text-gray-500"
                        >
                            Rayon
                        </Label>
                        <div
                            class="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5"
                            role="group"
                            aria-labelledby="map-radius-label"
                        >
                            <button
                                v-for="option in RADIUS_OPTIONS"
                                :key="option"
                                type="button"
                                class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                                :class="selectedRadiusKm === option
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-white'"
                                :aria-pressed="selectedRadiusKm === option"
                                @click="onRadiusChange(option)"
                            >
                                {{ option }} km
                            </button>
                        </div>
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

                <div class="relative h-[min(70vh,640px)] w-full">
                    <div
                        v-if="loading"
                        class="absolute inset-0 z-10 rounded-md border border-gray-200 bg-gray-50/90 animate-pulse"
                        aria-busy="true"
                        aria-label="Chargement de la carte"
                    />
                    <ClientOnly>
                        <NursesResidenceMap
                            ref="mapRef"
                            :points="points"
                            :institution-points="institutionPoints"
                            :country-label="countryLabel"
                            :show-nurses="showNurses"
                            :show-institutions="showInstitutions"
                            @select-point="onSelectPoint"
                        />
                    </ClientOnly>
                </div>

                <AdminMapZipEntitiesDialog
                    v-model:open="zipDialogOpen"
                    :zip="zipDialogZip"
                    :city="zipDialogCity"
                    :type="zipDialogType"
                    :loading="zipDialogLoading"
                    :error="zipDialogError"
                    :nurse-items="zipNurseItems"
                    :institution-items="zipInstitutionItems"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import AdminMapZipEntitiesDialog from '@/components/admin/AdminMapZipEntitiesDialog.vue';
import NursesResidenceMap, {
    type NursesMapSelectPointPayload,
} from '@/components/maps/NursesResidenceMap.vue';
import {
    type NursesMapCountry,
    type NursesMapPoint,
    type NursesMapPointType,
    type NursesMapZipInstitutionItem,
    type NursesMapZipNurseItem,
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

const RADIUS_OPTIONS = [5, 10, 25] as const;
type FocusRadiusKm = (typeof RADIUS_OPTIONS)[number];

type MapExpose = {
    focusAround: (lat: number, lng: number, radiusKm?: number) => Promise<void>;
    clearFocus: () => Promise<void>;
};

const { fetchMap, geocode, fetchZipList } = useNursesMap();

const selectedCountry = ref<NursesMapCountry>('be');
const selectedRadiusKm = ref<FocusRadiusKm>(10);
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
const lastFocus = ref<{
    latitude: number;
    longitude: number;
    label: string;
} | null>(null);
const mapRef = ref<MapExpose | null>(null);
const showNurses = ref(true);
const showInstitutions = ref(true);

const zipDialogOpen = ref(false);
const zipDialogZip = ref('');
const zipDialogCity = ref('');
const zipDialogType = ref<NursesMapPointType>('nurses');
const zipDialogLoading = ref(false);
const zipDialogError = ref<string | null>(null);
const zipNurseItems = ref<NursesMapZipNurseItem[]>([]);
const zipInstitutionItems = ref<NursesMapZipInstitutionItem[]>([]);
let zipListRequestId = 0;

const countryLabel = computed(
    () => COUNTRY_OPTIONS.find(o => o.value === selectedCountry.value)?.label ?? '',
);

const placedNurses = computed(() =>
    points.value.reduce((sum, p) => sum + p.count, 0),
);

const placedInstitutions = computed(() =>
    institutionPoints.value.reduce((sum, p) => sum + p.count, 0),
);

const clearFocusState = () => {
    hasFocus.value = false;
    lastFocus.value = null;
    addressHint.value = null;
    addressError.value = null;
};

const applyFocus = async (
    latitude: number,
    longitude: number,
    label: string,
    radiusKm: FocusRadiusKm = selectedRadiusKm.value,
) => {
    if (!mapRef.value) {
        return;
    }
    await mapRef.value.focusAround(latitude, longitude, radiusKm);
    lastFocus.value = { latitude, longitude, label };
    hasFocus.value = true;
    addressHint.value = `Vue centrée (~${radiusKm} km) : ${label}`;
};

const load = async () => {
    loading.value = true;
    error.value = null;
    addressHint.value = null;
    addressError.value = null;
    if (hasFocus.value) {
        clearFocusState();
        await mapRef.value?.clearFocus();
    }
    try {
        const data = await fetchMap(selectedCountry.value);
        points.value = data.points ?? [];
        unresolvedCount.value = data.unresolved_count ?? 0;
        institutionPoints.value = data.institution_points ?? [];
        institutionUnresolvedCount.value = data.institution_unresolved_count ?? 0;
    }
    catch (e) {
        points.value = [];
        institutionPoints.value = [];
        unresolvedCount.value = 0;
        institutionUnresolvedCount.value = 0;
        error.value = getErrorMessage(e) || 'Impossible de charger la carte.';
    }
    finally {
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

        await applyFocus(result.latitude, result.longitude, result.label);
    }
    catch (e) {
        addressError.value = getErrorMessage(e) || 'Recherche d\'adresse impossible.';
    }
    finally {
        searchingAddress.value = false;
    }
};

const onRadiusChange = (radiusKm: FocusRadiusKm) => {
    if (selectedRadiusKm.value === radiusKm) {
        return;
    }
    selectedRadiusKm.value = radiusKm;
    const focus = lastFocus.value;
    if (!hasFocus.value || !focus || !mapRef.value) {
        return;
    }
    void applyFocus(focus.latitude, focus.longitude, focus.label, radiusKm);
};

const onClearFocus = async () => {
    await mapRef.value?.clearFocus();
    clearFocusState();
};

const onSelectPoint = async (payload: NursesMapSelectPointPayload) => {
    const requestId = ++zipListRequestId;
    zipDialogZip.value = payload.zip;
    zipDialogCity.value = payload.city;
    zipDialogType.value = payload.type;
    zipDialogOpen.value = true;
    zipDialogLoading.value = true;
    zipDialogError.value = null;
    zipNurseItems.value = [];
    zipInstitutionItems.value = [];

    try {
        const data = await fetchZipList(selectedCountry.value, payload.zip, payload.type);
        if (requestId !== zipListRequestId) {
            return;
        }
        if (data.city) {
            zipDialogCity.value = data.city;
        }
        switch (payload.type) {
            case 'institutions':
                zipInstitutionItems.value = (data.items as NursesMapZipInstitutionItem[]) ?? [];
                break;
            case 'nurses':
                zipNurseItems.value = (data.items as NursesMapZipNurseItem[]) ?? [];
                break;
            default: {
                const _exhaustive: never = payload.type;
                return _exhaustive;
            }
        }
    }
    catch (e) {
        if (requestId !== zipListRequestId) {
            return;
        }
        zipDialogError.value = getErrorMessage(e) || 'Impossible de charger la liste.';
    }
    finally {
        if (requestId === zipListRequestId) {
            zipDialogLoading.value = false;
        }
    }
};

onMounted(() => {
    void load();
});
</script>
