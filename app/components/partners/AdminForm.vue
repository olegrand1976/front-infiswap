<template>
    <form @submit.prevent="submit">
        <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            <div class="lg:p-4 pb-6">
                <h1 class="font-semibold text-gray-600">
                    Binôme
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Informations liées à la demande
                </p>

                <div class="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-md">
                    <div class="flex flex-col items-center text-center lg:gap-4">
                        <div class="relative">
                            <img
                                src="/images/icons/user-circle.png"
                                class="w-20 h-20 sm:w-24 sm:h-24 rounded-full opacity-60"
                            >
                        </div>

                        <h2 class="font-semibold text-gray-600 text-lg">
                            Informations sur le créateur
                        </h2>

                        <div class="text-sm text-gray-500 space-y-1 sm:space-y-2">
                            <p>
                                <strong class="text-gray-700">Nom complet :</strong>
                                {{ form.fullname }}
                            </p>
                            <p>
                                <strong class="text-gray-700">Email :</strong>
                                {{ form.email }}
                            </p>
                            <p>
                                <strong class="text-gray-700">Téléphone :</strong>
                                {{ form.phoneNumber }}
                            </p>
                        </div>
                    </div>

                    <p class="mt-4 text-sm text-gray-700 items-center text-center">
                        <strong class="text-gray-700">Nombre de personnes intéressées :</strong>
                        <NuxtLink
                            :to="`/dashboard/admin/partners/interest/${form.id}`"
                            class="ml-2 flex items-center justify-center gap-1 text-primary hover:underline font-bold"
                        >
                            {{ form.responsesCount }} personne<span v-if="form.responsesCount > 1">s</span>
                            <Eye
                                v-if="form.responsesCount > 0"
                                class="size-4"
                            />
                        </NuxtLink>
                    </p>

                    <div
                        v-if="partnership && isAdmin"
                        class="text-center mt-4"
                    >
                        <Button
                            class="w-full max-w-sm rounded"
                            @click.prevent="form.status == 'closed' ? handleOpenReleaseConfirmation() : handleRelease('closed')"
                        >
                            <RefreshCw class="mr-2" />
                            <span v-if="form.status == 'closed'">
                                Ré-ouvrir la demande
                            </span>
                            <span v-else>
                                Fermer la demande
                            </span>
                        </Button>
                    </div>
                </div>

                <div
                    v-if="form.notifiedUsers && form.notifiedUsers.length"
                    class="mt-6 bg-white p-6 rounded-xl border border-gray-200 shadow-md"
                >
                    <h3 class="text-lg font-bold text-center text-gray-800 mb-4 tracking-wide">
                        Liste des personnes notifiées
                    </h3>

                    <ul class="divide-y divide-gray-100 text-sm">
                        <li
                            v-for="user in visibleUsers"
                            :key="user.id"
                            class="py-2 px-3 hover:bg-gray-50 transition-colors rounded-md"
                        >
                            <div class="font-semibold text-gray-800">
                                <UsersName :user="user" />
                            </div>
                            <div class="text-gray-500 text-xs mt-1">
                                <span class="font-medium text-gray-600">Email :</span> {{ user.email }}<br>
                                <span class="font-medium text-gray-600">Code postal :</span> {{ user.profile.zip_code ?? '—' }}
                            </div>
                        </li>
                    </ul>

                    <button
                        v-if="shouldShowMoreButton"
                        class="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        @click="showAllNurses"
                    >
                        Voir plus (+{{ remainingUsersCount }})
                    </button>
                </div>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-8 rounded-md flex flex-col gap-6">
                <div class="flex flex-col space-y-3">
                    <label class="text-gray-500 text-sm font-medium">
                        Type de demande
                    </label>
                    <div class="flex flex-col gap-4">
                        <label>
                            <input
                                v-model="form.type"
                                type="radio"
                                name="type"
                                value="in_search"
                                checked
                            >
                            Je suis à la recherche d’un binôme
                        </label>
                        <label>
                            <input
                                v-model="form.type"
                                type="radio"
                                name="type"
                                value="available"
                            >
                            Je suis disponible pour collaborer
                        </label>
                    </div>
                </div>

                <div class="flex flex-col space-y-3">
                    <label class="text-gray-500 text-sm font-medium">
                        Description
                    </label>
                    <Textarea
                        v-model="form.description"
                        :rows="12"
                        class="rounded-md border border-gray-200 focus-within:border focus-within:border-primary"
                    />
                </div>
            </div>
        </div>

        <Separator class="my-4 lg:my-10" />

        <div class="col-span-3 grid place-content-center">
            <Button
                type="submit"
                class="rounded-md w-52"
                :in-progress="inProgress"
            >
                Sauvegarder
            </Button>
        </div>

        <AlertDialog :open="openReleaseModal">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ré-ouvrir la demande</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cela définira toutes les réponses liées à cette demande comme étant en attente. Cette action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel @click.prevent="handleCloseReleaseConfirmation">
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                        class="rounded"
                        @click.prevent="form.status == 'closed' ? handleRelease('open') : handleRelease('closed')"
                    >
                        Valider
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </form>
</template>

