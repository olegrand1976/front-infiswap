<script setup lang="ts">
import { Headset, MapPin, Quote, Search, ShieldCheck, Users } from 'lucide-vue-next';

const { locale } = useI18n();
const { stats, loading, copy, fetchStats, getKpiValue } = usePlatformStats();

await fetchStats();

const dateLocale = computed(() => (locale.value === 'nl' ? 'nl-BE' : 'fr-BE'));

const growthLabel = computed(() => {
    const percent = stats.value.growth?.percent_vs_previous_30d;
    if (percent === undefined || percent === null) {
        return '';
    }

    return `${percent >= 0 ? '+' : ''}${percent}%`;
});

const formattedAsOf = computed(() => {
    if (!stats.value.as_of) {
        return '';
    }

    const [year, month, day] = stats.value.as_of.split('-').map(Number);
    if (!year || !month || !day) {
        return stats.value.as_of;
    }

    return new Intl.DateTimeFormat(dateLocale.value, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(year, month - 1, day));
});
</script>

<template>
    <section
        class="bg-background py-14 text-center sm:py-20"
        aria-labelledby="platform-stats-title"
    >
        <div class="container mx-auto px-4 sm:px-6">
            <div class="mx-auto mb-8 max-w-md sm:mb-11">
                <h2
                    id="platform-stats-title"
                    class="font-secondary text-xl font-semibold text-foreground sm:text-2xl lg:text-3xl"
                >
                    {{ copy.sectionTitle }}
                </h2>
                <p class="mt-2 text-sm text-muted-foreground sm:mt-3">
                    {{ copy.sectionSubtitle }}
                </p>
            </div>

            <div class="mx-auto grid max-w-5xl grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-2xl bg-gradient-to-br from-green-700 to-green-800 p-5 text-center shadow-lg">
                    <span class="mx-auto mb-2 flex size-9 items-center justify-center rounded-lg bg-white/15">
                        <Users class="size-4 text-white" />
                    </span>
                    <div class="flex items-baseline justify-center gap-2">
                        <Skeleton
                            v-if="loading"
                            class="h-7 w-16 bg-white/20"
                        />
                        <span
                            v-else
                            class="font-secondary text-2xl font-semibold text-white"
                        >
                            <HomeStatCounter :value="getKpiValue('members_total')" />
                        </span>
                        <span
                            v-if="!loading && growthLabel"
                            class="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white"
                        >{{ growthLabel }}</span>
                    </div>
                    <p class="mt-1 text-xs text-white/80">
                        {{ $t('home.kpi.membersLabel') }}
                    </p>
                </div>

                <div class="rounded-2xl bg-gradient-to-br from-green-700 to-green-800 p-5 text-center shadow-lg">
                    <span class="mx-auto mb-2 flex size-9 items-center justify-center rounded-lg bg-white/15">
                        <MapPin class="size-4 text-white" />
                    </span>
                    <span class="font-secondary text-2xl font-semibold text-white">2</span>
                    <p class="mt-1 text-xs text-white/80">
                        {{ $t('home.stats.countriesLabel') }}
                    </p>
                </div>

                <div class="rounded-2xl bg-gradient-to-br from-green-700 to-green-800 p-5 text-center shadow-lg">
                    <span class="mx-auto mb-2 flex size-9 items-center justify-center rounded-lg bg-white/15">
                        <Search class="size-4 text-white" />
                    </span>
                    <span class="font-secondary text-2xl font-semibold text-white">&lt;24h</span>
                    <p class="mt-1 text-xs text-white/80">
                        {{ $t('home.stats.delayLabel') }}
                    </p>
                </div>

                <div class="flex flex-col rounded-2xl bg-primary p-5 shadow-lg sm:col-span-2 lg:col-span-1">
                    <Quote class="mb-2 size-5 text-white/70" />
                    <p class="flex-1 text-xs text-white">
                        {{ $t('home.stats.trustQuote') }}
                    </p>
                    <div class="mt-3 flex flex-wrap gap-2">
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-1 text-xs font-bold text-white">
                            <ShieldCheck class="size-3.5" />
                            {{ $t('home.stats.trustBadgeVerified') }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-1 text-xs font-bold text-white">
                            <Headset class="size-3.5" />
                            {{ $t('home.stats.trustBadgeSupport') }}
                        </span>
                    </div>
                </div>
            </div>

            <p
                v-if="!loading && formattedAsOf"
                class="mt-6 text-xs text-muted-foreground"
            >
                {{ copy.updatedLabel }} {{ formattedAsOf }}
            </p>
        </div>
    </section>
</template>
