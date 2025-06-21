<template>
    <template v-if="replacement.periods.length > 0">
        <div
            v-for="(period, index) in replacement.periods.slice(0, 1)"
            :key="index"
            class="flex justify-center gap-2 items-center text-sm"
        >
            <span>{{ formatDate(period.start_date) }}</span>
            <span class="flex items-center">au</span>
            <span>{{ formatDate(period.end_date) }}</span>
        </div>
        <div
            class="mt-1 text-center text-xs font-semibold text-primary cursor-pointer"
            @click="handleShowPeriods(replacement.periods)"
        >
            Voir tout
        </div>
    </template>
    <template v-else>
        <div
            class="flex justify-center gap-2 items-center text-sm"
        >
            <span>{{ formatDate(replacement.start_date) }}</span>
            <span class="flex items-center">au</span>
            <span>{{ formatDate(replacement.end_date) }}</span>
        </div>
    </template>
    <Dialog v-model:open="periodDialog">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle class="text-base font-semibold text-primary">
                    Période de remplacement
                </DialogTitle>
            </DialogHeader>
            <div class="mt-3 text-sm grid grid-cols-2 items-center font-semibold text-gray-700">
                <h5>
                    Date de début
                </h5>
                <h5>
                    Date de fin
                </h5>
            </div>
            <div
                v-for="period in selectedPeriods"
                :key="period.id"
                class="mt-1"
            >
                <div class="text-sm grid grid-cols-2 items-center">
                    <span>
                        {{ formatDate(period.start_date) }}
                    </span>
                    <span>
                        {{ formatDate(period.end_date) }}
                    </span>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>
import type { Replacement } from '~/lib/types';

defineProps<{
    replacement: Replacement;
}>();
const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const selectedPeriods = ref([]);
const periodDialog = ref(false);

const handleShowPeriods = (periods) => {
    selectedPeriods.value = periods;
    periodDialog.value = true;
};
</script>
