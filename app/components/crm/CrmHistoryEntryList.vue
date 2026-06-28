<template>
    <div class="space-y-4">
        <p
            v-if="entries.length === 0"
            class="py-6 text-center text-sm text-muted-foreground"
        >
            Aucune entrée pour ce filtre.
        </p>
        <section
            v-for="group in groupedEntries"
            :key="group.key"
            class="space-y-2"
        >
            <h4 class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-0.5">
                {{ group.label }}
            </h4>
            <ul class="space-y-2">
                <li
                    v-for="entry in group.entries"
                    :key="entry.id"
                    class="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-sm"
                >
                    <div class="flex items-start justify-between gap-2">
                        <span :class="crmHistoryActionBadgeClass(getCrmHistoryActionKey(entry))">
                            {{ formatCrmHistoryActionLabel(getCrmHistoryActionKey(entry)) }}
                        </span>
                        <span
                            v-if="entry.number_of_times"
                            class="shrink-0 tabular-nums text-xs font-semibold text-gray-700"
                        >
                            {{ entry.number_of_times }}×
                        </span>
                    </div>
                    <p class="mt-1.5 text-xs text-gray-500">
                        {{ formatCrmHistoryDates(entry) }}
                    </p>
                    <div
                        v-if="entry.product?.name || entry.creator?.full_name"
                        class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-600"
                    >
                        <span v-if="entry.product?.name">
                            Produit : {{ entry.product.name }}
                        </span>
                        <span v-if="entry.creator?.full_name">
                            Par {{ entry.creator.full_name }}
                        </span>
                    </div>
                    <p
                        v-if="entry.comment"
                        class="mt-1.5 text-xs leading-relaxed text-gray-700"
                    >
                        {{ entry.comment }}
                    </p>
                    <p
                        v-else-if="entry.new_value && entry.field_name !== entry.action_type"
                        class="mt-1.5 text-xs leading-relaxed text-gray-700"
                    >
                        {{ entry.new_value }}
                    </p>
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { CrmHistoryEntry } from '@/composables/useCrm';
import {
    crmHistoryActionBadgeClass,
    formatCrmHistoryActionLabel,
    formatCrmHistoryDates,
    getCrmHistoryActionKey,
    groupCrmHistoriesByMonth,
} from '@/composables/useCrmHistoryDisplay';

const props = withDefaults(defineProps<{
    entries: CrmHistoryEntry[];
    limit?: number;
}>(), {
    limit: undefined,
});

const visibleEntries = computed(() => {
    if (!props.limit) {
        return props.entries;
    }
    return props.entries.slice(0, props.limit);
});

const groupedEntries = computed(() => groupCrmHistoriesByMonth(visibleEntries.value));
</script>
