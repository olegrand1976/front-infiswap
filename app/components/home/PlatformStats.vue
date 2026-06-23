<script setup lang="ts">
import { Users } from 'lucide-vue-next';

const { stats, loading, copy, kpiDefinitions, fetchStats, getKpiValue } = usePlatformStats();

await fetchStats();

const formattedAsOf = computed(() => {
    if (!stats.value.as_of) {
        return '';
    }

    const [year, month, day] = stats.value.as_of.split('-').map(Number);
    if (!year || !month || !day) {
        return stats.value.as_of;
    }

    return new Intl.DateTimeFormat('fr-BE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(year, month - 1, day));
});
</script>

<template>
    <section
        class="relative overflow-hidden bg-muted/40 py-14 sm:py-16"
        aria-labelledby="platform-stats-title"
    >
        <div
            class="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
        />
        <div
            class="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-success/10 blur-3xl"
            aria-hidden="true"
        />

        <div class="container relative mx-auto px-4 sm:px-6">
            <div class="mx-auto mb-10 max-w-3xl text-center">
                <Badge
                    variant="secondary"
                    class="mb-4 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide"
                >
                    {{ copy.badge }}
                </Badge>
                <h2
                    id="platform-stats-title"
                    class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
                >
                    {{ copy.sectionTitle }}
                </h2>
                <p class="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {{ copy.sectionSubtitle }}
                </p>
            </div>

            <div class="mx-auto max-w-md">
                <Card
                    v-for="kpi in kpiDefinitions"
                    :key="kpi.key"
                    class="border-none bg-white/90 shadow-md backdrop-blur-sm"
                >
                    <div class="flex flex-col gap-4 p-6">
                        <div class="flex items-center justify-between">
                            <div class="rounded-2xl bg-primary/10 p-3 text-primary">
                                <Users
                                    class="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </div>
                            <Skeleton
                                v-if="loading"
                                class="h-8 w-20"
                            />
                            <p
                                v-else
                                class="text-3xl font-extrabold text-primary sm:text-4xl"
                            >
                                <HomeStatCounter
                                    :value="getKpiValue(kpi.key)"
                                    :suffix="kpi.suffix"
                                    :aria-label="`${kpi.label}: ${getKpiValue(kpi.key)}${kpi.suffix ?? ''}`"
                                />
                            </p>
                        </div>
                        <div>
                            <p class="text-base font-semibold text-foreground">
                                {{ kpi.label }}
                            </p>
                            <p class="mt-1 text-sm text-muted-foreground">
                                {{ kpi.description }}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <p
                v-if="!loading && formattedAsOf"
                class="mt-8 text-center text-xs text-muted-foreground/80"
            >
                {{ copy.updatedLabel }}
                {{ formattedAsOf }}
            </p>
        </div>
    </section>
</template>
