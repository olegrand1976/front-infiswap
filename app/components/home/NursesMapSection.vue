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
        class="relative overflow-hidden bg-gradient-to-b from-primary/8 to-background py-16 sm:py-[74px]"
        aria-labelledby="home-nurses-map-title"
    >
        <div
            class="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-success/15 blur-3xl"
            aria-hidden="true"
        />

        <div class="container relative mx-auto px-4 sm:px-6">
            <div class="mx-auto mb-10 max-w-xl text-center">
                <h2
                    id="home-nurses-map-title"
                    class="font-secondary text-[26px] font-semibold text-foreground sm:text-[28px]"
                >
                    {{ $t('home.map.title') }}
                </h2>
                <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {{ $t('home.map.body') }}
                </p>
            </div>

            <div class="mx-auto max-w-4xl overflow-hidden rounded-[22px] border border-input bg-card shadow-[0_24px_60px_rgba(0,0,0,.2)]">
                <div class="relative h-[340px] w-full sm:h-[420px]">
                    <div
                        v-if="loading"
                        class="absolute inset-0 z-10 animate-pulse bg-muted/60"
                        aria-busy="true"
                        :aria-label="$t('home.map.loading')"
                    />
                    <div
                        v-else-if="error"
                        class="absolute inset-0 z-10 flex items-center justify-center bg-muted/40 px-6 text-center text-sm text-muted-foreground"
                    >
                        {{ error }}
                    </div>
                    <div
                        v-else-if="isEmpty"
                        class="absolute inset-0 z-10 flex items-center justify-center bg-muted/40 px-6 text-center text-sm text-muted-foreground"
                    >
                        {{ $t('home.map.empty') }}
                    </div>
                    <ClientOnly v-else>
                        <NursesResidenceMap
                            :points="points"
                            :institution-points="[]"
                            :country-label="countryLabel"
                            :show-nurses="true"
                            :show-institutions="false"
                            :clickable="false"
                            class="h-full w-full border-0"
                        />
                    </ClientOnly>
                </div>

                <div
                    v-if="!isLoggedIn"
                    class="flex justify-center px-6 py-5 sm:justify-end sm:px-8"
                >
                    <NuxtLink
                        :to="localePath('/register')"
                        class="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[9px] bg-primary px-5 py-3 text-[13.5px] font-bold text-primary-foreground shadow-[0_10px_24px_oklch(0.5921_0.1935_15.63_/_0.28)] transition hover:scale-[1.02]"
                    >
                        <UserPlus class="size-4" />
                        {{ $t('home.map.joinCta') }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>
