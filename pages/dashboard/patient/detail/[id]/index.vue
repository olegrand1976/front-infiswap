<template>
    <Form class="grid grid-cols-[40%_57.5%] gap-6">
        <section class="flex flex-col justify-between">
            <div class="space-y-6">
                <div class="bg-primary p-6 rounded-xl flex flex-col space-y-3 justify-center items-center px-auto">
                    <UserCircleIcon class="text-white w-28" />
                    <p class="text-white">
                        <span class="font-semibold">
                            {{ patient.lastname }}
                        </span>
                        {{ patient.firstname }}
                    </p>
                    <Button
                        variant="secondary"
                        class="text-primary"
                        @click="openDialog"
                    >
                        Mettre à jour
                    </Button>

                    <Dialog v-model:open="isOpenDialog">
                        <DialogContent class="sm:max-w-xl h-[70vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Mise à jour</DialogTitle>
                                <DialogDescription>
                                    Vous pouvez mettre à jour ici les informations personnelles du patient
                                </DialogDescription>
                            </DialogHeader>

                            <div class="mt-4 space-y-3">
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Nom
                                    </p>
                                    <Input
                                        v-model="formData.lastname"
                                        type="text"
                                        :placeholder="patient.lastname"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Prénom
                                    </p>
                                    <Input
                                        v-model="formData.firstname"
                                        type="text"
                                        :placeholder="patient.firstname"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Email
                                    </p>
                                    <Input
                                        v-model="formData.email"
                                        type="email"
                                        :placeholder="patient.email"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Sécurité sociale
                                    </p>
                                    <Input
                                        v-model="formData.socialSecurityNumber"
                                        type="text"
                                        :placeholder="patient.social_security_number"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Téléphone
                                    </p>
                                    <Input
                                        v-model="formData.phoneNumber"
                                        type="text"
                                        :placeholder="patient.phone_number"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Code postal
                                    </p>
                                    <Input
                                        v-model="formData.zipCode"
                                        type="text"
                                        :placeholder="patient.profile.zip_code"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Ville
                                    </p>
                                    <Input
                                        v-model="formData.city"
                                        type="text"
                                        :placeholder="patient.profile.city"
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                            </div>

                            <Button
                                class="text-end mt-6 mx-36"
                                @click="closeDialog"
                            >
                                Valider
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>

                <div class="bg-gray-100 rounded-b">
                    <h3 class="bg-primary flex justify-between items-center text-white p-6 rounded-t">
                        <span>Information</span>
                        <PencilSquareIcon class="w-5 text-white" />
                    </h3>

                    <div class="px-4 py-6 space-y-5">
                        <div class="grid grid-cols-[40%_60%] gap-4">
                            <h6 class="font-semibold">
                                Sexe
                            </h6>
                            <p>
                                Masculin
                            </p>
                        </div>
                        <div class="grid grid-cols-[40%_60%] gap-4">
                            <h6 class="font-semibold">
                                Type de maladie
                            </h6>
                            <p>
                                Allergie
                            </p>
                        </div>
                        <div class="grid grid-cols-[40%_60%] gap-4">
                            <h6 class="font-semibold">
                                Facteur
                            </h6>
                            <p>
                                Pollen
                            </p>
                        </div>
                        <div class="grid grid-cols-[40%_60%] gap-4">
                            <h6 class="font-semibold">
                                Gravité
                            </h6>
                            <p>
                                Moyenne
                            </p>
                        </div>
                        <div class="grid grid-cols-[40%_60%] gap-4">
                            <h6 class="font-semibold">
                                Dernier traitement
                            </h6>
                            <p>
                                01/03/2024
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                class="mt-8"
                type="submit"
            >
                Enregistrer
            </Button>
        </section>

        <section>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h3 class="p-2 bg-primary text-white rounded-t">
                        Date de début d'intervention
                    </h3>
                    <div class="bg-gray-100 p-4">
                        <div class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52">
                            <CalendarDaysIcon class="w-5" />
                            <Input
                                v-model="formData.careStartDate"
                                v-model:model-value="patient.care_start_date"
                                type="date"
                                class="bg-transparent"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="p-2 bg-primary text-white rounded-t">
                        Date de fin d'intervention
                    </h3>
                    <div class="bg-gray-100 p-4">
                        <div class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52">
                            <CalendarDaysIcon class="w-5" />
                            <Input
                                v-model="formData.careEndDate"
                                v-model:model-value="patient.care_end_date"
                                type="date"
                                class="bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col space-y-4 mt-6">
                <div
                    v-for="(visit, visitIndex) in patient.visit_times"
                    :key="visitIndex"
                    class="w-full"
                >
                    <div class="bg-gray-100 p-5 rounded">
                        <div class="flex justify-between items-center">
                            <h3 class="text-primary">
                                Heure de visite théorique
                            </h3>
                        </div>

                        <div class="grid grid-cols-[30%_70%] items-center mt-4">
                            <h5>Jour</h5>
                            <p>
                                {{ days[visit.day_of_visit] }}
                            </p>
                        </div>

                        <div
                            v-for="(timeSlot, timeIndex) in JSON.parse(visit.theoretical_visit_times)"
                            :key="timeIndex"
                        >
                            <hr class="border border-gray-200 my-5">

                            <div class="grid grid-cols-[30%_70%] items-center mt-4">
                                <h5>Heure</h5>
                                <p>
                                    {{ timeSlot.time }}
                                </p>
                            </div>

                            <div class="grid grid-cols-[30%_70%] items-center mt-4">
                                <h5>Type de soin</h5>
                                <p>
                                    {{ timeSlot.care_types.join(', ') }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 p-6 rounded mt-8">
                <h2 class="text-primary">
                    Liste des documents
                </h2>

                <Button class="w-full flex items-center justify-center mt-4">
                    <PlusIcon class="w-5" />
                    Ajouter un document
                </Button>

                <div class="grid my-4">
                    <Table>
                        <TableBody>
                            <template
                                v-if="prescriptions.length == 0"
                            >
                                <p class="mt-16 text-center text-black/60">
                                    Aucun document disponible pour le moment
                                </p>
                            </template>
                            <template
                                v-for="prescription in prescriptions"
                                v-else
                                :key="prescription.id"
                            >
                                <TableRow class="grid grid-cols-[80%_20%] gap-2 border border-none overflow-x-hidden">
                                    <TableCell class="bg-gray-100">
                                        <div class="flex h-10 rounded bg-gray-200 justify-between items-center">
                                            <span class="truncate w-full px-2 text-center mx-auto">
                                                {{ prescription.name }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="bg-gray-100">
                                        <div class="flex h-10 rounded bg-gray-200 justify-center items-center">
                                            <CloudArrowDownIcon class="w-5 cursor-pointer" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </template>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    </Form>
</template>

<script setup>
import {
    PlusIcon,
    UserCircleIcon,
    CloudArrowDownIcon,
    PencilSquareIcon,
} from '@heroicons/vue/20/solid';
import { detailPatient } from '~/composables/usePatients';

const route = useRoute();
const patientId = route.params.id;

const { patient, fetchDetailPatient } = detailPatient(patientId);

const formData = reactive({
    lastname: '',
    firstname: '',
    email: '',
    socialSecurityNumber: '',
    phoneNumber: '',
    zipCode: '',
    city: '',
    careStartDate: '',
    careEndDate: '',
    availability: '',
    care_informations: [],
    visits: [
        {
            dayOfVisit: '',
            theoreticalVisitTimes: [
                {
                    time: '',
                    careTypeId: [],
                },
            ],
        },
    ],
    patient_care_type: [],
    patient_documents: [],
});

const days = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
};

const isOpenDialog = ref(false);

const openDialog = () => {
    isOpenDialog.value = true;
};

const closeDialog = () => {
    isOpenDialog.value = false;
};

const prescriptions = [
    {
        id: 1,
        name: 'Maladie cardiaque',
    },
    {
        id: 2,
        name: 'Soins de la peau',
    },
];

useHead({
    title: 'Editer le profil',
});

onMounted(() => {
    fetchDetailPatient();
});

definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
});
</script>
