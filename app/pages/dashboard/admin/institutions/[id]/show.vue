<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Détails de l'institution">
            <template #action>
                <div class="flex items-center gap-2">
                    <Button
                        v-if="!editMode"
                        variant="default"
                        class="rounded-md"
                        @click="toggleEditMode(true)"
                    >
                        Modifier
                    </Button>
                    <Button
                        v-if="editMode"
                        variant="outline"
                        class="rounded-md"
                        @click="toggleEditMode(false)"
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="outline"
                        @click="navigateTo('/dashboard/admin/institutions')"
                    >
                        Retour à la liste
                    </Button>
                </div>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent v-if="institution">
            <div
                v-if="loading"
                class="flex justify-center items-center py-12"
            >
                <RollingLoader :loading="loading" />
            </div>

            <div
                v-else
                class="space-y-6"
            >
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-bold mb-4">
                        Informations générales
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-500">
                                Nom de l'institution
                            </label>
                            <p class="text-base font-semibold">
                                {{ institution.name }}
                            </p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-500">
                                Statut
                            </label>
                            <p class="text-base">
                                <span
                                    class="px-2 py-1 rounded text-sm font-medium"
                                    :class="institutionStatusBadgeClass"
                                >
                                    {{ institutionStatusLabel }}
                                </span>
                            </p>
                            <p
                                v-if="institution.changes_pending"
                                class="text-sm text-amber-700 mt-2"
                            >
                                Des modifications ont été soumises et attendent votre validation.
                            </p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-500">
                                Date de création
                            </label>
                            <p class="text-base">
                                {{ formatRelativeDate(institution.created_at) }}
                            </p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-500">
                                Nombre de services
                            </label>
                            <p class="text-base font-semibold">
                                {{ institution.services_count || 0 }}
                            </p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-500">
                                Nombre d'utilisateurs
                            </label>
                            <p class="text-base font-semibold">
                                {{ institution.users_count || 0 }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-bold">
                            Coordonnées & suivi CRM
                        </h2>
                        <Button
                            v-if="editMode"
                            :in-progress="savingCrm"
                            class="rounded-md"
                            @click="saveCrmEdits"
                        >
                            Enregistrer
                        </Button>
                    </div>

                    <div
                        v-if="!editMode"
                        class="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div>
                            <label class="text-sm font-medium text-gray-500">Email</label>
                            <p class="text-base break-all">{{ institution.email || institution.main_user?.email || '—' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-500">Téléphone</label>
                            <p class="text-base">{{ institution.phone_number || institution.main_user?.phone_number || '—' }}</p>
                        </div>
                        <div v-if="institution.crm?.contact_user_id">
                            <label class="text-sm font-medium text-gray-500">Date de contact</label>
                            <p class="text-base">{{ formatContactDate(institution.crm?.last_contact_date) }}</p>
                        </div>
                        <div v-if="institution.crm?.contact_user_id">
                            <label class="text-sm font-medium text-gray-500">Contacté par</label>
                            <p class="text-base">{{ formatContactMethod(institution.crm?.last_contact_method) }}</p>
                        </div>
                        <div v-if="institution.crm?.contact_user_id">
                            <label class="text-sm font-medium text-gray-500">Dernier commentaire</label>
                            <p class="text-base whitespace-pre-wrap">{{ institution.crm?.last_comment || '—' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-500">Apporté par</label>
                            <p class="text-base">{{ referrerDisplayLabel(institution.referred_by) || '—' }}</p>
                        </div>
                    </div>

                    <form
                        v-else
                        class="grid grid-cols-1 md:grid-cols-2 gap-4"
                        @submit.prevent="saveCrmEdits"
                    >
                        <div>
                            <label
                                for="institutionEmail"
                                class="block text-sm font-medium text-gray-700 mb-1"
                            >Email</label>
                            <InputIcon
                                id="institutionEmail"
                                v-model="editForm.email"
                                type="email"
                                class="w-full"
                            />
                        </div>
                        <div>
                            <label
                                for="institutionPhone"
                                class="block text-sm font-medium text-gray-700 mb-1"
                            >Téléphone</label>
                            <InputIcon
                                id="institutionPhone"
                                v-model="editForm.phone_number"
                                type="tel"
                                class="w-full"
                            />
                        </div>

                        <template v-if="institution.crm?.contact_user_id">
                            <div>
                                <label
                                    for="contactDate"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >Date de contact</label>
                                <InputIcon
                                    id="contactDate"
                                    v-model="editForm.last_contact_date"
                                    type="date"
                                    class="w-full"
                                />
                            </div>
                            <div>
                                <span class="block text-sm font-medium text-gray-700 mb-1">Contacté par</span>
                                <div class="flex flex-wrap gap-4">
                                    <label class="inline-flex items-center">
                                        <input
                                            v-model="editForm.last_contact_method"
                                            type="radio"
                                            value="mail"
                                            class="form-radio"
                                        >
                                        <span class="ml-2">Mail</span>
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input
                                            v-model="editForm.last_contact_method"
                                            type="radio"
                                            value="phone"
                                            class="form-radio"
                                        >
                                        <span class="ml-2">Téléphone</span>
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input
                                            v-model="editForm.last_contact_method"
                                            type="radio"
                                            value="visio"
                                            class="form-radio"
                                        >
                                        <span class="ml-2">Visioconférence</span>
                                    </label>
                                </div>
                            </div>
                            <div class="md:col-span-2">
                                <label
                                    for="newComment"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >Nouveau commentaire</label>
                                <Textarea
                                    id="newComment"
                                    v-model="editForm.new_comment"
                                    class="w-full min-h-20"
                                    placeholder="Ajouter un commentaire CRM…"
                                />
                            </div>
                        </template>

                        <div class="md:col-span-2 space-y-3">
                            <span class="block text-sm font-medium text-gray-700">Apporté par</span>
                            <CrmReferrerPicker
                                v-model:mode="editForm.referrer_mode"
                                v-model:selected-referrer="selectedReferrer"
                                v-model:referrer-text="editForm.referred_by_text"
                                :referrers="userReferrer"
                                text-input-id="institutionShowReferrerText"
                                autocomplete-input-id="institutionShowReferrerAutocomplete"
                            />
                        </div>
                    </form>
                </div>

                <div
                    v-if="institution.main_user"
                    class="bg-white rounded-lg shadow p-6"
                >
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-bold">
                            Utilisateur principal
                        </h2>
                        <div class="flex items-center gap-3">
                            <label class="text-sm font-medium text-gray-700">
                                Validation :
                            </label>
                            <Checkbox
                                :checked="isValidated"
                                class="w-5 h-5"
                                @update:checked="handleValidationToggle"
                            />
                            <span class="text-sm text-gray-600">
                                {{ isValidated ? 'Validé' : 'Non validé' }}
                            </span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-500">
                                Nom complet
                            </label>
                            <p class="text-base font-semibold">
                                {{ institution.main_user.firstname }} {{ institution.main_user.lastname }}
                            </p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-500">
                                Email
                            </label>
                            <p class="text-base">
                                {{ institution.main_user.email }}
                            </p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-500">
                                Téléphone
                            </label>
                            <p class="text-base">
                                {{ institution.main_user.phone_number || '—' }}
                            </p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-500">
                                Email vérifié
                            </label>
                            <p class="text-base">
                                <span
                                    class="px-2 py-1 rounded text-sm"
                                    :class="institution.main_user.email_verified_at ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                                >
                                    {{ institution.main_user.email_verified_at ? 'Oui' : 'Non' }}
                                </span>
                            </p>
                        </div>
                        <div
                            v-if="institution.main_user.validate_at"
                        >
                            <label class="text-sm font-medium text-gray-500">
                                Date de validation
                            </label>
                            <p class="text-base">
                                {{ formatRelativeDate(institution.main_user.validate_at) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    v-if="institution.services && institution.services.length > 0"
                    class="bg-white rounded-lg shadow p-6"
                >
                    <h2 class="text-xl font-bold mb-4">
                        Services ({{ institution.services.length }})
                    </h2>
                    <div class="space-y-3">
                        <div
                            v-for="service in institution.services"
                            :key="service.id"
                            class="border rounded p-3"
                        >
                            <p class="font-semibold">
                                {{ service.name }}
                            </p>
                            <p
                                v-if="service.phone_number"
                                class="text-sm text-gray-600"
                            >
                                {{ service.phone_number }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-bold mb-4">
                        Actions
                    </h2>
                    <div class="flex gap-3">
                        <Button
                            variant="default"
                            class="rounded-md"
                            @click="handleEdit"
                        >
                            Modifier le nom
                        </Button>
                        <Button
                            v-if="institution.changes_pending"
                            variant="default"
                            class="bg-amber-600 hover:bg-amber-700"
                            :in-progress="validatingChanges"
                            @click="handleValidateChanges"
                        >
                            Valider les modifications
                        </Button>
                        <Button
                            v-if="!isValidated"
                            variant="default"
                            class="bg-green-600 hover:bg-green-700"
                            @click="handleValidate"
                        >
                            Valider l'institution
                        </Button>
                        <Button
                            v-if="!isValidated"
                            variant="outline"
                            class="border-orange-500 text-orange-600 hover:bg-orange-50"
                            @click="handleReject"
                        >
                            Rejeter
                        </Button>
                        <Button
                            v-if="isSuperAdmin"
                            variant="destructive"
                            @click="deleteDialogOpen = true"
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-bold mb-4">
                        Historique des changements
                    </h2>
                    <p
                        v-if="!institutionHistories.length"
                        class="text-sm text-muted-foreground"
                    >
                        Aucun changement enregistré pour cette institution.
                    </p>
                    <div
                        v-else
                        class="space-y-3"
                    >
                        <article
                            v-for="entry in institutionHistories"
                            :key="entry.id"
                            class="border rounded-lg p-4"
                        >
                            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div>
                                    <p class="font-semibold text-foreground">
                                        {{ entry.event_label }}
                                    </p>
                                    <p
                                        v-if="entry.description"
                                        class="text-sm text-muted-foreground mt-1"
                                    >
                                        {{ entry.description }}
                                    </p>
                                    <p
                                        v-if="entry.field && (entry.old_value || entry.new_value)"
                                        class="text-sm text-muted-foreground mt-1"
                                    >
                                        {{ entry.field_label || entry.field }} :
                                        <span v-if="entry.old_value">{{ entry.old_value }}</span>
                                        <span v-if="entry.old_value && entry.new_value"> → </span>
                                        <span v-if="entry.new_value">{{ entry.new_value }}</span>
                                    </p>
                                </div>
                                <div class="text-sm text-muted-foreground shrink-0">
                                    <p>{{ formatHistoryDate(entry.created_at) }}</p>
                                    <p v-if="entry.actor?.full_name">
                                        par {{ entry.actor.full_name }}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </DashboardAdminPageContent>

        <AlertDialog v-model:open="deleteDialogOpen">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                    <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer l'institution « {{ institution?.name }} » ? Cette action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                        class="rounded"
                        variant="destructive"
                        :disabled="deleting"
                        @click="confirmDelete"
                    >
                        Supprimer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<script setup lang="ts">
import type { Institution, InstitutionHistory, Referrer } from '~/lib/types';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import RollingLoader from '~/components/RollingLoader.vue';
import { InputIcon } from '~/components/ui/input-with-icon';
import { Textarea } from '~/components/ui/textarea';

useHead({ title: 'Détails de l\'institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const route = useRoute();
const router = useRouter();
const institution = ref<Institution | null>(null);
const institutionHistories = ref<InstitutionHistory[]>([]);
const loading = ref(true);
const validatingChanges = ref(false);
const editMode = ref(route.query.edit === '1');
const savingCrm = ref(false);
const { get, validateInstitution, validateInstitutionChanges, rejectInstitution, forceDelete } = useInstitutions();
const { updateCrmInstitutionContact, updateCrmUser } = useCrm();
const { updateInstitutionReferrer, getUserReferrer, userReferrer, referrerDisplayLabel } = useReferrer();
const { store: storeComment } = useComment();
const { isSuperAdmin } = useAuth();
const { $toast } = useNuxtApp();
const id = computed(() => route.params.id);

const editForm = reactive({
    email: '',
    phone_number: '',
    last_contact_date: '',
    last_contact_method: 'mail',
    new_comment: '',
    referrer_mode: 'account' as 'account' | 'text',
    referred_by_text: '',
});
const selectedReferrer = ref<Referrer | null>(null);

function populateEditForm() {
    if (!institution.value) {
        return;
    }

    editForm.email = institution.value.email ?? institution.value.main_user?.email ?? '';
    editForm.phone_number = institution.value.phone_number ?? institution.value.main_user?.phone_number ?? '';
    editForm.last_contact_date = institution.value.crm?.last_contact_date ?? '';
    editForm.last_contact_method = institution.value.crm?.last_contact_method ?? 'mail';
    editForm.new_comment = '';

    const referrer = institution.value.referred_by;

    if (referrer?.text) {
        editForm.referrer_mode = 'text';
        editForm.referred_by_text = referrer.text;
        selectedReferrer.value = null;
    }
    else if (referrer?.id) {
        editForm.referrer_mode = 'account';
        editForm.referred_by_text = '';
        selectedReferrer.value = referrer;
    }
    else {
        editForm.referrer_mode = 'account';
        editForm.referred_by_text = '';
        selectedReferrer.value = null;
    }
}

function formatContactMethod(method?: string | null): string {
    if (method === 'mail') {
        return 'Mail';
    }
    if (method === 'phone') {
        return 'Téléphone';
    }
    if (method === 'visio') {
        return 'Visioconférence';
    }

    return method || '—';
}

function formatContactDate(value?: string | null): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('fr-BE');
}

async function toggleEditMode(enable: boolean) {
    editMode.value = enable;

    if (enable) {
        populateEditForm();
        await getUserReferrer();
    }

    await router.replace({
        path: route.path,
        query: enable ? { edit: '1' } : {},
    });
}

async function saveCrmEdits() {
    if (!institution.value) {
        return;
    }

    savingCrm.value = true;

    try {
        await updateCrmInstitutionContact(institution.value.id, {
            email: editForm.email,
            phone_number: editForm.phone_number,
        });

        const contactUserId = institution.value.crm?.contact_user_id;
        const crmTargetId = institution.value.crm?.crm_id ?? contactUserId;

        if (contactUserId && crmTargetId) {
            await updateCrmUser(crmTargetId, {
                userId: contactUserId,
                clientType: 'institution',
                lastContactDate: editForm.last_contact_date || null,
                lastContactMethod: editForm.last_contact_method || null,
            });
        }

        if (contactUserId && editForm.new_comment.trim()) {
            await storeComment(contactUserId, 'User', editForm.new_comment.trim());
        }

        const referrerPayload = editForm.referrer_mode === 'text'
            ? {
                    referred_by: null,
                    referred_by_text: editForm.referred_by_text.trim() || null,
                }
            : {
                    referred_by: selectedReferrer.value?.id ?? null,
                    referred_by_text: null,
                };

        await updateInstitutionReferrer(institution.value.id, referrerPayload);

        $toast({ description: 'Modifications enregistrées', variant: 'success' });
        await refreshInstitution();
        await toggleEditMode(false);
    }
    catch (error) {
        console.error(error);
        $toast({ description: 'Erreur lors de l\'enregistrement', variant: 'destructive' });
    }
    finally {
        savingCrm.value = false;
    }
}

const response = await get(Number(id.value));
institution.value = response.data;
institutionHistories.value = response.data?.histories ?? [];
loading.value = false;

if (editMode.value) {
    populateEditForm();
    await getUserReferrer();
}

const isValidated = computed(() => {
    const mainUser = institution.value?.main_user;

    return institution.value?.status === 'active'
        || (mainUser?.validate_at !== null && mainUser?.validate_at !== undefined && mainUser?.validate_at !== '');
});

const resolvedInstitutionStatus = computed(() => {
    if (institution.value?.registration_source === 'file' && !institution.value?.main_user) {
        return 'not_applicable';
    }
    if (institution.value?.changes_pending && (institution.value?.status === 'active' || isValidated.value || institution.value?.main_user?.validate_at)) {
        return 'changes_pending';
    }
    if (institution.value?.status === 'rejected') {
        return 'rejected';
    }
    if (institution.value?.status === 'active' || institution.value?.main_user?.validate_at) {
        return 'active';
    }

    return institution.value?.status ?? 'pending';
});

const institutionStatusLabel = computed(() => {
    return matchInstitutionStatusLabel(resolvedInstitutionStatus.value);
});

const institutionStatusBadgeClass = computed(() => {
    return matchInstitutionStatusBadgeClass(resolvedInstitutionStatus.value);
});

function matchInstitutionStatusLabel(status?: string | null): string {
    if (status === 'not_applicable') {
        return 'Non applicable';
    }
    if (status === 'active') {
        return 'Validée';
    }
    if (status === 'changes_pending') {
        return 'Modif. en attente';
    }
    if (status === 'rejected') {
        return 'Rejetée';
    }

    return 'En attente';
}

function matchInstitutionStatusBadgeClass(status?: string | null): string {
    if (status === 'not_applicable') {
        return 'bg-gray-100 text-gray-600';
    }
    if (status === 'active') {
        return 'bg-green-100 text-green-800';
    }
    if (status === 'changes_pending') {
        return 'bg-amber-100 text-amber-800';
    }
    if (status === 'rejected') {
        return 'bg-red-100 text-red-800';
    }

    return 'bg-yellow-100 text-yellow-800';
}

function formatHistoryDate(value?: string | null): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('fr-BE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const handleValidationToggle = async (checked: boolean) => {
    if (!institution.value) return;

    if (checked && !isValidated.value) {
        await handleValidate();
    }
};

const handleEdit = () => {
    navigateTo(`/dashboard/admin/institutions/${institution.value?.id}/edit`);
};

const handleValidate = async () => {
    if (!institution.value) return;
    try {
        await validateInstitution(institution.value.id);
        await refreshInstitution();
        $toast({ description: 'Institution validée avec succès', status: 'success' });
    }
    catch (error) {
        console.error('Erreur lors de la validation:', error);
        $toast({ description: 'Erreur lors de la validation', status: 'error', variant: 'destructive' });
    }
};

const handleValidateChanges = async () => {
    if (!institution.value) return;

    validatingChanges.value = true;
    try {
        const response = await validateInstitutionChanges(institution.value.id);
        institution.value = response.data ?? institution.value;
        institutionHistories.value = response.data?.histories ?? institutionHistories.value;
        $toast({ description: response.message ?? 'Modifications validées', status: 'success' });
    }
    catch (error) {
        console.error('Erreur lors de la validation des modifications:', error);
        $toast({ description: 'Erreur lors de la validation des modifications', status: 'error', variant: 'destructive' });
    }
    finally {
        validatingChanges.value = false;
    }
};

const handleReject = async () => {
    if (!institution.value) return;
    if (confirm('Êtes-vous sûr de vouloir rejeter cette institution ?')) {
        try {
            await rejectInstitution(institution.value.id);
            await refreshInstitution();
            $toast({ description: 'Institution rejetée', status: 'success' });
        }
        catch (error) {
            console.error('Erreur lors du rejet:', error);
            $toast({ description: 'Erreur lors du rejet', status: 'error', variant: 'destructive' });
        }
    }
};

const deleteDialogOpen = ref(false);
const deleting = ref(false);

const confirmDelete = async () => {
    if (!institution.value) return;

    deleting.value = true;
    try {
        await forceDelete(institution.value.id);
        deleteDialogOpen.value = false;
        await navigateTo('/dashboard/admin/institutions');
    }
    catch (error) {
        console.error('Erreur lors de la suppression:', error);
        $toast({ description: 'Erreur lors de la suppression', status: 'error', variant: 'destructive' });
    }
    finally {
        deleting.value = false;
    }
};

const refreshInstitution = async () => {
    loading.value = true;
    await get(Number(id.value)).then((response) => {
        institution.value = response.data;
        institutionHistories.value = response.data?.histories ?? [];
        loading.value = false;
    });
};
</script>
