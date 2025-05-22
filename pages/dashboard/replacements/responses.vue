<template>
    <div>
        <h1 class="py-3 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
            Mes <strong>réponses reçues</strong>
        </h1>

        <template v-if="listResponse == 0">
            <p class="text-black/50 mt-16 text-center">
                Aucune donnée à afficher pour le moment
            </p>
        </template>
        <template v-else>
            <div class="grid my-4 md:my-8">
                <div
                    v-for="(response, index) in listResponse"
                    :key="index"
                    class="overflow-y-auto grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 lg:gap-8 h-full"
                >
                    <div
                        v-if="response?.responses?.length != 0"
                        class="bg-gray-100 shadow p-6 rounded-lg 2xl:col-span-1 mb-5 mt-8 md:mt-0"
                    >
                        <div class="flex justify-between items-center">
                            <h1 class="text-primary font-semibold">
                                <template v-if="listResponse.length === 1">
                                    Remplacement
                                </template>
                                <template v-else>
                                    Remplacement {{ index + 1 }}
                                </template>
                            </h1>

                            <Badge
                                v-if="response.responses?.length != 0"
                                class="w-24 text-center bg-success"
                            >
                                <template v-if="response.responses?.length == 1">
                                    1 intéressé
                                </template>
                                <template v-else>
                                    {{ response.responses?.length }} intéréssés
                                </template>
                            </Badge>
                        </div>
                        <div class="mt-4 grid grid-cols-[40%_60%]">
                            <p class="font-medium">
                                Période
                            </p>
                            <p>
                                <template v-if="response?.parent?.start_date === response?.parent?.end_date">
                                    {{ new Date(response?.parent?.start_date).toLocaleDateString('fr-FR') }}
                                </template>
                                <template v-else>
                                    {{ new Date(response?.parent?.start_date).toLocaleDateString('fr-FR') }} -
                                    {{ new Date(response?.parent?.end_date).toLocaleDateString('fr-FR') }}
                                </template>
                            </p>
                        </div>
                        <div class="mt-4 grid grid-cols-[40%_60%]">
                            <p class="font-medium">
                                Créneau horaire
                            </p>
                            <p>{{ formatTimeSlot(response?.parent?.time_slot) }}</p>
                        </div>
                        <div class="mt-4 grid grid-cols-[40%_60%]">
                            <p class="font-medium">
                                Codes postaux
                            </p>
                            <p>{{ formatArray(response?.parent?.zip_codes) }}</p>
                        </div>
                        <div class="mt-4 grid grid-cols-[40%_60%]">
                            <p class="font-medium">
                                Villes
                            </p>
                            <p>{{ formatArray(response?.parent?.cities) }}</p>
                        </div>
                    </div>

                    <div
                        v-if="visibleResponses(response.responses).length != 0"
                        class="2xl:col-span-2"
                    >
                        <Table>
                            <TableHeader class="w-full">
                                <TableRow class="grid grid-cols-3 overflow-x-hidden gap-2 rounded-t-lg border-none">
                                    <TableHead class="bg-primary w-full flex justify-center items-center text-white text-sm">
                                        Infirmier
                                    </TableHead>
                                    <TableHead class="bg-primary w-full flex justify-center items-center text-white text-sm">
                                        Ville
                                    </TableHead>
                                    <TableHead class="bg-primary w-full flex justify-center items-center text-white text-sm">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <template v-if="visibleResponses(response.responses).length != 0">
                                <TableBody class="rounded-b-lg">
                                    <TableRow
                                        v-for="responseDetail in visibleResponses(response.responses)"
                                        :key="responseDetail.id"
                                        class="grid grid-cols-3 my-2 gap-2 border border-none overflow-x-hidden relative"
                                    >
                                        <TableCell class="flex flex-col sm:flex-row items-center justify-center space-y-1.5 sm:space-y-0 sm:space-x-2 bg-[#F1F2F7] text-sm text-center">
                                            <template v-if="responseDetail?.respondedBy?.profile?.profil_url == null">
                                                <UserCircleIcon class="w-10 sm:w-6 text-black/60" />
                                            </template>
                                            <template v-else>
                                                <img
                                                    class="w-14 rounded-full"
                                                    :src="useRuntimeConfig().public.API_URL + '/storage/' + responseDetail?.respondedBy?.profile?.profil_url"
                                                />
                                            </template>
                                            <p>
                                                {{ responseDetail?.respondedBy?.firstname }} {{ responseDetail?.respondedBy?.lastname }}
                                            </p>
                                        </TableCell>

                                        <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-sm">
                                            {{ responseDetail?.respondedBy?.profile?.city }}
                                        </TableCell>

                                        <TableCell class="flex flex-col sm:flex-row sm:space-x-1.5 space-y-1.5 sm:space-y-0 justify-center items-center bg-[#F1F2F7] text-sm">
                                            <template v-if="responseDetail.status === 'confirmed'">
                                                <p class="flex items-center space-x-2 text-success font-medium">
                                                    <CheckBadgeIcon class="w-6" />
                                                    <span>Accepté</span>
                                                </p>
                                                <Button
                                                    class="bg-gray-200 border-none rounded shadow-none text-black hover:text-black hover:bg-gray-300"
                                                    title="Annuler"
                                                    @click="handleCancel(responseDetail)"
                                                >
                                                    <XMarkIcon class="w-4" />
                                                </Button>
                                            </template>
                                            <template v-else-if="responseDetail.status === 'canceled'">
                                                <p class="flex items-center space-x-2 text-primary font-medium">
                                                    <XCircleIcon class="w-6" />
                                                    <span>Rejeté</span>
                                                </p>
                                                <Button
                                                    class="bg-gray-200 border-none rounded shadow-none text-black hover:text-black hover:bg-gray-300"
                                                    title="Accepter"
                                                    @click="handleAccept(responseDetail)"
                                                >
                                                    <CheckIcon class="w-4" />
                                                </Button>
                                            </template>
                                            <template v-else>
                                                <Button
                                                    class="bg-gray-200 border-none rounded shadow-none text-black hover:text-black hover:bg-gray-300"
                                                    title="Rejeter"
                                                    @click="handleReject(responseDetail)"
                                                >
                                                    <XMarkIcon class="w-4" />
                                                </Button>
                                                <Button
                                                    class="bg-gray-200 border-none rounded shadow-none text-black hover:text-black hover:bg-gray-300"
                                                    title="Accepter"
                                                    @click="handleAccept(responseDetail)"
                                                >
                                                    <CheckIcon class="w-4" />
                                                </Button>
                                            </template>
                                            <Button
                                                class="bg-gray-200 border-none rounded shadow-none text-black hover:text-black hover:bg-gray-300"
                                                title="Détail"
                                                @click="openNurseDialog(responseDetail)"
                                            >
                                                <EyeIcon class="w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </template>
                            <template v-else>
                                <p class="mt-8 text-center text-black/70">
                                    Aucune donnée à afficher pour le moment
                                </p>
                            </template>
                        </Table>
                    </div>
                </div>
            </div>
        </template>

        <Dialog v-model:open="nurseDialog">
            <DialogContent class="sm:max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle
                        v-if="selectedNurse.respondedBy.gender === 'F'"
                    >
                        Informations de l'infirmière
                    </DialogTitle>
                    <DialogTitle
                        v-else
                    >
                        Informations de l'infirmier
                    </DialogTitle>
                </DialogHeader>

                <div
                    v-if="selectedNurse"
                    class="flex space-x-4 items-center mt-4"
                >
                    <img
                        :src="selectedNurse.respondedBy?.profile?.profil_url
                            ? useRuntimeConfig().public.API_URL + '/storage/' + selectedNurse.respondedBy.profile.profil_url
                            : '/icons/user-circle.png'"
                        class="w-8 h-8 sm:w-12 sm:h-12 rounded-full opacity-60"
                    />
                    <div class="flex flex-col space-y-2">
                        <h6 class="font-medium">
                            {{ selectedNurse.respondedBy.firstname }} {{ selectedNurse.respondedBy.lastname }}
                        </h6>
                    </div>
                </div>

                <div
                    v-if="selectedNurse"
                    class="grid grid-cols-[40%_60%] border border-primary h-9 rounded-full items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-s-full text-white font-semibold">
                        Numéro INAMI
                    </h5>
                    <p class="ps-4">
                        {{ selectedNurse.respondedBy.identifier_number }}
                    </p>
                </div>

                <div
                    v-if="selectedNurse"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-full items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-s-full text-white font-semibold">
                        <span class="hidden md:inline">Adresse e-mail</span>
                        <span class="md:hidden">Email</span>
                    </h5>
                    <p class="ps-4">
                        {{ selectedNurse.respondedBy.email }}
                    </p>
                </div>

                <div
                    v-if="selectedNurse"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-full items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-s-full text-white font-semibold">
                        N° téléphone
                    </h5>
                    <p class="ps-4">
                        {{ selectedNurse.respondedBy.phone_number }}
                    </p>
                </div>

                <div
                    v-if="selectedNurse"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-full items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-s-full text-white font-semibold">
                        Code postal
                    </h5>
                    <p class="ps-4">
                        {{ selectedNurse.respondedBy.zip_code }}
                    </p>
                </div>

                <div
                    v-if="selectedNurse"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-full items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-s-full text-white font-semibold">
                        Ville
                    </h5>
                    <p class="ps-4">
                        {{ selectedNurse.respondedBy.city }}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { UserCircleIcon, CheckIcon, XMarkIcon, CheckBadgeIcon, XCircleIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { useRuntimeConfig } from '#app';
import { useListResponse, changeStatusReplacement } from '~/composables/useReplacements';
import type { ReplacementResponse } from '~/lib/types';

const user = useState('user');
const { listResponse, getReplacementResponses } = useListResponse(user.value.nurse.id);
const { changeStatus } = changeStatusReplacement();
const nurseDialog = ref(false);
const selectedNurse = ref(null);

useHead({
    title: 'Mes réponses reçues',
});

const visibleResponses = (responses: ReplacementResponse[]) => {
    const hasConfirmed = responses.some(response => response.status === 'confirmed');
    if (hasConfirmed) {
        return responses.filter(response => response.status === 'confirmed');
    }
    return responses;
};

const handleAccept = async (responseDetail: ReplacementResponse) => {
    try {
        await changeStatus(responseDetail.id, 'confirmed');
        responseDetail.status = 'confirmed';
    }
    catch (error) {
        console.error('Failed to update status:', error);
    }
};

const handleReject = async (responseDetail: ReplacementResponse) => {
    try {
        await changeStatus(responseDetail.id, 'canceled');
        responseDetail.status = 'canceled';
        await getReplacementResponses();
    }
    catch (error) {
        console.error('Failed to update status:', error);
    }
};

const handleCancel = async (responseDetail: ReplacementResponse) => {
    try {
        await changeStatus(responseDetail.id, 'pending');
        responseDetail.status = 'pending';
        await getReplacementResponses();
    }
    catch (error) {
        console.error('Failed to update status:', error);
    }
};

const openNurseDialog = (responseDetail: ReplacementResponse) => {
    selectedNurse.value = responseDetail;
    nurseDialog.value = true;
};

await getReplacementResponses();

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

const formatArray = (jsonString: string) => {
    try {
        const array = JSON.parse(jsonString);
        return array.join(', ');
    }
    catch (e) {
        return jsonString;
    }
};

const formatTimeSlot = (timeSlot: string) => {
    try {
        const slot = JSON.parse(timeSlot);
        return `${slot.start_at} - ${slot.end_at}`;
    }
    catch (e) {
        return timeSlot;
    }
};
</script>
