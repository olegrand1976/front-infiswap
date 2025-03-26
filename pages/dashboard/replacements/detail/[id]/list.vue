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
                <Table>
                    <TableHeader>
                        <TableRow class="grid grid-cols-8 overflow-x-hidden gap-2 md:gap-2 border border-none">
                            <TableHead class="bg-primary col-span-1 flex w-full items-center rounded-lg text-white">
                                Nom
                            </TableHead>
                            <TableHead class="bg-primary col-span-1 flex w-full items-center rounded-lg text-white">
                                Prénom
                            </TableHead>
                            <TableHead class="bg-primary col-span-1 flex w-full items-center rounded-lg text-white">
                                NISS
                            </TableHead>
                            <TableHead class="bg-primary col-span-1 flex w-full items-center rounded-lg text-white">
                                Tél
                            </TableHead>
                            <TableHead class="bg-primary col-span-1 flex w-full items-center rounded-lg text-white">
                                Code postal
                            </TableHead>
                            <TableHead class="bg-primary col-span-1 flex w-full items-center rounded-lg text-white">
                                Ville
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
                                class="grid grid-cols-8 overflow-x-hidden justify-between gap-2 md:gap-2 border-2 border-gray-500"
                            >
                                <TableCell class="flex h-12 col-span-1 my-1 items-center bg-gray-10">
                                    <span class="">{{ list.repondedBy.lastname }}</span>
                                </TableCell>
                                <TableCell class="flex h-12 col-span-1 my-1 items-center bg-gray-10">
                                    <span class="">{{ list.repondedBy.firstname }}</span>
                                </TableCell>
                                <TableCell class="flex h-12 col-span-1 my-1 items-center bg-gray-10">
                                    <span class="">{{ list.repondedBy.identifier_number }}</span>
                                </TableCell>
                                <TableCell class="flex h-12 col-span-1 my-1 items-center bg-gray-10">
                                    <span class="">{{ list.repondedBy.phone_number }}</span>
                                </TableCell>
                                <TableCell class="h-12 col-span-1 my-1 bg-gray-10">
                                    <div class="flex items-center justify-center h-full">
                                        <span class="text-center">
                                            {{
                                                list.repondedBy.settings
                                                    && JSON.parse(list.repondedBy.settings).replacement?.zip_codes?.length
                                                    ? JSON.parse(list.repondedBy.settings).replacement.zip_codes.join(', ')
                                                    : ' -- '
                                            }}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell class="h-12 col-span-1 my-1 bg-gray-10">
                                    <div class="flex items-center justify-center h-full">
                                        <span class="text-center">
                                            {{
                                                list.repondedBy.settings
                                                    && JSON.parse(list.repondedBy.settings).replacement?.cities?.length
                                                    ? JSON.parse(list.repondedBy.settings).replacement.cities.join(', ')
                                                    : ' -- '
                                            }}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell class="flex h-12 col-span-1 justify-center my-1 items-center">
                                    <div
                                        v-if="list.status==='confirmed'"
                                        class="flex gap-2 text-success items-center font-bold"
                                    >
                                        <CheckCircleIcon class="size-7" /> <span>Accepté</span>
                                    </div>
                                    <Form
                                        v-else
                                        @submit="handlesubmit(list.id)"
                                    >
                                        <Button
                                            type="submit"
                                            class="bg-gray-200 hover:text-white text-black rounded-full w-24"
                                        >
                                            <span class="text-xs">
                                                Accepter
                                            </span>
                                        </Button>
                                    </Form>
                                </TableCell>

                                <TableCell class="flex h-12 col-span-1 justify-center my-1 items-center">
                                    <Button
                                        class="bg-gray-200 hover:text-white text-black rounded-full"
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
import { CheckCircleIcon } from '@heroicons/vue/24/outline';
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
    middleware: ['auth', 'verified'],
    ssr: false,
});
</script>
