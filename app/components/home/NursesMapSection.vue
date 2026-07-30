<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next';
import type { NursesMapCountry } from '@/composables/useNursesMap';
import NursesResidenceMap from '@/components/maps/NursesResidenceMap.vue';
import { useAuth } from '~/composables/useAuth';
import { usePublicNursesMapData } from '~/composables/usePublicNursesMapData';

const { t } = useI18n();
const localePath = useLocalePath();
const { isLoggedIn } = useAuth();

const url = useRequestURL();
const countryCode = computed((): NursesMapCountry =>
    url.hostname.endsWith('.fr') ? 'fr' : 'be',
);
const countryLabel = computed(() =>
    countryCode.value === 'fr' ? t('home.map.countryFr') : t('home.map.countryBe'),
);

const { points, loading, error, isEmpty } = usePublicNursesMapData(countryCode);
</script>

<template>
    <section
        class="relative overflow-hidden bg-gradient-to-b from-primary/5 via-muted/30 to-background py-14 sm:py-16"
        aria-labelledby="home-nurses-map-title"
    >
        <div
            class="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl"
            aria-hidden="true"
        />
        <div
            class="pointer-events-none absolute -bottom-28 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
        />

        <div class="container relative mx-auto px-4 sm:px-6">
            <div class="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
                <Badge
                    variant="secondary"
                    class="mb-4 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide"
                >
                    {{ $t('home.map.networkBadge', { country: countryLabel }) }}
                </Badge>
                <h2
                    id="home-nurses-map-title"
                    class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
                >
                    {{ $t('home.map.title', { country: countryLabel }) }}
                </h2>
                <p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {{ $t('home.map.body') }}
                </p>
            </div>

            <div class="relative mx-auto h-[420px] w-full max-w-5xl overflow-hidden rounded-xl shadow-lg sm:h-[500px]">
                <div
                    v-if="loading"
                    class="absolute inset-0 z-10 animate-pulse rounded-xl border border-gray-200 bg-gray-50/90"
                    aria-busy="true"
                    :aria-label="$t('home.map.loading')"
                />
                <div
                    v-else-if="error"
                    class="absolute inset-0 z-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-center text-sm text-muted-foreground"
                >
                    {{ error }}
                </div>
                <div
                    v-else-if="isEmpty"
                    class="absolute inset-0 z-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-center text-sm text-muted-foreground"
                >
                    {{ $t('home.map.empty', { country: countryLabel }) }}
                </div>
                <ClientOnly v-else>
                    <NursesResidenceMap
                        :points="points"
                        :institution-points="[]"
                        :country-label="countryLabel"
                        :show-nurses="true"
                        :show-institutions="false"
                        :clickable="false"
                        class="h-full w-full rounded-xl border-0"
                    />
                </ClientOnly>
            </div>

            <div
                v-if="!isLoggedIn"
                class="mt-8 flex justify-center"
            >
                <NuxtLink
                    :to="localePath('/register')"
                    class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
                >
                    <UserPlus class="size-4" />
                    {{ $t('home.map.joinCta') }}
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
