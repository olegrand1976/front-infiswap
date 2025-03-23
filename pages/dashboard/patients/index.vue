<template>
    <div>
        <div class="bg-gray-100 flex px-9 rounded-lg items-center w-full h-12">
            <h1 class="text-primary">
                Mes
                <strong>
                    patients
                </strong>
            </h1>
        </div>

        <div class="flex justify-end mt-6">
            <!-- <Form class="flex justify-between space-x-3 items-center">
                <div class="flex space-x-4">
                    <FormField name="postalCode">
                        <FormItem>
                            <FormControl>
                                <div class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1">
                                    <h5 class="text-white">
                                        Codes postaux
                                    </h5>
                                    <Input
                                        placeholder="1000,7687,5455"
                                        class="w-32 s my-0.5 rounded-full"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>

                <Button
                    class="bg-primary"
                >
                    <MagnifyingGlassIcon class="w-6" />
                    Rechercher
                </Button>
            </Form> -->

            <div>
                <Button
                    href="/dashboard/patients/create"
                >
                    Nouveau patient
                </Button>
            </div>
        </div>

        <div class="hidden md:grid my-8">
            <Table>
                <TableHeader class="w-full">
                    <TableRow class="grid grid-cols-4 overflow-x-hidden gap-2 border border-none">
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white">
                            Jour
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white">
                            Code postal
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white">
                            Ville
                        </TableHead>
                        <TableHead class="bg-primary text-nowrap w-full flex justify-center items-center text-white">
                            Type(s) de soin(s) à pratiquer
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <template
                        v-if="nursePatients.length == 0"
                    >
                        <p class="mt-16 text-center text-black/60">
                            Vous n'avez aucun patient pour le moment ou Veuillez patienter
                        </p>
                    </template>
                    <template
                        v-for="patient in nursePatients"
                        v-else
                        :key="patient.id"
                    >
                        <TableRow class="grid grid-cols-4 gap-2 border border-none overflow-x-hidden">
                            <TableCell class="bg-gray-100 s">
                                <div class="flex h-10 rounded mt-3 bg-gray-200 justify-between items-center">
                                    <span class="truncate w-full px-2 text-center mx-auto">
                                        {{ patient.firstname }} {{ patient.lastname }}
                                    </span>

                                    <div class="flex space-x-4">
                                        <NuxtLink :to="`/dashboard/patients/detail/${patient.id}`">
                                            <PencilSquareIcon class="w-5 cursor-pointer hover:text-primary" />
                                        </NuxtLink>
                                        <TrashIcon
                                            class="w-5 cursor-pointer hover:text-primary"
                                            @click="openDialog"
                                        />

                                        <Dialog v-model:open="isDialogOpen">
                                            <DialogContent class="h-[28vh]">
                                                <DialogHeader>
                                                    <DialogTitle>Confirmer la suppression</DialogTitle>
                                                    <DialogDescription>
                                                        Etes-vous sur de vouloir supprimer ce patient ?
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div class="flex space-x-8 justify-end items-center">
                                                    <Button
                                                        variant="secondary"
                                                        @click="closeDialog"
                                                    >
                                                        Annuler
                                                    </Button>
                                                    <Button
                                                        @click="submitDelete(patient.id)"
                                                    >
                                                        Oui
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell class="bg-gray-100 s">
                                <div class="flex h-10 rounded mt-3 bg-gray-200 justify-center items-center">
                                    <span class="truncate w-full px-2 text-center mx-auto">
                                        {{ patient.profile.zip_code }}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell class="bg-gray-100 s">
                                <div class="flex h-10 rounded mt-3 bg-gray-200 justify-center items-center">
                                    <span class="truncate w-full px-2 text-center mx-auto">
                                        {{ patient.profile.city }}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell class="bg-gray-100 s pt-6">
                                <div
                                    class="pt-3 h-10 rounded bg-gray-200 mx-auto px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                >
                                    {{ patient.care_types?.map((careType) => careType.name || [])
                                        .join(', ') }}
                                </div>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>

        <div class="md:hidden mt-8">
            <template v-if="nursePatients.length == 0">
                <p class="mt-16 text-center text-black/60">
                    Vous n'avez aucun patient pour le moment
                </p>
            </template>
            <template
                v-else
            >
                <div
                    v-for="patient in nursePatients"
                    :key="patient.id"
                    class="px-4 py-8 bg-gray-100 rounded-lg grid grid-cols-1 items-center mb-8"
                >
                    <div class="col-span-2 py-2 rounded bg-primary text-white font-semibold text-center">
                        <h4>
                            Nom
                        </h4>
                    </div>

                    <div class="col-span-2 flex p-2 rounded mt-3 bg-gray-200 justify-between items-center">
                        <span class="truncate w-full px-2">
                            {{ patient.firstname }} {{ patient.lastname }}
                        </span>

                        <div class="flex space-x-4">
                            <NuxtLink :to="`/dashboard/patients/detail/${patient.id}`">
                                <PencilSquareIcon class="w-5 cursor-pointer hover:text-primary" />
                            </NuxtLink>
                            <TrashIcon
                                class="w-5 cursor-pointer hover:text-primary"
                                @click="openDialog"
                            />

                            <Dialog v-model:open="isDialogOpen">
                                <DialogContent class="h-[25vh] w-[85%]">
                                    <DialogHeader>
                                        <DialogTitle>Confirmer la suppression</DialogTitle>
                                        <DialogDescription>
                                            Etes-vous sur de vouloir supprimer ce patient ?
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div class="flex space-x-8 justify-end items-center">
                                        <Button
                                            variant="secondary"
                                            @click="closeDialog"
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            @click="submitDelete(patient.id)"
                                        >
                                            Oui
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div class="col-span-2 flex mt-6 justify-between items-center space-x-2">
                        <div class="py-2 w-full rounded bg-primary text-white font-semibold text-center">
                            <h4>
                                Codes postaux
                            </h4>
                        </div>
                        <div class="py-2 w-full rounded bg-primary text-white font-semibold text-center">
                            <h4>
                                Villes
                            </h4>
                        </div>
                    </div>

                    <div class="col-span-2 flex mt-3 justify-between items-center space-x-2">
                        <div class="text-center py-2 truncate w-full rounded bg-gray-200">
                            {{ patient.profile.zip_code }}
                        </div>
                        <div class="text-center py-2 truncate w-full rounded bg-gray-200">
                            {{ patient.profile.city }}
                        </div>
                    </div>

                    <div class="col-span-2 py-2 mt-6 rounded bg-primary text-white font-semibold text-center">
                        <h4>
                            Types de soin à pratiquer
                        </h4>
                    </div>

                    <div class="mt-3 text-center rounded bg-gray-200 p-2 truncate">
                        {{ getUniqueCareTypes(patient.care_types) }}
                        <!-- {{ patient.care_types?.map((careType) => careType.name || [])
                            .join(', ') }} -->
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { useNursePatients } from '~/composables/useNursePatients';
import { deletePatient } from '~/composables/usePatients';
import type { CareType } from '~/lib/types';

useHead({
    title: 'Liste des patients',
});

const { nursePatients, fetchNursePatients } = useNursePatients();

const isDialogOpen = ref(false);

const openDialog = () => {
    isDialogOpen.value = true;
};

const closeDialog = () => {
    isDialogOpen.value = false;
};

function getUniqueCareTypes(careTypes: CareType[]) {
    const uniqueCareTypes = [...new Set(careTypes?.map(careType => careType.name || [])).values()];
    return uniqueCareTypes.join(', ');
}

const submitDelete = async (patientId) => {
    await deletePatient(patientId);
    closeDialog();
    navigateTo(useRoute().fullPath, { replace: true });
};

onMounted(() => {
    fetchNursePatients();
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified', 'subscribed'],
    ssr: false,
});
</script>
