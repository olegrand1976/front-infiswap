<template>
    <div
        class="flex flex-col items-center justify-center gap-1 py-0.5"
        :title="hint"
        data-no-row-select="true"
    >
        <Popover
            v-model:open="historyOpen"
            @update:open="onHistoryOpenChange"
        >
            <PopoverTrigger as-child>
                <button
                    type="button"
                    class="flex flex-col items-center rounded-md px-1 py-0.5 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    :disabled="!crmUserId || loading"
                    :aria-label="`Voir l'historique de ${columnLabel} cette semaine`"
                    @click.stop
                >
                    <span
                        class="tabular-nums text-sm font-bold min-w-[1.5rem] text-center"
                        :class="value > 0 ? 'text-gray-900' : 'text-gray-400'"
                    >
                        {{ value }}
                    </span>
                    <span class="text-[10px] leading-none text-gray-500 hidden lg:block">
                        sem.
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent
                class="w-[min(20rem,calc(100vw-2rem))] p-0"
                align="center"
                :side-offset="4"
                @click.stop
            >
                <div class="border-b bg-primary/5 px-3 py-2">
                    <p class="text-sm font-semibold text-primary">
                        {{ columnLabel }} — cette semaine
                    </p>
                    <p class="text-[11px] text-gray-600">
                        {{ value }} action(s) comptabilisée(s)
                    </p>
                </div>
                <div
                    v-if="historiesLoading"
                    class="flex justify-center py-6"
                >
                    <RollingLoader :loading="true" />
                </div>
                <div
                    v-else
                    class="max-h-48 overflow-y-auto px-3 py-3"
                >
                    <CrmHistoryEntryList :entries="weekHistories" />
                </div>
            </PopoverContent>
        </Popover>

        <div class="flex items-center gap-1">
            <Button
                type="button"
                size="sm"
                variant="outline"
                class="h-7 w-7 shrink-0 p-0 border-gray-300 text-gray-600 hover:bg-gray-50"
                :disabled="loading || value <= 0"
                :aria-label="`Retirer ${actionLabel}`"
                @click.stop="openDecrementConfirm"
            >
                <Minus class="w-3.5 h-3.5" />
            </Button>
            <Button
                type="button"
                size="sm"
                variant="outline"
                class="h-7 w-7 shrink-0 p-0 border-primary/30 text-primary hover:bg-primary/5"
                :disabled="loading"
                :in-progress="loading"
                :aria-label="`Ajouter ${actionLabel}`"
                @click.stop="emit('increment')"
            >
                <Plus class="w-3.5 h-3.5" />
            </Button>
        </div>

        <AlertDialog v-model:open="decrementDialogOpen">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Retirer une action</AlertDialogTitle>
                    <AlertDialogDescription>
                        Retirer 1 {{ actionLabel }} de la semaine en cours ?
                        Cette opération est exceptionnelle et ne peut pas être annulée automatiquement.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction @click="confirmDecrement">
                        Retirer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<script lang="ts" setup>
import { Minus, Plus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CrmHistoryEntryList from '@/components/crm/CrmHistoryEntryList.vue';
import RollingLoader from '~/components/RollingLoader.vue';
import type { CrmHistoryEntry } from '@/composables/useCrm';
import type { CrmWeeklyKpiActionType } from '@/composables/useCrmWeeklyKpi';
import { filterCrmHistoriesInCurrentWeek } from '@/composables/useCrmHistoryDisplay';

const props = withDefaults(defineProps<{
    value: number;
    actionLabel: string;
    columnLabel: string;
    actionType: CrmWeeklyKpiActionType;
    crmUserId?: number | null;
    loading?: boolean;
    hint?: string;
}>(), {
    crmUserId: null,
    loading: false,
    hint: 'Total de la semaine en cours. Utilisez + / − pour ajuster.',
});

const emit = defineEmits<{
    increment: [];
    decrement: [];
}>();

const { getCrmHistories } = useCrm();

const historyOpen = ref(false);
const historiesLoading = ref(false);
const histories = ref<CrmHistoryEntry[]>([]);
const decrementDialogOpen = ref(false);

const weekHistories = computed(() => filterCrmHistoriesInCurrentWeek(histories.value, props.actionType));

async function loadHistories() {
    if (!props.crmUserId) {
        histories.value = [];
        return;
    }

    historiesLoading.value = true;
    try {
        histories.value = await getCrmHistories(props.crmUserId);
    }
    catch {
        histories.value = [];
    }
    finally {
        historiesLoading.value = false;
    }
}

async function onHistoryOpenChange(isOpen: boolean) {
    if (!isOpen) {
        return;
    }

    await loadHistories();
}

function openDecrementConfirm() {
    if (props.value <= 0 || props.loading) {
        return;
    }

    decrementDialogOpen.value = true;
}

function confirmDecrement() {
    decrementDialogOpen.value = false;
    emit('decrement');
}

watch(() => props.value, () => {
    if (historyOpen.value) {
        void loadHistories();
    }
});

watch(() => props.crmUserId, () => {
    if (historyOpen.value) {
        void loadHistories();
    }
});
</script>
