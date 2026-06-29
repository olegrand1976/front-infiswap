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
                        <span
                            class="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium"
                            :class="institutionStatusBadgeClass(institution.status)"
                        >
                            {{ institutionStatusLabel(institution) }}
                        </span>
                        <p
                            v-if="institution.zip_code || institution.city"
                            class="text-sm text-muted-foreground mt-1"
                        >
                            {{ [institution.zip_code, institution.city].filter(Boolean).join(' ') }}
                        </p>
                        <p
                            v-if="institution.phone_number || institution.email"
                            class="text-sm text-muted-foreground mt-1"
                        >
                            <span v-if="institution.phone_number">{{ institution.phone_number }}</span>
                            <span v-if="institution.phone_number && institution.email"> · </span>
                            <span
                                v-if="institution.email"
                                class="break-all"
                            >{{ institution.email }}</span>
                        </p>
                        <button
                            v-if="!isCollaborator"
                            type="button"
                            class="text-xs text-primary underline mt-1 touch-manipulation"
                            @click="openContactInfoDialog(institution)"
                        >
                            Modifier coordonnées
                        </button>
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
                <div class="mt-3 flex items-center gap-3 flex-wrap">
                    <button
                        type="button"
                        class="text-sm text-primary underline touch-manipulation"
                        @click="openInstitutionShow(institution)"
                    >
                        Voir la fiche
                    </button>
                    <button
                        v-if="institutionCanCancel(institution) && !isCollaborator"
                        type="button"
                        class="text-sm text-destructive underline touch-manipulation"
                        @click="deleteDraftSubscription(institution)"
                    >
                        Supprimer le brouillon
                    </button>
                    <button
                        v-if="canDeleteInstitution(institution)"
                        type="button"
                        class="text-sm text-destructive underline touch-manipulation"
                        @click="openDeleteInstitutionDialog(institution)"
                    >
                        Supprimer l'institution
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
            v-model:open="contactInfoDialogOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <DialogContent class="bg-white rounded-lg p-6 max-w-md w-full">
                <DialogHeader>
                    <DialogTitle class="text-lg font-semibold text-primary mb-4">
                        Modifier les coordonnées
                    </DialogTitle>
                </DialogHeader>
                <form @submit.prevent="saveContactInfo">
                    <div class="mb-4">
                        <label
                            for="institutionPhone"
                            class="block mb-1 text-sm font-medium text-gray-700"
                        >
                            Téléphone
                        </label>
                        <InputIcon
                            id="institutionPhone"
                            v-model="tempInstitutionPhone"
                            type="tel"
                            class="w-full"
                            placeholder="+32-..."
                        />
                    </div>
                    <div class="mb-4">
                        <label
                            for="institutionEmail"
                            class="block mb-1 text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <InputIcon
                            id="institutionEmail"
                            v-model="tempInstitutionEmail"
                            type="email"
                            class="w-full"
                            placeholder="contact@exemple.be"
                        />
                    </div>
                    <div class="flex justify-end space-x-2">
                        <Button
                            variant="secondary"
                            class="px-4 py-2 rounded"
                            type="button"
                            @click="contactInfoDialogOpen = false"
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
                        for="institutionReferrerFreeText"
                        class="block mb-1 text-sm font-medium text-gray-700"
                    >
                        Nom ou source
                    </label>
                    <InputIcon
                        id="institutionReferrerFreeText"
                        v-model="tempReferrerText"
                        type="text"
                        class="w-full"
                        placeholder="Ex. Dr Dupont, salon Infirmiers 2025…"
                    />
                </div>

                <template v-else>
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

        <Dialog v-model:open="subscriptionModalOpen">
            <DialogContent class="max-w-md gap-0 overflow-hidden p-0">
                <div class="px-6 pt-6 pb-4">
                    <DialogHeader class="space-y-1 text-left">
                        <DialogTitle class="text-xl font-semibold text-primary">
                            {{ subscriptionModalStep === 'formula' ? 'Abonnement institution' : 'Bon de commande' }}
                        </DialogTitle>
                        <DialogDescription class="text-sm text-muted-foreground">
                            {{ subscriptionInstitutionName }}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div class="px-6 pb-6">
                    <template v-if="subscriptionModalStep === 'formula'">
                        <div class="grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                class="rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5 touch-manipulation"
                                :class="selectedSubscriptionFormula === 'institution_monthly_150' ? 'border-primary bg-primary/5 ring-2 ring-primary' : ''"
                                :disabled="subscriptionBusy"
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
                                :disabled="subscriptionBusy"
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

                        <DialogFooter class="mt-6 gap-2 sm:justify-end">
                            <Button
                                variant="secondary"
                                type="button"
                                :disabled="subscriptionBusy"
                                @click="subscriptionModalOpen = false"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="button"
                                :disabled="!selectedSubscriptionFormula || subscriptionBusy"
                                :in-progress="subscriptionGenerating"
                                @click="generateInstitutionSubscription"
                            >
                                Générer le bon de commande
                            </Button>
                        </DialogFooter>
                    </template>

                    <template v-else>
                        <div class="space-y-4">
                            <div class="overflow-hidden rounded-lg border bg-card shadow-sm">
                                <div class="flex items-center justify-between gap-3 border-b bg-muted/50 px-4 py-3">
                                    <div class="min-w-0">
                                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            Référence
                                        </p>
                                        <p class="truncate font-semibold text-foreground">
                                            {{ pendingSubscriptionReference ?? '—' }}
                                        </p>
                                    </div>
                                    <span class="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
                                        Brouillon
                                    </span>
                                </div>
                                <div class="px-4 py-3">
                                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Formule
                                    </p>
                                    <p class="font-medium text-foreground">
                                        {{ pendingSubscriptionFormulaLabel ?? '—' }}
                                    </p>
                                </div>
                            </div>

                            <p class="text-sm leading-relaxed text-muted-foreground">
                                Vérifiez le PDF avant l'envoi Documenso.
                                <span class="mt-1 block text-xs">
                                    Pour changer de formule, supprimez ce brouillon puis générez-en un nouveau.
                                </span>
                            </p>
                        </div>

                        <DialogFooter class="mt-6 flex flex-col gap-2 sm:flex-col sm:justify-stretch sm:space-x-0">
                            <Button
                                type="button"
                                class="w-full touch-manipulation"
                                :disabled="subscriptionBusy"
                                :in-progress="subscriptionSending"
                                @click="sendPendingSubscriptionForSignature"
                            >
                                Envoyer pour signature
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                class="w-full touch-manipulation"
                                :disabled="subscriptionBusy"
                                @click="previewPendingSubscriptionPdf"
                            >
                                Voir le PDF
                            </Button>
                            <Button
                                variant="ghost"
                                type="button"
                                class="w-full touch-manipulation text-destructive hover:bg-destructive/10 hover:text-destructive"
                                :disabled="subscriptionBusy"
                                :in-progress="subscriptionDeleting"
                                @click="deletePendingSubscriptionDraft"
                            >
                                Supprimer et recommencer
                            </Button>
                        </DialogFooter>
                    </template>
                </div>
            </DialogContent>
        </Dialog>

        <InstitutionSubscriptionStatusModal
            v-model:open="subscriptionStatusModalOpen"
            :institution-id="subscriptionInstitutionId"
            :institution-name="subscriptionInstitutionName"
            :subscription="subscriptionStatusData"
            @signed="onSubscriptionStatusChanged"
            @deleted="onSubscriptionStatusChanged"
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

        <AlertDialog v-model:open="deleteDialogOpen">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{{ deleteInstitutionDialogTitle }}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {{ deleteInstitutionDialogMessage }}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                        class="rounded"
                        variant="destructive"
                        :disabled="deletingInstitution"
                        @click="confirmDeleteInstitution"
                    >
                        Supprimer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import InstitutionSubscriptionStatusModal from './InstitutionSubscriptionStatusModal.vue';
