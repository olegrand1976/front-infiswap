<template>
    <Dialog v-model:open="open">
        <DialogContent class="max-w-md gap-0 overflow-hidden p-0">
            <div class="px-6 pt-6 pb-4">
                <DialogHeader class="space-y-1 text-left">
                    <DialogTitle class="text-xl font-semibold text-primary">
                        Offre commerciale
                    </DialogTitle>
                    <DialogDescription class="text-sm text-muted-foreground">
                        {{ institutionName }}
                    </DialogDescription>
                </DialogHeader>
            </div>

            <div class="px-6 pb-6 space-y-4">
                <div
                    v-if="offerReference"
                    class="rounded-lg border bg-muted/30 px-4 py-3 text-sm"
                >
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Référence
                    </p>
                    <p class="font-semibold">
                        {{ offerReference }}
                    </p>
                    <p
                        v-if="offerStatusLabel"
                        class="mt-1 text-muted-foreground"
                    >
                        Statut : {{ offerStatusLabel }}
                    </p>
                </div>

                <div
                    v-if="canEditFields"
                    class="space-y-4"
                >
                    <div class="grid gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            class="rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5 touch-manipulation"
                            :class="paymentMode === 'monthly' ? 'border-primary bg-primary/5 ring-2 ring-primary' : ''"
                            :disabled="busy"
                            @click="paymentMode = 'monthly'"
                        >
                            <p class="font-semibold">
                                Mensuel
                            </p>
                            <p class="text-sm text-muted-foreground">
                                150 € à 250 € HTVA
                            </p>
                        </button>

                        <button
                            type="button"
                            class="rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5 touch-manipulation"
                            :class="paymentMode === 'yearly' ? 'border-primary bg-primary/5 ring-2 ring-primary' : ''"
                            :disabled="busy"
                            @click="paymentMode = 'yearly'"
                        >
                            <p class="font-semibold">
                                Annuel
                            </p>
                            <p class="text-sm text-muted-foreground">
                                1 500 € à 2 500 € HTVA
                            </p>
                        </button>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-foreground">
                            Montant HTVA
                        </label>
                        <Input
                            v-model.number="amountHtva"
                            type="number"
                            :min="amountMin"
                            :max="amountMax"
                            step="1"
                            class="mt-1"
                            :disabled="busy"
                        />
                        <p class="mt-1 text-xs text-muted-foreground">
                            Entre {{ amountMin }} € et {{ amountMax }} €
                        </p>
                    </div>
                </div>

                <div
                    v-else-if="amountLabel"
                    class="rounded-lg border px-4 py-3"
                >
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Tarif retenu
                    </p>
                    <p class="font-semibold text-lg">
                        {{ amountLabel }}
                    </p>
                </div>

                <DialogFooter class="flex flex-col gap-2 sm:flex-col sm:justify-stretch sm:space-x-0">
                    <Button
                        v-if="canEditFields"
                        type="button"
                        class="w-full touch-manipulation"
                        :disabled="busy || !isAmountValid"
                        :in-progress="saving"
                        @click="saveOffer"
                    >
                        Enregistrer le brouillon
                    </Button>

                    <Button
                        v-if="currentOfferId"
                        variant="outline"
                        type="button"
                        class="w-full touch-manipulation"
                        :disabled="busy"
                        @click="previewPdf"
                    >
                        Voir le PDF
                    </Button>

                    <Button
                        v-if="canValidate"
                        type="button"
                        class="w-full touch-manipulation"
                        :disabled="busy"
                        :in-progress="validating"
                        @click="validateOffer"
                    >
                        Valider l'offre
                    </Button>

                    <Button
                        v-if="canConvert"
                        type="button"
                        class="w-full touch-manipulation"
                        :disabled="busy"
                        :in-progress="converting"
                        @click="convertOffer"
                    >
                        Générer le bon de commande
                    </Button>

                    <Button
                        v-if="canCancel"
                        variant="ghost"
                        type="button"
                        class="w-full touch-manipulation text-destructive hover:bg-destructive/10 hover:text-destructive"
                        :disabled="busy"
                        :in-progress="cancelling"
                        @click="cancelOffer"
                    >
                        Annuler l'offre
                    </Button>

                    <Button
                        variant="secondary"
                        type="button"
                        class="w-full touch-manipulation"
                        :disabled="busy"
                        @click="open = false"
                    >
                        Fermer
                    </Button>
                </DialogFooter>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCrm } from '@/composables/useCrm';
import type { CrmInstitutionCommercialOffer } from '@/lib/types';

const open = defineModel<boolean>('open', { default: false });

const props = defineProps<{
    institutionId: number | null;
    institutionName: string;
    offer: CrmInstitutionCommercialOffer | null | undefined;
}>();

const emit = defineEmits<{
    updated: [offer: CrmInstitutionCommercialOffer];
    converted: [payload: {
        offer: CrmInstitutionCommercialOffer;
        contractId: number;
        contract?: {
            id: number;
            formula?: string | null;
            reference?: string | null;
            status?: string | null;
            created_at?: string | null;
        };
    }];
}>();

const {
    saveInstitutionCommercialOffer,
    validateInstitutionCommercialOffer,
    convertInstitutionCommercialOffer,
    cancelInstitutionCommercialOffer,
    viewInstitutionCommercialOfferPdf,
} = useCrm();
const { $toast } = useNuxtApp();

const paymentMode = ref<'monthly' | 'yearly'>('monthly');
const amountHtva = ref(150);
const saving = ref(false);
const validating = ref(false);
const converting = ref(false);
const cancelling = ref(false);

