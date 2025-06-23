<template>
    <form @submit.prevent="submit">
        <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            <div class="lg:p-4 pb-6">
                <h1 class="font-semibold text-gray-600">
                    Remplacement
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Informations liées au remplacement
                </p>

                <div class="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-md">
                    <div class="flex flex-col items-center text-center lg:gap-4">
                        <div class="relative">
                            <img
                                v-if="form?.nurseOwnerProfilUrl"
                                :src="useRuntimeConfig().public.API_URL + '/storage/' + form?.nurseOwnerProfilUrl"
                                class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-300"
                            >
                            <img
                                v-else
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
                                {{ form.nurseOwnerFullName }}
                            </p>
                            <p>
                                <strong class="text-gray-700">Email :</strong>
                                {{ form.nurseOwnerEmail }}
                            </p>
                            <p>
                                <strong class="text-gray-700">Téléphone :</strong>
                                {{ form.nurseOwnerPhoneNumber }}
                            </p>
                        </div>
                    </div>
                    <p class="mt-4 text-sm text-gray-700 items-center text-center">
                        <strong class="text-gray-700">Nombre de personnes intéressées :</strong>
                        <NuxtLink
                            :to="`/dashboard/admin/replacements/interest/${form.id}`"
                            class="ml-2 flex items-center justify-center gap-1 text-primary hover:underline font-bold"
                        >
                            {{ form.responseCount }} personne<span v-if="form.responseCount > 1">s</span>
                            <EyeIcon
                                v-if="form.responseCount>0"
                                class="size-4"
                            />
                        </NuxtLink>
                    </p>
                    <div
                        v-if="replacement && isAdmin"
                        class="text-center mt-4"
                    >
                        <Button
                            class="w-full max-w-sm rounded"
                            @click.prevent="handleOpenReleaseConfirmation"
                        >
                            <ArrowPathIcon class="mr-2" />
                            <span>Libérer le remplacement</span>
                        </Button>
                    </div>
                </div>

                <div
                    v-if="form.matchingNurses && form.matchingNurses.length"
                    class="mt-6 bg-white p-6 rounded-xl border border-gray-200 shadow-md"
                >
                    <h3 class="text-lg font-bold text-center text-gray-800 mb-4 tracking-wide">
                        Liste des personnes notifiées
                    </h3>

                    <ul class="divide-y divide-gray-100 text-sm">
                        <li
                            v-for="(user) in visibleUsers"
                            :key="user.id"
                            class="py-2 px-3 hover:bg-gray-50 transition-colors rounded-md"
                        >
                            <div class="font-semibold text-gray-800">
                                <UsersName :user="user" />
                            </div>
                            <div class="text-gray-500 text-xs mt-1">
                                <span class="font-medium text-gray-600">Email :</span> {{ user.email }}<br>
                                <span class="font-medium text-gray-600">Code postal :</span> {{ user.zip_code ?? '—' }}
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

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                <template v-if="form.type === 'classic' && form.periods.length > 0">
                    <p class="text-gray-500 text-sm font-medium">
                        Périodes
                    </p>
                    <div
                        v-for="(period, index) in form.periods"
                        :key="index"
                        class="mb-2"
                    >
                        <div class="flex items-center gap-2">
                            <InputIcon
                                v-model="period.start_date"
                                type="date"
                                class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                            />
                            <span class="mx-2">au</span>
                            <InputIcon
                                v-model="period.end_date"
                                type="date"
                                class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                            />
                            <button
                                type="button"
                                @click="form.periods.splice(index, 1)"
                            >
                                🗑
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        class="text-xs text-primary underline"
                        @click="form.periods.push({ start_date: '', end_date: '' })"
                    >
                        + Ajouter une période
                    </button>
                </template>
                <template v-else>
                    <div class="flex flex-col gap-1 w-full">
                        <p class="text-gray-500 text-sm font-medium">
                            Date de début
                        </p>
                        <InputIcon
                            v-model="form.startDate"
                            type="date"
                            class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                        />
                    </div>
                    <div class="flex flex-col gap-1 w-full">
                        <p class="text-gray-500 text-sm font-medium">
                            Date de fin
                        </p>
                        <InputIcon
                            v-model="form.endDate"
                            type="date"
                            class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                        />
                    </div>
                </template>

                <div v-if="form.type === 'classic'">
                    <div class="grid grid-cols-2 gap-4">
                        <template v-if="form.timeSlot.morning || form.timeSlot.evening">
                            <div>
                                <span>Matin - Heure de début</span>
                                <InputTime
                                    v-model="form.timeSlot.morning.startAt"
                                    input-class="rounded-lg"
                                />
                            </div>
                            <div>
                                <span>Matin - Heure de fin</span>
                                <InputTime
                                    v-model="form.timeSlot.morning.endAt"
                                    input-class="rounded-lg"
                                />
                            </div>
                            <div>
                                <span>Soir - Heure de début</span>
                                <InputTime
                                    v-model="form.timeSlot.evening.startAt"
                                    input-class="rounded-lg"
                                />
                            </div>
                            <div>
                                <span>Soir - Heure de fin</span>
                                <InputTime
                                    v-model="form.timeSlot.evening.endAt"
                                    input-class="rounded-lg"
                                />
                            </div>
                        </template>
                        <template v-else>
                            <div>
                                <span>Heure de début</span>
                                <InputTime
                                    v-if="form.details.length > 0 && form.details[0].start_at"
                                    v-model="form.details[0].start_at"
                                    input-class="rounded-lg"
                                />
                                <InputTime
                                    v-else
                                    v-model="form.timeSlot.startAt"
                                    input-class="rounded-lg"
                                />
                            </div>
                            <div>
                                <span>Heure de fin</span>
                                <InputTime
                                    v-if="form.details.length > 0 && form.details[0].end_at"
                                    v-model="form.details[0].end_at"
                                    input-class="rounded-lg"
                                />
                                <InputTime
                                    v-else
                                    v-model="form.timeSlot.endAt"
                                    input-class="rounded-lg"
                                />
                            </div>
                        </template>
                    </div>
                </div>

                <div v-else>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span>Heure de début</span>
                            <InputTime
                                v-if="form.details.length > 0 && form.details[0].start_at"
                                v-model="form.details[0].start_at"
                                input-class="rounded-lg"
                            />
                        </div>
                        <div>
                            <span>Heure de fin</span>
                            <InputTime
                                v-if="form.details.length > 0 && form.details[0].end_at"
                                v-model="form.details[0].end_at"
                                input-class="rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Select
                        v-model="form.visibility"
                        label="Visibilité"
                    >
                        <SelectTrigger
                            position="right"
                            class="rounded-md"
                        >
                            <SelectValue placeholder="Séléctionner..." />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup>
                                <SelectItem
                                    v-for="(visible, index) in visibility"
                                    :key="index"
                                    :value="visible.value"
                                >
                                    <span class="text-sm">{{ visible.label }}</span>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select
                        v-model="form.status"
                        label="Status"
                    >
                        <SelectTrigger
                            position="right"
                            class="rounded-md"
                        >
                            <SelectValue placeholder="Séléctionner..." />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup>
                                <SelectItem
                                    v-for="(stat, index) in status"
                                    :key="index"
                                    :value="stat.value"
                                >
                                    <span class="text-sm">{{ stat.label }}</span>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select
                        v-model="form.type"
                        label="Type"
                    >
                        <SelectTrigger
                            position="right"
                            class="rounded-md"
                        >
                            <SelectValue placeholder="Séléctionner..." />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup>
                                <SelectItem
                                    v-for="(types, index) in type"
                                    :key="index"
                                    :value="types.value"
                                >
                                    <span class="text-sm">{{ types.label }}</span>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <InputIcon
                        v-model="form.patientCount"
                        rounded="md"
                        label="Nombre de patients"
                        type="number"
                    />
                </div>

                <div class="flex flex-col gap-2 w-full">
                    <label class="text-gray-600 text-sm font-medium">
                        Codes postaux
                    </label>
                    <InputTagManager
                        v-model="form.zipCodes"
                        placeholder="6565,4561,1237"
                        class="pt-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :is-mobile="false"
                        :comma-validation="false"
                        @keydown.enter.prevent
                    />
                </div>

                <div class="flex flex-col gap-2 w-full">
                    <label class="text-gray-600 text-sm font-medium">
                        Villes
                    </label>
                    <InputTagManager
                        v-model="form.cities"
                        placeholder="Anvers, Bruges, Gand"
                        class="pt-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :is-mobile="false"
                        :comma-validation="true"
                        :no-space-validation="true"
                        @keydown.enter.prevent
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <h5>Type de soin</h5>
                    <Select
                        v-model="form.careTypes"
                        multiple
                    >
                        <SelectTrigger
                            class="w-full bg-white rounded-lg text-nowrap border border-2 border-gray-300"
                            position="right"
                        >
                            <SelectValue class="truncate w-[200rem]">
                                <template v-if="getSelectedCareTypesText(form.careTypes)">
                                    {{ getSelectedCareTypesText(form.careTypes) }}
                                </template>
                                <template v-else>
                                    <span class="text-black/60">
                                        Sélectionner un type de soin
                                    </span>
                                </template>
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent class="border border-none">
                            <SelectGroup class="w-32">
                                <div
                                    v-for="careType in careTypes"
                                    :key="careType.id"
                                    class="flex items-center space-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                    @click="handleCareTypeClick(form.careTypes, careType.id)"
                                >
                                    <Checkbox
                                        :checked="form.careTypes.includes(careType.id)"
                                        class="mr-2"
                                    />
                                    <label class="text-xs text-nowrap cursor-pointer">
                                        {{ careType.name }}
                                    </label>
                                </div>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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
                {{ props.replacement ? 'Sauvegarder' : 'Créer un remplacement' }}
            </Button>
        </div>

        <AlertDialog :open="openReleaseModal">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Libérer le remplacement</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cela définira toutes les réponses liées à ce remplacement comme étant en attente. Cette action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel @click.prevent="handleCloseReleaseConfirmation">
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                        class="rounded"
                        @click.prevent="handleRelease(replacement)"
                    >
                        Valider
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </form>
</template>

