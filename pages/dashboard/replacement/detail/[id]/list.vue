<template>
    <div class="pt-3">
        <div class="bg-gray-100 h-12 rounded p-2">
            <h1 class="text-primary">
                Liste des personnes <strong>interessées par mon remplacement</strong>
            </h1>
        </div>

        <div class="flex items-center space-x-6 mt-6 p-2">
            <h4 class="font-bold text-sm text-primary">
                Période
            </h4>
            <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                <span class="text-xs text-white ms-3">Début</span>
                <div class="flex justify-center items-center text-primary rounded-full bg-white shadow w-40">
                    <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                    <div class="text-xs text-primary w-[5.75rem] h-9 flex items-center rounded-full bg-white">
                        {{ startDate }}
                    </div>
                </div>
            </div>
            <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                <span class="text-xs text-white ms-3">Fin</span>
                <div class="flex justify-center items-center text-primary rounded-full bg-white shadow w-40">
                    <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                    <div class="text-xs text-primary w-[5.75rem] h-9 flex items-center rounded-full bg-white">
                        {{ endDate }}
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 mb-12 p-2">
            <Table>
                <TableHeader>
                    <TableRow class="grid grid-cols-4 overflow-x-hidden gap-4 md:gap-8 border border-none">
                        <TableHead class="bg-primary col-span-2 flex w-full items-center rounded-lg text-white">
                            Nom
                        </TableHead>
                        <TableHead class="bg-primary col-span-2 justify-center flex w-full items-center rounded-lg text-white">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <template
                        v-for="list in listResponse"
                    >
                        <TableRow class="grid grid-cols-4 overflow-x-hidden justify-between gap-4 md:gap-8 border border-none group">
                            <TableCell class="flex h-12 col-span-2 my-1 items-center bg-gray-100 group-hover:bg-primary">
                                <span class="group-hover:text-white">{{ list.repondedBy.firstname }} {{ list.repondedBy.lastname }}</span>
                            </TableCell>

                            <TableCell class="flex h-12 col-span-1 group-hover:bg-primary justify-center my-1 items-center bg-gray-100">
                                <Form @submit="changeStatus(list.id)">
                                    <Button
                                        type="submit"
                                        variant="transparent"
                                        class="bg-gray-200 group-hover:bg-white rounded-full w-24"
                                    >
                                        <span class="text-xs">
                                            Accepter
                                        </span>
                                    </Button>
                                </Form>
                            </TableCell>

                            <TableCell class="flex h-12 col-span-1 group-hover:bg-primary justify-center my-1 items-center bg-gray-100">
                                <Button
                                    variant="transparent"
                                    class="bg-gray-200 group-hover:bg-white rounded-full"
                                >
                                    <span class="text-xs">Voir le profil</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useListResponse, changeStatusReplacement } from '~/composables/useReplacements';
import { useSubmit } from '~/composables/useSubmit';
import { useReplacementStore } from '@/stores/useReplacementStore';

const replacementStore = useReplacementStore();

const route = useRoute();
const replacementId = route.params.id;

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

/*
const submitStatus = useSubmit(async (responseId) => {
    const { changeStatus } = changeStatusReplacement(responseId, 'confirmed');
    await changeStatus();
    await fetchListResponse();
}, {
    onSuccess: () => {
    },
    onError: (error) => {
        console.error('Erreur lors du changement de statut:', error);
    }
});
*/
onMounted(() => {
    fetchListResponse();
});

useHead({
    title: 'Liste des personnes intéréssées par mon remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

const changeStatus = async (id) => {
    await replacementStore.changeStatus(id);
};
</script>
