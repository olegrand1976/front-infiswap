<template>
    <div class="px-4 sm:px-16 md:px-0">
        <Form @submit="submit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                <div class="space-y-8 md:space-y-6">
                    <div class="flex gap-4">
                        <div>
                            <h3 class="p-2 bg-primary text-white rounded-t">
                                Date de début d'intervention
                            </h3>
                            <div class="bg-gray-100 p-4">
                                <div
                                    class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52"
                                >
                                    <CalendarDaysIcon class="w-5" />
                                    <Input
                                        v-model="formData.careStartDate"
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
                                <div
                                    class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52"
                                >
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

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="lastname">
                                Nom
                            </label>
                        </div>
                        <Input
                            id="lastname"
                            v-model="formData.lastname"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="Doe"
                            @blur="validateField('lastname')"
                            @input="validateField('lastname')"
                        />
                        <p
                            v-if="error.lastname"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ error.lastname }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="firstname">
                                Prénoms
                            </label>
                        </div>
                        <Input
                            id="firstname"
                            v-model="formData.firstname"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="John"
                            @blur="validateField('firstname')"
                            @input="validateField('firstname')"
                        />
                        <p
                            v-if="error.firstname"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ error.firstname }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="socialSecurityNumber">
                                NISS
                            </label>
                        </div>
                        <Input
                            id="socialSecurityNumber"
                            v-model="formData.socialSecurityNumber"
                            type="text"
                            placeholder="880603-123-56"
                            class="w-full bg-transparent"
                            @blur="validateField('socialSecurityNumber')"
                            @input="validateField('socialSecurityNumber')"
                        />
                        <p
                            v-if="error.socialSecurityNumber"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ error.socialSecurityNumber }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="email">
                                Email
                            </label>
                        </div>
                        <Input
                            id="email"
                            v-model="formData.email"
                            type="email"
                            class="w-full bg-transparent"
                            placeholder="johndoe@gmail.com"
                            @blur="validateField('email')"
                            @input="validateField('email')"
                        />
                        <p
                            v-if="error.email"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ error.email }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="phoneNumber">
                                Téléphone
                            </label>
                        </div>
                        <Input
                            id="phoneNumber"
                            v-model="formData.phoneNumber"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="0499123456"
                            @blur="validateField('phoneNumber')"
                            @input="validateField('phoneNumber')"
                        />
                        <p
                            v-if="error.phoneNumber"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ error.phoneNumber }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="zipCode">
                                Code postal
                            </label>
                        </div>
                        <Input
                            id="zipCode"
                            v-model="formData.zipCode"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="1000"
                            @blur="validateField('zipCode')"
                            @input="validateField('zipCode')"
                        />
                        <p
                            v-if="error.zipCode"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ error.zipCode }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="city">
                                Ville
                            </label>
                        </div>
                        <Input
                            id="city"
                            v-model="formData.city"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="Bruxelles"
                            @blur="validateField('city')"
                            @input="validateField('city')"
                        />
                        <p
                            v-if="error.city"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ error.city }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div
                            class="bg-primary flex items-center text-white ps-4 rounded-s-full"
                            title="Un patient hospitalisé? Passez-le en indisponible."
                        >
                            <label for="Availabilitie">
                                Disponibilité
                            </label>
                        </div>
                        <Select v-model="formData.availability">
                            <SelectTrigger
                                class="w-full bg-transparent text-nowrap border border-none"
                                position="right"
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent class="border border-none">
                                <template
                                    v-for="[key, value] in Object.entries(availabilities)"
                                    :key="key"
                                >
                                    <SelectItem :value="key">
                                        {{ value }}
                                    </SelectItem>
                                </template>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="Genre">
                                Genre
                            </label>
                        </div>
                        <Select v-model="formData.genre">
                            <SelectTrigger
                                class="w-full bg-transparent text-nowrap border border-none"
                                position="right"
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent class="border border-none">
                                <template
                                    v-for="[key, value] in Object.entries(gender)"
                                    :key="key"
                                >
                                    <SelectItem :value="key">
                                        {{ value }}
                                    </SelectItem>
                                </template>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="flex flex-col">
                    <div class="flex flex-col space-y-4">
                        <div
                            v-for="(visit, visitIndex) in formData.visits"
                            :key="visitIndex"
                            class="relative"
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
                                                    <label class="text-xs text-nowrap cursor-pointer">{{ value
                                                    }}</label>
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
                                            input-class="rounded-full"
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
                                                <SelectValue class="truncate w-[38rem]">
                                                    <template v-if="getSelectedCareTypesText(timeSlot.careTypeId)">
                                                        {{ getSelectedCareTypesText(timeSlot.careTypeId) }}
                                                    </template>
                                                    <template v-else>
                                                        <span class="text-black/60">
                                                            Sélectionner un type de soin
                                                        </span>
                                                    </template>
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

                                <p
                                    class="w-48 ml-auto flex justify-start text-primary mt-8 cursor-pointer items-center space-x-3"
                                    @click="addTimeSlot(visitIndex)"
                                >
                                    <PlusIcon class="w-6" />
                                    <span>
                                        Nouvelle visite
                                    </span>
                                </p>
                            </div>
                        </div>

                        <Button
                            class="flex justify-end items-center mx-auto mt-4"
                            type="button"
                            @click="addVisit"
                        >
                            <PlusIcon class="w-5 h-5 mr-2" />
                            <span>Ajouter un autre jour</span>
                        </Button>
                    </div>
                </div>
            </div>

            <Button
                class="my-12 w-80 flex justify-center items-center mx-auto"
                type="submit"
                :in-progress="inProgress"
            >
                Enregistrer
            </Button>

            <Dialog v-model:open="isOpen">
                <DialogContent class="h-[28vh]">
                    <DialogHeader>
                        <DialogTitle>Confirmation</DialogTitle>
                        <DialogDescription>
                            Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?
                        </DialogDescription>
                    </DialogHeader>

                    <div class="flex space-x-8 justify-end items-center">
                        <Button
                            variant="secondary"
                            @click="closeDialog"
                        >
                            Annuler
                        </Button>
                        <Button @click="confirmNavigation">
                            Oui
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import { useRouter, onBeforeRouteLeave } from 'vue-router';