<script setup lang="ts">
import { Eye, RefreshCw } from 'lucide-vue-next';
import type { User, UserPartner } from '~/lib/types';

const props = defineProps<{
    partnership?: UserPartner | null;
}>();

const { isAdmin } = useAuth();
const { updatePartnership } = usePartners();
const openReleaseModal = ref(false);

function handleOpenReleaseConfirmation() {
    openReleaseModal.value = true;
}
function handleCloseReleaseConfirmation() {
    openReleaseModal.value = false;
}

const getInitialValue = (partnership: UserPartner | null | undefined = props.partnership) => ({
    id: partnership?.id ?? null,
    type: partnership?.type ?? null,
    description: partnership?.description ?? '',
    status: partnership?.status ?? '',
    userId: partnership?.user.id ?? null,
    fullname: partnership?.user.full_name ?? '',
    email: partnership?.user.email ?? '',
    phoneNumber: partnership?.user.phone_number ?? '',
    responsesCount: partnership?.responses_count ?? null,
    notifiedUsers: partnership?.notified_users ?? [],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const form = reactive(getInitialValue() as any);
const { $toast } = useNuxtApp();

function resetForm(partnership?: UserPartner | null) {
    Object.assign(form, getInitialValue(partnership));
}

watch(
    () => props.partnership,
    (newReplacement) => {
        resetForm(newReplacement);
    },
    { immediate: true },
);

const showAll = ref(false);
const limit = 5;
const notifiedUsers = ref<User[]>([]);

function initializeNotifiedUsers() {
    if (!form.notifiedUsers || !Array.isArray(form.notifiedUsers)) {
        notifiedUsers.value = [];
        return;
    }
    notifiedUsers.value = JSON.parse(JSON.stringify(form.notifiedUsers));
}

const visibleUsers = computed(() => {
    return showAll.value
        ? notifiedUsers.value
        : notifiedUsers.value.slice(0, limit);
});

const shouldShowMoreButton = computed(() => {
    return notifiedUsers.value.length > limit && !showAll.value;
});

const remainingUsersCount = computed(() => {
    return Math.max(notifiedUsers.value.length - limit, 0);
});

function showAllNurses() {
    showAll.value = true;
}

initializeNotifiedUsers();

async function handleRelease(status: string) {
    const payload = {
        id: form.id,
        type: form.type,
        status: status,
        description: form.description,
    };

    try {
        const response = await updatePartnership(payload);

        form.status = response.partnership.status;

        $toast({
            description: form.status == 'open' ? 'Demande de collaboration ré-ouverte' : 'Demande de collaboration fermée',
        });
    }
    catch {
        $toast({
            variant: 'destructive',
            description: form.status == 'open' ? 'Erreur lors de l\'ouverture de la demande' : 'Erreur lors de la fermeture de la demande',
        });
    }

    handleCloseReleaseConfirmation();
}

const { submit, inProgress } = useSubmit(async () => {
    const payload = {
        id: form.id,
        type: form.type,
        status: form.status,
        description: form.description,
    };

    await updatePartnership(payload);
}, {
    onSuccess: () => {
        $toast({
            description: 'Demande de collaboration mise à jour avec succès',
        });
    },
});
</script>
