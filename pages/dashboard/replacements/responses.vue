<template>
    <div>
        <h1 class="p-3 text-primary mb-4 rounded-lg font-bold">
            Historique de mes réponses
        </h1>

        <template v-if="listResponse.length === 0">
            <p class="text-black/50 mt-16 text-center">
                Aucune donnée à afficher pour le moment
            </p>
        </template>
        <template v-else>
            <div class="grid gap-4 lg:gap-8 text-sm">
                <div
                    v-for="(response, index) in listResponse"
                    :key="index"
                    class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 bg-gray-100 p-2 lg:p-4 rounded"
                >
                    <div
                        class="rounded-md col-span-3 lg:col-span-1"
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
                                <template v-if="response?.parent?.start_date && response?.parent?.end_date">
                                    <template v-if="response.parent.start_date === response.parent.end_date">
                                        {{ new Date(response.parent.start_date).toLocaleDateString('fr-FR') }}
                                    </template>
                                    <template v-else>
                                        {{ new Date(response.parent.start_date).toLocaleDateString('fr-FR') }} -
                                        {{ new Date(response.parent.end_date).toLocaleDateString('fr-FR') }}
                                    </template>
                                </template>

                                <template v-else-if="response?.parent?.periods?.length">
                                    <ul>
                                        <li
                                            v-for="(period) in response.parent.periods"
                                            :key="period.id"
                                        >
                                            <template v-if="period.start_date === period.end_date">
                                                {{ new Date(period.start_date).toLocaleDateString('fr-FR') }}
                                            </template>
                                            <template v-else>
                                                {{ new Date(period.start_date).toLocaleDateString('fr-FR') }} -
                                                {{ new Date(period.end_date).toLocaleDateString('fr-FR') }}
                                            </template>
                                        </li>
                                    </ul>
                                </template>

                                <template v-else>
                                    Non défini
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
                        class="col-span-3 lg:col-span-2"
                    >
                        <Table>
                            <TableHeader class="w-full">
                                <TableRow class="grid grid-cols-4 overflow-x-hidden border-none">
                                    <TableHead class="bg-primary w-full flex justify-center items-center text-white text-sm">
                                        Infirmier
                                    </TableHead>
                                    <TableHead class="bg-primary w-full flex justify-center items-center text-white text-sm">
                                        Téléphone
                                    </TableHead>
                                    <TableHead class="bg-primary w-full flex justify-center items-center text-white text-sm">
                                        Code Postal
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
                                        class="grid grid-cols-4 w-full my-2 border border-none overflow-x-hidden relative"
                                    >
                                        <TableCell class="w-full truncate flex flex-nowrap flex-col sm:flex-row items-center justify-center sm:justify-start space-y-1.5 sm:space-y-0 sm:space-x-2 bg-[#F1F2F7] text-sm text-center">
                                            <template v-if="responseDetail?.responded_by?.profile?.profil_url == null">
                                                <UserCircleIcon class="size-8 text-black/60" />
                                            </template>
                                            <template v-else>
                                                <img
                                                    class="w-8 h-8 rounded-full object-cover object-center"
                                                    :src="useRuntimeConfig().public.API_URL + '/storage/' + responseDetail?.responded_by?.profile?.profil_url"
                                                >
                                            </template>
                                            <p class="truncate">
                                                {{ responseDetail?.responded_by?.full_name }}
                                            </p>
                                        </TableCell>

                                        <TableCell class="flex truncate justify-center items-center bg-[#F1F2F7] text-sm">
                                            {{ responseDetail?.responded_by?.phone_number }}
                                        </TableCell>

                                        <TableCell class="flex truncate justify-center items-center bg-[#F1F2F7] text-sm">
                                            {{ responseDetail?.responded_by?.profile?.zip_code }}
                                        </TableCell>

                                        <TableCell class="flex flex-col sm:flex-row sm:space-x-1.5 space-y-1.5 sm:space-y-0 justify-center items-center bg-[#F1F2F7] text-sm">
                                            <template v-if="responseDetail.status === 'confirmed'">
                                                <p class="flex items-center space-x-2 text-success font-medium">
                                                    <CheckBadgeIcon class="w-6" />
                                                    <span class="hidden 2xl:block">Accepté</span>
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
                        v-if="selectedUser.responded_by.gender === 'F'"
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
                    v-if="selectedUser"
                    class="flex space-x-4 items-center mt-4"
                >
                    <LayoutsAppImage
                        :src="selectedUser.responded_by?.profile?.profil_url
                            ? useRuntimeConfig().public.API_URL + '/storage/' + selectedUser.responded_by.profile.profil_url
                            : '/icons/user-circle.png'"
                        class="w-8 h-8 sm:w-12 sm:h-12 rounded-full opacity-60"
                    />
                    <div class="flex flex-col space-y-2">
                        <h6 class="font-medium">
                            {{ selectedUser.responded_by.full_name }}
                        </h6>
                    </div>
                </div>

                <div
                    v-if="selectedUser"
                    class="grid grid-cols-[40%_60%] border border-primary h-9 rounded-full items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-s-full text-white font-semibold">
                        Numéro {{ identifierLabel }}
                    </h5>
                    <p class="ps-4">
                        {{ selectedUser.responded_by.identifier_number }}
                    </p>
                </div>

                <div
                    v-if="selectedUser"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-full items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-s-full text-white font-semibold">
                        <span class="hidden md:inline">Adresse e-mail</span>
                        <span class="md:hidden">Email</span>
                    </h5>
                    <p class="ps-4">
                        {{ selectedUser.responded_by.email }}
                    </p>
                </div>

                <div
                    v-if="selectedUser"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-full items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-s-full text-white font-semibold">
                        N° téléphone
                    </h5>
                    <p class="ps-4">
                        {{ selectedUser.responded_by.phone_number }}
                    </p>
                </div>

                <div
                    v-if="selectedUser"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-full items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-s-full text-white font-semibold">
                        Code postal
                    </h5>
                    <p class="ps-4">
                        {{ selectedUser.responded_by.profile.zip_code }}
                    </p>
                </div>

                <div
                    v-if="selectedUser"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-full items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-s-full text-white font-semibold">
                        Ville
                    </h5>
                    <p class="ps-4">
                        {{ selectedUser.responded_by.profile.city }}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { UserCircleIcon, CheckIcon, XMarkIcon, CheckBadgeIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { useRuntimeConfig } from '#app';
import { getErrorMessage } from '~/lib/utils';
import { useListResponse, changeStatusReplacement } from '~/composables/useReplacements';
import type { ReplacementResponse, User } from '~/lib/types';

const user = useState<User>('user');
const { $toast } = useNuxtApp();
const { listResponse, getReplacementResponses } = useListResponse(user.value.id);
const { changeStatus } = changeStatusReplacement();
const nurseDialog = ref(false);
const selectedUser = ref(null);

const { identifierLabel } = useCountry();

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
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
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
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
        console.error('Failed to update status:', error);
    }
};

const openNurseDialog = (responseDetail: ReplacementResponse) => {
    selectedUser.value = responseDetail;
    nurseDialog.value = true;
};

const formatArray = (jsonString: string) => {
    try {
        const array = JSON.parse(jsonString);
        return array.join(', ');
    }
    catch {
        return jsonString;
    }
};

const formatTimeSlot = (timeSlot: string) => {
    try {
        const slot = JSON.parse(timeSlot);

        const extractSlots = (obj): string[] => {
            const results: string[] = [];

            if (typeof obj !== 'object' || obj === null) {
                return results;
            }

            if ('start_at' in obj || 'end_at' in obj) {
                const start = obj.start_at ?? 'Non défini';
                const end = obj.end_at ?? 'Non défini';
                results.push(`${start} - ${end}`);
            }

            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    results.push(...extractSlots(obj[key]));
                }
            }

            return results;
        };

        return extractSlots(slot).join(' | ');
    }
    catch {
        return timeSlot;
    }
};

await getReplacementResponses();

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
