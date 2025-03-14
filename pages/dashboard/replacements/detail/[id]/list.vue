<template>
    <div class="pt-3">
        <div class="bg-gray-100 h-12 rounded p-2">
            <h1 class="text-primary">
                Liste des personnes <strong>interessées par mon remplacement</strong>
            </h1>
        </div>

        <template v-if="listResponse.length != 0">
            <div class="flex items-center space-x-8 mt-6 p-2">
                <h4 class="font-bold text-sm text-primary">
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
                            v-for="(list, index) in listResponse"
                            :key="index"
                        >
                            <TableRow
                                class="grid grid-cols-4 overflow-x-hidden justify-between gap-4 md:gap-8 border border-none group"
                            >
                                <TableCell class="flex h-12 col-span-2 my-1 items-center bg-gray-100 group-hover:bg-primary">
                                    <span class="group-hover:text-white">{{ list.repondedBy.firstname }} {{ list.repondedBy.lastname }}</span>
                                </TableCell>

                                <TableCell class="flex h-12 col-span-1 group-hover:bg-primary justify-center my-1 items-center bg-gray-100">
                                    <Form @submit="handlesubmit(list.id)">
                                        <Button
                                            type="submit"
                                            class="bg-gray-200 group-hover:bg-white text-black rounded-full w-24"
                                        >
                                            <span class="text-xs">
                                                Accepter
                                            </span>
                                        </Button>
                                    </Form>
                                </TableCell>

                                <TableCell class="flex h-12 col-span-1 group-hover:bg-primary justify-center my-1 items-center bg-gray-100">
                                    <Button
                                        class="bg-gray-200 group-hover:bg-white text-black rounded-full"
                                    >
                                        <span class="text-xs">Voir le profil</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </template>
                    </TableBody>
                </Table>
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
import { useListResponse, changeStatusReplacement } from '~/composables/useReplacements';

const { changeStatus } = changeStatusReplacement();

const route = useRoute();
const router = useRouter();
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

const handlesubmit = async (id) => {
    try {
        await changeStatus(id);
        $toast({
            title: 'Succès',
            description: 'Infirmier accepté',
        });
        router.push('/dashboard/replacements');
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
    middleware: 'verified',
    ssr: false,
});
</script>
