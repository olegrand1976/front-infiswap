<template>
    <Dialog
        :open="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @update:open="emit('update:open', $event)"
    >
        <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-2 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle class="text-lg font-semibold text-primary">
                    Activer {{ productLabel }}
                </DialogTitle>
                <DialogDescription v-if="entityLabel">
                    {{ entityLabel }}
                </DialogDescription>
            </DialogHeader>

            <div class="mb-4">
                <label
                    for="productActivationDate"
                    class="block mb-1 text-sm font-medium text-gray-700"
                >
                    Date d'activation
                </label>
                <InputIcon
                    id="productActivationDate"
                    v-model="effectiveDate"
                    type="date"
                    class="w-full"
                />
            </div>

            <p class="font-semibold mb-4">
                Apporté par
            </p>

            <div class="flex flex-wrap gap-4 mb-4">
                <label class="inline-flex items-center">
                    <input
                        v-model="referrerMode"
                        type="radio"
                        value="account"
                        class="form-radio"
                    >
                    <span class="ml-2">Porteur d'affaire</span>
                </label>
                <label class="inline-flex items-center">
                    <input
                        v-model="referrerMode"
                        type="radio"
                        value="text"
                        class="form-radio"
                    >
                    <span class="ml-2">Texte libre</span>
                </label>
            </div>

            <div
                v-if="referrerMode === 'text'"
                class="mb-4"
            >
                <label
                    for="productReferrerFreeText"
                    class="block mb-1 text-sm font-medium text-gray-700"
                >
                    Nom ou source
                </label>
                <InputIcon
                    id="productReferrerFreeText"
                    v-model="tempReferrerText"
                    type="text"
                    class="w-full"
                    placeholder="Ex. Dr Dupont, salon Infirmiers 2025…"
                />
            </div>

            <template v-else>
                <RollingLoader
                    v-if="referrerLoading"
                    :loading="referrerLoading"
                />

                <template v-else>
                    <p
                        v-if="!userReferrer || userReferrer.length === 0"
                        class="text-gray-500 italic text-center py-4"
                    >
                        Pas encore de porteur d'affaire enregistré
                    </p>

                    <ul
                        v-else
                        class="space-y-2 max-h-48 overflow-y-auto mb-4"
                    >
                        <li
                            v-for="ref in userReferrer"
                            :key="ref.id"
                            class="cursor-pointer hover:bg-primary/90 hover:text-white p-2 rounded"
                            :class="{ 'bg-primary text-white font-semibold': selectedReferrer?.id === ref.id }"
                            @click="selectedReferrer = ref"
                        >
                            {{ ref.full_name }} ({{ ref.email }})
                        </li>
                    </ul>
                </template>
            </template>

            <div class="mt-6">
                <p class="font-semibold mb-2">
                    Historique
                </p>
                <RollingLoader
                    v-if="loadingHistories"
                    :loading="loadingHistories"
                />
                <p
                    v-else-if="histories.length === 0"
                    class="text-gray-500 italic text-sm"
                >
                    Aucun historique pour ce produit.
                </p>
                <ul
                    v-else
                    class="space-y-2 max-h-48 overflow-y-auto text-sm"
                >
                    <li
                        v-for="entry in histories"
                        :key="entry.id"
                        class="border rounded p-2"
                    >
                        <div class="flex justify-between gap-2">
                            <span :class="entry.activate ? 'text-green-700' : 'text-red-700'">
                                {{ entry.activate ? 'Activé' : 'Désactivé' }}
                            </span>
                            <span class="text-gray-500 shrink-0">{{ entry.created_at }}</span>
                        </div>
                        <p
                            v-if="entry.effective_date"
                            class="text-gray-600 mt-1"
                        >
                            Date effective : {{ entry.effective_date }}
                        </p>
                        <p
                            v-if="entry.referred_by_display"
                            class="text-gray-600"
                        >
                            Apporté par : {{ entry.referred_by_display }}
                        </p>
                        <p
                            v-if="entry.admin_name"
                            class="text-gray-500 text-xs mt-1"
                        >
                            Par {{ entry.admin_name }}
                        </p>
                    </li>
                </ul>
            </div>

            <div class="flex justify-end space-x-2 mt-6">
                <Button
                    variant="secondary"
                    class="px-4 py-2 rounded"
                    type="button"
                    :disabled="submitting"
                    @click="emit('update:open', false)"
                >
                    Annuler
                </Button>
                <Button
                    type="button"
                    class="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                    :disabled="submitting || !effectiveDate"
                    @click="confirmActivation"
                >
                    {{ submitting ? 'Enregistrement…' : 'Confirmer' }}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { InputIcon } from '~/components/ui/input-with-icon';
import type { CrmProductKey, ProductCrmHistoryEntry, Referrer } from '~/lib/types';

const props = defineProps<{
    open: boolean;
    targetUserId: number;
    product: CrmProductKey;
    entityLabel?: string;
    referrer?: Referrer | null;
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
    confirmed: [payload: {
        referred_by: Referrer;
        product: CrmProductKey;
    }];
}>();

const { $toast } = useNuxtApp();
const {
    loadingHistories,
    submitting,
    getProductCrmHistories,
    activateProduct,
    formatReferrerPayload,
} = useProductCrmHistory();
const { userReferrer, getUserReferrer, loading: referrerLoading } = useReferrer();

const effectiveDate = ref('');
const referrerMode = ref<'account' | 'text'>('text');
const tempReferrerText = ref('');
const selectedReferrer = ref<Referrer | null>(null);
const histories = ref<ProductCrmHistoryEntry[]>([]);

const productLabel = computed(() => (props.product === 'nursassur' ? 'NursAssur' : 'NursTech'));

function todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
}

function prefillReferrer(referrer?: Referrer | null): void {
    if (referrer?.text) {
        referrerMode.value = 'text';
        tempReferrerText.value = referrer.text;
        selectedReferrer.value = null;
        return;
    }

    if (referrer?.id) {
        referrerMode.value = 'account';
        tempReferrerText.value = '';
        selectedReferrer.value = referrer;
        return;
    }

    referrerMode.value = 'text';
    tempReferrerText.value = '';
    selectedReferrer.value = null;
}

async function loadModalData(): Promise<void> {
    effectiveDate.value = todayIsoDate();
    prefillReferrer(props.referrer);
    await Promise.all([
        getUserReferrer(),
        getProductCrmHistories(props.targetUserId, props.product).then((items) => {
            histories.value = items;
        }),
    ]);
}

watch(
    () => props.open,
    async (isOpen) => {
        if (isOpen) {
            await loadModalData();
        }
    },
);

async function confirmActivation(): Promise<void> {
    const referrerPayload = formatReferrerPayload(
        referrerMode.value,
        selectedReferrer.value,
        tempReferrerText.value,
    );

    try {
        await activateProduct(props.targetUserId, props.product, {
            effective_date: effectiveDate.value,
            ...referrerPayload,
        });

        const referredBy: Referrer = referrerPayload.referred_by_text
            ? { text: referrerPayload.referred_by_text }
            : {
                    id: referrerPayload.referred_by ?? undefined,
                    full_name: selectedReferrer.value?.full_name,
                    email: selectedReferrer.value?.email,
                };

        emit('confirmed', {
            referred_by: referredBy,
            product: props.product,
        });

        $toast({
            description: `${productLabel.value} activé avec succès`,
            variant: 'success',
        });

        emit('update:open', false);
    }
    catch (error) {
        console.error(error);
        $toast({
            description: 'Une erreur est survenue',
            variant: 'destructive',
        });
    }
}
</script>
