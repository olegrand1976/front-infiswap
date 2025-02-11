<template>
    <div class="pt-3">
        <div class="bg-gray-100 h-12 rounded py-2">
            <h1 class="text-primary">
                Liste des personnes <strong>interessées par mon remplacement</strong>
            </h1>
        </div>

        <div class="flex items-center space-x-6 mt-6 mx-16">
            <h4 class="font-bold text-sm text-primary">
                Période 
            </h4>
            <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                <span class="text-xs text-white ms-3">Début</span>
                <div class="flex justify-center items-center text-primary rounded-full bg-white shadow w-40">
                    <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                    <Input
                        v-model="startDate"
                        variant="transparent"
                        type="date"
                        class="text-xs text-primary w-[5.75rem]"
                        disabled
                    />
                </div>
            </div>
            <div class="flex space-x-5 items-center rounded-full bg-primary w-40">
                <span class="text-xs text-white ms-3">Fin</span>
                <div class="flex justify-center items-center text-primary rounded-full bg-white shadow w-40">
                    <CalendarDaysIcon class="w-4 h-4 ml-1 text-primary" />
                    <Input
                        v-model="endDate"
                        variant="transparent"
                        type="date"
                        class="text-xs text-primary w-[5.75rem]"
                        disabled
                    />
                </div>
            </div>
        </div>

        <div class="mx-16 mt-8 mb-12">
            <Table>
                <TableHeader>
                    <TableRow class="grid grid-cols-3 overflow-x-hidden gap-3 border border-none">
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                            Nom
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <template
                            v-for="people in peopleInterests"
                            :key="people.id"
                    >
                        <TableRow class="grid grid-cols-3 overflow-x-hidden gap-3 border border-none group">
                            <TableCell class="flex justify-center my-1 items-center bg-gray-100 group-hover:bg-primary text-xs">
                                <span class="group-hover:text-white">{{ people.lastname }}</span>
                            </TableCell>

                            <TableCell class="flex group-hover:bg-primary w-52 ml-12 justify-center my-1 items-center bg-gray-100 text-xs">
                                <Button
                                    variant="transparent"
                                    class="bg-gray-200 group-hover:bg-white rounded-full"
                                >
                                    <span class="text-xs">Accepter</span>
                                </Button>
                            </TableCell>

                            <TableCell class="flex group-hover:bg-primary w-52 -ml-10 justify-center my-1 items-center bg-gray-100 text-xs">
                                <Button
                                    variant="transparent"
                                    class="bg-gray-200 group-hover:bg-white rounded-full"
                                >
                                    <span class="text-xs">Refuser</span>
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

import { useDetailReplacement } from '~/composables/useReplacements';

const route = useRoute();
const replacementId = route.params.id;

const { replacement, fetchReplacement } = useDetailReplacement(replacementId);

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const startDate = computed(() => {
    return replacement.value.start_date ? formatDate(replacement.value.start_date) : '';
});

const endDate = computed(() => {
    return replacement.value.end_date ? formatDate(replacement.value.end_date) : '';
});

onMounted(() => {
    fetchReplacement();
});

const peopleInterests = [
    {
        id: 1,
        lastname: "Jena Dupont",
    },
    {
        id: 2,
        lastname: "Jena Dupont",
    },
    {
        id: 3,
        lastname: "Jena Dupont",
    },
    {
        id: 4,
        lastname: "Jena Dupont",
    },
    {
        id: 5,
        lastname: "Jena Dupont",
    },
    {
        id: 6,
        lastname: "Jena Dupont",
    },
    {
        id: 7,
        lastname: "Jena Dupont",
    },
    {
        id: 8,
        lastname: "Jena Dupont",
    },
];

useHead({
    title: 'Liste des personnes intéréssées par mon remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>