<template>
    <div class="space-y-4">
        <div class="rounded-lg border bg-muted/20 p-4 space-y-3">
            <h3 class="text-sm font-semibold text-primary">
                Suivi commercial
            </h3>

            <div
                v-if="weeklyCounterItems.length"
                class="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3"
            >
                <div
                    v-for="item in weeklyCounterItems"
                    :key="item.label"
                    class="rounded-md bg-background px-2 py-1.5"
                >
                    <p class="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {{ item.label }}
                    </p>
                    <p class="text-lg font-bold tabular-nums">
                        {{ item.value }}
                    </p>
                </div>
            </div>

            <p class="text-sm">
                <span class="text-muted-foreground">Dernier contact :</span>
                {{ lastContactLabel }}
            </p>
            <p
                v-if="lastCommentText"
                class="text-sm whitespace-pre-wrap"
            >
                <span class="text-muted-foreground">Commentaire :</span>
                {{ lastCommentText }}
            </p>

            <div class="flex flex-wrap gap-2 pt-1">
                <Button
                    variant="outline"
                    size="sm"
                    class="rounded-md"
                    @click="emit('action', 'contact')"
                >
                    Contact
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    class="rounded-md"
                    @click="emit('action', 'comment')"
                >
                    Commentaire
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    class="rounded-md"
                    @click="emit('action', 'referrer')"
                >
                    Apporteur
                </Button>
                <Button
                    size="sm"
                    class="rounded-md"
                    :disabled="!userId"
                    @click="commercialDialogOpen = true"
                >
                    Enregistrer une action
                </Button>
            </div>
        </div>

        <div class="rounded-lg border p-4 space-y-3">
            <h3 class="text-sm font-semibold text-primary">
                Historique des contacts
            </h3>
            <div
                v-if="historiesLoading"
                class="flex justify-center py-8"
            >
                <RollingLoader :loading="true" />
            </div>
            <CrmHistoryEntryList
                v-else
                :entries="histories"
            />
        </div>

        <CommercialQuickActionDialog
            v-if="userId"
            v-model:open="commercialDialogOpen"
            :user-id="userId"
            :crm-user-id="crmUserId"
            :entity-label="entityLabel"
            :client-type="clientType"
            :initial-counters="weeklyCounters"
            @crm-updated="onCommercialUpdated"
        />
    </div>
</template>

<script setup lang="ts">
import { formatToDMY } from '@/composables/useDate';
import type { CrmHistoryEntry } from '@/composables/useCrm';
import CrmHistoryEntryList from '@/components/crm/CrmHistoryEntryList.vue';
import CommercialQuickActionDialog from '@/components/crm/CommercialQuickActionDialog.vue';
import RollingLoader from '@/components/RollingLoader.vue';
import { Button } from '@/components/ui/button';

export type CrmFollowUpCounters = {
    nb_call?: number;
    nb_sale?: number;
    nb_recommandation?: number;
    nb_meeting?: number;
    nb_pending?: number;
};

export type CrmFollowUpAction = 'contact' | 'comment' | 'referrer';

const props = withDefaults(defineProps<{
    crmUserId?: number | null;
    userId?: number | null;
    clientType?: string;
    entityLabel?: string;
    counters?: CrmFollowUpCounters | null;
    lastContactDate?: string | null;
    lastContactMethod?: string | null;
    lastComment?: string | null;
}>(), {
    crmUserId: null,
    userId: null,
    clientType: 'user',
    entityLabel: '',
    counters: null,
    lastContactDate: null,
    lastContactMethod: null,
    lastComment: null,
});

const emit = defineEmits<{
    'action': [type: CrmFollowUpAction];
    'crm-updated': [crm: Record<string, unknown>];
}>();

const { getCrmHistories } = useCrm();
const { $toast } = useNuxtApp();

const historiesLoading = ref(false);
const histories = ref<CrmHistoryEntry[]>([]);
const commercialDialogOpen = ref(false);
const localCounters = ref<CrmFollowUpCounters | null>(props.counters ? { ...props.counters } : null);

watch(
    () => props.counters,
    (value) => {
        localCounters.value = value ? { ...value } : null;
    },
    { deep: true },
);

const weeklyCounters = computed(() => {
    const crm = localCounters.value;
    if (!crm) {
        return null;
    }
    return {
        nb_call: Number(crm.nb_call) || 0,
        nb_sale: Number(crm.nb_sale) || 0,
        nb_recommandation: Number(crm.nb_recommandation) || 0,
        nb_meeting: Number(crm.nb_meeting) || 0,
        nb_pending: Number(crm.nb_pending) || 0,
    };
});

const weeklyCounterItems = computed(() => {
    const c = weeklyCounters.value;
    if (!c) {
        return [];
    }
    return [
        { label: 'Appels', value: c.nb_call },
        { label: 'Ventes', value: c.nb_sale },
        { label: 'Recommand.', value: c.nb_recommandation },
        { label: 'RDV', value: c.nb_meeting },
        { label: 'En attente', value: c.nb_pending },
    ];
});

const lastContactLabel = computed(() => {
    if (!props.lastContactDate) {
        return '—';
    }
    const method = props.lastContactMethod ? ` (${props.lastContactMethod})` : '';
    return `${formatToDMY(props.lastContactDate)}${method}`;
});

const lastCommentText = computed(() => props.lastComment?.trim() || '');

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
        $toast({
            description: 'Impossible de charger l\'historique.',
            variant: 'destructive',
        });
    }
    finally {
        historiesLoading.value = false;
    }
}

function onCommercialUpdated(crm: Record<string, unknown>) {
    localCounters.value = {
        ...(localCounters.value ?? {}),
        nb_call: Number(crm.nb_call) || 0,
        nb_sale: Number(crm.nb_sale) || 0,
        nb_recommandation: Number(crm.nb_recommandation) || 0,
        nb_meeting: Number(crm.nb_meeting) || 0,
        nb_pending: Number(crm.nb_pending) || 0,
    };
    emit('crm-updated', crm);
    void loadHistories();
}

watch(
    () => props.crmUserId,
    () => {
        void loadHistories();
    },
    { immediate: true },
);

defineExpose({
    reloadHistories: loadHistories,
});
</script>
