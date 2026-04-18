<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="mt-6 flex items-center gap-2 rounded-lg text-primary sm:bg-muted/50 sm:px-9">
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
                    <span class="ms-3 text-xs text-primary-foreground">Début</span>
                    <div class="flex w-40 items-center justify-center rounded-full bg-card text-primary shadow">
                        <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                        <div class="flex h-9 w-24 items-center rounded-full bg-card text-xs text-primary">
                            {{ startDate }}
                        </div>
                    </div>
                </div>
                <span class="text-primary">au</span>
                <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                    <span class="ms-3 text-xs text-primary-foreground">Fin</span>
                    <div class="flex w-40 items-center justify-center rounded-full bg-card text-primary shadow">
                        <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                        <div class="flex h-9 w-24 items-center rounded-full bg-card text-xs text-primary">
                            {{ endDate }}
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div class="mt-8 mb-12 p-2">
            <template v-if="listResponse.length != 0">
                <div
                    class="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 2xl:grid-cols-4"
                >
                    <div
                        v-for="(list, index) in sortedListResponse"
                        :key="list.id ?? index"
                        class="flex h-full min-h-0 w-full max-w-sm flex-col rounded-lg bg-muted/50 text-foreground shadow-xl"
                    >
                        <div class="flex min-h-0 flex-1 flex-col px-3 pt-3 sm:px-4 sm:pt-4">
                            <ReplacementsInstitutionResponseCard
                                v-if="list.institution"
                                class="h-full min-h-0 w-full flex-1"
                                :institution="list.institution"
                                :show-full-info="list.status === 'confirmed'"
                            />
                            <UsersCard
                                v-else
                                class="h-full min-h-0 w-full flex-1"
                                :user="list.repondedBy"
                                :show-full-info="list.status === 'confirmed'"
                            />
                        </div>
                        <div class="mx-auto mt-auto flex min-h-[5.25rem] w-full max-w-[300px] shrink-0 flex-col justify-center border-t border-border/60 px-3 pb-3 pt-3 sm:px-4">
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
                <span class="mx-auto mt-8 flex items-center justify-center text-muted-foreground">
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

const { changeStatus } = changeStatusReplacement();

const route = useRoute();
const replacementId = route.params.id;
const { $toast } = useNuxtApp();

const { loading, listResponse, fetchListResponse } = useListResponse(replacementId);

const sortedListResponse = computed(() => {
    const items = [...(listResponse.value || [])];
    items.sort((a, b) => {
        const aInst = !!a.institution;
        const bInst = !!b.institution;
        if (aInst !== bInst) return aInst ? -1 : 1;
        return 0;
    });
    return items;
});

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
