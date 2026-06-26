<template>
    <div>
        <div
            v-if="selectedCount > 0"
            class="mb-3 flex items-center gap-3 px-2"
        >
            <span class="text-sm text-gray-600">{{ selectedCount }} sélectionné(s)</span>
            <Button
                size="sm"
                variant="outline"
                class="rounded-md"
                @click="exportSelectedCsv"
            >
                Exporter la sélection
            </Button>
        </div>
        <div class="md:hidden space-y-3 mb-4">
            <article
                v-for="institution in localInstitutions"
                :key="`mobile-institution-${institution.id}`"
                class="rounded-lg border bg-white p-4 shadow-sm"
            >
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <p class="font-semibold text-foreground">
                            {{ institution.full_name }}
                        </p>
                        <p
                            v-if="institution.zip_code || institution.city"
                            class="text-sm text-muted-foreground mt-1"
                        >
                            {{ [institution.zip_code, institution.city].filter(Boolean).join(' ') }}
                        </p>
                    </div>
                    <Button
                        v-if="!isCollaborator"
                        type="button"
                        size="sm"
                        :variant="canCreateInstitutionSubscription(institution) ? 'default' : 'outline'"
                        class="shrink-0 touch-manipulation min-h-10"
                        @click="handleSubscriptionClick(institution)"
                    >
                        {{ institutionSubscriptionLabel(institution) }}
                    </Button>
                </div>
                <div class="mt-3 flex items-center gap-3">
                    <button
                        type="button"
                        class="text-sm text-primary underline touch-manipulation"
                        @click="openModal(institution)"
                    >
                        Voir le détail
                    </button>
                </div>
            </article>
        </div>
        <DataTable
            ref="dataTableRef"
            class="hidden md:block"
            :data="localInstitutions"
            :columns="columns"
            manual-sorting
        />

        <Dialog
            v-model:open="showModal"
            class="fixed inset-0 z-50 flex justify-center items-center bg-black/50"
        >
            <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-2">
                <div
                    v-if="selectedInstitution"
                    class="space-y-3"
                >
                    <h3 class="text-lg font-semibold text-primary">
                        {{ selectedInstitution.full_name }}
                    </h3>
                    <p class="text-sm">
                        {{ selectedInstitution.email }}
                    </p>
                    <p
                        v-if="selectedInstitution.company_number"
                        class="text-sm text-muted-foreground"
                    >
                        N° entreprise : {{ selectedInstitution.company_number }}
                    </p>
                    <NuxtLink
                        :to="`/dashboard/admin/institutions/${selectedInstitution.id}/show`"
                        class="inline-flex text-sm text-primary underline"
                    >
                        Voir la fiche institution
                    </NuxtLink>
                    <Button
                        v-if="!isCollaborator && selectedInstitution"
                        type="button"
                        class="w-full sm:w-auto touch-manipulation"
                        :variant="canCreateInstitutionSubscription(selectedInstitution) ? 'default' : 'outline'"
                        @click="handleSubscriptionClick(selectedInstitution)"
                    >
                        {{ institutionSubscriptionLabel(selectedInstitution) }}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog
            v-model:open="contactDialogOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <DialogContent class="bg-white rounded-lg p-6 max-w-md w-full">
                <DialogHeader>
                    <DialogTitle class="text-lg font-semibold text-primary mb-4">
                        Modifier le contact
                    </DialogTitle>
                </DialogHeader>
                <form @submit.prevent="saveContact">
                    <div class="mb-4">
                        <label
                            for="contactDate"
                            class="block mb-1 text-sm font-medium text-gray-700"
                        >
                            Date de contact
                        </label>
                        <InputIcon
                            id="contactDate"
                            v-model="tempContactDate"
                            type="date"
                            class="w-full"
                        />
                    </div>
                    <div class="mb-4">
                        <span class="block mb-1 text-sm font-medium text-gray-700">Mode de contact</span>
                        <div class="flex space-x-4">
                            <label class="inline-flex items-center">
                                <input
                                    v-model="tempContactMethod"
                                    type="radio"
                                    value="mail"
                                    class="form-radio"
                                >
                                <span class="ml-2">Mail</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    v-model="tempContactMethod"
                                    type="radio"
                                    value="phone"
                                    class="form-radio"
                                >
                                <span class="ml-2">Téléphone</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    v-model="tempContactMethod"
                                    type="radio"
                                    value="visio"
                                    class="form-radio"
                                >
                                <span class="ml-2">Visioconférence</span>
                            </label>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <Button
                            variant="secondary"
                            class="px-4 py-2 rounded"
                            type="button"
                            @click="contactDialogOpen = false"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            class="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                        >
                            Valider
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog
            v-model:open="commentDialogOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <DialogContent class="bg-white rounded-lg w-full min-h-[40vh] sm:min-h-[300px] sm:max-w-[700px] max-h-[700px] flex flex-col">
                <DialogHeader class="shrink-0">
                    <DialogTitle class="text-primary">
                        Commentaires
                    </DialogTitle>
                </DialogHeader>

                <div class="flex-1 overflow-y-auto space-y-4">
                    <RollingLoader
                        v-if="loading"
                        :loading="loading"
                    />
                    <div v-else>
                        <div
                            v-for="comment in userComments"
                            :key="comment.id"
                            class="bg-white p-4 rounded-lg shadow-md"
                        >
                            <div class="text-gray-700 text-sm mb-2 flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <span>{{ formatRelativeDate(comment.created_at) }}</span>
                                    <span
                                        v-if="comment.created_at !== comment.updated_at"
                                        class=" text-xs font-semibold"
                                    >Modifié</span>
                                </div>
                                <div>
                                    <EditAndDeleteAction
                                        :on-delete="() => deleteComment(comment)"
                                        :on-edit="() => prepareCommentToUpdate(comment)"
                                    />
                                </div>
                            </div>
                            <p class="text-gray-700 w-full wrap-break-word whitespace-normal">
                                {{ comment.body ?? '' }}
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    class="shrink-0 pt-2"
                    @submit.prevent="createOrUpdateComment"
                >
                    <h3 class="text-md font-bold mb-2">
                        {{ updatingComment!== null ? 'Modification Commentaire' : 'Nouveau commentaire' }}
                    </h3>
                    <Textarea
                        v-model="updateFormData.lastComment"
                        class="w-full h-16 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                    />
                    <Button
                        class="rounded"
                        type="submit"
                        :in-progress="progressingComment"
                    >
                        {{ updatingComment !== null ? 'Modifier' : 'Créer' }}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog
            v-model:open="referrerDialogOpen"
            class="fixed inset-0 flex justify-center items-center bg-black/50"
        >
            <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-2">
                <p class="font-semibold mb-4">
                    Sélectionner un référent
                </p>

                <RollingLoader
                    v-if="loading"
                    :loading="loading"
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
                        class="space-y-2 max-h-64 overflow-y-auto"
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

                <div class="flex justify-end space-x-2 mt-4">
                    <Button
                        variant="secondary"
                        class="px-4 py-2 rounded"
                        type="button"
                        @click="referrerDialogOpen = false"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        class="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                        @click="confirmReferrer"
                    >
                        Valider
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog
            v-model:open="subscriptionModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-2">
                <DialogHeader>
                    <DialogTitle class="text-lg font-semibold text-primary">
                        Abonnement institution
                    </DialogTitle>
                </DialogHeader>

                <p class="text-sm text-muted-foreground mb-4">
                    {{ subscriptionInstitutionName }}
                </p>

                <template v-if="subscriptionModalStep === 'formula'">
                    <div class="grid gap-4 sm:grid-cols-2">
                        <button
                            type="button"
                            class="rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5 touch-manipulation"
                            :class="selectedSubscriptionFormula === 'institution_monthly_150' ? 'border-primary bg-primary/5 ring-2 ring-primary' : ''"
                            :disabled="subscriptionLoading"
                            @click="selectedSubscriptionFormula = 'institution_monthly_150'"
                        >
                            <p class="font-semibold text-lg">
                                150 €
                            </p>
                            <p class="text-sm text-muted-foreground">
                                par mois
                            </p>
                        </button>

                        <button
                            type="button"
                            class="rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5 touch-manipulation"
                            :class="selectedSubscriptionFormula === 'institution_yearly_1500' ? 'border-primary bg-primary/5 ring-2 ring-primary' : ''"
                            :disabled="subscriptionLoading"
                            @click="selectedSubscriptionFormula = 'institution_yearly_1500'"
                        >
                            <p class="font-semibold text-lg">
                                1 500 €
                            </p>
                            <p class="text-sm text-muted-foreground">
                                par an
                            </p>
                        </button>
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <Button
                            variant="secondary"
                            type="button"
                            :disabled="subscriptionLoading"
                            @click="subscriptionModalOpen = false"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="button"
                            :disabled="!selectedSubscriptionFormula || subscriptionLoading"
                            :in-progress="subscriptionLoading"
                            @click="generateInstitutionSubscription"
                        >
                            Générer le bon de commande
                        </Button>
                    </div>
                </template>

                <template v-else>
                    <p class="text-sm text-muted-foreground mb-4">
                        Vérifiez le contenu du PDF avant l'envoi pour signature électronique.
                    </p>

                    <div class="flex flex-col sm:flex-row gap-2 mt-6">
                        <Button
                            variant="outline"
                            type="button"
                            class="touch-manipulation"
                            :disabled="subscriptionLoading"
                            @click="previewPendingSubscriptionPdf"
                        >
                            Voir le PDF
                        </Button>
                        <Button
                            type="button"
                            class="touch-manipulation"
                            :disabled="subscriptionLoading"
                            :in-progress="subscriptionLoading"
                            @click="sendPendingSubscriptionForSignature"
                        >
                            Envoyer pour signature
                        </Button>
                    </div>
                </template>
            </DialogContent>
        </Dialog>

        <InstitutionSubscriptionStatusModal
            v-model:open="subscriptionStatusModalOpen"
            :institution-id="subscriptionInstitutionId"
            :institution-name="subscriptionInstitutionName"
            :subscription="subscriptionStatusData"
            @signed="onSubscriptionStatusChanged"
        />

        <div>
            <CustomPagination
                :default-page="page"
                :internal-per-page="perPage"
                :total="props.institutions?.total"
                @update:page="emit('refresh-institutions', $event)"
                @update:per-page="emit('handle-per-page-change', $event)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown, Eye, Pencil } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import type { Comment, CrmInstitution, Pagination, Referrer, User } from '~/lib/types';
