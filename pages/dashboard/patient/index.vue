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

        <div class="flex justify-between mt-6">
            <Form class="flex justify-between space-x-3 items-center">
                <div class="flex space-x-4">
                    <FormField name="postalCode">
                        <FormItem>
                            <FormControl>
                                <div class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1">
                                    <h5 class="text-white s">
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
            </Form>

            <div>
                <Button
                    href="/dashboard/patient/create"
                >
                    Créer patient
                </Button>
            </div>
        </div>

        <div class="grid my-8">
            <Table>
                <TableHeader class="w-full">
                    <TableRow class="grid grid-cols-4 overflow-x-hidden gap-2 border border-none">
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white s">
                            Jour
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white s">
                            Code postal
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white s">
                            Ville
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white s">
                            Type de soin à pratiquer
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <template
                        v-if="nursePatients.length == 0"
                    >
                        <p class="mt-16 text-center text-black/60">
                            Vous n'avez aucun patient pour le moment
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
                                        <NuxtLink :to="`/dashboard/patient/detail/${patient.id}`">
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
    </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { useNursePatients } from '~/composables/useNursePatients';
import { deletePatient } from '~/composables/usePatients';

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
    middleware: ['auth'],
});
</script>
