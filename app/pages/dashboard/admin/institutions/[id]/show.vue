<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Détails de l'institution">
            <template #action>
                <Button
                    variant="outline"
                    @click="navigateTo('/dashboard/admin/institutions')"
                >
                    Retour à la liste
                </Button>
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
                                    :class="{
                                        'bg-green-100 text-green-800': institution.status === 'active',
                                        'bg-yellow-100 text-yellow-800': institution.status === 'pending',
                                        'bg-red-100 text-red-800': institution.status === 'rejected',
                                    }"
                                >
                                    {{ institution.status === 'active' ? 'Active' : institution.status === 'pending' ? 'En attente' : 'Rejetée' }}
                                </span>
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
import type { Institution } from '~/lib/types';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import RollingLoader from '~/components/RollingLoader.vue';

useHead({ title: 'Détails de l\'institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const route = useRoute();
const institution = ref<Institution | null>(null);
const loading = ref(true);
const { get, validateInstitution, rejectInstitution, forceDelete } = useInstitutions();
const { isSuperAdmin } = useAuth();
const { $toast } = useNuxtApp();
const id = computed(() => route.params.id);

await get(Number(id.value)).then((response) => {
    institution.value = response.data;
    loading.value = false;
});

const isValidated = computed(() => {
    const mainUser = institution.value?.main_user;
    return mainUser && mainUser.validate_at !== null && mainUser.validate_at !== undefined && mainUser.validate_at !== '';
});

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
        loading.value = false;
    });
};
</script>
