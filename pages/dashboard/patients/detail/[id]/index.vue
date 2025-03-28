<template>
    <Form
        v-if="patient"
        class="grid grid-cols-1 lg:grid-cols-[40%_57.5%] gap-6 relative"
        @submit="submit"
    >
        <transition name="fade">
            <div
                v-show="isScrolled"
                :class="clsx('w-full fixed top-10 z-50 text-center bg-red-300/50 py-5 transition-opacity ease-in-out duration-500', {
                    'opacity-0': !isScrolled,
                    'opacity-100': isScrolled,
                })"
            >
                >
                <Button
                    variant="success"
                    class="w-64 rounded-full"
                    :in-progress="inProgress"
                    type="submit"
                >
                    Enregistrer
                </Button>
            </div>
        </transition>
        <section class="flex flex-col justify-between mb-8">
            <div class="space-y-6">
                <div class="bg-primary text-white p-4 rounded">
                    <UserCircleIcon class="w-28 mx-auto" />
                    <p class="text-center mt-4">
                        {{ patient.firstname }}
                        <span
                            v-if="patient.lastname"
                            class="font-semibold"
                        >
                            {{ patient.lastname?.toUpperCase() }}
                        </span>
                    </p>

                    <Dialog v-model:open="isOpenDialog">
                        <DialogContent class="w-full sm:max-w-xl h-[36rem] overflow-y-auto">
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
                                        class="bg-transparent placeholder:text-black"
                                    />
                                </div>
                                <div class="grid grid-cols-[30%_70%] items-center border border-primary h-9 rounded-full">
                                    <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                        Genre
                                    </p>
                                    <select
                                        v-model="formData.gender"
                                        class="bg-transparent px-2 h-full rounded-e-full focus:outline-none"
                                    >
                                        <option
                                            value="M"
                                            :selected="formData.gender === 'M'"
                                        >
                                            Homme
                                        </option>
                                        <option
                                            value="F"
                                            :selected="formData.gender === 'F'"
                                        >
                                            Femme
                                        </option>
                                        <option
                                            value="null"
                                            :selected="formData.gender === 'null'"
                                        >
                                            X
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <Button
                                class="text-end mt-6 mx-36"
                                @click="updatePatientInfo"
                            >
                                Enregistrer
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>

                <div class="bg-gray-100 rounded-b">
                    <h3 class="bg-primary flex justify-between items-center text-white p-6 rounded-t">
                        <span class="font-semibold">Informations personnelles</span>
                        <PencilSquareIcon
                            class="w-5 text-white cursor-pointer"
                            @click="openDialog"
                        />
                    </h3>
                    <div class="flex flex-col gap-2 px-4 py-6 lg:gap-4">
                        <div class="grid grid-cols-[40%_60%] gap-4">
                            <div class="font-semibold">
                                <!-- Numéro de registre national -->
                                NISS
                            </div>
                            <div>{{ patient.social_security_number }}</div>
                        </div>
                        <div
                            v-if="patient.phone_number"
                            class="grid grid-cols-[40%_60%] gap-4"
                        >
                            <div class="font-semibold">
                                Téléphone
                            </div>
                            <div>{{ phoneNumber(patient.phone_number as string) }}</div>
                        </div>
                        <div
                            v-if="patient.profile?.zip_code"
                            class="grid grid-cols-[40%_60%] gap-4"
                        >
                            <div class="font-semibold">
                                Code Postale
                            </div>
                            <div>{{ patient.profile.zip_code }}</div>
                        </div>
                        <div
                            v-if="patient.profile?.city"
                            class="grid grid-cols-[40%_60%] gap-4"
                        >
                            <div class="font-semibold">
                                Ville
                            </div>
                            <div>{{ patient.profile.city }}</div>
                        </div>
                        <div
                            v-if="patient.profile?.city"
                            class="grid grid-cols-[40%_60%] gap-4"
                        >
                            <div class="font-semibold">
                                Genre
                            </div>
                            <div>{{ patient.gender ?? 'Non genré' }}</div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-100 rounded-b">
                    <h3 class="bg-primary flex justify-between items-center text-white p-6 rounded-t">
                        <span class="font-semibold">Notes de santé</span>
                        <PencilSquareIcon
                            class="w-5 text-white cursor-pointer"
                            @click="openCareInfoDialog"
                        />
                    </h3>

                    <div class="px-4 py-6">
                        <template v-if="formData.care_informations && formData.care_informations.length > 0">
                            <div
                                v-for="(careInformation, careIndex) in formData.care_informations"
                                :key="careIndex"
                                class="space-y-5 mb-4"
                            >
                                <div class="grid grid-cols-[40%_60%] gap-4">
                                    <h6 class="font-semibold">
                                        Titre
                                    </h6>
                                    <p>
                                        {{ careInformation.recordType }}
                                    </p>
                                </div>

                                <div class="grid grid-cols-[40%_60%] gap-4">
                                    <h6 class="font-semibold">
                                        Complément
                                    </h6>
                                    <p>
                                        {{ careInformation.recordName }}
                                    </p>
                                </div>
                                <div class="grid grid-cols-[40%_60%] gap-4">
                                    <h6 class="font-semibold">
                                        Gravité
                                    </h6>
                                    <p>
                                        {{ severities[careInformation.recordSeverity] }}
                                    </p>
                                </div>
                                <div class="grid grid-cols-[40%_60%] gap-4">
                                    <h6 class="font-semibold">
                                        Détail
                                    </h6>
                                    <p>
                                        {{ careInformation.recordDetails }}
                                    </p>
                                </div>
                                <hr class="border border-gray-200">
                            </div>
                        </template>
                        <template v-else>
                            <p class="text-center text-sm text-black/40 p-6">
                                Aucune information à afficher pour le moment
                            </p>
                        </template>
                    </div>
                </div>

                <Dialog v-model:open="isCareInfoDialogOpen">
                    <DialogContent class="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Gestion des informations de soins</DialogTitle>
                            <DialogDescription>
                                Ajoutez, modifiez ou supprimez les informations de soins du patient.
                            </DialogDescription>
                        </DialogHeader>

                        <div class="space-y-6 max-h-[400px] overflow-y-auto">
                            <div
                                v-for="(info, index) in formData.care_informations"
                                :key="index"
                                class="p-4 bg-gray-50 rounded-lg relative"
                            >
                                <span
                                    title="Supprimer"
                                    style="background-color: black; color: white; font-style: italic; padding: 2px 5px; border-radius: 4px;"
                                >
                                    <XMarkIcon
                                        class="w-5 h-5 absolute top-2 right-2 text-primary cursor-pointer"
                                        @click="removeCareInfo(index)"
                                    />
                                </span>

                                <div class="space-y-4">
                                    <div class="space-y-2">
                                        <Label>Titre</Label>
                                        <Input
                                            v-model="info.recordType"
                                            placeholder="Sourd"
                                            class="w-full outline outline-gray-200"
                                        />
                                    </div>

                                    <div class="space-y-2">
                                        <Label>Complément</Label>
                                        <Input
                                            v-model="info.recordName"
                                            placeholder="Oreille droite"
                                            class="w-full outline outline-gray-200"
                                        />
                                    </div>

                                    <div class="space-y-2">
                                        <Label>Gravité</Label>
                                        <Select v-model="info.recordSeverity">
                                            <SelectTrigger class="text-nowrap">
                                                <SelectValue placeholder="Sélectionnez la gravité" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    Faible
                                                </SelectItem>
                                                <SelectItem value="moderate">
                                                    Moyen
                                                </SelectItem>
                                                <SelectItem value="hight">
                                                    Élevé
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div class="space-y-2">
                                        <Label>Détails</Label>
                                        <Textarea
                                            v-model="info.recordDetails"
                                            placeholder="Entrez les détails"
                                            class="w-full border border-gray-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between mt-6">
                            <Button
                                variant="success"
                                @click="addNewCareInfo"
                            >
                                <PlusCircleIcon class="mr-2" />
                                <span>Ajouter</span>
                            </Button>

                            <div class="space-x-2">
                                <Button
                                    variant="outline"
                                    @click="cancelCareInfoEdit"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    @click="saveCareInformations"
                                >
                                    Enregistrer
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Button
                class="mt-8 hidden lg:block"
                type="submit"
                :in-progress="inProgress"
            >
                Enregistrer
            </Button>
        </section>

        <section class="mb-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <h3 class="p-2 bg-primary text-white rounded-t">
                        Date de début d'intervention
                    </h3>
                    <div class="bg-gray-100 p-4">
                        <div class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52">
                            <CalendarDaysIcon class="w-5" />
                            <Input
                                v-model="patient.care_start_date"
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
                                type="date"
                                class="bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col space-y-4 mt-6">
                <div
                    v-for="(visit, visitIndex) in formData.visits"
                    :key="visitIndex"
                    class="w-full"
                >
                    <div class="bg-gray-100 p-5 rounded">
                        <div class="flex justify-between items-center">
                            <h3 class="text-primary">
                                Heure de visite théorique
                            </h3>
                            <button
                                v-if="formData.visits.length > 1"
                                class="text-red-500 hover:text-red-700"
                                type="button"
                                @click="removeVisit(visitIndex)"
                            >
                                Supprimer ce jour
                            </button>
                        </div>

                        <div class="grid grid-cols-[30%_70%] items-center mt-4">
                            <h5>Jour</h5>
                            <Select
                                v-model="visit.daysOfVisit"
                                multiple
                            >
                                <SelectTrigger
                                    class="w-full bg-white shadow rounded-full text-nowrap border border-none"
                                    position="right"
                                >
                                    <SelectValue>
                                        <template v-if="getSelectedDaysText(visit.daysOfVisit)">
                                            {{ getSelectedDaysText(visit.daysOfVisit) }}
                                        </template>
                                        <template v-else>
                                            <span class="text-black/60">
                                                Sélectionner un jour
                                            </span>
                                        </template>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent class="border border-none">
                                    <SelectGroup class="w-32">
                                        <div
                                            v-for="[key, value] in Object.entries(days)"
                                            :key="key"
                                            class="flex items-center space-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                            @click="toggleDaySelection(visit, key)"
                                        >
                                            <Checkbox
                                                :checked="visit.daysOfVisit.includes(key)"
                                                class="mr-2"
                                            />
                                            <label class="text-xs text-nowrap cursor-pointer">{{ value }}</label>
                                        </div>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            v-for="(timeSlot, timeIndex) in visit.theoreticalVisitTimes"
                            :key="timeIndex"
                        >
                            <hr class="border border-gray-200 my-5">

                            <div class="flex justify-end items-center">
                                <XMarkIcon
                                    v-if="visit.theoreticalVisitTimes.length > 1"
                                    class="w-5 text-primary cursor-pointer"
                                    @click="removeTimeSlot(visitIndex, timeIndex)"
                                />
                            </div>

                            <div class="grid grid-cols-[30%_70%] items-center mt-4">
                                <h5>Heure</h5>
                                <InputTime
                                    v-model="timeSlot.time"
                                    input-class="shadow rounded-full"
                                />
                            </div>

                            <div class="grid grid-cols-[30%_70%] items-center mt-4">
                                <h5>Type de soin</h5>
                                <Select
                                    v-model="timeSlot.careTypeId"
                                    multiple
                                >
                                    <SelectTrigger
                                        class="w-full bg-white shadow rounded-full text-nowrap border border-none"
                                        position="right"
                                    >
                                        <SelectValue class="truncate w-[35rem]">
                                            {{ getSelectedCareTypesText(timeSlot.careTypeId) }}
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent class="border border-none">
                                        <SelectGroup class="w-32">
                                            <div
                                                v-for="careType in careTypes"
                                                :key="careType.id"
                                                class="flex items-center space-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                                @click="handleCareTypeClick(timeSlot, careType.id)"
                                            >
                                                <Checkbox
                                                    :checked="timeSlot.careTypeId.includes(careType.id)"
                                                    class="mr-2"
                                                />
                                                <label class="text-xs text-nowrap cursor-pointer">
                                                    {{ careType.name }}
                                                </label>
                                            </div>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <PlusCircleIcon
                            class="w-6 text-primary mt-8 ml-auto cursor-pointer"
                            title="Ajouter un autre heure"
                            @click="addTimeSlot(visitIndex)"
                        />
                    </div>
                </div>

                <Button
                    class="flex justify-center items-center mx-auto mt-4"
                    type="button"
                    @click="addVisit"
                >
                    <PlusCircleIcon class="w-5 h-5 mr-2" />
                    <span>Ajouter un autre jour</span>
                </Button>
            </div>

            <div class="bg-gray-100 p-6 rounded mt-8">
                <h2 class="text-primary">
                    Liste des documents
                </h2>

                <div class="relative">
                    <Button
                        class="w-full flex items-center justify-center mt-4"
                        @click="openFileUploadDialog"
                    >
                        <PlusCircleIcon class="w-5" />
                        Ajouter un document
                    </Button>
                </div>

                <div class="grid my-4">
                    <Table>
                        <TableBody>
                            <template
                                v-if="!formData.patient_documents.length"
                            >
                                <p class="mt-8 text-center text-black/60">
                                    Aucun document disponible pour le moment
                                </p>
                            </template>
                            <template
                                v-for="(document, index) in patient.patient_documents"
                                v-else
                                :key="index"
                            >
                                <TableRow class="grid grid-cols-[75%_12%_12%] gap-2 border border-none overflow-x-hidden">
                                    <TableCell class="bg-gray-100">
                                        <div class="flex h-10 rounded bg-gray-200 justify-between items-center">
                                            <span class="truncate w-full px-2 text-center mx-auto">
                                                {{ document.note }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="bg-gray-100">
                                        <Button
                                            class="flex h-10 rounded bg-gray-200 justify-center items-center text-black hover:text-white"
                                            :in-progress="downloading"
                                            @click="downloadDocument(document.id)"
                                        >
                                            <CloudArrowDownIcon class="w-5 cursor-pointer" />
                                        </Button>
                                    </TableCell>
                                    <TableCell class="bg-gray-100">
                                        <Button
                                            class="flex h-10 rounded bg-gray-200 justify-center items-center text-black hover:text-white"
                                            @click="removeDocument(index, document.id)"
                                        >
                                            <TrashIcon class="w-5 cursor-pointer" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </template>
                        </TableBody>
                    </Table>
                </div>

                <Dialog
                    v-model:open="isDocumentDialogOpen"
                >
                    <DialogContent class="sm:max-w-[40rem]">
                        <DialogHeader>
                            <DialogTitle>Ajouter un document</DialogTitle>
                        </DialogHeader>
                        <div class="grid gap-4 py-4">
                            <div class="grid gap-2">
                                <FileUpload @file-selected="file = $event" />
                            </div>
                            <div class="grid gap-2">
                                <Label for="note">Note</Label>
                                <Input
                                    id="note"
                                    v-model="documentNote"
                                    placeholder="Ex: Rapport de test sanguin"
                                    class="outline outline-gray-300 w-full"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                :in-progress="uploading"
                                @click="handleUploadDocument"
                            >
                                Sauvegarder
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Button
                class="mt-12 flex w-64 justify-center mx-auto lg:hidden"
                type="submit"
                :in-progress="inProgress"
            >
                Enregistrer
            </Button>
        </section>
    </Form>
</template>

<script lang="ts" setup>
import {
    PlusCircleIcon,
    UserCircleIcon,
    CloudArrowDownIcon,
    PencilSquareIcon,
    XMarkIcon,
    CalendarDaysIcon,
    TrashIcon,
} from '@heroicons/vue/24/solid';

import clsx from 'clsx';
import { useCareTypes } from '~/composables/useCareTypes';
import { detailPatient } from '~/composables/usePatients';
import { InputTime } from '@/components/ui/input-time';
import FileUpload from '~/components/ui/form/FileUpload.vue';
import type { Patient } from '~/lib/types';

const { $apifetch } = useNuxtApp();
const { careTypes, fetchCareTypes } = useCareTypes();
const route = useRoute();

const isScrolled = ref(false);

const handleScroll = () => {
    isScrolled.value = window.scrollY > 30 && document.documentElement.scrollHeight > 80;
};
const { phoneNumber } = useFormmater();
const patientId = route.params.id as string;

const { patient, fetchDetailPatient } = detailPatient(patientId) as unknown as { patient: Ref<Patient | null>; fetchDetailPatient: () => Promise<void> };

const { loading: downloading, downloadDocument, deleteDocument } = usePatientManagement();
interface User {
    nurse?: {
        id: string;
    };
}

const user = useState<User>('user');

// Fonction pour trouver l'ID du type de soin par son nom
const findCareTypeIdByName = (name) => {
    return careTypes.value.find(ct => ct.name === name)?.id;
};

const { $toast } = useNuxtApp();

const groupVisitsByTimeAndCareTypes = (oldVisitTimes) => {
    if (!oldVisitTimes) return [];

    const uniqueVisits = new Map();

    oldVisitTimes.forEach((oldVisit) => {
        oldVisit.visits.forEach((visit) => {
            const careTypeIds = visit.care_types
                .map(name => findCareTypeIdByName(name))
                .filter(id => id !== undefined)
                .sort();

            const timeSignature = `${visit.time}-${careTypeIds.join(',')}`;

            if (!uniqueVisits.has(timeSignature)) {
                uniqueVisits.set(timeSignature, {
                    daysOfVisit: [oldVisit.day_of_visit],
                    theoreticalVisitTimes: [{
                        time: formatTime(visit.time),
                        careTypeId: careTypeIds,
                    }],
                });
            }
            else {
                const existingVisit = uniqueVisits.get(timeSignature);
                if (!existingVisit.daysOfVisit.includes(oldVisit.day_of_visit)) {
                    existingVisit.daysOfVisit.push(oldVisit.day_of_visit);
                }
            }
        });
    });

    return Array.from(uniqueVisits.values());
};

const transformVisitsForApi = (visits) => {
    const transformedVisits = [];

    visits.forEach((visit) => {
        visit.daysOfVisit.forEach((day) => {
            visit.theoreticalVisitTimes.forEach((timeSlot) => {
                const existingVisit = transformedVisits.find(v => v.day_of_visit === day);

                if (existingVisit) {
                    existingVisit.visits.push({
                        time: timeSlot.time,
                        care_types: timeSlot.careTypeId.map(id =>
                            careTypes.value.find(ct => ct.id === id)?.name,
                        ).filter(Boolean),
                    });
                }
                else {
                    transformedVisits.push({
                        daysOfVisit: [day],
                        theoreticalVisitTimes: [{
                            time: timeSlot.time,
                            careTypeId: timeSlot.careTypeId.map(id =>
                                careTypes.value.find(ct => ct.id === id)?.id,
                            ).filter(Boolean),
                        }],
                    });
                }
            });
        });
    });

    return transformedVisits;
};

const migrateVisitTimes = (oldVisitTimes) => {
    if (!oldVisitTimes) return [];
    return groupVisitsByTimeAndCareTypes(oldVisitTimes);
};

const formData = ref({
    nurseId: '',
    lastname: '',
    firstname: '',
    email: '',
    socialSecurityNumber: '',
    phoneNumber: '',
    zipCode: '',
    city: '',
    gender: '',
    careStartDate: '',
    careEndDate: '',
    availability: [],
    care_informations: [],
    visits: [],
    patient_care_type: [],
    patient_documents: [],
    patientId: '',
});

const transformCareInformations = (careInfo: any[]) => {
    return careInfo.map(info => ({
        recordType: info.record_type,
        recordName: info.record_name,
        recordSeverity: info.record_severity,
        recordDetails: info.record_details,
    }));
};

const initializeFormData = () => {
    if (patient.value && user.value?.nurse) {
        formData.value = {
            nurseId: user.value.nurse.id,
            lastname: patient.value.lastname || '',
            firstname: patient.value.firstname || '',
            email: patient.value.email || '',
            gender: patient.value.gender || null,
            socialSecurityNumber: patient.value.social_security_number || '',
            phoneNumber: patient.value.phone_number || '',
            zipCode: patient.value.profile?.zip_code || '',
            city: patient.value.profile?.city || '',
            careStartDate: patient.value.care_start_date || '',
            careEndDate: patient.value.care_end_date || '',
            availability: patient.value.availability || [],
            care_informations: transformCareInformations(patient.value.care_informations || []),
            visits: migrateVisitTimes(patient.value.visit_times || []),
            patient_care_type: patient.value.patient_care_type || [],
            patient_documents: patient.value.patient_documents || [],
            patientId: patient.value.id,
        };
    }
};

const days = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
    all: 'Tous',
};