import { InputIcon } from '~/components/ui/input-with-icon';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { Switch } from '~/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/composables/useAuth';
import { formatRelativeDate } from '@/composables/useDate';
import { useCrm } from '@/composables/useCrm';
import { useComment } from '~/composables/useComment';
import InstitutionSubscriptionStatusModal from './InstitutionSubscriptionStatusModal.vue';

const props = defineProps<{
    institutions: Pagination<CrmInstitution>;
    page: number;
    perPage: number;
}>();

const authUser = useState('user');

const emit = defineEmits(['refresh-institutions', 'handle-per-page-change', 'set-sort', 'update-institutions']);
const { loading, userComments, getUserComments, destroy, store, update } = useComment();
const { updateReferrer, userReferrer, getUserReferrer } = useReferrer();

const showModal = ref(false);
const contactDialogOpen = ref(false);
const commentDialogOpen = ref(false);
const referrerDialogOpen = ref(false);
const tempContactDate = ref('');
const tempContactMethod = ref('mail');
const editingUserId = ref<number | null>(null);
const tempCrmId = ref<number | null>(null);
const tempComment = ref('');
const tempClientType = ref('user');
const updatingComment = ref<Comment | null>(null);
const { $toast } = useNuxtApp();
const { edit, isCollaborator } = useAuth();
const subscriptionModalOpen = ref(false);
const subscriptionStatusModalOpen = ref(false);
const subscriptionInstitutionId = ref<number | null>(null);
const subscriptionInstitutionName = ref('');
const subscriptionStatusData = ref<CrmInstitution['subscription'] | null>(null);
const selectedSubscriptionFormula = ref<'institution_monthly_150' | 'institution_yearly_1500' | null>(null);
const subscriptionModalStep = ref<'formula' | 'review'>('formula');
const pendingSubscriptionContractId = ref<number | null>(null);
const subscriptionLoading = ref(false);
const { createInstitutionSubscription, viewInstitutionSubscriptionPdf, sendInstitutionSubscriptionForSignature } = useCrm();
const selectedInstitution = ref<CrmInstitution | null>(null);
const representativeUserId = ref<number | null>(null);
const { updateCrmUser } = useCrm();
const selectedReferrer = ref<{ id: number } | null>(null);