import { Button } from '@/components/ui/button';
import type { Comment, CrmInstitution, CrmInstitutionSubscription, Pagination, Referrer, User } from '~/lib/types';
import { InputIcon } from '~/components/ui/input-with-icon';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { Switch } from '~/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/composables/useAuth';
import { useInstitutions } from '@/composables/useInstitution';
import { formatRelativeDate, formatToDMY } from '@/composables/useDate';
import { useCrm } from '@/composables/useCrm';
import { institutionStatusBadgeClassFromCode, institutionStatusLabelFromCode } from '@/composables/useInstitutionStatusDisplay';
import { useComment } from '~/composables/useComment';

const props = defineProps<{
    institutions: Pagination<CrmInstitution>;
    page: number;
    perPage: number;
}>();

const authUser = useState('user');

const emit = defineEmits(['refresh-institutions', 'handle-per-page-change', 'set-sort', 'update-institutions']);
const { loading, userComments, getUserComments, destroy, store, update } = useComment();
const { updateInstitutionReferrer, userReferrer, getUserReferrer, referrerDisplayLabel } = useReferrer();

const contactDialogOpen = ref(false);
const contactInfoDialogOpen = ref(false);
const commentDialogOpen = ref(false);
const referrerDialogOpen = ref(false);
const tempContactDate = ref('');
const tempContactMethod = ref('mail');
const tempInstitutionEmail = ref('');
const tempInstitutionPhone = ref('');
const editingInstitutionId = ref<number | null>(null);
const editingUserId = ref<number | null>(null);
const tempCrmId = ref<number | null>(null);
const tempComment = ref('');
const tempClientType = ref('user');
const updatingComment = ref<Comment | null>(null);
const { $toast } = useNuxtApp();
const { edit, isCollaborator, isSuperAdmin, isAdmin } = useAuth();
const { forceDelete } = useInstitutions();
const subscriptionModalOpen = ref(false);
const subscriptionStatusModalOpen = ref(false);
const subscriptionInstitutionId = ref<number | null>(null);
const subscriptionInstitutionName = ref('');
const subscriptionStatusData = ref<CrmInstitution['subscription'] | null>(null);
const selectedSubscriptionFormula = ref<'institution_monthly_150' | 'institution_yearly_1500' | null>(null);
const subscriptionModalStep = ref<'formula' | 'review'>('formula');
const pendingSubscriptionContractId = ref<number | null>(null);
const subscriptionGenerating = ref(false);
const subscriptionSending = ref(false);
const subscriptionDeleting = ref(false);
const subscriptionBusy = computed(() =>
    subscriptionGenerating.value || subscriptionSending.value || subscriptionDeleting.value,
);
const {
    createInstitutionSubscription,
    viewInstitutionSubscriptionPdf,
    sendInstitutionSubscriptionForSignature,
    deleteInstitutionSubscriptionDraft,
    updateCrmInstitutionContact,
    updateCrmUser,
} = useCrm();
const representativeUserId = ref<number | null>(null);
const selectedReferrer = ref<Referrer | null>(null);
const referrerMode = ref<'account' | 'text'>('text');
const tempReferrerText = ref('');
const editingInstitutionForReferrer = ref<CrmInstitution | null>(null);