<script setup lang="ts">
import { ArrowPathIcon, EyeIcon } from '@heroicons/vue/24/solid';
import type { Replacement, User, Nurse } from '~/lib/types';
import { useRuntimeConfig } from '#app';

const props = defineProps<{
    replacement?: Replacement | null;
}>();

const { $apifetch } = useNuxtApp();
const { isAdmin } = useAuth();
const { careTypes, fetchCareTypes } = useCareTypes();
const { updateAgainReplacement, release } = useReplacements();
const isEditMode = computed(() => !!props.replacement);
const formatDate = (dateString: string | null) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
};

const openReleaseModal = ref(false);

function handleOpenReleaseConfirmation() {
    openReleaseModal.value = true;
}
function handleCloseReleaseConfirmation() {
    openReleaseModal.value = false;
}

async function handleRelease(replacement: Replacement) {
    return await release(replacement.id).then(() => {
        handleCloseReleaseConfirmation();
    });
}

const transformCareInformations = (careInfo: string | object) => {
    try {
        const parsed = typeof careInfo === 'string' ? JSON.parse(careInfo) : careInfo;
        return Array.isArray(parsed)
            ? parsed.map(info => info?.id ?? info)
            : [];
    }
    catch {
        return [];
    }
};

const getInitialValue = (replacement: Replacement | null | undefined = props.replacement) => ({
    id: replacement?.id ?? null,
    nurseId: replacement?.nurse_id ?? null,
    replacedBy: replacement?.replaced_by ?? null,
    experienceYears: replacement?.experience_years ?? null,
    startDate: formatDate(replacement?.start_date ?? null),
    endDate: formatDate(replacement?.end_date ?? null),
    visibility: replacement?.visibility ?? 'public',
    status: replacement?.status ?? 'open',
    type: replacement?.type ?? 'classic',
    patientCount: replacement?.patient_count ?? null,
    zipCodes: typeof replacement?.zip_codes === 'string'
        ? (() => {
                try {
                    return JSON.parse(replacement.zip_codes);
                }
                catch {
                    return [];
                }
            })()
        : replacement?.zip_codes ?? [],
    cities: typeof replacement?.cities === 'string'
        ? (() => {
                try {
                    return JSON.parse(replacement.cities);
                }
                catch {
                    return [];
                }
            })()
        : replacement?.cities ?? [],
    careTypes: transformCareInformations(replacement?.care_types),
    details: replacement?.details ?? [],
    nurseOwnerFullName: replacement?.nurse_owner_full_name ?? '',
    nurseOwnerEmail: replacement?.nurse_owner_email ?? '',
    nurseOwnerPhoneNumber: replacement?.nurse_owner_phone_number ?? '',
    nurseOwnerProfilUrl: replacement?.nurse_owner_profil_url ?? '',
    matchingNurses: replacement?.matching_nurses ?? '',
    substituteNurse: replacement?.substitute_nurse ?? '',
    candidate: replacement?.candidate ?? false,
    responseCount: replacement?.response_count ?? null,
    periods: replacement?.periods ?? [],
    timeSlot: (() => {
        try {
            if (typeof replacement?.timeSlot === 'string') {
                const slot = JSON.parse(replacement.timeSlot);

                const hasMorning = !!slot?.morning?.start_at || !!slot?.morning?.end_at;
                const hasEvening = !!slot?.evening?.start_at || !!slot?.evening?.end_at;

                if (hasMorning || hasEvening) {
                    return {
                        morning: {
                            startAt: slot?.morning?.start_at ?? '',
                            endAt: slot?.morning?.end_at ?? '',
                        },
                        evening: {
                            startAt: slot?.evening?.start_at ?? '',
                            endAt: slot?.evening?.end_at ?? '',
                        },
                    };
                }

                return {
                    startAt: slot?.start_at ?? replacement?.details?.[0]?.start_at ?? '',
                    endAt: slot?.end_at ?? replacement?.details?.[0]?.end_at ?? '',
                };
            }

            return replacement?.timeSlot ?? {};
        }
        catch {
            return {};
        }
    })(),
});

