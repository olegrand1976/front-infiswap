<template>
    <div>
        <DashboardAdminPageHeader title="Candidatures" />

        <div class="mt-8">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 class="text-xl text-primary font-semibold">
                        Liste des candidats
                    </h1>
                    <p class="text-gray-500 text-sm">
                        Voici les personnes qui ont postulé pour cette mission.
                    </p>
                </div>

                <div class="flex gap-2 items-center border border-gray-300 rounded-md py-2 px-4">
                    <MagnifyingGlassIcon class="w-4 h-4 text-gray-500" />
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Rechercher par nom ou prénom..."
                        class="w-72 text-sm focus-within:outline-none transition text-gray-700"
                        @input="debouncedFilterResponses"
                    >
                </div>
            </div>
        </div>

        <div class="mt-12 hidden md:block">
            <Table class="w-full border rounded-xl overflow-hidden shadow-sm">
                <TableHeader>
                    <TableRow class="grid grid-cols-4 bg-gray-50 border-b">
                        <TableHead class="py-4 font-semibold text-gray-600">
                            Candidat
                        </TableHead>
                        <TableHead class="py-4 font-semibold text-gray-600">
                            Motivation
                        </TableHead>
                        <TableHead class="py-4 font-semibold text-gray-600">
                            Date de candidature
                        </TableHead>
                        <TableHead class="py-4 font-semibold text-gray-600">
                            Statut
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <div
                        v-if="responses.data.length == 0"
                        class="text-center mt-12 text-gray-600"
                    >
                        Aucune résultat trouvé
                    </div>

                    <div v-else>
                        <TableRow
                            v-for="response in dataResponses"
                            :key="response.id"
                            class="grid grid-cols-4 items-center border-b hover:bg-gray-50 transition"
                        >
                            <TableCell class="flex items-center gap-4 py-4">
                                <img
                                    v-if="response.responder.profil_url"
                                    :src="useRuntimeConfig().public.API_URL + '/storage/' + response.responder.profil_url"
                                    class="w-10 h-10 rounded-full object-cover"
                                >
                                <LayoutsAppImage
                                    v-else
                                    src="icons/user-circle.png"
                                    class="w-10 h-10 rounded-full opacity-40"
                                />
                                <UsersName
                                    :user="response.responder"
                                    class="font-medium text-gray-700"
                                />
                            </TableCell>

                            <TableCell
                                class="text-gray-900 flex gap-2 items-center hover:transition-all hover:scale-105 hover:duration-300 cursor-pointer"
                                @click="handleOpenMotivation(response)"
                            >
                                <p class="max-w-52 truncate">
                                    {{ response.description }}
                                </p>
                                <EyeIcon class="w-4 h-4 hover:text-primary" />
                            </TableCell>

                            <TableCell class="text-gray-600">
                                {{ formatToDMY(response.responded_at) }}
                            </TableCell>

                            <TableCell>
                                <div
                                    v-if="response.status === 'pending'"
                                    class="flex gap-2"
                                >
                                    <Button
                                        variant="success"
                                        @click="handleChangeStatusCandidacy(response, 'accepted')"
                                    >
                                        <CheckIcon class="w-4 h-4 mr-1" />
                                        Accepter
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        @click="handleChangeStatusCandidacy(response, 'rejected')"
                                    >
                                        <XMarkIcon class="w-4 h-4 mr-1" />
                                        Rejeter
                                    </Button>
                                </div>

                                <span
                                    v-else
                                    :class="[
                                        'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold',
                                        response.status === 'accepted'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700',
                                    ]"
                                >
                                    <CheckIcon class="w-4 h-4" />
                                    {{ response.status === 'accepted' ? 'Accepté' : 'Rejeté' }}
                                </span>
                            </TableCell>
                        </TableRow>
                    </div>
                </TableBody>
            </Table>
        </div>

        <div class="mt-12 space-y-6 md:hidden">
            <div
                v-if="responses.data.length == 0"
                class="text-center mt-12 text-gray-600"
            >
                Aucune résultat trouvé
            </div>

            <div v-else>
                <div
                    v-for="response in dataResponses"
                    :key="response.id"
                    class="bg-white rounded-xl border p-4 shadow-sm"
                >
                    <div class="flex items-center gap-3 mb-3">
                        <img
                            v-if="response.responder.profil_url"
                            :src="useRuntimeConfig().public.API_URL + '/storage/' + response.responder.profil_url"
                            class="w-12 h-12 rounded-full object-cover"
                        >
                        <LayoutsAppImage
                            v-else
                            src="icons/user-circle.png"
                            class="w-12 h-12 rounded-full opacity-40"
                        />
                        <div>
                            <UsersName
                                :user="response.responder"
                                class="font-semibold text-gray-800"
                            />
                            <p class="text-xs text-gray-500">
                                {{ formatToDMY(response.responded_at) }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-6">
                        <span class="text-gray-800 line-clamp-3">
                            {{ response.description }}
                        </span>
                        <span
                            class="text-primary text-sm font-semibold cursor-pointer hover:underline"
                            @click="handleOpenMotivation(response)"
                        >
                            Voir plus
                        </span>
                    </div>

                    <div
                        v-if="response.status === 'pending'"
                        class="flex gap-2 mt-8 mb-4"
                    >
                        <Button
                            size="sm"
                            class="w-full"
                            variant="success"
                            @click="handleChangeStatusCandidacy(response, 'accepted')"
                        >
                            Accepter
                        </Button>
                        <Button
                            size="sm"
                            class="w-full"
                            variant="destructive"
                            @click="handleChangeStatusCandidacy(response, 'rejected')"
                        >
                            Rejeter
                        </Button>
                    </div>

                    <div
                        v-else
                        :class="[
                            'mt-8 mb-4 text-center py-2 rounded-lg font-semibold',
                            response.status === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700',
                        ]"
                    >
                        {{ response.status === 'accepted' ? 'Candidature acceptée' : 'Candidature rejetée' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8">
            <CustomPagination
                :default-page="page"
                :per-page="perPage"
                :total="responses.meta.total"
                @update:page="refreshResponses"
                @update:per-page="handlePerPageChange"
            />
        </div>

        <Dialog v-model:open="motivationDialog">
            <DialogContent class="max-w-2xl">
                <DialogTitle class="text-primary">
                    Motivation
                </DialogTitle>

                <DialogDescription>
                    {{ selectedResponse.description }}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { CheckIcon, EyeIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { PERPAGE } from '~/lib/constants';
import { useRuntimeConfig } from '#app';
import { formatToDMY } from '~/composables/useDate';
import type { MissionResponse } from '~/lib/types';
import { debounce } from '~/lib/utils';

useHead({ title: 'Candidatures' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

import { toast } from 'vue-sonner';
const route = useRoute();
const id = computed(() => route.params.id);

const { getByMission, responses, update } = useMissionResponses();

const page = ref(1);
const perPage = ref(PERPAGE);

const search = ref('');
const selectedResponse = ref<MissionResponse>(null);
const motivationDialog = ref(false);

await getByMission(Number(id.value), page.value, perPage.value, { name: search.value });
const dataResponses = computed(() => responses.value.data ?? []);

const filterResponses = async () => {
    await getByMission(
        Number(id.value),
        page.value,
        perPage.value,
        {
            name: search.value,
        });
};

const debouncedFilterResponses = debounce(filterResponses, 100);

const refreshResponses = async (pge: number) => {
    page.value = pge;
    await filterResponses();
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await filterResponses();
};

const handleOpenMotivation = (response) => {
    selectedResponse.value = response;
    motivationDialog.value = true;
};

const handleChangeStatusCandidacy = async (response: MissionResponse, status: string) => {
    const payload = {
        mission_id: response.mission_id,
        responded_by: response.responded_by,
        status: status,
        candidate_id: null,
    };

    if (status == 'accepted') {
        payload.candidate_id = response.responder.id;
    };

    try {
        const result = await update(response.id, payload);

        if (result.data) {
            const updatedCandidacy = result.data;

            responses.value = {
                ...responses.value,
                data: responses.value.data.map(response =>
                    response.id === updatedCandidacy.id
                        ? { ...response, ...updatedCandidacy }
                        : response,
                ),
            };

            toast(status == 'accepted' ? 'Candidature acceptée' : 'Candidature rejetée');
        };
    }
    catch (err) {
        if (err.data?.errors) {
            const firstError = Object.values(err.data.errors)[0][0];
            toast.error(firstError);
        }
    }
};
</script>
