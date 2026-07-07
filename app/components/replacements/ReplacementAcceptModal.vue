<script setup lang="ts">
import { FileText, ShieldCheck } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ReplacementResponse } from '~/lib/types';
import type { ReplacementContractSignatureMode } from '~/composables/useReplacementContract';
import { getErrorMessage } from '~/lib/utils';

const props = defineProps<{
    open: boolean;
    response: ReplacementResponse | null;
    replacementId: number | string;
    isInstitutionRespondent: boolean;
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
    accepted: [];
}>();

const { $toast } = useNuxtApp();
const { changeStatus } = changeStatusReplacement();
const { checkoutContract, loading: contractLoading } = useReplacementContract();
const { trackEvent } = useProductAnalytics();

const signatureMode = ref<ReplacementContractSignatureMode>('pdf_download');
const includesPatientAccess = ref(false);
const accepting = ref(false);

const respondentName = computed(() => {
    const r = props.response?.respondent;
    if (!r) return 'cette collègue';
    if (r.type === 'institution') return r.name ?? 'cette institution';
    return [r.firstname, r.lastname].filter(Boolean).join(' ') || 'cette collègue';
});

watch(() => props.open, (isOpen) => {
    if (isOpen && props.response?.id) {
        trackEvent('contract_offer_shown', {
            replacement_id: String(props.replacementId),
            response_id: String(props.response.id),
        });
        signatureMode.value = 'pdf_download';
        includesPatientAccess.value = false;
    }
});

async function acceptWithoutContract() {
    if (!props.response?.id) return;

    trackEvent('contract_cta_click', {
        with_contract: false,
        signature_mode: 'none',
    });

    accepting.value = true;
    try {
        await changeStatus(props.response.id, 'confirmed');
        emit('accepted');
        emit('update:open', false);
    }
    catch (error) {
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
    }
    finally {
        accepting.value = false;
    }
}

async function acceptWithContract() {
    if (!props.response?.id) return;

    trackEvent('contract_cta_click', {
        with_contract: true,
        signature_mode: signatureMode.value,
    });

    accepting.value = true;
    try {
        const url = await checkoutContract(Number(props.replacementId), props.response.id, {
            signatureMode: signatureMode.value,
            includesPatientAccess: includesPatientAccess.value,
        });

        if (url) {
            window.location.assign(url);
            return;
        }

        $toast({
            variant: 'destructive',
            description: 'Impossible d\'ouvrir la page de paiement.',
        });
    }
    catch (error) {
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
    }
    finally {
        accepting.value = false;
    }
}
</script>

<template>
    <Dialog
        :open="open"
        @update:open="emit('update:open', $event)"
    >
        <DialogContent class="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2">
                    <ShieldCheck class="size-5 text-primary" />
                    Confirmer {{ respondentName }}
                </DialogTitle>
                <DialogDescription>
                    Validez ce remplacement avec ou sans contrat légal (3 €).
                </DialogDescription>
            </DialogHeader>

            <div
                v-if="isInstitutionRespondent"
                class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
            >
                Le contrat de remplacement n'est pas encore disponible pour les candidatures institution.
            </div>

            <div
                v-else
                class="space-y-4"
            >
                <div class="rounded-lg border border-primary/15 bg-primary/5 p-3 text-sm space-y-2">
                    <p class="font-medium text-primary flex items-center gap-2">
                        <FileText class="size-4" />
                        Contrat de remplacement — 3 €
                    </p>
                    <ul class="list-disc pl-5 text-muted-foreground space-y-1">
                        <li>Consolide l'accord entre vous et {{ respondentName }}</li>
                        <li>Période et identités des deux parties</li>
                        <li>Option délégation patientèle si vous le souhaitez</li>
                    </ul>
                </div>

                <div class="space-y-3">
                    <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Mode de signature
                    </p>
                    <RadioGroup v-model="signatureMode">
                        <div class="flex items-center space-x-2">
                            <RadioGroupItem
                                id="sig-pdf"
                                value="pdf_download"
                            />
                            <Label for="sig-pdf">Télécharger le PDF à imprimer</Label>
                        </div>
                        <div class="flex items-center space-x-2">
                            <RadioGroupItem
                                id="sig-electronic"
                                value="electronic"
                            />
                            <Label for="sig-electronic">Signature électronique</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div class="flex items-start gap-2">
                    <Checkbox
                        id="patient-access"
                        :checked="includesPatientAccess"
                        @update:checked="(v) => includesPatientAccess = v === true"
                    />
                    <Label
                        for="patient-access"
                        class="text-sm leading-snug cursor-pointer"
                    >
                        J'autorise l'accès à ma patientèle pour la durée du remplacement (opt-in explicite).
                    </Label>
                </div>
            </div>

            <DialogFooter class="flex-col gap-2 sm:flex-col">
                <Button
                    v-if="!isInstitutionRespondent"
                    class="w-full bg-success hover:bg-success/90"
                    :in-progress="accepting || contractLoading"
                    @click="acceptWithContract"
                >
                    Accepter avec contrat — 3 €
                </Button>
                <Button
                    variant="outline"
                    class="w-full"
                    :in-progress="accepting"
                    @click="acceptWithoutContract"
                >
                    Accepter sans contrat
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