const localInstitutions = ref<CrmInstitution[]>(props.institutions?.data ? [...props.institutions.data] : []);
const dataTableRef = ref<{ table: { getFilteredSelectedRowModel: () => { rows: { original: CrmInstitution }[] } } } | null>(null);

const selectedCount = computed(() => dataTableRef.value?.table.getFilteredSelectedRowModel().rows.length ?? 0);

function exportSelectedCsv() {
    const rows = dataTableRef.value?.table.getFilteredSelectedRowModel().rows.map(r => r.original) ?? [];
    if (!rows.length) return;

    const headers = ['Nom', 'Email', 'Téléphone', 'Code postal', 'Ville', 'NursAssur', 'NursTech'];
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const lines = [
        headers.join(';'),
        ...rows.map(user => [
            user.full_name,
            user.email,
            user.phone_number,
            user.zip_code,
            user.city,
            user.insurance ? 'oui' : 'non',
            user.site ? 'oui' : 'non',
        ].map(escape).join(';')),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crm-selection-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

function openModal(institution: CrmInstitution) {
    selectedInstitution.value = institution;
    showModal.value = true;
}

function openContactDialog(institution: CrmInstitution) {
    representativeUserId.value = institution.representative_user_id;
    editingUserId.value = institution.representative_user_id;
    tempCrmId.value = Number(institution.crm?.id);
    tempClientType.value = institution.crm?.client_type ?? 'institution';
    tempContactDate.value = institution.crm?.last_contact_date ?? '';
    tempContactMethod.value = institution.crm?.last_contact_method ?? 'mail';
    updateFormData.lastContactDate = tempContactDate.value;
    updateFormData.lastContactMethod = tempContactMethod.value;
    contactDialogOpen.value = true;
}

async function openCommentDialog(institution: CrmInstitution) {
    commentDialogOpen.value = true;
    representativeUserId.value = institution.representative_user_id;
    tempCrmId.value = institution.representative_user_id ?? null;
    if (institution.representative_user_id) {
        await getUserComments({ id: institution.representative_user_id } as User);
    }
}

async function openReferrerDialog(institution: CrmInstitution) {
    referrerDialogOpen.value = true;
    representativeUserId.value = institution.representative_user_id;
    tempCrmId.value = institution.representative_user_id ?? null;
    await getUserReferrer();
}

function openSubscriptionModal(institution: CrmInstitution) {
    subscriptionInstitutionId.value = institution.id;
    subscriptionInstitutionName.value = institution.full_name;
    selectedSubscriptionFormula.value = null;
    subscriptionModalStep.value = 'formula';
    pendingSubscriptionContractId.value = null;
    subscriptionModalOpen.value = true;
}

async function generateInstitutionSubscription() {
    if (!subscriptionInstitutionId.value || !selectedSubscriptionFormula.value) {
        $toast({
            description: 'Sélectionnez une formule d\'abonnement.',
            variant: 'destructive',
        });
        return;
    }

    subscriptionLoading.value = true;

    try {
        const response = await createInstitutionSubscription(
            subscriptionInstitutionId.value,
            selectedSubscriptionFormula.value,
        );

        pendingSubscriptionContractId.value = response.contract?.id ?? null;
        subscriptionModalStep.value = 'review';

        $toast({
            description: response.message ?? 'Bon de commande généré.',
            variant: 'success',
        });

        if (pendingSubscriptionContractId.value) {
            await previewPendingSubscriptionPdf();
        }
    }
    catch {
        $toast({
            description: 'Impossible de générer le bon de commande. Réessayez.',
            variant: 'destructive',
        });
    }
    finally {
        subscriptionLoading.value = false;
    }
}

async function previewPendingSubscriptionPdf() {
    if (!subscriptionInstitutionId.value || !pendingSubscriptionContractId.value) {
        return;
    }

    try {
        await viewInstitutionSubscriptionPdf(
            subscriptionInstitutionId.value,
            pendingSubscriptionContractId.value,
        );
    }
    catch {
        $toast({
            description: 'Impossible d\'ouvrir le PDF.',
            variant: 'destructive',
        });
    }
}

async function sendPendingSubscriptionForSignature() {
    if (!subscriptionInstitutionId.value || !pendingSubscriptionContractId.value) {
        return;
    }

    subscriptionLoading.value = true;

    try {
        const response = await sendInstitutionSubscriptionForSignature(
            subscriptionInstitutionId.value,
            pendingSubscriptionContractId.value,
        );

        if (response.signing_url) {
            window.open(response.signing_url, '_blank', 'noopener,noreferrer');
        }

        $toast({
            description: response.message ?? 'Bon de commande envoyé pour signature.',
            variant: 'success',
        });

        subscriptionModalOpen.value = false;
        onSubscriptionCreated();
    }
    catch {
        $toast({
            description: 'Envoi Documenso impossible. Vérifiez la configuration ou réessayez.',
            variant: 'destructive',
        });
    }
    finally {
        subscriptionLoading.value = false;
    }
}

function openSubscriptionStatusModal(institution: CrmInstitution) {
    subscriptionInstitutionId.value = institution.id;
    subscriptionInstitutionName.value = institution.full_name;
    subscriptionStatusData.value = institution.subscription ?? null;
    subscriptionStatusModalOpen.value = true;
}

function handleSubscriptionClick(institution: CrmInstitution) {
    if (isCollaborator.value) {
        return;
    }

    showModal.value = false;

    if (institution.subscription?.can_create === true) {
        openSubscriptionModal(institution);
        return;
    }

    openSubscriptionStatusModal(institution);
}

function canCreateInstitutionSubscription(institution: CrmInstitution): boolean {
    return institution.subscription?.can_create === true;
}

function institutionSubscriptionLabel(institution: CrmInstitution): string {
    const subscription = institution.subscription;
    const status = subscription?.status;
    const formula = subscription?.formula;

    if (canCreateInstitutionSubscription(institution)) {
        return 'Créer bon de commande';
    }
    if (subscription?.can_send_for_signature) {
        return 'À valider';
    }
    if (subscription?.status_label) {
        return subscription.status_label;
    }
    if (status === 'paid' || status === 'accomplished') {
        return formula === 'institution_yearly_1500' ? 'Actif (annuel)' : 'Actif (mensuel)';
    }

    return 'Suivi signature';
}

function institutionSubscriptionBadgeClass(institution: CrmInstitution): string {
    const subscription = institution.subscription;
    const status = subscription?.status;

    if (canCreateInstitutionSubscription(institution)) {
        return 'bg-primary/10 text-primary border border-primary/30';
    }
    if (subscription?.can_send_for_signature) {
        return 'bg-blue-100 text-blue-800';
    }
    if (status === 'paid' || status === 'accomplished') {
        return 'bg-green-100 text-green-800';
    }
    if (['sent_for_signature', 'sign', 'pending_signature', 'signed'].includes(status ?? '')) {
        return 'bg-amber-100 text-amber-800';
    }
    if (status === 'cancelled') {
        return 'bg-red-100 text-red-800';
    }

    return 'bg-gray-100 text-gray-700';
}

function onSubscriptionCreated() {
    emit('refresh-institutions', props.page);
}

function onSubscriptionStatusChanged() {
    emit('refresh-institutions', props.page);
}

async function confirmReferrer() {
    if (!selectedReferrer.value) return;

    try {
        const response = await updateReferrer(tempCrmId.value, {
            referred_by: selectedReferrer.value.id,
        });

        localInstitutions.value = localInstitutions.value.map(u =>
            u.representative_user_id === tempCrmId.value
                ? { ...u, referred_by: { ...response } }
                : u,
        );

        emit('update-institutions', {
            ...props.institutions,
            data: localInstitutions.value,
        });

        $toast({
            description: 'Porteur d\'affaire mis à jour avec succès',
            variant: 'success',
        });

        referrerDialogOpen.value = false;
    }
    catch (error) {
        console.error(error);
        $toast({
            description: 'Une erreur est survenue',
            variant: 'destructive',
        });
    }
}

const prepareCommentToUpdate = (comment: Comment) => {
    updatingComment.value = comment;
    tempComment.value = comment.body;
};

const { submit: createOrUpdateComment, inProgress: progressingComment } = useSubmit(
    async () => {
        if (updatingComment.value !== null && typeof updatingComment.value.body === 'string') {
            const response = await update(updatingComment.value, {
                commentableId: updatingComment.value.commentable_id,
                commentableType: 'User',
                body: tempComment.value,
            });

            userComments.value = userComments.value.map(c =>
                c.id === updatingComment.value!.id ? { ...c, ...response } : c,
            );

            localInstitutions.value = localInstitutions.value.map(u =>
                u.representative_user_id === tempCrmId.value ? { ...u, last_comment: response } : u,
            );
            emit('update-institutions', {
                ...props.institutions,
                data: props.institutions.data.map((u: CrmInstitution) =>
                    u.representative_user_id === tempCrmId.value ? { ...u, last_comment: response } : u,
                ),
            });
        }
        else {
            const response = await store(tempCrmId.value, 'User', tempComment.value);

            userComments.value.unshift(response);

            localInstitutions.value = localInstitutions.value.map(u =>
                u.representative_user_id === tempCrmId.value ? { ...u, last_comment: response } : u,
            );

            emit('update-institutions', {
                ...props.institutions,
                data: props.institutions.data.map((u: CrmInstitution) =>
                    u.representative_user_id === tempCrmId.value ? { ...u, last_comment: response } : u,
                ),
            });
        }

        tempComment.value = null;
        updatingComment.value = null;
    },
    {
        onError: () => {
            $toast({
                description: 'Une erreur est survenue',
                variant: 'destructive',
            });
        },
    },
);

const deleteComment = (comment: Comment) => {
    destroy(comment).then(() => {
        userComments.value = userComments.value.filter((item: Comment) => item.id !== comment.id);

        localInstitutions.value = localInstitutions.value.map(u =>
            u.representative_user_id === tempCrmId.value ? { ...u, last_comment: userComments.value[0] } : u,
        );

        emit('update-institutions', {
            ...props.institutions,
            data: props.institutions.data.map((u: CrmInstitution) =>
                u.representative_user_id === tempCrmId.value
                    ? { ...u, last_comment: userComments.value[0] || null }
                    : u,
            ),
        });

        $toast({
            description: 'Commentaire supprimé avec succès',
        });
    }).catch(() => {
        $toast({
            description: 'Une erreur est survenue',
            variant: 'destructive',
        });
    });
};

const updateFormData = reactive({
    userId: editingUserId,
    clientType: tempClientType.value,
    lastContactDate: tempContactDate,
    lastContactMethod: tempContactMethod,
    lastComment: tempComment,
});

const updateCrmUserField = async (
    type: 'comment' | 'contact',
    dialogRef: Ref<boolean>,
) => {
    try {
        const response = await updateCrmUser(tempCrmId.value, updateFormData);
        $toast({
            description: response.message,
        });
        const idx = localInstitutions.value.findIndex(u => u.id === editingUserId.value || u.representative_user_id === editingUserId.value);
        if (idx !== -1) {
            const current = localInstitutions.value[idx];
            const updatedUser = {
                ...current,
                crm: {
                    ...current.crm,
                    ...(type === 'contact'
                        ? {
                                last_contact_date: updateFormData.lastContactDate,
                                last_contact_method: updateFormData.lastContactMethod,
                            }
                        : { last_comment: updateFormData.lastComment }),
                },
            };
            localInstitutions.value[idx] = updatedUser;
            localInstitutions.value = [...localInstitutions.value];
        }
    }
    catch {
        $toast({
            description: 'Une erreur est survenue',
            variant: 'destructive',
        });
    }
    finally {
        dialogRef.value = false;
    }
};

function saveContact() {
    return updateCrmUserField(
        'contact',
        contactDialogOpen,
    );
}

const setSort = (columnKey: string) => {
    emit('set-sort', columnKey);
};

const isFranceUser = computed(() => {
    const country = authUser.value?.profile?.country?.toLowerCase();

    return country === 'fr' || country === 'france';
});

const columns: ColumnDef<CrmInstitution>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'checked': table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                    ? 'indeterminate'
                    : false,
            'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
            'class': 'mx-2',
        }),
        cell: ({ row }) => h(Checkbox, {
            'checked': row.getIsSelected(),
            'onUpdate:checked': value => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
            'class': 'mx-2',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'full_name',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('name'),
            }, () => ['Nom', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('full_name')),
    },
    {
        accessorKey: 'zip_code',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('zip_code'),
            }, () => ['C.P', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('zip_code'));
        },
    },
    {
        accessorKey: 'city',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('city'),
            }, () => ['Ville', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('city'));
        },
    },

    {
        accessorKey: 'insurance',
        header: 'NursAssur',
        cell: ({ row }) => {
            const institution = row.original as CrmInstitution;

            const currentValue = (() => {
                const mods = institution.last_product_modifications ?? [];
                const found = mods.find(p => (p.product_name || '').toLowerCase().includes('nursassur'));
                if (found !== undefined && found.activate !== undefined && found.activate !== null) {
                    return Number(found.activate);
                }
                if (institution.insurance !== undefined && institution.insurance !== null) {
                    return Number(institution.insurance);
                }
                return 0;
            })();

            const toggle = async (value: boolean) => {
                const index = localInstitutions.value.findIndex(item => item.id === row.original.id);
                if (index !== -1) {
                    localInstitutions.value[index].insurance = value ? 1 : 0;
                    const mods = localInstitutions.value[index].last_product_modifications ?? [];
                    const modIndex = mods.findIndex(p => (p.product_name || '').toLowerCase() === 'nursassur');
                    if (modIndex !== -1) {
                        mods[modIndex].activate = value ? 1 : 0;
                    }
                    localInstitutions.value[index].last_product_modifications = [...mods];
                }
                if (institution.representative_user_id) {
                    await edit(Number(institution.representative_user_id), { nursassur: value });
                }
            };
            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': currentValue === 1,
                    'onUpdate:checked': toggle,
                    'disabled': isCollaborator.value || isFranceUser.value,

                }),
            ]);
        },
        enableSorting: false,
    },
    {
        accessorKey: 'site',
        header: 'NursTech',
        cell: ({ row }) => {
            const institution = row.original as CrmInstitution;
            const currentValue = (() => {
                const mods = institution.last_product_modifications ?? [];
                const found = mods.find(p => (p.product_name || '').toLowerCase().includes('nurstech'));
                if (found !== undefined && found.activate !== undefined && found.activate !== null) {
                    return Number(found.activate);
                }
                if (institution.site !== undefined && institution.site !== null) {
                    return Number(institution.site);
                }
                return 0;
            })();
            const toggle = async (value: boolean) => {
                const index = localInstitutions.value.findIndex(item => item.id === row.original.id);
                if (index !== undefined && index !== -1 && props.institutions) {
                    localInstitutions.value[index].site = value ? 1 : 0;
                    const mods = localInstitutions.value[index].last_product_modifications ?? [];
                    const modIndex = mods.findIndex(p => (p.product_name || '').toLowerCase() === 'nurstech');
                    if (modIndex !== -1) mods[modIndex].activate = value ? 1 : 0;
                    localInstitutions.value[index].last_product_modifications = [...mods];
                }
                if (institution.representative_user_id) {
                    await edit(Number(institution.representative_user_id), { nurstech: value });
                }
            };
            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': currentValue === 1,
                    'onUpdate:checked': toggle,
                    'disabled': isCollaborator.value,
                }),
            ]);
        },
        enableSorting: false,
    },
    {
        accessorKey: 'last_comment',
        header: 'Commentaire',
        cell: ({ row }) => {
            const comment = row.original?.last_comment;
            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: comment?.body ?? '',
                            }, comment?.body || ''),
                            h(Pencil, {
                                class: 'w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800 shrink-0',
                                onClick: () => openCommentDialog(row.original),
                            }),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'contact_date',
        header: () => h(Button, { variant: 'ghost', onClick: () => setSort('contact_date') }, () => [
            'Date de contact',
            h(ArrowUpDown, { class: 'inline w-4 h-4 ml-1' }),
        ]),
        cell: ({ row }) => {
            const rawDate = row.original.crm?.last_contact_date;
            let formattedDate = '';
            if (rawDate) {
                const date = new Date(rawDate);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                formattedDate = `${day}/${month}/${year}`;
            }
            return h('div', { class: 'flex justify-center items-center gap-1' }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', formattedDate),
                            h(Pencil, {
                                class: 'w-3 h-3 cursor-pointer hover:text-gray-700',
                                onClick: () => openContactDialog(row.original),
                            }),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'contact_method',
        header: () => h(Button, { variant: 'ghost', onClick: () => setSort('contact_method') }, () => [
            'Contacté par',
            h(ArrowUpDown, { class: 'inline w-4 h-4 ml-1' }),
        ]),
        cell: ({ row }) => {
            const method = row.original.crm?.last_contact_method;
            const displayMethod = method === 'mail'
                ? 'Mail'
                : method === 'phone'
                    ? 'Téléphone'
                    : method === 'visio'
                        ? 'Visioconférence'
                        : '';
            return h('div', { class: 'flex justify-center items-center gap-1' }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', displayMethod),
                            h(Pencil, {
                                class: 'w-3 h-3 cursor-pointer hover:text-gray-700',
                                onClick: () => openContactDialog(row.original),
                            }),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'crm.referred_by',
        header: 'Apporté par',
        cell: ({ row }) => {
            const referrer = row.original?.referred_by as Referrer | undefined;

            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: referrer?.full_name ?? '',
                            }, referrer?.full_name || ''),
                            h(Pencil, {
                                class: 'w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800 shrink-0',
                                onClick: () => openReferrerDialog(row.original),
                            }),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_at'),
            }, () => ['Date de création', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            const rawDate = row.original.created_at;
            const dateObj = new Date(rawDate);

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();

            const formattedDate = `${day}/${month}/${year}`;

            return h('div', { class: 'text-center' }, formattedDate);
        },
    },
    {
        id: 'last_post_date',
        accessorKey: 'historic_activity.last_post_date',
        header: () => h('div', {
            class: 'text-center text-sm',
            title: 'Date de dernière post d\'un remplacement',
        }, 'Dernière post'),
        enableSorting: false,
        cell: ({ row }) => {
            const rawDate = row.original.historic_activity?.last_post_date;

            if (!rawDate) {
                return h('div', { class: 'text-center' }, ' ');
            }

            const dateObj = new Date(rawDate);
            if (isNaN(dateObj.getTime())) {
                return h('div', { class: 'text-center' }, ' ');
            }

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');

            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
            return h('div', { class: 'text-center' }, formattedDate);
        },
    },
    {
        id: 'last_accept_posted_date',
        accessorKey: 'historic_activity.last_accept_posted_date',
        header: () => h('div', {
            class: 'text-center text-sm',
            title: 'Date de dernière acceptation d\'un remplacement',
        }, 'Dernière acceptation'),
        enableSorting: false,
        cell: ({ row }) => {
            const rawDate = row.original.historic_activity?.last_accept_posted_date;
            if (!rawDate) {
                return h('div', { class: 'text-center' }, ' ');
            }
            const dateObj = new Date(rawDate);
            if (isNaN(dateObj.getTime())) {
                return h('div', { class: 'text-center' }, ' ');
            }
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
            return h('div', { class: 'text-center' }, formattedDate);
        },
    },
    {
        id: 'last_response_date',
        accessorKey: 'historic_activity.last_response_date',
        header: () => h('div', {
            class: 'text-center text-sm',
            title: 'Date de dernière réponse à un remplacement posté',
        }, 'Dernière réponse'),
        enableSorting: false,
        cell: ({ row }) => {
            const rawDate = row.original.historic_activity?.last_response_date;
            if (!rawDate) {
                return h('div', { class: 'text-center' }, ' ');
            }
            const dateObj = new Date(rawDate);
            if (isNaN(dateObj.getTime())) {
                return h('div', { class: 'text-center' }, ' ');
            }
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
            return h('div', { class: 'text-center' }, formattedDate);
        },
    },
    {
        id: 'last_accept_response_date',
        accessorKey: 'historic_activity.last_accept_response_date',
        header: () => h('div', {
            class: 'text-center text-sm',
            title: 'Date de dernière acceptation sur un remplacement posté',
        }, 'Acceptation réponse'),
        enableSorting: false,
        cell: ({ row }) => {
            const rawDate = row.original.historic_activity?.last_accept_response_date;
            if (!rawDate) {
                return h('div', { class: 'text-center' }, ' ');
            }
            const dateObj = new Date(rawDate);
            if (isNaN(dateObj.getTime())) {
                return h('div', { class: 'text-center' }, ' ');
            }
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
            return h('div', { class: 'text-center' }, formattedDate);
        },
    },
    {
        accessorKey: 'last_login_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('last_login_at'),
            }, () => ['Dernière connexion', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            const rawDate = row.original.last_login_at;
            if (!rawDate) {
                return h('div', { class: 'text-center' }, '');
            }
            const dateObj = new Date(rawDate);
            if (isNaN(dateObj.getTime())) {
                return h('div', { class: 'text-center' }, '');
            }
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
            return h('div', { class: 'text-center' }, formattedDate);
        },
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_at'),
            }, () => ['Création', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'subscription',
        header: 'Bon de commande',
        cell: ({ row }) => {
            const institution = row.original as CrmInstitution;
            const label = institutionSubscriptionLabel(institution);
            const badgeClass = institutionSubscriptionBadgeClass(institution);
            const isClickable = !isCollaborator.value;

            return h('div', { class: 'flex justify-center' }, [
                h(
                    'button',
                    {
                        type: 'button',
                        'data-no-row-select': 'true',
                        class: `px-2 py-1 rounded text-xs font-medium touch-manipulation ${badgeClass} ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`,
                        disabled: !isClickable,
                        onClick: (event: MouseEvent) => {
                            event.stopPropagation();
                            if (isClickable) {
                                handleSubscriptionClick(institution);
                            }
                        },
                    },
                    label,
                ),
            ]);
        },
        enableSorting: false,
    },
    {
        id: 'action',
        header: () => 'Action',
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, [
                h(Eye, {
                    class: 'w-5 h-5 text-blue-500 cursor-pointer inline-block',
                    onClick: () => openModal(row.original),
                }),
            ]);
        },
    },
];

watch(() => props.institutions, (newInstitutions) => {
    localInstitutions.value = newInstitutions?.data ? [...newInstitutions.data] : [];
}, { immediate: true });
</script>
