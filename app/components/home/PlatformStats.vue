<script setup lang="ts">
import { MapPin, Search, Users } from 'lucide-vue-next';

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
        class="bg-background py-14 text-center sm:py-16"
        aria-labelledby="platform-stats-title"
    >
        <div class="container relative mx-auto px-4 sm:px-6">
            <div class="mx-auto mb-9 max-w-md">
                <h2
                    id="platform-stats-title"
                    class="font-secondary text-[26px] font-semibold text-foreground"
                >
                    {{ copy.sectionTitle }}
                </h2>
                <p class="mt-2.5 text-sm text-muted-foreground">
                    {{ copy.sectionSubtitle }}
                </p>
            </div>

            <div class="mx-auto grid max-w-3xl grid-cols-1 overflow-hidden rounded-[20px] bg-[#14110f] shadow-[0_24px_60px_rgba(0,0,0,.35)] sm:grid-cols-3">
                <div class="border-b border-white/10 px-6 py-8 sm:border-b-0 sm:border-r">
                    <Users class="mx-auto mb-3.5 size-6.5 text-success" />
                    <div class="flex items-baseline justify-center gap-2">
                        <Skeleton
                            v-if="loading"
                            class="h-8 w-16 bg-white/10"
                        />
                        <span
                            v-else
                            class="font-secondary text-[30px] font-semibold text-white"
                        >
                            <HomeStatCounter :value="getKpiValue('members_total')" />
                        </span>
                        <span
                            v-if="!loading && growthLabel"
                            class="text-[11px] font-bold text-success"
                        >{{ growthLabel }}</span>
                    </div>
                    <p class="mt-1.5 text-[12.5px] text-white/65">
                        {{ $t('home.kpi.membersLabel') }}
                    </p>
                </div>

                <div class="border-b border-white/10 px-6 py-8 sm:border-b-0 sm:border-r">
                    <MapPin class="mx-auto mb-3.5 size-6.5 text-success" />
                    <span class="font-secondary text-[30px] font-semibold text-white">2</span>
                    <p class="mt-1.5 text-[12.5px] text-white/65">
                        {{ $t('home.stats.countriesLabel') }}
                    </p>
                </div>

                <div class="px-6 py-8">
                    <Search class="mx-auto mb-3.5 size-6.5 text-success" />
                    <span class="font-secondary text-[30px] font-semibold text-white">&lt;24h</span>
                    <p class="mt-1.5 text-[12.5px] text-white/65">
                        {{ $t('home.stats.delayLabel') }}
                    </p>
                </div>
            </div>

            <p
                v-if="!loading && formattedAsOf"
                class="mt-6 text-xs text-muted-foreground/80"
            >
                {{ copy.updatedLabel }} {{ formattedAsOf }}
            </p>
        </div>
    </section>
</template>
