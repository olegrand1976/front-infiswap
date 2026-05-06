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
                    class="grid grid-cols-1 items-stretch gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                >
                    <div
                        v-for="(list, index) in sortedListResponse"
                        :key="list.id ?? index"
                        class="flex h-full min-h-0 w-full max-w-[17.5rem] flex-col rounded-md bg-muted/50 text-foreground shadow-md"
                    >
                        <div class="flex min-h-0 flex-1 flex-col px-2 pt-2">
                            <ReplacementsInstitutionResponseCard
                                v-if="isInstitutionRespondent(list)"
                                class="h-full min-h-0 w-full flex-1"
                                compact
                                :institution="list.respondent"
                                :show-full-info="list.status === 'confirmed'"
                            />
                            <UsersCard
                                v-else
                                class="h-full min-h-0 w-full flex-1"
                                compact
                                :user="list.respondent"
                                :show-full-info="list.status === 'confirmed'"
                            />
                        </div>

                        <div class="px-2 pt-1 text-xs text-muted-foreground text-center">
                            Réponse reçue le {{ list.responded_at }}
                        </div>

                        <div class="mx-auto mt-auto flex min-h-[3.75rem] w-full max-w-[260px] shrink-0 flex-col justify-center border-t border-border/60 px-2 pb-2 pt-2">
                            <div
                                v-if="list.status==='confirmed'"
                                class="mx-auto flex w-full items-center justify-center gap-1.5 text-sm text-success"
                            >
                                <CheckCircleIcon class="size-5 shrink-0" /> <span>Accepté</span>
                            </div>
                            <div
                                v-else-if="list.status==='refused'"
                                class="mx-auto flex w-full items-center justify-center gap-1.5 text-sm font-bold text-primary"
                            >
                                <XMarkIcon class="size-5 shrink-0" /> <span>Refusé</span>
                            </div>
                            <div
                                v-if="!hasConfirmed() && list.status !== 'refused'"
                                class="mt-1 flex w-full justify-center gap-2"
                            >
                                <Button
                                    size="sm"
                                    class="w-1/2 hover:bg-primary/90"
                                    :class="{ 'opacity-50 cursor-not-allowed': loading }"
                                    @click="updateStatus(list.id, 'refused')"
                                >
                                    Refuser
                                </Button>
                                <Button
                                    size="sm"
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
        const aInst = isInstitutionRespondent(a);
        const bInst = isInstitutionRespondent(b);
        if (aInst !== bInst) return aInst ? -1 : 1;
        return 0;
    });
    return items;
});

const showOlder = ref(false);

const isInstitutionRespondent = (response: any) => response?.respondent?.type === 'institution';

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

// const startDate = computed(() =>
//     listResponse.value?.length > 0 ? formatDate(listResponse.value[0].parent.start_date) : '',
// );

// const endDate = computed(() =>
//     listResponse.value?.length > 0 ? formatDate(listResponse.value[0].parent.end_date) : '',
// );
const startDate = computed(() => {
    if (!listResponse.value?.length) return '';
    const parent = listResponse.value[0].parent;

    // ✅ Cas avec periods
    if (!parent.start_date && parent.periods?.length) {
        return formatDate(parent.periods[0].start_date);
    }
    return parent.start_date ? formatDate(parent.start_date) : '';
});

const endDate = computed(() => {
    if (!listResponse.value?.length) return '';
    const parent = listResponse.value[0].parent;

    // ✅ Cas avec periods
    if (!parent.end_date && parent.periods?.length) {
        return formatDate(parent.periods[parent.periods.length - 1].end_date);
    }
    return parent.end_date ? formatDate(parent.end_date) : '';
});

const loadOlder = async () => {
    showOlder.value = true;
    await fetchListResponse(true);
};

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
