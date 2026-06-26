<template>
    <Dialog
        v-model:open="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
        <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-2">
            <DialogHeader>
                <DialogTitle class="text-lg font-semibold text-primary">
                    Bon de commande
                </DialogTitle>
            </DialogHeader>

            <p class="text-sm text-muted-foreground mb-4">
                {{ institutionName }}
            </p>

            <div
                v-if="subscription"
                class="space-y-4"
            >
                <div class="flex items-center justify-between gap-3">
                    <span class="text-sm text-muted-foreground">Statut</span>
                    <span
                        class="px-2 py-1 rounded text-xs font-medium"
                        :class="statusBadgeClass"
                    >
                        {{ statusLabel }}
                    </span>
                </div>

                <div
                    v-if="formulaLabel"
                    class="flex items-center justify-between gap-3"
                >
                    <span class="text-sm text-muted-foreground">Formule</span>
                    <span class="text-sm font-medium">{{ formulaLabel }}</span>
                </div>

                <div
                    v-if="subscription.created_at"
                    class="flex items-center justify-between gap-3"
                >
                    <span class="text-sm text-muted-foreground">Créé le</span>
                    <span class="text-sm">{{ formattedCreatedAt }}</span>
                </div>

                <div class="flex flex-wrap gap-2 pt-2">
                    <Button
                        v-if="subscription.contract_id && institutionId"
                        type="button"
                        variant="outline"
                        class="touch-manipulation"
                        :disabled="pdfLoading"
                        :in-progress="pdfLoading"
                        @click="viewContractPdf"
                    >
                        Voir le PDF
                    </Button>
                    <Button
                        v-if="subscription.can_send_for_signature && institutionId"
                        type="button"
                        class="touch-manipulation"
                        :disabled="signingLoading"
                        :in-progress="signingLoading"
                        @click="sendForSignature"
                    >
                        Envoyer pour signature
                    </Button>
                </div>

                <p
                    v-if="subscription.can_send_for_signature"
                    class="text-xs text-muted-foreground"
                >
                    Contrôlez le PDF avant l'envoi Documenso à l'institution.
                </p>
                <p
                    v-else-if="subscription.can_sign"
                    class="text-xs text-muted-foreground"
                >
                    Le lien de signature a été envoyé par email via Documenso.
                </p>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CrmInstitutionSubscription } from '~/lib/types';
import { useCrm } from '@/composables/useCrm';

const open = defineModel<boolean>('open', { default: false });

const props = defineProps<{
    institutionId: number | null;
    institutionName: string;
    subscription: CrmInstitutionSubscription | null;
}>();

const emit = defineEmits<{
    signed: [];
}>();

const { viewInstitutionSubscriptionPdf, sendInstitutionSubscriptionForSignature } = useCrm();
const { $toast } = useNuxtApp();

const pdfLoading = ref(false);
const signingLoading = ref(false);

const statusLabel = computed(() => {
    const subscription = props.subscription;
    if (!subscription?.status) {
        return 'Aucun bon de commande';
    }

    return subscription.status_label ?? subscription.status;
});

const formulaLabel = computed(() => {
    const formula = props.subscription?.formula;
    if (formula === 'institution_yearly_1500') {
        return '1 500 € / an';
    }
    if (formula === 'institution_monthly_150') {
        return '150 € / mois';
    }

    return null;
});

const formattedCreatedAt = computed(() => {
    const raw = props.subscription?.created_at;
    if (!raw) {
        return '';
    }

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
        return raw;
    }

    return date.toLocaleString('fr-BE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
});

const statusBadgeClass = computed(() => {
    const status = props.subscription?.status;
    if (!status) {
        return 'bg-gray-100 text-gray-700';
    }
    if (status === 'draft') {
        return 'bg-blue-100 text-blue-800';
    }
    if (status === 'paid' || status === 'accomplished') {
        return 'bg-green-100 text-green-800';
    }
    if (['sent_for_signature', 'sign', 'pending_signature', 'signed'].includes(status)) {
        return 'bg-amber-100 text-amber-800';
    }
    if (status === 'cancelled') {
        return 'bg-red-100 text-red-800';
    }

    return 'bg-gray-100 text-gray-700';
});

async function viewContractPdf() {
    const contractId = props.subscription?.contract_id;
    if (!contractId || !props.institutionId) {
        return;
    }

    pdfLoading.value = true;
    try {
        await viewInstitutionSubscriptionPdf(props.institutionId, contractId);
    }
    catch {
        $toast({
            description: 'Impossible d\'ouvrir le PDF.',
            variant: 'destructive',
        });
    }
    finally {
        pdfLoading.value = false;
    }
}

async function sendForSignature() {
    const contractId = props.subscription?.contract_id;
    if (!contractId || !props.institutionId) {
        return;
    }

    signingLoading.value = true;

    try {
        const response = await sendInstitutionSubscriptionForSignature(
            props.institutionId,
            contractId,
        );

        if (response.signing_url) {
            window.open(response.signing_url, '_blank', 'noopener,noreferrer');
        }

        $toast({
            description: response.message ?? 'Bon de commande envoyé pour signature.',
            variant: 'success',
        });

        emit('signed');
    }
    catch {
        $toast({
            description: 'Envoi Documenso impossible. Vérifiez la configuration ou réessayez.',
            variant: 'destructive',
        });
    }
    finally {
        signingLoading.value = false;
    }
}
</script>
