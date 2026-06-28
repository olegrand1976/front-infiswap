<template>
    <Popover
        v-model:open="open"
        @update:open="onOpenChange"
    >
        <PopoverTrigger as-child>
            <Button
                type="button"
                variant="outline"
                size="sm"
                class="h-auto min-h-8 gap-1.5 px-2 py-1 text-xs"
                :disabled="disabled"
                :in-progress="loading || resolving"
                data-no-row-select="true"
                :title="triggerTitle"
                @click.stop
            >
                <History class="size-3.5 shrink-0 text-primary" />
                <span class="hidden sm:inline font-medium">Historique</span>
                <span
                    v-if="weeklyCount > 0"
                    class="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-primary"
                >
                    {{ weeklyCount }} sem.
                </span>
            </Button>
        </PopoverTrigger>
        <PopoverContent
            class="w-[min(24rem,calc(100vw-2rem))] p-0"
            align="end"
            :side-offset="4"
            @click.stop
        >
            <div class="border-b bg-primary/5 px-3 py-2.5">
                <p class="text-sm font-semibold text-primary">
                    Suivi commercial
                </p>
                <p
                    v-if="entityLabel"
                    class="text-xs text-muted-foreground truncate"
                >
                    {{ entityLabel }}
                </p>
                <p
                    v-if="summaryText"
                    class="mt-1 text-[11px] text-gray-600"
                >
                    {{ summaryText }}
                </p>
            </div>

            <div
                v-if="loading || resolving || historiesLoading"
                class="flex justify-center py-10"
            >
                <RollingLoader :loading="true" />
            </div>

            <div
                v-else-if="!activeCrmUserId"
                class="px-3 py-6 text-sm text-muted-foreground text-center"
            >
                Aucun contact CRM pour afficher l'historique.
            </div>

            <template v-else>
                <div class="border-b px-3 py-2 bg-gray-50/80">
                    <Select
                        :model-value="actionFilter"
                        @update:model-value="onActionFilterChange"
                    >
                        <SelectTrigger class="h-8 rounded-md text-xs bg-white">
                            <span>{{ crmHistoryFilterLabel(actionFilter) }}</span>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="option in CRM_HISTORY_FILTER_OPTIONS"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.label }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="max-h-64 overflow-y-auto px-3 py-3">
                    <CrmHistoryEntryList :entries="filteredHistories" />
                </div>
            </template>

            <div class="border-t bg-gray-50 px-3 py-2 flex justify-end gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    class="text-xs"
                    @click="open = false"
                >
                    Fermer
                </Button>
                <Button
                    type="button"
                    size="sm"
                    class="text-xs"
                    :disabled="disabled"
                    @click="onAddAction"
                >
                    Enregistrer une action
                </Button>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { History } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import CrmHistoryEntryList from '@/components/crm/CrmHistoryEntryList.vue';
import RollingLoader from '~/components/RollingLoader.vue';
import type { CrmHistoryEntry } from '@/composables/useCrm';
import {
    CRM_HISTORY_FILTER_OPTIONS,
    countCrmHistoriesInCurrentWeek,
    crmHistoryFilterLabel,
    filterCrmHistories,
    type CrmHistoryFilterValue,
} from '@/composables/useCrmHistoryDisplay';

const props = withDefaults(defineProps<{
    crmUserId?: number | null;
    entityLabel?: string;
    disabled?: boolean;
    loading?: boolean;
    weeklyCount?: number;
    resolveCrmUserId?: () => Promise<number | null>;
}>(), {
    crmUserId: null,
    entityLabel: '',
    disabled: false,
    loading: false,
    weeklyCount: 0,
    resolveCrmUserId: undefined,
});

const emit = defineEmits<{
    'add-action': [];
}>();

const { getCrmHistories } = useCrm();
const { $toast } = useNuxtApp();

const open = ref(false);
const resolving = ref(false);
const historiesLoading = ref(false);
const histories = ref<CrmHistoryEntry[]>([]);
const activeCrmUserId = ref<number | null>(props.crmUserId ?? null);
const actionFilter = ref<CrmHistoryFilterValue>('all');

const triggerTitle = computed(() => {
    if (props.disabled) {
        return 'Historique indisponible';
    }
    const weekly = props.weeklyCount > 0
        ? `${props.weeklyCount} action(s) comptabilisée(s) cette semaine. `
        : '';
    return `${weekly}Ouvrir l'historique complet du suivi commercial.`;
});

const filteredHistories = computed(() => filterCrmHistories(histories.value, actionFilter.value));

const summaryText = computed(() => {
    if (!activeCrmUserId.value || historiesLoading.value) {
        return '';
    }
    const total = filteredHistories.value.length;
    const weekFromHistory = countCrmHistoriesInCurrentWeek(histories.value);
    const parts = [`${histories.value.length} entrée(s) au total`];
    if (actionFilter.value !== 'all') {
        parts.push(`${total} affichée(s) avec ce filtre`);
    }
    if (weekFromHistory > 0) {
        parts.push(`${weekFromHistory} cette semaine (historique)`);
    }
    return parts.join(' · ');
});

async function ensureCrmUserId(): Promise<number | null> {
    if (props.crmUserId) {
        return props.crmUserId;
    }
    if (!props.resolveCrmUserId) {
        return null;
    }
    resolving.value = true;
    try {
        return await props.resolveCrmUserId();
    }
    finally {
        resolving.value = false;
    }
}

async function loadHistories() {
    const crmId = activeCrmUserId.value;
    if (!crmId) {
        histories.value = [];
        return;
    }

    historiesLoading.value = true;
    try {
        histories.value = await getCrmHistories(crmId);
    }
    catch {
        histories.value = [];
        $toast({
            description: 'Impossible de charger l\'historique du suivi commercial.',
            variant: 'destructive',
        });
    }
    finally {
        historiesLoading.value = false;
    }
}

async function onOpenChange(isOpen: boolean) {
    if (!isOpen) {
        actionFilter.value = 'all';
        return;
    }

    activeCrmUserId.value = props.crmUserId ?? null;
    if (!activeCrmUserId.value) {
        activeCrmUserId.value = await ensureCrmUserId();
    }
    await loadHistories();
}

function onActionFilterChange(value: unknown) {
    actionFilter.value = typeof value === 'string'
        ? value as CrmHistoryFilterValue
        : 'all';
}

function onAddAction() {
    open.value = false;
    emit('add-action');
}

watch(() => props.crmUserId, (id) => {
    if (open.value && id) {
        activeCrmUserId.value = id;
        void loadHistories();
    }
});
</script>
