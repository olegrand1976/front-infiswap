<template>
    <div class="pt-3">
        <Button @click="goBack">
            Retour
        </Button>

        <h1 class="mt-4 rounded bg-gray-100 text-primary text-center lg:text-start font-bold p-2 lg:p-4">
            <span class="hidden lg:inline-block">Personnes intéressées par mon remplacement</span>
            <span class="lg:hidden">Intéressées</span>
        </h1>
        <template v-if="listResponse.length != 0">
            <div class="flex items-center sm:space-x-4 lg:space-x-8 gap-2 mt-6 p-2">
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
                <div
                    v-for="(list, index) in listResponse"
                    :key="index"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4 justify-between items-center"
                >
                    <div
                        class="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-gray-100/50 shadow-xl rounded-lg text-gray-900"
                    >
                        <div class="rounded-t-lg h-32 overflow-hidden bg-white">
                            <LayoutsLogo classe="object-cover object-top w-full" />
                        </div>
                        <div class="mx-auto grid place-content-center w-32 h-32 relative -mt-16 border-4 border-primary rounded-full overflow-hidden">
                            <img
                                v-if="list.repondedBy.profil_url"
                                :src="useRuntimeConfig().public.API_URL + '/storage/' + list.repondedBy.profil_url"
                                class="rounded-full border-2 border-success"
                            >
                            <UserCircleIcon v-else />
                        </div>
                        <div class="text-center mt-4">
                            <h2 class="font-semibold">
                                {{ getFullName(list.repondedBy) }}
                            </h2>
                        </div>

                        <ul class="py-4 mt-2 text-gray-700 text-center">
                            <li class="flex gap-1 h-6 justify-center items-center">
                                <MapPinIcon class="size-5" />
                                <span>
                                    {{ list.repondedBy.profile.zip_code ?? '---' }}
                                </span>
                            </li>
                            <li class="flex mt-2 h-6 gap-1 justify-center items-center">
                                <PhoneIcon
                                    v-show="list.status ==='confirmed'"
                                    class="size-4"
                                />
                                <div v-show="list.status === 'confirmed'">
                                    {{ list.repondedBy.phone_number ? formatPhoneNumber(list.repondedBy.phone_number) : '---' }}
                                </div>
                            </li>
                        </ul>
                        <div class="p-4 border-t mx-8 mt-2">
                            <div
                                v-if="list.status==='confirmed'"
                                class="flex justify-center items-center gap-2 mx-auto w-1/2 text-success"
                            >
                                <CheckCircleIcon class="size-8" /> <span>Accepté</span>
                            </div>
                            <div
                                v-else-if="list.status==='refused'"
                                class="flex mx-auto gap-2 w-1/2 text-primary items-center font-bold"
                            >
                                <XMarkIcon class="size-7" /> <span>Refusé</span>
                            </div>
                            <div
                                v-if="!hasConfirmed() && list.status !== 'refused'"
                                class="flex justify-center gap-4 w-full mt-2"
                            >
                                <Button
                                    class="w-1/2 hover:bg-primary/90"
                                    :class="{ 'opacity-50 cursor-not-allowed': loading }"
                                    @click="updateStatus(list.id, 'refused')"
                                >
                                    Refuser
                                </Button>
                                <Button
                                    class="w-1/2 bg-success hover:bg-success/90"
                                    :class="{ 'opacity-50 cursor-not-allowed': loading }"
                                    @click="updateStatus(list.id, 'confirmed')"
                                >
                                    Accepter
                                </Button>
                            </div>
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
import { CheckCircleIcon, UserCircleIcon, PhoneIcon, MapPinIcon, CalendarDaysIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { useListResponse, changeStatusReplacement } from '~/composables/useReplacements';
import { formatPhoneNumber, getFullName } from '~/lib/utils';
import { useRuntimeConfig } from '#app';

const { changeStatus } = changeStatusReplacement();

const route = useRoute();
const replacementId = route.params.id;
const { $toast } = useNuxtApp();

const goBack = () => {
    window.history.back();
};

const { loading, listResponse, fetchListResponse } = useListResponse(replacementId);

const updateStatus = async (id: number, status: string) => {
    try {
        await changeStatus(id, status);
        await fetchListResponse();
        $toast({
            description: 'Statut modifié avec succès',
        });
    }
    catch (error) {
        $toast({
            variant: 'destructive',
            description: 'Erreur lors du changement de statut',
        });
        console.error(error);
    }
};
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

const hasConfirmed = () =>
    listResponse.value?.some(item => item.status === 'confirmed');

useHead({
    title: 'Liste des personnes intéréssées par le remplacement',
});

await fetchListResponse();

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