import * as yup from 'yup';

import { CalendarDaysIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { InputTime } from '@/components/ui/input-time';
import { useCareTypes } from '~/composables/useCareTypes';
import { createPatient } from '~/composables/usePatients';

const { careTypes, fetchCareTypes } = useCareTypes();
const router = useRouter();
const user = useState('user');
const { $toast } = useNuxtApp();

const isOpen = ref(false);
const pendingRoute = ref(null);
const allowNavigation = ref(false);
const formSubmitted = ref(false);

const openDialog = (to) => {
    pendingRoute.value = to;
    isOpen.value = true;
};

const closeDialog = () => {
    isOpen.value = false;
    pendingRoute.value = null;
    allowNavigation.value = false;
};

const confirmNavigation = async () => {
    allowNavigation.value = true;
    isOpen.value = false;

    if (pendingRoute.value) {
        await navigateToRoute();
    }
};

const navigateToRoute = async () => {
    try {
        await router.push(pendingRoute.value);
        pendingRoute.value = null;
        allowNavigation.value = false;
    }
    catch (error) {
        console.error('Navigation error:', error);
    }
};

const availabilities = {
    available: 'Disponible',
    unavailable: 'Indisponible',
    absent: 'Absent',
    hospitalized: 'Hospitalisé',
    on_vacation: 'En vacances',
};

const gender = {
    homme: 'Homme',
    femme: 'Femme',
    x: 'X',
};

const initialFormData = {
    nurseId: user.value.nurse.id,
    lastname: '',
    firstname: '',
    email: '',
    socialSecurityNumber: '',
    phoneNumber: '',
    zipCode: '',
    city: '',
    careStartDate: '',
    careEndDate: '',
    availability: 'available',
    genre: '',
    care_informations: [],
    visits: [
        {
            daysOfVisit: [],
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
};

const formData = ref({ ...initialFormData });

const error = reactive({
    lastname: '',
    firstname: '',
    email: '',
    socialSecurityNumber: '',
    phoneNumber: '',
    zipCode: '',
    city: '',
});

const schema = yup.object({
    lastname: yup.string()
        .required('Le nom est requis')
        .min(2, 'Le nom doit comporter au moins 2 caractères'),

    firstname: yup.string()
        .required('Le prénom est requis')
        .min(2, 'Le prénom doit comporter au moins 2 caractères'),

    email: yup.string()
        .required('L\'email est requis')
        .email('L\'email doit être valide'),

    socialSecurityNumber: yup.string()
        .required('Le numéro de sécurité social est requis')
        .matches(/^\d{6}-\d{3}-\d{2}$/, 'Format valide: 880603-123-56'),

    phoneNumber: yup.string()
        .required('Le téléphone est requis')
        .matches(/^(?:\d\s*){8,12}$/, '8 à 12 chiffres requis'),

    zipCode: yup.string()
        .required('Le code postal est requis')
        .max(7, 'Maximum 7 caractères'),

    city: yup.string()
        .required('La ville est requise'),
});

// Modifier la fonction validateField
const validateField = async (field: string) => {
    try {
        error[field] = '';
        await schema.validateAt(field, formData.value);
    }
    catch (err) {
        const errorMessage = (err as yup.ValidationError).message;

        // Ne pas afficher 'required' si le champ est en cours de remplissage
        if (formData.value[field as keyof typeof formData.value] !== '' || errorMessage.includes('requis')) {
            error[field] = errorMessage;
        }
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

const toggleDaySelection = (visit, day) => {
    const index = visit.daysOfVisit.indexOf(day);
    if (index === -1) {
        visit.daysOfVisit.push(day);
    }
    else {
        visit.daysOfVisit.splice(index, 1);
    }
    visit.daysOfVisit = [...visit.daysOfVisit];
};

const getSelectedDaysText = (selectedDays) => {
    return selectedDays.map(day => days[day]).join(', ');
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

const { submit, inProgress } = useSubmit(async () => {
    try {
        await schema.validate(formData.value, { abortEarly: false });
        updatePatientCareTypes();
        return createPatient(formData.value).then(() => {
            formSubmitted.value = true;
            $toast({
                description: 'Création effectuée',
            });

            setTimeout(() => {
                router.push('/dashboard/patients');
            }, 3000);
        }).catch((error) => {
            console.error('Erreur API :', error);

            if (error.data && error.data.errors) {
                const backendErrors = error.data.errors;
                const errorMessages: string[] = [];

                Object.keys(backendErrors).forEach((field) => {
                    backendErrors[field].forEach((message: string) => {
                        errorMessages.push(message);
                    });
                });

                if (errorMessages.length > 0) {
                    $toast({
                        description: errorMessages.join('<br>'),
                        status: 'error',
                        variant: 'destructive',
                    });
                }
            }
            else {
                $toast({
                    description: 'Une erreur est survenue. Veuillez réessayer.',
                    status: 'error',
                    variant: 'destructive',
                });
            }
        });
    }
    catch (err) {
        if (err instanceof yup.ValidationError) {
            err.inner.forEach((e) => {
                error[e.path] = e.message;
            });

            const hasEmptyFields = Object.values(error).some(msg => msg.includes('est requis'));

            if (hasEmptyFields) {
                $toast({
                    description: 'Veuillez remplir tous les champs obligatoires',
                    status: 'error',
                    variant: 'destructive',
                });
            }
        }
    }
});

onMounted(() => {
    fetchCareTypes();
});

onBeforeRouteLeave((to, from, next) => {
    if (formSubmitted.value) {
        next();
        return;
    }

    if (hasUnsavedChanges() && !allowNavigation.value) {
        openDialog(to.fullPath);
        next(false);
        return;
    }
    next();
});

const hasUnsavedChanges = () => {
    return JSON.stringify(formData.value) !== JSON.stringify(initialFormData);
};

useHead({
    title: 'Créer un patient',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified', 'subscribed'],
    ssr: false,
});
</script>
