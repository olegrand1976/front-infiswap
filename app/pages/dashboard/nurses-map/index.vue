<template>
    <div class="w-full min-w-0 lg:ml-20 xl:ml-0">
        <div class="mt-6 flex items-center gap-2 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
            <h1 class="py-3 text-primary font-bold">
                Carte <strong>infirmières</strong>
            </h1>
        </div>

        <div class="mt-6 space-y-4 px-1 sm:px-0">
            <p class="text-sm text-muted-foreground">
                Densité du réseau soignant en
                <span class="font-medium text-foreground">{{ countryLabel }}</span>
                (agrégation par code postal). Zoomez pour explorer —
                les points ne sont pas cliquables.
                <span
                    v-if="!loading && placedCount > 0"
                    class="text-teal-800"
                >
                    — {{ placedCount }} soignant{{ placedCount > 1 ? 's' : '' }}
                </span>
            </p>

            <div class="relative h-[min(70vh,560px)] w-full min-h-[360px]">
                <div
                    v-if="loading"
                    class="absolute inset-0 z-10 animate-pulse rounded-md border border-gray-200 bg-gray-50/90"
                    aria-busy="true"
                    aria-label="Chargement de la carte"
                />
                <div
                    v-else-if="error"
                    class="absolute inset-0 z-10 flex items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-center text-sm text-muted-foreground"
                >
                    {{ error }}
                </div>
                <div
                    v-else-if="isEmpty"
                    class="absolute inset-0 z-10 flex items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-center text-sm text-muted-foreground"
                >
                    Aucun soignant positionné pour le moment en {{ countryLabel }}.
                </div>
                <ClientOnly v-else>
                    <NursesResidenceMap
                        :points="points"
                        :institution-points="[]"
                        :country-label="countryLabel"
                        :show-nurses="true"
                        :show-institutions="false"
                        :clickable="false"
                    />
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NursesMapCountry } from '@/composables/useNursesMap';
import NursesResidenceMap from '@/components/maps/NursesResidenceMap.vue';
import { useCountry } from '~/composables/useCountry';
import { usePublicNursesMapData } from '~/composables/usePublicNursesMapData';

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

useHead({
    title: 'Carte infirmières',
});

const { defaultCountryCode, COUNTRY_LABELS } = useCountry();

const countryCode = computed((): NursesMapCountry => defaultCountryCode.value);
const countryLabel = computed(() => COUNTRY_LABELS[countryCode.value]);

const { points, loading, error, placedCount, isEmpty } = usePublicNursesMapData(countryCode);
</script>