const busy = computed(() => saving.value || validating.value || converting.value || cancelling.value);
const amountMin = computed(() => (paymentMode.value === 'monthly' ? 150 : 1500));
const amountMax = computed(() => (paymentMode.value === 'monthly' ? 250 : 2500));
const isAmountValid = computed(() => amountHtva.value >= amountMin.value && amountHtva.value <= amountMax.value);
const currentOfferId = computed(() => props.offer?.id ?? null);
const offerReference = computed(() => props.offer?.reference ?? null);
const offerStatusLabel = computed(() => props.offer?.status_label ?? null);
const amountLabel = computed(() => props.offer?.amount_label ?? null);
const canEditFields = computed(() => props.offer?.status === 'draft' || !props.offer?.id);
const canValidate = computed(() => props.offer?.can_validate === true && currentOfferId.value !== null);
const canConvert = computed(() => props.offer?.can_convert === true && currentOfferId.value !== null);
const canCancel = computed(() => props.offer?.can_cancel === true && currentOfferId.value !== null);

watch(open, (isOpen) => {
    if (!isOpen) {
        return;
    }

    syncFromOffer();
});

watch(paymentMode, (mode) => {
    if (mode === 'monthly' && amountHtva.value > 250) {
        amountHtva.value = 250;
    }
    if (mode === 'monthly' && amountHtva.value < 150) {
        amountHtva.value = 150;
    }
    if (mode === 'yearly' && amountHtva.value < 1500) {
        amountHtva.value = 1500;
    }
    if (mode === 'yearly' && amountHtva.value > 2500) {
        amountHtva.value = 2500;
    }
});

function syncFromOffer() {
    if (props.offer?.payment_mode) {
        paymentMode.value = props.offer.payment_mode;
    }
    else {
        paymentMode.value = 'monthly';
    }

    if (props.offer?.amount_htva != null) {
        amountHtva.value = props.offer.amount_htva;
    }
    else {
        amountHtva.value = paymentMode.value === 'monthly' ? 150 : 1500;
    }
}

async function saveOffer() {
    if (!props.institutionId || !isAmountValid.value) {
        return;
    }

    saving.value = true;
    try {
        const response = await saveInstitutionCommercialOffer(
            props.institutionId,
            { payment_mode: paymentMode.value, amount_htva: amountHtva.value },
            currentOfferId.value,
        );
        emit('updated', response.offer as CrmInstitutionCommercialOffer);
        $toast({ description: response.message ?? 'Offre enregistrée.', variant: 'success' });
    }
    catch (error: unknown) {
        const message = (error as { data?: { message?: string } })?.data?.message;
        $toast({ description: message ?? 'Impossible d\'enregistrer l\'offre.', variant: 'destructive' });
    }
    finally {
        saving.value = false;
    }
}

async function previewPdf() {
    if (!props.institutionId || !currentOfferId.value) {
        return;
    }

    try {
        await viewInstitutionCommercialOfferPdf(props.institutionId, currentOfferId.value);
    }
    catch {
        $toast({ description: 'Erreur lors du chargement du PDF.', variant: 'destructive' });
    }
}

async function validateOffer() {
    if (!props.institutionId || !currentOfferId.value) {
        return;
    }

    validating.value = true;
    try {
        const response = await validateInstitutionCommercialOffer(props.institutionId, currentOfferId.value);
        emit('updated', response.offer as CrmInstitutionCommercialOffer);
        $toast({ description: response.message ?? 'Offre validée.', variant: 'success' });
    }
    catch (error: unknown) {
        const message = (error as { data?: { message?: string } })?.data?.message;
        $toast({ description: message ?? 'Impossible de valider l\'offre.', variant: 'destructive' });
    }
    finally {
        validating.value = false;
    }
}

async function convertOffer() {
    if (!props.institutionId || !currentOfferId.value) {
        return;
    }

    converting.value = true;
    try {
        const response = await convertInstitutionCommercialOffer(props.institutionId, currentOfferId.value);
        const contract = response.contract as { id: number };
        emit('converted', {
            offer: response.offer as CrmInstitutionCommercialOffer,
            contractId: contract.id,
            contract: response.contract as {
                id: number;
                formula?: string | null;
                reference?: string | null;
                status?: string | null;
                created_at?: string | null;
            },
        });
        $toast({ description: response.message ?? 'Bon de commande généré.', variant: 'success' });
        open.value = false;
    }
    catch (error: unknown) {
        const message = (error as { data?: { message?: string } })?.data?.message;
        $toast({ description: message ?? 'Impossible de générer le bon de commande.', variant: 'destructive' });
    }
    finally {
        converting.value = false;
    }
}

function emptyCommercialOfferPayload(): CrmInstitutionCommercialOffer {
    return {
        id: null,
        reference: null,
        status: null,
        status_label: null,
        payment_mode: null,
        amount_htva: null,
        amount_label: null,
        can_edit: true,
        can_validate: false,
        can_convert: false,
        can_cancel: false,
    };
}

async function cancelOffer() {
    if (!props.institutionId || !currentOfferId.value) {
        return;
    }

    cancelling.value = true;
    try {
        const response = await cancelInstitutionCommercialOffer(props.institutionId, currentOfferId.value);
        emit('updated', emptyCommercialOfferPayload());
        $toast({ description: response.message ?? 'Offre annulée.', variant: 'success' });
    }
    catch (error: unknown) {
        const message = (error as { data?: { message?: string } })?.data?.message;
        $toast({ description: message ?? 'Impossible d\'annuler l\'offre.', variant: 'destructive' });
    }
    finally {
        cancelling.value = false;
    }
}
</script>
