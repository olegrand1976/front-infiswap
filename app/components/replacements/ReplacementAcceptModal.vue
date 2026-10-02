<script setup lang="ts">
import { FileText, ShieldCheck } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ReplacementResponse } from '~/lib/types';
import type { ReplacementContractSignatureMode } from '~/composables/useReplacementContract';
import { getErrorMessage } from '~/lib/utils';
import { assertAllowedExternalRedirectUrl } from '~/utils/accessReturn';
import { buildContractCelebrationDedupeKey } from '~/utils/purchaseCelebration';

const props = defineProps<{
    open: boolean;
    response: ReplacementResponse | null;
    replacementId: number | string;
    isInstitutionRespondent: boolean;
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
    'accepted': [];
}>();

const { t } = useI18n();
const { $toast } = useNuxtApp();
const { changeStatus } = changeStatusReplacement();
const { checkoutContract, loading: contractLoading } = useReplacementContract();
const { trackEvent } = useProductAnalytics();
const { triggerCelebration } = usePurchaseCelebration();
const { isPremium: isProSubscriber, fetchStatus: fetchProStatus } = useProSubscription();

const signatureMode = ref<ReplacementContractSignatureMode>('pdf_download');
const includesPatientAccess = ref(false);
const accepting = ref(false);

const respondentName = computed(() => {
    const r = props.response?.respondent;
    if (!r) return t('replacements.acceptModal.defaultRespondentFallback');
    if (r.type === 'institution') return r.name ?? t('replacements.acceptModal.defaultInstitutionFallback');
    return [r.firstname, r.lastname].filter(Boolean).join(' ') || t('replacements.acceptModal.defaultRespondentFallback');
});

watch(() => props.open, async (isOpen) => {
    if (isOpen) {
        await fetchProStatus();
    }

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
        const result = await checkoutContract(Number(props.replacementId), props.response.id, {
            signatureMode: signatureMode.value,
            includesPatientAccess: includesPatientAccess.value,
        });

        if (result.kind === 'granted') {
            emit('accepted');
            emit('update:open', false);
            triggerCelebration({
                variant: 'contract',
                replacementId: Number(props.replacementId),
                dedupeKey: buildContractCelebrationDedupeKey(Number(props.replacementId)),
            });

            return;
        }

        const checkoutUrl = assertAllowedExternalRedirectUrl(result.url);
        if (checkoutUrl) {
            window.location.assign(checkoutUrl);
            return;
        }

        $toast({
            variant: 'destructive',
            description: t('replacements.paymentPageError'),
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
                    {{ t('replacements.acceptModal.dialogTitle', { name: respondentName }) }}
                </DialogTitle>
                <DialogDescription>
                    <template v-if="isProSubscriber">
                        {{ t('replacements.acceptModal.descPro') }}
                    </template>
                    <template v-else>
                        {{ t('replacements.acceptModal.descFree') }}
                    </template>
                </DialogDescription>
            </DialogHeader>

            <div
                v-if="isInstitutionRespondent"
                class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
            >
                {{ t('replacements.acceptModal.institutionNotAvailable') }}
            </div>

            <div
                v-else
                class="space-y-4"
            >
                <div class="rounded-lg border border-primary/15 bg-primary/5 p-3 text-sm space-y-2">
                    <p class="font-medium text-primary flex items-center gap-2">
                        <FileText class="size-4" />
                        {{ t('replacements.acceptModal.contractHeading', { suffix: isProSubscriber ? t('replacements.acceptModal.includedInPremium') : '3 €' }) }}
                    </p>
                    <ul class="list-disc pl-5 text-muted-foreground space-y-1">
                        <li>{{ t('replacements.acceptModal.bulletConsolidate', { name: respondentName }) }}</li>
                        <li>{{ t('replacements.acceptModal.bulletPeriod') }}</li>
                        <li>{{ t('replacements.acceptModal.bulletDelegation') }}</li>
                    </ul>
                </div>

                <SubscriptionProUpsellCallout
                    v-if="!isProSubscriber"
                    tone="amber"
                    :title="t('replacements.acceptModal.upsellTitle')"
                    :description="t('replacements.acceptModal.upsellDesc')"
                />

                <div class="space-y-3">
                    <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {{ t('replacements.acceptModal.signatureModeLabel') }}
                    </p>
                    <RadioGroup v-model="signatureMode">
                        <div class="flex items-center space-x-2">
                            <RadioGroupItem
                                id="sig-pdf"
                                value="pdf_download"
                            />
                            <Label for="sig-pdf">{{ t('replacements.acceptModal.pdfOption') }}</Label>
                        </div>
                        <div class="flex items-center space-x-2">
                            <RadioGroupItem
                                id="sig-electronic"
                                value="electronic"
                            />
                            <Label for="sig-electronic">{{ t('replacements.acceptModal.electronicOption') }}</Label>
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
                        {{ t('replacements.acceptModal.patientAccessLabel') }}
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
                    {{ t('replacements.acceptModal.acceptWithContractCta', { suffix: isProSubscriber ? t('replacements.acceptModal.includedShort') : '3 €' }) }}
                </Button>
                <Button
                    variant="outline"
                    class="w-full"
                    data-testid="replacement-accept-without-contract"
                    :in-progress="accepting"
                    @click="acceptWithoutContract"
                >
                    {{ t('replacements.acceptModal.acceptWithoutContractCta') }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