const localInstitutions = ref<CrmInstitution[]>(props.institutions?.data ? [...props.institutions.data] : []);
const dataTableRef = ref<{ table: { getFilteredSelectedRowModel: () => { rows: { original: CrmInstitution }[] } } } | null>(null);

const deleteDialogOpen = ref(false);
const institutionToDelete = ref<CrmInstitution | null>(null);
const deletingInstitution = ref(false);

const isImportProspect = (institution: CrmInstitution): boolean =>
    institution.registration_source === 'file' && !institution.representative_user_id;

const isSiteRegistration = (institution: CrmInstitution): boolean =>
    institution.registration_source === 'site';

const canDeleteInstitution = (institution: CrmInstitution): boolean => {
    if (isCollaborator.value) {
        return false;
    }

    if (isSuperAdmin.value) {
        return true;
    }

    return isAdmin.value && (isImportProspect(institution) || isSiteRegistration(institution));
};

const deleteInstitutionDialogMessage = computed(() => {
    const institution = institutionToDelete.value;
    if (!institution) {
        return '';
    }

    if (isSiteRegistration(institution)) {
        return `Supprimer l'institution inscrite sur le site « ${institution.full_name} » ? Elle sera masquée de la liste (suppression logique) et les accès API des comptes liés seront révoqués.`;
    }

    return `Supprimer le prospect importé « ${institution.full_name} » ? Il sera masqué de la liste (suppression logique).`;
});