const form = reactive(getInitialValue() as any);
const { $toast } = useNuxtApp();

const { submit, inProgress } = useSubmit(async () => {
    if (form.details.length > 0) {
        if (form.details[0].start_at) {
            form.timeSlot.startAt = form.details[0].start_at;
        }
        if (form.details[0].end_at) {
            form.timeSlot.endAt = form.details[0].end_at;
        }
    }
    if (isEditMode.value && props.replacement?.id) {
        await updateAgainReplacement(form);
        return;
    }
}, {
    onSuccess: () => {
        $toast({
            description: isEditMode.value ? 'Remplacement mis à jour avec succès' : 'Remplacement créé avec succès',
        });
    },
});

const handleCareTypeClick = (careTypesArray, careTypes) => {
    const index = careTypesArray.indexOf(careTypes);
    if (index === -1) {
        careTypesArray.push(careTypes);
    }
    else {
        careTypesArray.splice(index, 1);
    }
    form.careTypes = [...careTypesArray];
};

const getSelectedCareTypesText = (selectedIds) => {
    return careTypes.value
        .filter(ct => selectedIds.includes(ct.id))
        .map(ct => ct.name)
        .join(', ');
};

function resetForm(replacement?: Replacement | null) {
    Object.assign(form, getInitialValue(replacement));
}

