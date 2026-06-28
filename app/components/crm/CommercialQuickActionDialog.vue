<template>
    <Dialog
        :open="open"
        @update:open="emit('update:open', $event)"
    >
        <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-2 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle class="text-lg font-semibold text-primary">
                    Action commerciale
                </DialogTitle>
                <p
                    v-if="entityLabel"
                    class="text-sm text-gray-600 mt-1"
                >
                    {{ entityLabel }}
                </p>
            </DialogHeader>

            <div
                v-if="weeklyCounters"
                class="p-3 mb-4 border border-gray-200 rounded-lg bg-gray-50 text-sm"
            >
                <p class="font-semibold text-primary mb-2">
                    Compteurs semaine en cours
                </p>
                <div class="grid grid-cols-2 gap-2">
                    <span>Appels : <strong>{{ weeklyCounters.nb_call ?? 0 }}</strong></span>
                    <span>Ventes : <strong>{{ weeklyCounters.nb_sale ?? 0 }}</strong></span>
                    <span>Recommandations : <strong>{{ weeklyCounters.nb_recommandation ?? 0 }}</strong></span>
                    <span>RDV : <strong>{{ weeklyCounters.nb_meeting ?? 0 }}</strong></span>
                    <span>En attente : <strong>{{ weeklyCounters.nb_pending ?? 0 }}</strong></span>
                </div>
            </div>

            <div
                v-if="crmHistories.length"
                class="p-3 mb-4 border border-gray-200 rounded-lg max-h-32 overflow-y-auto"
            >
                <p class="font-semibold text-primary mb-2 text-sm">
                    Historique récent
                </p>
                <ul class="space-y-2 text-xs">
                    <li
                        v-for="entry in crmHistories.slice(0, 5)"
                        :key="entry.id"
                        class="border-b border-gray-100 pb-2"
                    >
                        <span class="font-medium">{{ formatHistoryAction(entry.action_type ?? entry.field_name) }}</span>
                        <span v-if="entry.number_of_times"> — {{ entry.number_of_times }}×</span>
                        <span v-if="entry.comment" class="text-gray-600"> — {{ entry.comment }}</span>
                        <br>
                        <span class="text-gray-400">{{ formatDate(entry.created_at) }}</span>
                    </li>
                </ul>
            </div>

            <div class="flex flex-wrap gap-2 mb-4 border-b border-gray-300 pb-2">
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
                <p class="text-sm italic text-center text-gray-700">
                    {{ actionDescriptions[tradeTab] }}
                </p>

                <div class="flex flex-col gap-4 md:flex-row md:items-end">
                    <InputIcon
                        v-model="form.start_date"
                        type="date"
                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                    />
                    <InputIcon
                        v-model="form.end_date"
                        type="date"
                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                    />
                </div>

                <div
                    v-if="tradeTab === 'sale'"
                    class="flex flex-col w-full gap-1"
                >
                    <p class="text-gray-700 text-sm">
                        Produit
                    </p>
                    <Select v-model="form.produit_id">
                        <SelectTrigger
                            class="w-full bg-white border-2 border-gray-300 rounded-lg"
                        >
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

                <div class="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        @click="emit('update:open', false)"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        :in-progress="inProgress"
                    >
                        Enregistrer
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>
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

const { crmUser, getCrmHistories } = useCrm();
const { getAll } = useProduct();
const { $toast } = useNuxtApp();

const tradeTab = ref<CommercialActionType>(props.defaultActionType);
const products = ref<{ id: number; name: string }[]>([]);
const crmHistories = ref<Array<Record<string, unknown>>>([]);
const weeklyCounters = ref(props.initialCounters);
const comment = ref('');

const actionTabs: Array<{ key: CommercialActionType; label: string }> = [
    { key: 'call', label: 'Appels' },
    { key: 'sale', label: 'Ventes' },
    { key: 'recommandation', label: 'Recommandation' },
    { key: 'meeting', label: 'Rendez-vous' },
    { key: 'pending', label: 'Réponse en attente' },
];

const actionDescriptions: Record<CommercialActionType, string> = {
    call: 'Nombre d’appels passés sur la période',
    sale: 'Nombre de ventes sur la période',
    recommandation: 'Nombre de recommandations sur la période',
    meeting: 'Nombre de rendez-vous sur la période',
    pending: 'Nombre de réponses en attente sur la période',
};

const countLabels: Record<CommercialActionType, string> = {
    call: 'Nombre d\'appels',
    sale: 'Nombre de ventes',
    recommandation: 'Nombre de recommandations',
    meeting: 'Nombre de rendez-vous',
    pending: 'Nombre de réponses en attente',
};

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

function formatHistoryAction(action: string | null | undefined) {
    const labels: Record<string, string> = {
        call: 'Appel',
        sale: 'Vente',
        recommandation: 'Recommandation',
        meeting: 'Rendez-vous',
        pending: 'Réponse en attente',
    };
    return labels[action ?? ''] ?? action ?? 'Action';
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
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
    const payload = {
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
    };

    return await crmUser(payload);
}, {
    onSuccess: (response) => {
        const crm = response?.crm ?? response;
        weeklyCounters.value = {
            nb_call: crm.nb_call,
            nb_sale: crm.nb_sale,
            nb_recommandation: crm.nb_recommandation,
            nb_meeting: crm.nb_meeting,
            nb_pending: crm.nb_pending,
        };
        $toast({ description: 'Action commerciale enregistrée' });
        emit('crm-updated', crm);
        loadHistories();
        resetForm();
    },
    onError: () => {
        $toast({ description: 'Erreur lors de l\'enregistrement', variant: 'destructive' });
    },
});
</script>