const deleteInstitutionDialogTitle = computed(() =>
    institutionToDelete.value && isSiteRegistration(institutionToDelete.value)
        ? 'Supprimer l\'institution'
        : 'Confirmer la suppression',
);

const openDeleteInstitutionDialog = (institution: CrmInstitution) => {
    institutionToDelete.value = institution;
    deleteDialogOpen.value = true;
};

const confirmDeleteInstitution = async () => {
    if (!institutionToDelete.value) return;

    deletingInstitution.value = true;
    try {
        await forceDelete(institutionToDelete.value.id);
        localInstitutions.value = localInstitutions.value.filter(
            item => item.id !== institutionToDelete.value?.id,
        );
        emit('update-institutions', {
            ...props.institutions,
            data: localInstitutions.value,
            total: Math.max(0, (props.institutions?.total ?? 1) - 1),
        });
        emit('refresh-institutions', props.page);
        deleteDialogOpen.value = false;
        institutionToDelete.value = null;
    }
    catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
    finally {
        deletingInstitution.value = false;
    }
};

const selectedCount = computed(() => dataTableRef.value?.table.getFilteredSelectedRowModel().rows.length ?? 0);

const pendingSubscriptionInstitution = computed(() =>
    localInstitutions.value.find(institution => institution.id === subscriptionInstitutionId.value) ?? null,
);

const pendingSubscriptionReference = computed(() =>
    pendingSubscriptionInstitution.value?.subscription?.reference ?? null,
);

const pendingSubscriptionFormulaLabel = computed(() => {
    const formula = pendingSubscriptionInstitution.value?.subscription?.formula;
    if (formula === 'institution_yearly_1500') {
        return '1 500 € / an';
    }
    if (formula === 'institution_monthly_150') {
        return '150 € / mois';
    }

    return null;
});

function emptyInstitutionSubscription(): CrmInstitutionSubscription {
    return {
        active: false,
        status: null,
        status_label: null,
        formula: null,
        contract_id: null,
        reference: null,
        created_at: null,
        can_create: true,
        can_send_for_signature: false,
        can_sign: false,
        can_delete_draft: false,
    };
}

function buildDraftSubscription(contract: {
    id: number;
    formula?: string | null;
    reference?: string | null;
    status?: string | null;
    created_at?: string | null;
}): CrmInstitutionSubscription {
    return {
        active: false,
        status: 'draft',
        status_label: 'Brouillon',
        formula: contract.formula ?? null,
        contract_id: contract.id,
        reference: contract.reference ?? null,
        created_at: contract.created_at ?? null,
        can_create: false,
        can_send_for_signature: true,
        can_sign: false,
        can_delete_draft: true,
    };
}

function patchInstitutionSubscription(
    institutionId: number,
    subscription: CrmInstitutionSubscription,
) {
    localInstitutions.value = localInstitutions.value.map((institution) => {
        if (institution.id !== institutionId) {
            return institution;
        }

        return { ...institution, subscription };
    });

    emit('update-institutions', {
        ...props.institutions,
        data: localInstitutions.value,
    });
}

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

