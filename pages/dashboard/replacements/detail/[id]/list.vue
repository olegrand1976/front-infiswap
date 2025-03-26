<template>
    <div class="pt-3">
        <h1 class="rounded bg-gray-100 text-primary text-center lg:text-start font-bold p-2 lg:p-4">
            <span class="hidden lg:inline-block">Personnes intéressées par mon remplacement</span>
            <span class="lg:hidden">Intéressées</span>
        </h1>
        <template v-if="listResponse.length != 0">
            <div class="flex items-center lg:space-x-8 gap-2 mt-6 p-2">
                <h4 class="font-bold hidden lg:inline-block text-sm text-primary">
                    Période
                </h4>
                <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                    <span class="text-xs text-white ms-3">Début</span>
                    <div class="flex justify-center items-center text-primary rounded-full bg-white shadow w-40">
                        <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                        <div class="text-xs text-primary w-24 h-9 flex items-center rounded-full bg-white">
                            {{ startDate }}
                        </div>
                    </div>
                </div>
                <span class="text-primary">au</span>
                <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                    <span class="text-xs text-white ms-3">Fin</span>
                    <div class="flex justify-center items-center text-primary rounded-full bg-white shadow w-40">
                        <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                        <div class="text-xs text-primary w-24 h-9 flex items-center rounded-full bg-white">
                            {{ endDate }}
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div class="mt-8 mb-12 p-2">
            <template v-if="listResponse.length != 0">
                {{  listResponse }}
                <div
                    v-for="(list, index) in listResponse"
                    :key="index"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4 justify-between items-center"
                >
                    <div
                        class="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900"
                    >
                        <div class="rounded-t-lg h-32 overflow-hidden">
                            <img
                                class="object-cover object-top w-full"
                                src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                                alt="Mountain"
                            >
                        </div>
                        <div class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                            <UserCircleIcon />
                        </div>
                        <div class="text-center mt-2">
                            <h2 class="font-semibold">
                                {{ fullName(list.repondedBy) }}
                            </h2>
                        </div>
                        <!-- <ul class="py-4 mt-2 text-gray-700 flex items-center justify-around">
                            <li class="flex flex-col items-center justify-around">
                                <StarIcon class="size-7"/>
                                <div>5</div>
                            </li>
                            <li class="flex flex-col items-center justify-between">
                                <ArrowPathIcon class="size-6"/>
                                <div>0</div>
                            </li>
                            <li class="flex flex-col items-center justify-around">
                                <BriefcaseIcon class="size-6"/>
                                <div>15</div>
                            </li>
                        </ul> -->
                        <ul class="py-4 mt-2 text-gray-700 text-center">
                            <li class="flex gap-1 justify-center items-center">
                                <IdentificationIcon class="size-5" />
                                <span>
                                    {{ list.repondedBy.identifier_number }}
                                </span>
                            </li>
                            <li class="flex gap-1 justify-center items-center">
                                <MapPinIcon class="size-5" />
                                <span>
                                    {{ list.repondedBy.profile.zip_code ?? '---' }} {{ list.repondedBy.profile.city ?? '---' }}
                                </span>
                            </li>
                            <li class="flex gap-1 justify-center items-center">
                                <PhoneIcon class="size-4" />
                                <div>
                                    {{ list.repondedBy.phone_number ? formattedPhoneNumber(list.repondedBy.phone_number) : '---' }}
                                </div>
                            </li>
                        </ul>
                        <div class="p-4 border-t mx-8 mt-2">
                            <div
                                v-if="list.status==='confirmed'"
                                class="flex mx-auto gap-2 w-1/2 text-success items-center font-bold"
                            >
                                <CheckCircleIcon class="size-7" /> <span>Accepté</span>
                            </div>
                            <Button
                                v-else
                                class="w-1/2 block mx-auto"
                            >
                                Accepter
                            </Button>
                        </div>
                    </div>
                    <div
                        class="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900"
                    >
                        <div class="rounded-t-lg h-32 overflow-hidden">
                            <img
                                class="object-cover object-top w-full"
                                src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                                alt="Mountain"
                            >
                        </div>
                        <div class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                            <UserCircleIcon />
                        </div>
                        <div class="text-center mt-2">
                            <h2 class="font-semibold">
                                {{ getFullName(list.repondedBy) }}
                            </h2>
                        </div>
                        <!-- <ul class="py-4 mt-2 text-gray-700 flex items-center justify-around">
                            <li class="flex flex-col items-center justify-around">
                                <StarIcon class="size-7"/>
                                <div>5</div>
                            </li>
                            <li class="flex flex-col items-center justify-between">
                                <ArrowPathIcon class="size-6"/>
                                <div>0</div>
                            </li>
                            <li class="flex flex-col items-center justify-around">
                                <BriefcaseIcon class="size-6"/>
                                <div>15</div>
                            </li>
                        </ul> -->
                        <ul class="py-4 mt-2 text-gray-700 text-center">
                            <li class="flex gap-1 justify-center items-center">
                                <IdentificationIcon class="size-5" />
                                <span>
                                    {{ list.repondedBy.identifier_number }}
                                </span>
                            </li>
                            <li class="flex gap-1 justify-center items-center">
                                <MapPinIcon class="size-5" />
                                <span>
                                    {{ list.repondedBy.profile.zip_code ?? '---' }} {{ list.repondedBy.profile.city ?? '---' }}
                                </span>
                            </li>
                            <li class="flex gap-1 justify-center items-center">
                                <PhoneIcon class="size-4" />
                                <div>
                                    {{ list.repondedBy.phone_number ? formatPhoneNumber(list.repondedBy.phone_number) : '---' }}
                                </div>
                            </li>
                        </ul>
                        <div class="p-4 border-t mx-8 mt-2">
                            <div
                                v-if="list.status==='confirmed'"
                                class="flex mx-auto gap-2 w-1/2 text-success items-center font-bold"
                            >
                                <CheckCircleIcon class="size-7" /> <span>Accepté</span>
                            </div>
                            <Button
                                v-else
                                class="w-1/2 block mx-auto"
                                @submit="handlesubmit(list.id)"
                            >
                                Accepter
                            </Button>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <span class="text-black/60 mx-auto flex justify-center items-center mt-8">
                    Aucune liste à afficher pour le moment
                </span>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { CheckCircleIcon, UserCircleIcon, StarIcon, ArrowPathIcon, BriefcaseIcon, PhoneIcon, MapPinIcon, IdentificationIcon } from '@heroicons/vue/24/outline';
