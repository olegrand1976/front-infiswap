<template>
    <Dialog
        :open="open"
        @update:open="emit('update:open', $event)"
    >
        <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-2 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle class="text-lg font-semibold text-primary">
                    Enregistrer une activité
                </DialogTitle>
                <p
                    v-if="entityLabel"
                    class="text-sm text-gray-600 mt-1"
                >
                    {{ entityLabel }}
                </p>
            </DialogHeader>

            <div class="rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900">
                <p class="font-medium">
                    Les colonnes du tableau = total de la <strong>semaine en cours</strong> (lun.–dim.).
                </p>
                <p class="mt-1 text-sky-800/90">
                    Pour faire évoluer le chiffre affiché, enregistrez une action datée <strong>cette semaine</strong>
                    (le bouton « +1 aujourd'hui » utilise la date du jour).
                </p>
            </div>

            <div
                v-if="weeklyCounters"
                class="rounded-lg border border-gray-200 bg-white p-3 text-sm"
            >
                <p class="font-semibold text-primary mb-2">
                    Totaux semaine en cours
                </p>
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div class="rounded-md bg-gray-50 px-2 py-1.5">
                        <span class="text-[10px] uppercase tracking-wide text-gray-500">Appels</span>
                        <p class="text-lg font-bold tabular-nums text-gray-900">
                            {{ weeklyCounters.nb_call ?? 0 }}
                        </p>
                    </div>
                    <div class="rounded-md bg-gray-50 px-2 py-1.5">
                        <span class="text-[10px] uppercase tracking-wide text-gray-500">Ventes</span>
                        <p class="text-lg font-bold tabular-nums text-gray-900">
                            {{ weeklyCounters.nb_sale ?? 0 }}
                        </p>
                    </div>
                    <div class="rounded-md bg-gray-50 px-2 py-1.5">
                        <span class="text-[10px] uppercase tracking-wide text-gray-500">Recommand.</span>
                        <p class="text-lg font-bold tabular-nums text-gray-900">
                            {{ weeklyCounters.nb_recommandation ?? 0 }}
                        </p>
                    </div>
                    <div class="rounded-md bg-gray-50 px-2 py-1.5">
                        <span class="text-[10px] uppercase tracking-wide text-gray-500">RDV</span>
                        <p class="text-lg font-bold tabular-nums text-gray-900">
                            {{ weeklyCounters.nb_meeting ?? 0 }}
                        </p>
                    </div>
                    <div class="rounded-md bg-gray-50 px-2 py-1.5">
                        <span class="text-[10px] uppercase tracking-wide text-gray-500">En attente</span>
                        <p class="text-lg font-bold tabular-nums text-gray-900">
                            {{ weeklyCounters.nb_pending ?? 0 }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p class="text-sm font-medium text-primary">
                    Ajout rapide
                </p>
                <p class="text-sm text-gray-600">
                    {{ quickActionDescription }}
                </p>
                <Button
                    type="button"
                    class="w-full sm:w-auto"
                    :in-progress="quickInProgress"
                    @click="submitQuickOne"
                >
                    +1 {{ currentActionLabel }} aujourd'hui
                </Button>
            </div>

            <details class="group rounded-lg border border-gray-200">
                <summary class="cursor-pointer select-none px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Saisie avancée (période, quantité, produit…)
                </summary>
                <div class="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4">
                    <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                        <button
                            v-for="tab in actionTabs"
                            :key="tab.key"
                            type="button"
                            class="pb-1 border-b-2 text-sm"
                            :class="tradeTab === tab.key ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = tab.key"
                        >
                            {{ tab.label }}
                        </button>
                    </div>

                    <form
                        class="space-y-4"
                        @submit.prevent="submit"
                    >
                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div class="flex flex-col gap-1">
                                <label class="text-xs font-medium text-gray-500">Du</label>
                                <InputIcon
                                    v-model="form.start_date"
                                    type="date"
                                    class="w-full h-10 px-3 bg-gray-100 border-none rounded-lg"
                                />
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-xs font-medium text-gray-500">Au</label>
                                <InputIcon
                                    v-model="form.end_date"
                                    type="date"
                                    class="w-full h-10 px-3 bg-gray-100 border-none rounded-lg"
                                />
                            </div>
                        </div>

                        <div
                            v-if="tradeTab === 'sale'"
                            class="flex flex-col w-full gap-1"
                        >
                            <label class="text-xs font-medium text-gray-500">Produit</label>
                            <Select v-model="form.produit_id">
                                <SelectTrigger class="w-full bg-white border border-gray-300 rounded-lg">
                                    <SelectValue placeholder="Choisis un produit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="product in products"
                                        :key="product.id"
                                        :value="String(product.id)"
                                    >
                                        {{ product.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex flex-col w-full gap-1">
                            <label class="text-sm font-medium text-gray-500">{{ countLabels[tradeTab] }}</label>
                            <InputIcon
                                v-model="form.number"
                                type="number"
                                min="1"
                                placeholder="1"
                                rounded="md"
                            />
                        </div>

                        <div class="flex flex-col w-full gap-1">
                            <label class="text-sm font-medium text-gray-500">Commentaire (optionnel)</label>
                            <InputIcon
                                v-model="comment"
                                type="text"
                                placeholder="Note..."
                                rounded="md"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="secondary"
                            class="w-full sm:w-auto"
                            :in-progress="inProgress"
                        >
                            Enregistrer la saisie avancée
                        </Button>
                    </form>
                </div>
            </details>

            <div
                v-if="crmHistories.length"
                class="rounded-lg border border-gray-200 bg-gray-50/50 overflow-hidden"
            >
                <div class="border-b border-gray-200 bg-white px-3 py-2">
                    <p class="font-semibold text-primary text-sm">
                        Historique récent
                    </p>
                    <p class="text-[11px] text-gray-500">
                        {{ crmHistories.length }} entrée(s) — affichage des 5 plus récentes
                    </p>
                </div>
                <div class="max-h-40 overflow-y-auto px-3 py-2">
                    <CrmHistoryEntryList
                        :entries="crmHistories"
                        :limit="5"
                    />
                </div>
            </div>

            <div class="flex justify-end pt-2">
                <Button
                    type="button"
                    variant="ghost"
                    @click="emit('update:open', false)"
                >
                    Fermer
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>
import CrmHistoryEntryList from '@/components/crm/CrmHistoryEntryList.vue';
import type { CrmHistoryEntry } from '@/composables/useCrm';

type CommercialActionType = 'call' | 'sale' | 'recommandation' | 'meeting' | 'pending';

const props = withDefaults(defineProps<{
    open: boolean;
    userId: number;
    crmUserId?: number | null;
    entityLabel?: string;
    defaultActionType?: CommercialActionType;
    clientType?: string;
    initialCounters?: {
        nb_call?: number;
        nb_sale?: number;
        nb_recommandation?: number;
        nb_meeting?: number;
        nb_pending?: number;
    } | null;
}>(), {
    entityLabel: '',
    defaultActionType: 'call',
    clientType: 'user',
    crmUserId: null,
    initialCounters: null,
});

const emit = defineEmits<{
    'update:open': [value: boolean];
    'crm-updated': [crm: Record<string, unknown>];
}>();

const { crmUser, getCrmHistories, recordQuickCommercialAction } = useCrm();
const { getAll } = useProduct();
const { $toast } = useNuxtApp();

const tradeTab = ref<CommercialActionType>(props.defaultActionType);
const products = ref<{ id: number; name: string }[]>([]);
const crmHistories = ref<CrmHistoryEntry[]>([]);
const weeklyCounters = ref(props.initialCounters);
const comment = ref('');
const quickInProgress = ref(false);

const actionTabs: Array<{ key: CommercialActionType; label: string }> = [
    { key: 'call', label: 'Appels' },
    { key: 'sale', label: 'Ventes' },
    { key: 'recommandation', label: 'Recommandations' },
    { key: 'meeting', label: 'RDV' },
    { key: 'pending', label: 'En attente' },
];

const actionLabels: Record<CommercialActionType, string> = {
    call: 'appel',
    sale: 'vente',
    recommandation: 'recommandation',
    meeting: 'rendez-vous',
    pending: 'réponse en attente',
};

const countLabels: Record<CommercialActionType, string> = {
    call: 'Nombre d\'appels',
    sale: 'Nombre de ventes',
    recommandation: 'Nombre de recommandations',
    meeting: 'Nombre de rendez-vous',
    pending: 'Nombre de réponses en attente',
};

const currentActionLabel = computed(() => actionLabels[tradeTab.value]);

const quickActionDescription = computed(() => {
    const labels: Record<CommercialActionType, string> = {
        call: 'Enregistre un appel téléphonique effectué aujourd\'hui.',
        sale: 'Enregistre une vente conclue aujourd\'hui (produit optionnel en saisie avancée).',
        recommandation: 'Enregistre une recommandation obtenue aujourd\'hui.',
        meeting: 'Enregistre un rendez-vous planifié ou tenu aujourd\'hui.',
        pending: 'Enregistre une relance en attente de réponse aujourd\'hui.',
    };
    return labels[tradeTab.value];
});

const today = () => new Date().toISOString().slice(0, 10);

const defaultForm = () => ({
    start_date: today(),
    end_date: today(),
    number: '1',
    produit_id: '',
    type: tradeTab.value,
});

const form = ref(defaultForm());

function resetForm() {
    form.value = {
        ...defaultForm(),
        type: tradeTab.value,
    };
    comment.value = '';
}

async function loadProducts() {
    try {
        products.value = await getAll();
    }
    catch {
        products.value = [];
    }
}

async function loadHistories() {
    if (!props.crmUserId) {
        crmHistories.value = [];
        return;
    }
    try {
        crmHistories.value = await getCrmHistories(props.crmUserId);
    }
    catch {
        crmHistories.value = [];
    }
}

function counterLabelForAction(action: CommercialActionType): string {
    return actionLabels[action];
}

function counterKeyForAction(action: CommercialActionType): string {
    const map: Record<CommercialActionType, string> = {
        call: 'nb_call',
        sale: 'nb_sale',
        recommandation: 'nb_recommandation',
        meeting: 'nb_meeting',
        pending: 'nb_pending',
    };
    return map[action];
}

function applySuccess(response: { crm?: Record<string, unknown> } | Record<string, unknown>, action: CommercialActionType) {
    const crm = (response as { crm?: Record<string, unknown> })?.crm ?? response as Record<string, unknown>;
    weeklyCounters.value = {
        nb_call: crm.nb_call as number,
        nb_sale: crm.nb_sale as number,
        nb_recommandation: crm.nb_recommandation as number,
        nb_meeting: crm.nb_meeting as number,
        nb_pending: crm.nb_pending as number,
    };

    const counterKey = counterKeyForAction(action);
    const newTotal = crm[counterKey];
    $toast({
        description: `Enregistré : +1 ${counterLabelForAction(action)}. Total semaine : ${newTotal ?? '—'}.`,
        variant: 'success',
    });
    emit('crm-updated', crm);
    loadHistories();
    resetForm();
    emit('update:open', false);
}

async function submitPayload(payload: Record<string, unknown>, action: CommercialActionType) {
    const response = await crmUser(payload);
    applySuccess(response, action);
}

async function submitQuickOne() {
    quickInProgress.value = true;
    try {
        const response = await recordQuickCommercialAction(
            props.userId,
            props.clientType,
            tradeTab.value,
        );
        applySuccess(response, tradeTab.value);
    }
    catch {
        $toast({ description: 'Erreur lors de l\'enregistrement', variant: 'destructive' });
    }
    finally {
        quickInProgress.value = false;
    }
}

watch(tradeTab, (val) => {
    form.value.type = val;
});

watch(() => props.open, async (isOpen) => {
    if (!isOpen) return;
    tradeTab.value = props.defaultActionType;
    weeklyCounters.value = props.initialCounters;
    resetForm();
    await loadProducts();
    await loadHistories();
});

const { submit, inProgress } = useSubmit(async () => {
    return await crmUser({
        user_id: props.userId,
        client_type: props.clientType,
        last_contact_date: form.value.start_date,
        last_comment: comment.value || null,
        history: [
            {
                action_type: form.value.type,
                number_of_times: Number(form.value.number) || 1,
                start_date: form.value.start_date,
                end_date: form.value.end_date,
                product_id: form.value.produit_id ? Number(form.value.produit_id) : null,
                comment: comment.value || '',
            },
        ],
    });
}, {
    onSuccess: (response) => {
        applySuccess(response, tradeTab.value);
    },
    onError: () => {
        $toast({ description: 'Erreur lors de l\'enregistrement', variant: 'destructive' });
    },
});
</script>
