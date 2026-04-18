<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="mt-6 flex items-center gap-2 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
            <ArrowLeftIcon
                class="size-5 cursor-pointer hover:text-primary"
                title="Retour"
                @click="goBack"
            />
            <h1 class="py-3 text-primary font-bold">
                <span class="hidden lg:inline-block">Personnes intéressées par mon remplacement</span>
                <span class="lg:hidden">Intéressés</span>
            </h1>
        </div>
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
                        <div class="px-4 pt-4">
                            <div
                                v-if="list.institution"
                                class="flex flex-col items-center gap-3 py-2"
                            >
                                <span class="text-xs font-semibold uppercase text-primary">Institution</span>
                                <img
                                    v-if="institutionLogoUrl(list.institution)"
                                    :src="institutionLogoUrl(list.institution)!"
                                    :alt="list.institution.name"
                                    class="h-16 w-16 rounded-lg object-cover border border-gray-200"
                                >
                                <p class="text-center font-semibold text-gray-900">
                                    {{ list.institution.name }}
                                </p>
                            </div>
                            <UsersCard
                                v-else
                                :user="list.repondedBy"
                                :show-full-info="list.status === 'confirmed'"
                            />
                        </div>
                        <div class="p-4 mx-8 mt-2 w-[300px]">
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
import { CheckCircleIcon, CalendarDaysIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { getErrorMessage, goBack } from '~/lib/utils';
import { useListResponse, changeStatusReplacement } from '~/composables/useReplacements';
import { useInstitutions } from '~/composables/useInstitution';

const { getLogoUrl } = useInstitutions();

const institutionLogoUrl = (inst: { logo?: string | null }) => {
    if (!inst?.logo) return null;
    const logo = inst.logo;
    if (typeof logo === 'string' && (logo.startsWith('http://') || logo.startsWith('https://'))) {
        return logo;
    }
    return getLogoUrl(logo) || null;
};

const { changeStatus } = changeStatusReplacement();

const route = useRoute();
const replacementId = route.params.id;
const { $toast } = useNuxtApp();

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
            description: getErrorMessage(error),
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
