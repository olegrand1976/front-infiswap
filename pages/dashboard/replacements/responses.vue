<template>
    <div>
        <h1 class="py-3 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
            Mes <strong>réponses reçues</strong>
        </h1>

        <div class="grid my-4 md:my-8">
            <div
                v-for="(response, index) in listResponse"
                :key="index"
                class="overflow-y-auto grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 h-full"
            >
                <div
                    v-if="response?.responses?.length != 0"
                    class="bg-gray-100 shadow p-6 rounded-lg 2xl:col-span-1"
                >
                    <h1 class="text-primary font-semibold">
                        <template v-if="listResponse.length = 1">
                            Remplacement
                        </template>
                        <template v-else>
                            Remplacement {{ index + 1 }}
                        </template>
                    </h1>
                    <div class="mt-4 grid grid-cols-[40%_60%]">
                        <p class="font-medium">
                            Période
                        </p>
                        <p>
                            {{ new Date(response?.parent?.start_date).toLocaleDateString('fr-FR') }} - {{ new Date(response?.parent?.end_date).toLocaleDateString('fr-FR') }}
                        </p>
                    </div>
                    <div class="mt-4 grid grid-cols-[40%_60%]">
                        <p class="font-medium">
                            Créneau horaire
                        </p>
                        <p>
                            {{ formatTimeSlot(response?.parent?.time_slot) }}
                        </p>
                    </div>
                    <div class="mt-4 grid grid-cols-[40%_60%]">
                        <p class="font-medium">
                            Codes postaux
                        </p>
                        <p>
                            {{ formatArray(response?.parent?.zip_codes) }}
                        </p>
                    </div>
                    <div class="mt-4 grid grid-cols-[40%_60%]">
                        <p class="font-medium">
                            Villes
                        </p>
                        <p>
                            {{ formatArray(response?.parent?.cities) }}
                        </p>
                    </div>
                </div>

                <div
                    v-if="response?.responses?.length != 0"
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

                        <TableBody class="rounded-b-lg">
                            <TableRow
                                v-for="responseDetail in response.responses"
                                :key="responseDetail.id"
                                class="grid grid-cols-3 my-2 gap-2 border border-none overflow-x-hidden relative"
                            >
                                <TableCell class="flex justify-center space-x-2 items-center bg-[#F1F2F7] text-sm">
                                    <template v-if="responseDetail?.respondedBy?.profile?.profil_url == null">
                                        <UserCircleIcon class="w-6 text-black/60" />
                                    </template>
                                    <template v-else>
                                        <LayoutsAppImage
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

                                <TableCell class="flex space-x-4 justify-center items-center bg-[#F1F2F7] text-sm">
                                    <Button
                                        class="bg-gray-200 border-none rounded shadow-none text-black hover:text-black hover:bg-gray-300"
                                        title="Accepter"
                                    >
                                        <CheckIcon class="w-4" />
                                    </Button>

                                    <Button
                                        class="bg-gray-200 border-none rounded shadow-none text-black hover:text-black hover:bg-gray-300"
                                        title="Rejeter"
                                    >
                                        <XMarkIcon class="w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { UserCircleIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useRuntimeConfig } from '#app';
import { useListResponse } from '~/composables/useReplacements';

const user = useState('user');

const { listResponse, getReplacementResponses } = useListResponse(user.value.nurse.id);

useHead({
    title: 'Mes réponses reçues',
});

onMounted(async () => {
    await getReplacementResponses();
});

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
