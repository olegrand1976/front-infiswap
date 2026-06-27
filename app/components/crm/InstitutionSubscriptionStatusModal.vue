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

                <div
                    v-if="subscription.reference"
                    class="flex items-center justify-between gap-3"
                >
                    <span class="text-sm text-muted-foreground">Référence BC</span>
                    <span class="text-sm font-medium">{{ subscription.reference }}</span>
                </div>

                <div
                    v-if="subscription.requester"
                    class="flex items-center justify-between gap-3"
                >
                    <span class="text-sm text-muted-foreground">Commercial</span>
                    <span class="text-sm">{{ subscription.requester.full_name }}</span>
                </div>

                <div
                    v-if="subscription.signatory"
                    class="flex items-center justify-between gap-3"
                >
                    <span class="text-sm text-muted-foreground">Signataire client</span>
                    <span class="text-sm">{{ subscription.signatory.full_name }}</span>
                </div>

                <div
                    v-if="subscription.signed_at"
                    class="flex items-center justify-between gap-3"
                >
                    <span class="text-sm text-muted-foreground">Signé le</span>
                    <span class="text-sm">{{ formattedSignedAt }}</span>
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
                        {{ subscription.has_signed_pdf ? 'Voir BC signé' : 'Voir le PDF' }}
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
                    <Button
                        v-if="canCancel && institutionId"
                        type="button"
                        variant="destructive"
                        class="touch-manipulation"
                        :disabled="deleteLoading"
                        :in-progress="deleteLoading"
                        @click="deleteDraft"
                    >
                        Annuler le bon de commande
                    </Button>
                    <Button
                        v-if="subscription.contract_id"
                        type="button"
                        variant="outline"
                        class="touch-manipulation"
                        as-child
                    >
                        <NuxtLink :to="`/dashboard/admin/contracts/institutions?contract=${subscription.contract_id}`">
                            Suivi BC / facturation
                        </NuxtLink>
                    </Button>
                </div>

                <p
                    v-if="canCancel"
                    class="text-xs text-muted-foreground"
                >
                    Ce bon de commande n'est pas encore signé. Vous pouvez l'annuler pour en créer un nouveau.
                </p>
                <p
                    v-else-if="subscription.can_send_for_signature"
                    class="text-xs text-muted-foreground"
                >
                    Contrôlez le PDF avant l'envoi Documenso à l'institution.
                </p>
                <p
                    v-else-if="subscription.can_sign"
                    class="text-xs text-muted-foreground"
                >
                    Les liens de signature ont été envoyés par e-mail via Documenso au client et au commercial.
                </p>
                <p
                    v-else-if="!subscription.can_create && subscription.status"
                    class="text-xs text-muted-foreground"
                >
                    Un bon de commande est déjà en cours pour cette institution.
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
    deleted: [];
}>();

const { viewInstitutionSubscriptionPdf, sendInstitutionSubscriptionForSignature, deleteInstitutionSubscriptionDraft } = useCrm();
const { $toast } = useNuxtApp();

const pdfLoading = ref(false);
const signingLoading = ref(false);
const deleteLoading = ref(false);

const canCancel = computed(() =>
    props.subscription?.can_cancel ?? props.subscription?.can_delete_draft ?? false,
);

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

    return formatSubscriptionDate(raw);
});

const formattedSignedAt = computed(() => {
    const raw = props.subscription?.signed_at;
    if (!raw) {
        return '';
    }

    return formatSubscriptionDate(raw);
});

function formatSubscriptionDate(raw: string): string {
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
}

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

        if (response.signing_urls?.commercial) {
            window.open(response.signing_urls.commercial, '_blank', 'noopener,noreferrer');
        }
        else if (response.signing_url) {
            window.open(response.signing_url, '_blank', 'noopener,noreferrer');
        }

        $toast({
            description: response.message ?? 'Bon de commande envoyé. Le client et le commercial recevront un e-mail Documenso.',
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

async function deleteDraft() {
    const contractId = props.subscription?.contract_id;
    if (!contractId || !props.institutionId || !canCancel.value) {
        return;
    }

    if (!window.confirm('Supprimer ce brouillon de bon de commande ?')) {
        return;
    }

    deleteLoading.value = true;

    try {
        const response = await deleteInstitutionSubscriptionDraft(props.institutionId, contractId);

        $toast({
            description: response.message ?? 'Brouillon supprimé.',
            variant: 'success',
        });

        open.value = false;
        emit('deleted');
    }
    catch {
        $toast({
            description: 'Impossible de supprimer le brouillon.',
            variant: 'destructive',
        });
    }
    finally {
        deleteLoading.value = false;
    }
}
</script>
