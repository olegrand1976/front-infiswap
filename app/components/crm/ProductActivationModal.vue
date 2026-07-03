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

            <CrmReferrerPicker
                v-model:mode="referrerMode"
                v-model:selected-referrer="selectedReferrer"
                v-model:referrer-text="tempReferrerText"
                :referrers="userReferrer"
                :loading="referrerLoading"
                text-input-id="productReferrerFreeText"
                autocomplete-input-id="productReferrerAutocomplete"
            />

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
    targetUserId?: number;
    institutionId?: number;
    product: CrmProductKey;
    entityLabel?: string;
    referrer?: Referrer | null;
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
    'confirmed': [payload: {
        referred_by: Referrer;
        product: CrmProductKey;
        contact_user_id?: number;
    }];
}>();

const { $toast } = useNuxtApp();
const {
    loadingHistories,
    submitting,
    getProductCrmHistories,
    getInstitutionProductCrmHistories,
    activateProduct,
    activateInstitutionProduct,
    formatReferrerPayload,
} = useProductCrmHistory();
const { userReferrer, getUserReferrer, loading: referrerLoading } = useReferrer();

const effectiveDate = ref('');
const referrerMode = ref<'account' | 'text'>('account');
const tempReferrerText = ref('');
const selectedReferrer = ref<Referrer | null>(null);
const histories = ref<ProductCrmHistoryEntry[]>([]);

const productLabel = computed(() => (props.product === 'nursassur' ? 'NursAssur' : 'NursTech'));

function extractFetchErrorMessage(error: unknown): string {
    if (!error || typeof error !== 'object' || !('data' in error)) {
        return 'Une erreur est survenue';
    }

    const data = (error as { data?: Record<string, unknown> }).data;
    const errors = data?.errors;

    if (errors && typeof errors === 'object') {
        const first = Object.values(errors as Record<string, string[]>)
            .flat()
            .find(message => typeof message === 'string' && message.trim() !== '');

        if (first) {
            return first;
        }
    }

    if (typeof data?.message === 'string' && data.message.trim() !== '') {
        return data.message;
    }

    return 'Une erreur est survenue';
}

function todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
}

function prefillReferrer(referrer?: Referrer | null): void {
    referrerMode.value = 'account';
    tempReferrerText.value = '';
    selectedReferrer.value = referrer?.id ? referrer : null;
}

async function loadHistories(): Promise<void> {
    if (props.institutionId) {
        histories.value = await getInstitutionProductCrmHistories(props.institutionId, props.product);
        return;
    }

    if (props.targetUserId) {
        histories.value = await getProductCrmHistories(props.targetUserId, props.product);
    }
}

async function loadModalData(): Promise<void> {
    effectiveDate.value = todayIsoDate();
    prefillReferrer(props.referrer);
    await Promise.all([
        getUserReferrer(),
        loadHistories(),
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
        const activationPayload = {
            effective_date: effectiveDate.value,
            ...referrerPayload,
        };

        let contactUserId: number | undefined;

        if (props.institutionId) {
            const response = await activateInstitutionProduct(
                props.institutionId,
                props.product,
                activationPayload,
            );
            contactUserId = response.representative_user_id
                ?? (typeof response.user?.id === 'number' ? response.user.id : undefined);
        }
        else if (props.targetUserId) {
            await activateProduct(props.targetUserId, props.product, activationPayload);
            contactUserId = props.targetUserId;
        }

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
            contact_user_id: contactUserId,
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
            description: extractFetchErrorMessage(error),
            variant: 'destructive',
        });
    }
}
</script>
