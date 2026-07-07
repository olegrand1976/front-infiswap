<template>
    <div class="space-y-4">
        <h3 class="text-sm font-semibold text-muted-foreground">
            Gain / perte mensuel
        </h3>
        <div
            v-if="loading"
            class="text-sm text-muted-foreground py-8 text-center"
        >
            Chargement…
        </div>
        <div
            v-else-if="!series.length"
            class="text-sm text-muted-foreground py-8 text-center border rounded-lg border-dashed"
        >
            Aucune donnée sur la période.
        </div>
        <div
            v-else
            class="space-y-3"
        >
            <div
                v-for="row in series"
                :key="row.month"
                class="grid grid-cols-[72px_1fr] gap-3 items-center text-xs"
            >
                <span class="text-muted-foreground font-medium">{{ row.month }}</span>
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <span class="w-16 text-muted-foreground">Encaissé</span>
                        <div class="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                class="h-full bg-emerald-600 rounded-full"
                                :style="{ width: barWidth(row.received) }"
                            />
                        </div>
                        <span class="w-20 text-right">{{ formatEuro(row.received) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-16 text-muted-foreground">Commiss.</span>
                        <div class="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                class="h-full bg-indigo-600 rounded-full"
                                :style="{ width: barWidth(row.earned) }"
                            />
                        </div>
                        <span class="w-20 text-right">{{ formatEuro(row.earned) }}</span>
                    </div>
                    <div
                        v-if="row.reversed > 0"
                        class="flex items-center gap-2 text-red-600"
                    >
                        <span class="w-16">Reprises</span>
                        <span class="flex-1">—</span>
                        <span class="w-20 text-right">−{{ formatEuro(row.reversed) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GainLossRow } from '@/composables/useInstitutionCommissionTracking';

const props = defineProps<{
    series: GainLossRow[];
    loading?: boolean;
}>();

const maxValue = computed(() => {
    if (!props.series.length) return 1;
    return Math.max(
        ...props.series.flatMap(r => [r.received, r.earned, r.paid]),
        1,
    );
});

function barWidth(value: number) {
    return `${Math.min(100, Math.round((value / maxValue.value) * 100))}%`;
}

function formatEuro(value: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}
</script>
