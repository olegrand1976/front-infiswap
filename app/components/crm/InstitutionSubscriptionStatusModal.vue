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

                <div
                    v-if="clientSigningUrl || commercialSigningUrl"
                    class="space-y-2 rounded-lg border bg-muted/30 p-3"
                >
                    <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Liens Documenso
                    </p>
                    <div
                        v-if="clientSigningUrl"
                        class="flex flex-col gap-1"
                    >
                        <span class="text-xs text-muted-foreground">Client</span>
                        <div class="flex gap-2">
                            <Input
                                :model-value="clientSigningUrl"
                                readonly
                                class="text-xs"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                @click="copySigningUrl(clientSigningUrl)"
                            >
                                Copier
                            </Button>
                        </div>
                    </div>
                    <div
                        v-if="commercialSigningUrl"
                        class="flex flex-col gap-1"
                    >
                        <span class="text-xs text-muted-foreground">Commercial</span>
                        <div class="flex gap-2">
                            <Input
                                :model-value="commercialSigningUrl"
                                readonly
                                class="text-xs"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                @click="copySigningUrl(commercialSigningUrl)"
                            >
                                Copier
                            </Button>
                        </div>
                    </div>
                    <Button
                        v-if="subscription.can_sign && institutionId"
                        type="button"
                        variant="ghost"
                        size="sm"
                        class="touch-manipulation"
                        :disabled="resendLoading"
                        :in-progress="resendLoading"
                        @click="resendSignatureLinks"
                    >
                        Récupérer les liens
                    </Button>
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
                    <ConfirmDialog
                        v-if="canCancel && institutionId"
                        title="Archiver le bon de commande"
                        :description="archiveDescription"
                        confirm-text="Archiver"
                        cancel-text="Annuler"
                        :on-confirm="deleteDraft"
                    >
                        <template #trigger>
                            <Button
                                type="button"
                                variant="destructive"
                                class="touch-manipulation"
                                :disabled="deleteLoading"
                                :in-progress="deleteLoading"
                            >
                                Archiver le bon de commande
                            </Button>
                        </template>
                    </ConfirmDialog>
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
                    Ce bon de commande n'est pas encore signé. Vous pouvez l'archiver pour en créer un nouveau.
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
import ConfirmDialog from '~/components/ui/alert-dialog/ConfirmDialog.vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
    refreshed: [];
}>();

const {
    viewInstitutionSubscriptionPdf,
    sendInstitutionSubscriptionForSignature,
    resendInstitutionSubscriptionForSignature,
    deleteInstitutionSubscriptionDraft,
} = useCrm();
const { $toast } = useNuxtApp();

const pdfLoading = ref(false);
const signingLoading = ref(false);
const resendLoading = ref(false);
const deleteLoading = ref(false);

const localSigningUrls = ref<{ client: string | null; commercial: string | null } | null>(null);

watch(
    () => props.subscription,
    () => {
        localSigningUrls.value = null;
    },
    { deep: true },
);

const clientSigningUrl = computed(() =>
    localSigningUrls.value?.client
    ?? props.subscription?.signing_urls?.client
    ?? props.subscription?.client_signing_url
    ?? null,
);

const commercialSigningUrl = computed(() =>
    localSigningUrls.value?.commercial
    ?? props.subscription?.signing_urls?.commercial
    ?? props.subscription?.commercial_signing_url
    ?? null,
);

async function copySigningUrl(url: string) {
    try {
        await navigator.clipboard.writeText(url);
        $toast({ description: 'Lien copié dans le presse-papiers.' });
    }
    catch {
        $toast({ description: 'Impossible de copier le lien.', variant: 'destructive' });
    }
}

async function resendSignatureLinks() {
    const contractId = props.subscription?.contract_id;
    if (!contractId || !props.institutionId) {
        return;
    }

    resendLoading.value = true;
    try {
        const response = await resendInstitutionSubscriptionForSignature(props.institutionId, contractId);
        if (response.signing_urls) {
            localSigningUrls.value = {
                client: response.signing_urls.client ?? null,
                commercial: response.signing_urls.commercial ?? null,
            };
        }
        $toast({ description: response.message ?? 'Liens récupérés.' });
        emit('refreshed');
    }
    catch {
        $toast({ description: 'Impossible de récupérer les liens.', variant: 'destructive' });
    }
    finally {
        resendLoading.value = false;
    }
}

const archiveDescription = computed(() => {
    const reference = props.subscription?.reference ?? props.subscription?.contract_id;
    return reference
        ? `Le BC ${reference} sera retiré de la liste active. L'historique des actions sera conservé.`
        : 'Ce bon de commande sera archivé. L\'historique des actions sera conservé.';
});

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
        emit('refreshed');
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

    deleteLoading.value = true;

    try {
        const response = await deleteInstitutionSubscriptionDraft(props.institutionId, contractId);

        $toast({
            description: response.message ?? 'Bon de commande archivé.',
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