const severities = {
    low: 'Faible',
    moderate: 'Moyen',
    hight: 'Elevé',
};

const isOpenDialog = ref(false);

const openDialog = () => {
    isOpenDialog.value = true;
};

const updatePatientInfo = async () => {
    try {
        const genderValue = formData.value.gender === 'null' ? null : formData.value.gender;

        const payload = {
            lastname: formData.value.lastname,
            firstname: formData.value.firstname,
            email: formData.value.email,
            gender: genderValue,
            socialSecurityNumber: formData.value.socialSecurityNumber,
            phoneNumber: formData.value.phoneNumber,
            zipCode: formData.value.zipCode,
            city: formData.value.city,
        };

        await $apifetch(`/api/patients/information/${formData.value.patientId}`, {
            method: 'PUT',
            body: payload,
        });

        isOpenDialog.value = false;
        $toast({
            description: 'Informations du patient mises à jour avec succès',
        });
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
    catch (error) {
        let errorMessage = 'Une erreur s\'est produite';

        if (error.response && error.response._data) {
            const responseData = error.response._data;

            if (responseData.message) {
                errorMessage = responseData.message;
            }
            else if (responseData.errors) {
                errorMessage = Object.values(responseData.errors)
                    .flat()
                    .join(', ');
            }
        }
        else if (error.message) {
            errorMessage = error.message;
        }

        $toast({
            description: `Erreur : ${errorMessage}`,
            variant: 'destructive',
        });
    }
};

const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

const toggleDaySelection = (visit, day) => {
    const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (day === 'all') {
        if (visit.daysOfVisit.includes('all')) {
            visit.daysOfVisit = [];
        }
        else {
            visit.daysOfVisit = [...allDays, 'all'];
        }
        return;
    }
    const index = visit.daysOfVisit.indexOf(day);
    const hasAllSelected = visit.daysOfVisit.includes('all');

    if (index === -1) {
        visit.daysOfVisit.push(day);
        if (hasAllSelected) {
            const allIndex = visit.daysOfVisit.indexOf('all');
            visit.daysOfVisit.splice(allIndex, 1);
        }
    }
    else {
        visit.daysOfVisit.splice(index, 1);
        if (hasAllSelected) {
            const allIndex = visit.daysOfVisit.indexOf('all');
            visit.daysOfVisit.splice(allIndex, 1);
        }
    }
    visit.daysOfVisit = [...visit.daysOfVisit];
};

const getSelectedDaysText = (selectedDays) => {
    if (!selectedDays || selectedDays.length === 0) return null;
    if (selectedDays.includes('all')) {
        return 'Tous les jours';
    }
    // Cas normal
    return selectedDays
        .filter(day => day !== 'all')
        .map(day => days[day])
        .join(', ');
};

const addVisit = () => {
    formData.value.visits.push({
        daysOfVisit: [],
        theoreticalVisitTimes: [
            {
                time: '',
                careTypeId: [],
            },
        ],
    });
};

const removeVisit = (visitIndex) => {
    formData.value.visits.splice(visitIndex, 1);
};

const addTimeSlot = (visitIndex) => {
    formData.value.visits[visitIndex].theoreticalVisitTimes.push({
        time: '',
        careTypeId: [],
    });
};

const removeTimeSlot = (visitIndex, timeIndex) => {
    formData.value.visits[visitIndex].theoreticalVisitTimes.splice(timeIndex, 1);
};

const handleCareTypeClick = (timeSlot, careTypeId) => {
    const index = timeSlot.careTypeId.indexOf(careTypeId);
    if (index === -1) {
        timeSlot.careTypeId.push(careTypeId);
    }
    else {
        timeSlot.careTypeId.splice(index, 1);
    }
    timeSlot.careTypeId = [...timeSlot.careTypeId];
};

const getSelectedCareTypesText = (selectedIds) => {
    return careTypes.value
        .filter(ct => selectedIds.includes(ct.id))
        .map(ct => ct.name)
        .join(', ');
};

const updatePatientCareTypes = () => {
    const careTypeSet = new Set();

    formData.value.visits.forEach((visit) => {
        visit.theoreticalVisitTimes.forEach((timeSlot) => {
            timeSlot.careTypeId.forEach((careTypeId) => {
                careTypeSet.add(careTypeId);
            });
        });
    });

    formData.value.patient_care_type = Array.from(careTypeSet).map(careTypeId => ({ careTypeId }));
};

const isCareInfoDialogOpen = ref(false);
const editableCareInformations = ref([]);

const openCareInfoDialog = () => {
    editableCareInformations.value = formData.value.care_informations.map(info => ({ ...info })) || [];
    isCareInfoDialogOpen.value = true;
};

const addNewCareInfo = () => {
    formData.value.care_informations.push({
        recordType: '',
        recordName: '',
        recordSeverity: '',
        recordDetails: '',
    });
};

const removeCareInfo = (index: number) => {
    formData.value.care_informations.splice(index, 1);
};

const cancelCareInfoEdit = () => {
    isCareInfoDialogOpen.value = false;
    editableCareInformations.value = [];
};

const saveCareInformations = async () => {
    try {
        await $apifetch(`/api/patients/care-informations/update`, {
            method: 'PUT',
            body: {
                care_informations: formData.value.care_informations.map(info => ({
                    recordType: info.recordType,
                    recordName: info.recordName,
                    recordSeverity: info.recordSeverity,
                    recordDetails: info.recordDetails,
                })),
                patientId: formData.value.patientId,
            },
        });

        isCareInfoDialogOpen.value = false;
        $toast({
            description: 'Informations de soins mises à jour avec succès',
        });
    }
    catch (error) {
        let errorMessage = 'Une erreur s\'est produite';

        if (error.response && error.response._data) {
            const responseData = error.response._data;

            if (responseData.message) {
                errorMessage = responseData.message;
            }
            else if (responseData.errors) {
                errorMessage = Object.values(responseData.errors)
                    .flat()
                    .join(', ');
            }
        }
        else if (error.message) {
            errorMessage = error.message;
        }

        $toast({
            description: `Erreur : ${errorMessage}`,
            variant: 'destructive',
        });
    }
};

const documentNote = ref('');
const isDocumentDialogOpen = ref(false);

const openFileUploadDialog = () => {
    isDocumentDialogOpen.value = !isDocumentDialogOpen.value;
};

const { loading: uploading, file, uploadFile } = useFile();

const handleUploadDocument = async () => {
    if (!file.value) {
        $toast({
            variant: 'destructive',
            description: 'Aucun fichier sélectionné.',
        });
        return;
    }

    const url = `/api/patients/documents/${patient.value.id}/upload`;

    await uploadFile({
        records: {
            note: documentNote.value,
        },
        url: url,
    }).then((response) => {
        patient.value.patient_documents.push(response.document);

        $toast({
            description: 'Fichier téléchargé avec succès',
        });

        isDocumentDialogOpen.value = false;
    });

    // patient.value.patient_documents.push(responseBody.document);
};

const removeDocument = (index: number, id: number) => {
    formData.value.patient_documents.splice(index, 1);
    deleteDocument(id);
};

const router = useRouter();

const {
    submit,
    inProgress,
} = useSubmit(
    async () => {
        updatePatientCareTypes();

        const dataToSubmit = {
            ...formData.value,
            visits: transformVisitsForApi(formData.value.visits),
        };

        await updatePatient(patient.value.id, dataToSubmit).then(() => {
            $toast({
                description: 'Mise à jour du patient avec succès',
            });

            setTimeout(() => {
                router.push('/dashboard/patients');
            }, 3000);
        });
    },
);

useHead({
    title: 'Profil patient',
});

onMounted(async () => {
    await fetchDetailPatient();
    await fetchCareTypes();
    initializeFormData();
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

watch(() => patient.value, () => {
    initializeFormData();
}, { deep: true });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});
</script>
