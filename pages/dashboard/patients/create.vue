<script setup lang="ts">
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

// Form validation schema
const schema = yup.object({
    lastname: yup
        .string()
        .min(2, 'Le nom doit comporter au moins 2 caractères')
        .required('Le nom est requis')
        .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne doit contenir que des lettres'),
    firstname: yup
        .string()
        .min(2, 'Le prénom doit comporter au moins 2 caractères')
        .required('Le prénom est requis')
        .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom ne doit contenir que des lettres'),
    email: yup
        .string()
        .email('L\'email doit être valide (exemple: nom@domaine.com)')
        .required('L\'email est requis'),
    socialSecurityNumber: yup
        .string()
        .matches(/^\d{6}-\d{3}-\d{2}$/, 'Format requis: 349089-666-55')
        .required('Le numéro de sécurité social est requis'),
    phoneNumber: yup
        .string()
        .matches(/^\d{8,12}$/, 'Le numéro doit contenir entre 8 et 12 chiffres'),
    zipCode: yup
        .string()
        .required('Le code postal est requis')
        .matches(/^\d+$/, 'Le code postal ne doit contenir que des chiffres')
        .max(7, 'Le code postal ne doit pas dépasser 7 caractères'),
    city: yup
        .string()
        .required('La ville est requise')
        .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, 'La ville ne doit contenir que des lettres'),
});

// Form state
const formData = ref({
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
});

const initialFormData = { ...formData.value };

// Validation state
const errors = reactive({
    lastname: '',
    firstname: '',
    email: '',
    socialSecurityNumber: '',
    phoneNumber: '',
    zipCode: '',
    city: '',
});

const touchedFields = reactive({
    lastname: false,
    firstname: false,
    email: false,
    socialSecurityNumber: false,
    phoneNumber: false,
    zipCode: false,
    city: false,
});

// Validation functions
const validateField = async (field: string) => {
    touchedFields[field] = true;
    try {
        await schema.validateAt(field, formData.value);
        errors[field] = '';
    }
    catch (err) {
        if (err instanceof yup.ValidationError) {
            errors[field] = err.message;
        }
    }
};

const validateForm = async () => {
    try {
        await schema.validate(formData.value, { abortEarly: false });
        return true;
    }
    catch (err) {
        if (err instanceof yup.ValidationError) {
            err.inner.forEach((error) => {
                if (error.path) {
                    errors[error.path] = error.message;
                    touchedFields[error.path] = true;
                }
            });
            $toast.error('Veuillez remplir tous les champs correctement');
        }
        return false;
    }
};

// Form submission
const { submit, inProgress } = useSubmit(async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
        updatePatientCareTypes();
        await createPatient(formData.value);

        formSubmitted.value = true;
        $toast.success('Création effectuée');

        setTimeout(() => {
            router.push('/dashboard/patients');
        }, 3000);
    }
    catch (error) {
        console.error('Erreur API :', error);
        handleApiError(error);
    }
});

const handleApiError = (error) => {
    if (error.data?.errors) {
        const errorMessages = Object.values(error.data.errors).flat();
        if (errorMessages.length > 0) {
            $toast.error(errorMessages.join('\n'));
        }
    }
    else {
        $toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
};

// Navigation handling
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

// Form data handling
const availabilities = {
    available: 'Disponible',
    unavailable: 'Indisponible',
    absent: 'Absent',
    hospitalized: 'Hospitalisé',
    on_vacation: 'En vacances',
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

// Lifecycle hooks
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

// Meta
useHead({
    title: 'Créer un patient',
});

definePageMeta({
    layout: 'dashboard',
    middleware: 'verified',
    ssr: false,
});
</script>

<template>
    <div class="px-4 sm:px-16 md:px-0">
        <form @submit="submit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                <div class="space-y-8 md:space-y-6">
                    <div class="space-y-4">
                        <div>
                            <h3 class="p-2 bg-primary text-white rounded-t">
                                Date de début d'intervention
                            </h3>
                            <div class="bg-gray-100 p-4">
                                <div class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52">
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

                    <!-- Form fields with validation -->
                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="lastname">Nom</label>
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
                            v-if="touchedFields.lastname && errors.lastname"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ errors.lastname }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="firstname">Prénom</label>
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
                            v-if="touchedFields.firstname && errors.firstname"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ errors.firstname }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="socialSecurityNumber">Sécurité sociale</label>
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
                            v-if="touchedFields.socialSecurityNumber && errors.socialSecurityNumber"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ errors.socialSecurityNumber }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="email">Email</label>
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
                            v-if="touchedFields.email && errors.email"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ errors.email }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="phoneNumber">Téléphone</label>
                        </div>
                        <Input
                            id="phoneNumber"
                            v-model="formData.phoneNumber"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="08 67 56 54 32"
                            @blur="validateField('phoneNumber')"
                            @input="validateField('phoneNumber')"
                        />
                        <p
                            v-if="touchedFields.phoneNumber && errors.phoneNumber"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ errors.phoneNumber }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="zipCode">Code postal</label>
                        </div>
                        <Input
                            id="zipCode"
                            v-model="formData.zipCode"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="09866"
                            @blur="validateField('zipCode')"
                            @input="validateField('zipCode')"
                        />
                        <p
                            v-if="touchedFields.zipCode && errors.zipCode"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ errors.zipCode }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="city">Ville</label>
                        </div>
                        <Input
                            id="city"
                            v-model="formData.city"
                            type="text"
                            class="w-full bg-transparent"
                            placeholder="Wallon"
                            @blur="validateField('city')"
                            @input="validateField('city')"
                        />
                        <p
                            v-if="touchedFields.city && errors.city"
                            class="text-red-500 text-nowrap text-xs my-1 ms-[105%]"
                        >
                            {{ errors.city }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 xl:grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                        <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                            <label for="availability">Disponibilité</label>
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
                </div>

                <!-- Visits section -->
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
                                                    <span class="text-black/60">Sélectionner un jour</span>
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
                                                        <span class="text-black/60">Sélectionner un type de soin</span>
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
                                                        <label class="text-xs text-nowrap cursor-pointer">{{ careType.name }}</label>
                                                    </div>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <p
                                    class="w-48 ml-auto flex justify-end text-primary mt-8 cursor-pointer items-center space-x-3"
                                    @click="addTimeSlot(visitIndex)"
                                >
                                    <PlusIcon class="w-6" />
                                    <span>Nouvelle visite</span>
                                </p>
                            </div>
                        </div>

                        <Button
                            class="flex justify-center items-center mx-auto mt-4"
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

            <!-- Navigation dialog -->
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
        </form>
    </div>
</template>