import { useListResponse, changeStatusReplacement } from '~/composables/useReplacements';
import { formatPhoneNumber, getFullName } from '~/lib/utils';

const { changeStatus } = changeStatusReplacement();

const route = useRoute();
const replacementId = route.params.id;
const { $toast } = useNuxtApp();

const { listResponse, fetchListResponse } = useListResponse(replacementId);

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const startDate = computed(() =>
    listResponse.value?.length > 0 ? formatDate(listResponse.value[0].parent.start_date) : '',
);

const endDate = computed(() =>
    listResponse.value?.length > 0 ? formatDate(listResponse.value[0].parent.end_date) : '',
);

const displayCities = (settings) => {
    if (!settings) return 'Aucune ville';
    const data = typeof settings === 'string' ? JSON.parse(settings) : settings;
    return data?.replacement?.cities?.join(', ') || 'Aucune ville';
};

// Méthode pour extraire les codes postaux
const getZipCodes = (settings) => {
    try {
        const parsed = JSON.parse(settings);
        return parsed?.replacement?.zip_codes?.join(', ') || 'Aucun code postal';
    }
    catch {
        return 'Format invalide';
    }
};

const handlesubmit = async (id) => {
    try {
        await changeStatus(id);
        $toast({
            title: 'Succès',
            description: 'Infirmier accepté',
        });
    }
    catch (e) {
        $toast({
            title: 'Oups! Une erreur s\'est produite',
            description: 'Veuillez réessayer',
            variant: 'destructive',
        });
        console.log(e);
    }
};

useHead({
    title: 'Liste des personnes intéréssées par le remplacement',
});

onMounted(() => {
    fetchListResponse();
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});
</script>