const type = [
    {
        value: 'classic',
        label: 'Classique',
        name: 'Classique',
    },
    {
        value: 'immediate',
        label: 'Urgent',
        name: 'Urgent',
    },
];

const status = [
    {
        value: 'open',
        label: 'Ouvert',
        name: 'Ouvert',
    },
    {
        value: 'closed',
        label: 'Fermé',
        name: 'Fermé',
    },
];

const visibility = [
    {
        value: 'public',
        label: 'Publique',
        name: 'Publique',
    },
    {
        value: 'group',
        label: 'Groupe',
        name: 'Groupe',
    },
    {
        value: 'friends',
        label: 'Amis',
        name: 'Amis',
    },
];

watch(
    () => props.replacement,
    (newReplacement) => {
        resetForm(newReplacement);
    },
    { immediate: true },
);
fetchCareTypes();

const showAll = ref(false);
const limit = 5;
const matchingUsers = ref<User[]>([]);

async function loadMatchingUsers() {
    if (!form.matchingNurses || !Array.isArray(form.matchingNurses)) return;

    const nurses = JSON.parse(JSON.stringify(form.matchingNurses));

    const userIdPromises = nurses.map((n: Nurse) =>
        $apifetch<{ nurse: Nurse }>(`/api/nurses/${n.id}`)
            .then(res => res.nurse?.user_id)
            .catch(() => null),
    );

    const userIds = await Promise.all(userIdPromises);

    const userPromises = userIds
        .filter(id => !!id)
        .map(id => $apifetch<{ user: User }>(`/api/users/${id}`));

    const userResponses = await Promise.all(userPromises);

    matchingUsers.value = userResponses.map(r => r.user);
}

const visibleUsers = computed(() => {
    return showAll.value
        ? matchingUsers.value
        : matchingUsers.value.slice(0, limit);
});

const shouldShowMoreButton = computed(() => {
    return matchingUsers.value.length > limit && !showAll.value;
});

const remainingUsersCount = computed(() => {
    return Math.max(matchingUsers.value.length - limit, 0);
});

loadMatchingUsers();

const showAllNurses = () => {
    showAll.value = true;
};
</script>