function openInstitutionShow(institution: CrmInstitution, edit = false) {
    const query = edit ? '?edit=1' : '';
    navigateTo(`/dashboard/admin/institutions/${institution.id}/show${query}`);
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

function openContactInfoDialog(institution: CrmInstitution) {
    editingInstitutionId.value = institution.id;
    tempInstitutionEmail.value = institution.email ?? '';
    tempInstitutionPhone.value = institution.phone_number ?? '';
    contactInfoDialogOpen.value = true;
}

async function saveContactInfo() {
    if (!editingInstitutionId.value) {
        return;
    }

    try {
        const response = await updateCrmInstitutionContact(editingInstitutionId.value, {
            email: tempInstitutionEmail.value,
            phone_number: tempInstitutionPhone.value,
        });
        $toast({
            description: response.message,
        });
        const idx = localInstitutions.value.findIndex(i => i.id === editingInstitutionId.value);
        if (idx !== -1) {
            localInstitutions.value[idx] = {
                ...localInstitutions.value[idx],
                email: response.email,
                phone_number: response.phone_number,
            };
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
        contactInfoDialogOpen.value = false;
    }
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
    editingInstitutionForReferrer.value = institution;
    representativeUserId.value = institution.representative_user_id;
    tempCrmId.value = institution.representative_user_id ?? null;

    const referrer = institution.referred_by;

    if (referrer?.text) {
        referrerMode.value = 'text';
        tempReferrerText.value = referrer.text;
        selectedReferrer.value = null;
    }
    else if (referrer?.id) {
        referrerMode.value = 'account';
        tempReferrerText.value = '';
        selectedReferrer.value = referrer;
    }
    else {
        referrerMode.value = 'text';
        tempReferrerText.value = '';
        selectedReferrer.value = null;
    }

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

function openSubscriptionReviewModal(institution: CrmInstitution, contractId: number) {
    subscriptionInstitutionId.value = institution.id;
    subscriptionInstitutionName.value = institution.full_name;
    pendingSubscriptionContractId.value = contractId;
    selectedSubscriptionFormula.value = institution.subscription?.formula === 'institution_yearly_1500'
        ? 'institution_yearly_1500'
        : institution.subscription?.formula === 'institution_monthly_150'
            ? 'institution_monthly_150'
            : null;
    subscriptionModalStep.value = 'review';
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

    subscriptionGenerating.value = true;

    try {
        const response = await createInstitutionSubscription(
            subscriptionInstitutionId.value,
            selectedSubscriptionFormula.value,
        );

        const contract = response.contract as {
            id: number;
            formula?: string | null;
            reference?: string | null;
            status?: string | null;
            created_at?: string | null;
        } | undefined;

        pendingSubscriptionContractId.value = contract?.id ?? null;
        subscriptionModalStep.value = 'review';

        if (subscriptionInstitutionId.value && contract) {
            patchInstitutionSubscription(
                subscriptionInstitutionId.value,
                buildDraftSubscription(contract),
            );
        }

        $toast({
            description: response.message ?? 'Bon de commande généré.',
            variant: 'success',
        });

        if (pendingSubscriptionContractId.value) {
            await previewPendingSubscriptionPdf();
        }
    }
    catch (error: unknown) {
        const apiMessage = (error as { data?: { message?: string } })?.data?.message;
        const institution = localInstitutions.value.find(item => item.id === subscriptionInstitutionId.value);
        const existingContractId = institution?.subscription?.contract_id;

        if (existingContractId && apiMessage?.includes('déjà actif')) {
            openSubscriptionReviewModal(institution!, existingContractId);
            $toast({
                description: 'Un brouillon existe déjà. Supprimez-le ou continuez l\'envoi pour signature.',
                variant: 'destructive',
            });
            return;
        }

        $toast({
            description: apiMessage ?? 'Impossible de générer le bon de commande. Supprimez le brouillon existant ou ouvrez-le pour continuer.',
            variant: 'destructive',
        });
    }
    finally {
        subscriptionGenerating.value = false;
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

    subscriptionSending.value = true;

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
        subscriptionSending.value = false;
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

    if (institution.subscription?.can_create === true) {
        openSubscriptionModal(institution);
        return;
    }

    const contractId = institution.subscription?.contract_id;
    if (
        contractId
        && (institution.subscription?.status === 'draft' || institution.subscription?.can_send_for_signature)
    ) {
        openSubscriptionReviewModal(institution, contractId);
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
    if (status === 'draft') {
        return subscription?.reference
            ? `Brouillon (${subscription.reference})`
            : 'Brouillon';
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
    if (status === 'draft') {
        return 'bg-slate-100 text-slate-800 border border-slate-300';
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

function institutionStatusBadgeClass(status?: string | null): string {
    return institutionStatusBadgeClassFromCode(status);
}

function institutionStatusLabel(institution: CrmInstitution): string {
    return institutionStatusLabelFromCode(institution.status);
}

function institutionCanCancel(institution: CrmInstitution): boolean {
    return institution.subscription?.can_cancel
        ?? institution.subscription?.can_delete_draft
        ?? false;
}

async function deleteDraftSubscription(institution: CrmInstitution) {
    const contractId = institution.subscription?.contract_id;
    if (!contractId || !institutionCanCancel(institution)) {
        return;
    }

    await deleteSubscriptionDraft(institution.id, contractId, {
        onSuccess: () => {
            subscriptionStatusModalOpen.value = false;
            subscriptionModalOpen.value = false;
            pendingSubscriptionContractId.value = null;
            selectedSubscriptionFormula.value = null;
            subscriptionModalStep.value = 'formula';
        },
    });
}

async function deletePendingSubscriptionDraft() {
    const institutionId = subscriptionInstitutionId.value;
    const contractId = pendingSubscriptionContractId.value
        ?? pendingSubscriptionInstitution.value?.subscription?.contract_id;

    if (!institutionId || !contractId) {
        return;
    }

    await deleteSubscriptionDraft(institutionId, contractId, {
        onSuccess: () => {
            pendingSubscriptionContractId.value = null;
            selectedSubscriptionFormula.value = null;
            subscriptionModalStep.value = 'formula';
        },
    });
}

async function deleteSubscriptionDraft(
    institutionId: number,
    contractId: number,
    options?: { onSuccess?: () => void },
) {
    if (!window.confirm('Supprimer ce brouillon de bon de commande ?')) {
        return;
    }

    subscriptionDeleting.value = true;

    try {
        const response = await deleteInstitutionSubscriptionDraft(institutionId, contractId);

        patchInstitutionSubscription(institutionId, emptyInstitutionSubscription());

        $toast({
            description: response.message ?? 'Brouillon supprimé. Vous pouvez générer un nouveau bon de commande.',
            variant: 'success',
        });

        options?.onSuccess?.();
        onSubscriptionStatusChanged();
    }
    catch {
        $toast({
            description: 'Impossible de supprimer le brouillon.',
            variant: 'destructive',
        });
    }
    finally {
        subscriptionDeleting.value = false;
    }
}

async function confirmReferrer() {
    const payload = referrerMode.value === 'text'
        ? {
                referred_by: null,
                referred_by_text: tempReferrerText.value.trim() || null,
            }
        : {
                referred_by: selectedReferrer.value?.id ?? null,
                referred_by_text: null,
            };

    if (!editingInstitutionForReferrer.value) {
        return;
    }

    try {
        const response = await updateInstitutionReferrer(
            editingInstitutionForReferrer.value.id,
            payload,
        );

        localInstitutions.value = localInstitutions.value.map(u =>
            u.id === editingInstitutionForReferrer.value!.id
                ? { ...u, referred_by: { ...response } }
                : u,
        );

        emit('update-institutions', {
            ...props.institutions,
            data: localInstitutions.value,
        });

        $toast({
            description: 'Apporté par mis à jour avec succès',
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
        accessorKey: 'phone_number',
        header: () => h('div', { class: 'text-center' }, 'Téléphone'),
        cell: ({ row }) => {
            const phone = row.getValue('phone_number') as string | null | undefined;

            return h('div', { class: 'flex justify-center items-center gap-1' }, [
                isCollaborator.value
                    ? h('span', { class: 'text-sm whitespace-nowrap' }, phone || '—')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', { class: 'text-sm whitespace-nowrap' }, phone || '—'),
                            h(Pencil, {
                                class: 'w-3 h-3 cursor-pointer hover:text-gray-700 shrink-0',
                                onClick: () => openContactInfoDialog(row.original),
                            }),
                        ]),
            ]);
        },
        enableSorting: false,
    },
    {
        accessorKey: 'email',
        header: () => h('div', { class: 'text-center' }, 'Email'),
        cell: ({ row }) => {
            const email = row.getValue('email') as string | null | undefined;

            return h('div', { class: 'flex justify-center items-center gap-1' }, [
                isCollaborator.value
                    ? h('span', { class: 'text-sm break-all max-w-[220px]' }, email || '—')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', { class: 'text-sm break-all max-w-[220px]' }, email || '—'),
                            h(Pencil, {
                                class: 'w-3 h-3 cursor-pointer hover:text-gray-700 shrink-0',
                                onClick: () => openContactInfoDialog(row.original),
                            }),
                        ]),
            ]);
        },
        enableSorting: false,
    },
    {
        accessorKey: 'status',
        header: () => h('div', { class: 'text-center' }, 'Statut institution'),
        cell: ({ row }) => {
            const institution = row.original as CrmInstitution;

            return h('div', { class: 'flex justify-center' }, [
                h(
                    'span',
                    {
                        class: `px-2 py-1 rounded text-xs font-medium ${institutionStatusBadgeClass(institution.status)}`,
                    },
                    institutionStatusLabel(institution),
                ),
            ]);
        },
        enableSorting: false,
    },
    {
        id: 'registration_source',
        header: () =>
            h(Button, {
                variant: 'ghost',
                onClick: () => setSort('registration_source'),
            }, () => ['Source', h(ArrowUpDown, { class: '' })]),
        cell: ({ row }) => {
            const source = row.original.registration_source;
            const label = source === 'file' ? 'Fichier' : source === 'site' ? 'Site' : '—';
            const colorClass = source === 'file'
                ? 'bg-blue-100 text-blue-800'
                : source === 'site'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800';

            return h('div', { class: 'flex justify-center' }, [
                h('span', { class: `px-2 py-1 rounded text-xs font-medium ${colorClass}` }, label),
            ]);
        },
    },
    {
        id: 'registered_at',
        header: () =>
            h(Button, {
                variant: 'ghost',
                onClick: () => setSort('registered_at'),
            }, () => ['Date inscription / import', h(ArrowUpDown, { class: '' })]),
        cell: ({ row }) => {
            const rawDate = row.original.registered_at || row.original.created_at;

            return h('div', { class: 'text-center text-sm' }, rawDate ? formatToDMY(rawDate) : '—');
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
            const label = referrerDisplayLabel(referrer);

            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, label || '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: label,
                            }, label),
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

            return h('div', { class: 'flex justify-center items-center gap-1' }, [
                h(
                    'button',
                    {
                        'type': 'button',
                        'data-no-row-select': 'true',
                        'class': `px-2 py-1 rounded text-xs font-medium touch-manipulation ${badgeClass} ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`,
                        'disabled': !isClickable,
                        'onClick': (event: MouseEvent) => {
                            event.stopPropagation();
                            if (isClickable) {
                                handleSubscriptionClick(institution);
                            }
                        },
                    },
                    label,
                ),
                institutionCanCancel(institution) && !isCollaborator.value
                    ? h(
                            'button',
                            {
                                'type': 'button',
                                'data-no-row-select': 'true',
                                'title': 'Annuler le bon de commande',
                                'class': 'p-1 rounded text-destructive hover:bg-destructive/10 touch-manipulation',
                                'onClick': (event: MouseEvent) => {
                                    event.stopPropagation();
                                    void deleteDraftSubscription(institution);
                                },
                            },
                            [h(Trash2, { class: 'w-4 h-4' })],
                        )
                    : null,
            ]);
        },
        enableSorting: false,
    },
    {
        id: 'action',
        header: () => 'Action',
        cell: ({ row }) => {
            const institution = row.original as CrmInstitution;

            return h('div', { class: 'flex justify-center items-center gap-2' }, [
                h(Pencil, {
                    class: 'w-5 h-5 text-blue-500 cursor-pointer inline-block',
                    title: 'Modifier la fiche institution',
                    onClick: () => openInstitutionShow(institution, true),
                }),
                canDeleteInstitution(institution)
                    ? h(
                            'button',
                            {
                                'type': 'button',
                                'data-no-row-select': 'true',
                                'title': isSiteRegistration(institution)
                                    ? 'Supprimer l\'institution inscrite sur le site'
                                    : 'Supprimer le prospect importé',
                                'class': 'p-1 rounded text-destructive hover:bg-destructive/10 touch-manipulation',
                                'onClick': (event: MouseEvent) => {
                                    event.stopPropagation();
                                    openDeleteInstitutionDialog(institution);
                                },
                            },
                            [h(Trash2, { class: 'w-4 h-4' })],
                        )
                    : null,
            ]);
        },
    },
];

watch(() => props.institutions, (newInstitutions) => {
    localInstitutions.value = newInstitutions?.data ? [...newInstitutions.data] : [];
}, { immediate: true });
</script>
