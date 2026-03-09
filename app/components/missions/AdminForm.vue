<template>
    <form
        class="mb-12"
        @submit.prevent="submit"
        @keydown.ctrl.enter="submit"
    >
        <Separator class="my-4 lg:my-10" />

        <div class="mt-8 grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    {{ mission?.id ? 'Mettre à jour la mission' : 'Nouvelle mission' }}
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations essentielles
                </p>
                <p class="mt-4 text-xs text-gray-400">
                    💡 Astuce : Ctrl+Entrée pour publier rapidement
                </p>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-6">
                <div class="space-y-3 border-b pb-4">
                    <label class="text-gray-500 font-medium">
                        Template de mission <span class="text-gray-400 text-sm">(optionnel)</span>
                    </label>
                    <div class="flex gap-2 items-center">
                        <Select
                            v-model="selectedTemplateId"
                            class="flex-1"
                            @update:model-value="loadTemplate"
                        >
                            <SelectTrigger
                                class="flex w-full space-x-4 text-sm justify-start items-center rounded-md border-2 border-gray-300"
                                position="right"
                            >
                                <SelectValue
                                    placeholder="Sélectionner un template ou saisir manuellement"
                                    class="text-nowrap w-full text-sm ml-3 my-auto"
                                />
                            </SelectTrigger>
                            <SelectContent class="border border-none">
                                <SelectGroup>
                                    <SelectItem
                                        v-for="template in missionTemplates"
                                        :key="template.id"
                                        :value="template.id"
                                    >
                                        <span class="xl:text-sm sm:text-xs">{{ template.name }}</span>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="space-y-3">
                    <label class="text-gray-500 font-medium">
                        Service <span class="text-red-500">*</span>
                    </label>
                    <div class="flex gap-2 items-center">
                        <Select
                            v-model="formData.service_id"
                            :disabled="dataServices.length === 0 && !showServiceModal"
                            class="flex-1"
                        >
                            <SelectTrigger
                                class="flex w-full space-x-4 text-sm justify-start items-center rounded-md border-2"
                                :class="errors.service_id ? 'border-red-300' : 'border-gray-300'"
                                position="right"
                            >
                                <BriefcaseIcon class="text-gray-500 w-5 h-5" />
                                <SelectValue
                                    :placeholder="dataServices.length === 0 ? 'Aucun service disponible' : 'Sélectionner un service'"
                                    class="text-nowrap w-full text-sm ml-3 my-auto"
                                />
                            </SelectTrigger>
                            <SelectContent class="border border-none">
                                <SelectGroup>
                                    <div
                                        v-for="service in dataServices"
                                        :key="service.id"
                                        class="flex justify-center items-center -ms-3"
                                    >
                                        <SelectItem :value="service.id">
                                            <span class="xl:text-sm sm:text-xs">{{ service.name }}</span>
                                        </SelectItem>
                                    </div>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            class="whitespace-nowrap"
                            @click="showServiceModal = true"
                        >
                            <PlusIcon class="w-4 h-4 mr-1" />
                            Nouveau
                        </Button>
                    </div>
                    <p
                        v-if="errors.service_id"
                        class="text-sm text-red-500"
                    >
                        {{ errors.service_id }}
                    </p>
                </div>

                <div class="grid sm:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-gray-500 font-medium">
                            Date de début <span class="text-red-500">*</span>
                        </label>
                        <InputIcon
                            v-model="startDate"
                            type="date"
                            rounded="md"
                            placeholder="Date de début"
                            :class="errors.start_date ? 'border-red-300' : ''"
                        />
                        <p
                            v-if="errors.start_date"
                            class="text-sm text-red-500"
                        >
                            {{ errors.start_date }}
                        </p>
                    </div>
                    <div class="space-y-2">
                        <label class="text-gray-500 font-medium">
                            Date de fin <span class="text-gray-400 text-sm">(optionnel)</span>
                        </label>
                        <InputIcon
                            v-model="endDate"
                            type="date"
                            rounded="md"
                            placeholder="Date de fin"
                            :min="startDate"
                            :class="errors.end_date ? 'border-red-300' : ''"
                        />
                        <p
                            v-if="errors.end_date"
                            class="text-sm text-red-500"
                        >
                            {{ errors.end_date }}
                        </p>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-gray-500 font-medium">
                        Horaire <span class="text-red-500">*</span>
                    </label>
                    <div class="flex gap-4 items-center">
                        <div class="flex-1">
                            <InputTime
                                v-model="formData.time_start_at"
                                class="w-full"
                                input-class="rounded-md"
                                :class="errors.time_start_at ? 'border-red-300' : ''"
                            />
                        </div>
                        <span class="text-gray-500">à</span>
                        <div class="flex-1">
                            <InputTime
                                v-model="formData.time_end_at"
                                class="w-full"
                                input-class="rounded-md"
                                :class="errors.time_end_at ? 'border-red-300' : ''"
                            />
                        </div>
                    </div>
                    <p
                        v-if="errors.time_start_at || errors.time_end_at"
                        class="text-sm text-red-500"
                    >
                        {{ errors.time_start_at || errors.time_end_at }}
                    </p>
                </div>

                <div class="space-y-2">
                    <label class="text-gray-500 font-medium">
                        Diplôme requis <span class="text-red-500">*</span>
                    </label>
                    <Select
                        v-model="selectedDiploma"
                        @update:model-value="handleDiplomaChange"
                    >
                        <SelectTrigger
                            class="flex w-full space-x-4 text-sm justify-start items-center rounded-md border-2"
                            :class="errors.required_diploma ? 'border-red-300' : 'border-gray-300'"
                            position="right"
                        >
                            <SelectValue
                                :placeholder="formData.required_diploma || 'Sélectionner un diplôme'"
                                class="text-nowrap w-full text-sm ml-3 my-auto"
                            />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup>
                                <SelectItem value="__custom__">
                                    <span class="text-gray-400">Autre (saisie libre)</span>
                                </SelectItem>
                                <SelectItem
                                    v-for="diploma in commonDiplomas"
                                    :key="diploma"
                                    :value="diploma"
                                >
                                    <span class="xl:text-sm sm:text-xs">{{ diploma }}</span>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <InputIcon
                        v-if="showCustomDiploma"
                        v-model="formData.required_diploma"
                        rounded="md"
                        placeholder="Saisir le diplôme requis"
                        class="mt-2"
                        :class="errors.required_diploma ? 'border-red-300' : ''"
                    />
                    <p
                        v-if="errors.required_diploma"
                        class="text-sm text-red-500"
                    >
                        {{ errors.required_diploma }}
                    </p>
                </div>

                <div class="space-y-2">
                    <label class="text-gray-500 font-medium">
                        Description <span class="text-gray-400 text-sm">(optionnel)</span>
                    </label>
                    <Textarea
                        v-model="formData.description"
                        :rows="3"
                        class="w-full border border-gray-300 rounded-md focus-within:border-primary focus-within:border-2"
                        placeholder="Ajoutez des détails supplémentaires si nécessaire..."
                    />
                </div>

                <Separator class="my-2" />

                <div class="flex justify-between items-center">
                    <p class="text-xs text-gray-400">
                        * Champs obligatoires
                    </p>
                    <div class="flex items-center gap-4">
                        <label
                            v-if="!mission?.id && canSaveAsTemplate"
                            class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                        >
                            <Checkbox
                                id="save-as-template"
                                v-model:checked="saveAsTemplate"
                            />
                            <span class="flex items-center gap-1">
                                <BookmarkIcon class="w-4 h-4" />
                                Enregistrer comme template
                            </span>
                        </label>
                        <Button
                            type="submit"
                            class="rounded-md px-8"
                            :in-progress="inProgress"
                        >
                            {{ mission?.id ? 'Mettre à jour' : 'Publier la mission' }}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <Dialog v-model:open="showSaveTemplateModal">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>Enregistrer comme template</DialogTitle>
                    <DialogDescription>
                        Donnez un nom à ce template pour le réutiliser plus tard.
                    </DialogDescription>
                </DialogHeader>
                <form
                    class="mt-4 space-y-4"
                    @submit.prevent="saveTemplate"
                >
                    <InputIcon
                        v-model="templateName"
                        rounded="md"
                        label="Nom du template *"
                        placeholder="Ex: Mission soins à domicile"
                        :icon="BookmarkIcon"
                        required
                    />
                    <div class="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            @click="showSaveTemplateModal = false; templateName = ''"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            :in-progress="isSavingTemplate"
                        >
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showServiceModal">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Créer un service rapidement</DialogTitle>
                    <DialogDescription>
                        Remplissez au minimum le nom du service. Les autres informations peuvent être ajoutées plus tard.
                    </DialogDescription>
                </DialogHeader>
                <form
                    class="mt-4 space-y-4"
                    @submit.prevent="createServiceQuick"
                >
                    <InputIcon
                        v-model="quickServiceForm.name"
                        rounded="md"
                        label="Nom du service *"
                        placeholder="Ex: Service de soins à domicile"
                        :icon="BriefcaseIcon"
                        required
                    />
                    <InputIcon
                        v-model="quickServiceForm.phoneNumber"
                        rounded="md"
                        label="Téléphone *"
                        placeholder="Optionnel"
                        :icon="PhoneIcon"
                    />
                    <div class="grid sm:grid-cols-2 gap-4">
                        <InputIcon
                            v-model="quickServiceForm.address.street"
                            rounded="md"
                            label="Rue"
                            placeholder="Optionnel"
                            :icon="MapPinIcon"
                        />
                        <InputIcon
                            v-model="quickServiceForm.address.zipCode"
                            rounded="md"
                            label="Code postal"
                            placeholder="Optionnel"
                            :icon="InboxArrowDownIcon"
                        />
                    </div>
                    <div class="grid sm:grid-cols-2 gap-4">
                        <InputIcon
                            v-model="quickServiceForm.address.city"
                            rounded="md"
                            label="Ville"
                            placeholder="Optionnel"
                            :icon="BuildingOffice2Icon"
                        />
                        <InputIcon
                            v-model="quickServiceForm.address.country"
                            rounded="md"
                            label="Pays"
                            placeholder="Optionnel"
                            :icon="MapPinIcon"
                        />
                    </div>
                    <div class="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            @click="showServiceModal = false"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            :in-progress="isCreatingService"
                        >
                            Créer et utiliser
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </form>
</template>

<script lang="ts" setup>
import {
    BriefcaseIcon,
    PlusIcon,
    PhoneIcon,
    MapPinIcon,
    InboxArrowDownIcon,
    BuildingOffice2Icon,
    BookmarkIcon,
} from '@heroicons/vue/24/outline';
import type { Mission, User } from '~/lib/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'vue-sonner';

const props = defineProps({
    mission: {
        type: Object as PropType<Mission>,
        default: () => ({
            id: undefined,
            institution_id: undefined,
            service_id: undefined,
            start_date: '',
            end_date: '',
            time_start_at: '',
            time_end_at: '',
            description: '',
            status: '',
            required_diploma: '',
        }),
    },
});

const user = useState<User>('user');
const { create, update } = useMissions();
const { getAll, services, create: createService } = useInstitutionServices();
const { getAll: getAllTemplates, templates: templatesState, create: createTemplate, getById: getTemplateById } = useMissionTemplates();

const dataServices = computed(() => services.value.data ?? []);
const missionTemplates = computed(() => {
    if (Array.isArray(templatesState.value)) {
        return templatesState.value;
    }
    if (templatesState.value?.data && Array.isArray(templatesState.value.data)) {
        return templatesState.value.data;
    }
    return [];
});
const showServiceModal = ref(false);
const isCreatingService = ref(false);
const selectedTemplateId = ref<string | number | null>(null);
const showSaveTemplateModal = ref(false);
const templateName = ref('');
const isSavingTemplate = ref(false);
const saveAsTemplate = ref(false);

const commonDiplomas = [
    'IDE (Infirmier Diplômé d\'État)',
    'IADE (Infirmier Anesthésiste)',
    'IBODE (Infirmier de Bloc Opératoire)',
    'Puéricultrice',
    'Cadre de santé',
    'Aide-soignant(e)',
    'Auxiliaire de puériculture',
    'Sage-femme',
    'Infirmier(e) spécialisé(e)',
    'Autre',
];

await getAll(1, 50);
await getAllTemplates();

const { $toast } = useNuxtApp();

const errors = reactive({
    service_id: '',
    start_date: '',
    end_date: '',
    time_start_at: '',
    time_end_at: '',
    required_diploma: '',
});

const quickServiceForm = reactive({
    name: '',
    phoneNumber: '',
    address: {
        street: '',
        city: '',
        zipCode: '',
        country: '',
        additionnalInformation: '',
    },
});

const getDefaultStartDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getDefaultTime = () => {
    return {
        start: '08:00',
        end: '17:00',
    };
};

const getLastUsedService = () => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return undefined;
    }
    const lastMission = localStorage.getItem('lastMission');
    if (lastMission) {
        try {
            const parsed = JSON.parse(lastMission);
            return parsed.service_id;
        }
        catch {
            return undefined;
        }
    }
    return undefined;
};

const getLastUsedTimes = () => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return { start: '08:00', end: '17:00' };
    }
    const lastMission = localStorage.getItem('lastMission');
    if (lastMission) {
        try {
            const parsed = JSON.parse(lastMission);
            return {
                start: parsed.time_start_at || '08:00',
                end: parsed.time_end_at || '17:00',
            };
        }
        catch {
            return { start: '08:00', end: '17:00' };
        }
    }
    return { start: '08:00', end: '17:00' };
};

const lastTimes = getLastUsedTimes();
const lastServiceId = getLastUsedService();

const formData = reactive({
    ...props.mission,
    start_date: props.mission?.start_date || getDefaultStartDate(),
    time_start_at: props.mission?.time_start_at || lastTimes.start,
    time_end_at: props.mission?.time_end_at || lastTimes.end,
    service_id: props.mission?.service_id || lastServiceId || (dataServices.value.length === 1 ? dataServices.value[0].id : undefined),
    required_diploma: props.mission?.required_diploma || '',
});

const getInitialDiploma = () => {
    const diploma = props.mission?.required_diploma || formData.required_diploma || '';
    if (diploma && commonDiplomas.includes(diploma)) {
        return diploma;
    }
    return diploma ? '__custom__' : '';
};

const selectedDiploma = ref(getInitialDiploma());

const showCustomDiploma = computed(() => {
    return selectedDiploma.value === '__custom__'
        || (formData.required_diploma && !commonDiplomas.includes(formData.required_diploma));
});

const handleDiplomaChange = (value: string) => {
    if (value === '__custom__') {
        formData.required_diploma = '';
        selectedDiploma.value = '__custom__';
    }
    else {
        formData.required_diploma = value;
        selectedDiploma.value = value;
    }
};

watch(() => formData.required_diploma, (newVal) => {
    if (newVal && commonDiplomas.includes(newVal) && selectedDiploma.value !== newVal) {
        selectedDiploma.value = newVal;
    }
    else if (newVal && !commonDiplomas.includes(newVal) && selectedDiploma.value !== '__custom__') {
        selectedDiploma.value = '__custom__';
    }
});

watch(() => props.mission, (newVal) => {
    if (newVal?.id) {
        Object.assign(formData, newVal);
    }
}, { deep: true });

watch(() => dataServices.value, (newServices) => {
    if (newServices.length === 1 && !formData.service_id && !props.mission?.id) {
        formData.service_id = newServices[0].id;
    }
}, { immediate: true });

const validateForm = () => {
    Object.keys(errors).forEach((key) => {
        errors[key] = '';
    });

    let isValid = true;

    if (!formData.service_id) {
        errors.service_id = 'Veuillez sélectionner ou créer un service';
        isValid = false;
    }

    if (!formData.start_date) {
        errors.start_date = 'La date de début est requise';
        isValid = false;
    }
    else {
        const startDate = new Date(formData.start_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate < today) {
            errors.start_date = 'La date de début ne peut pas être dans le passé';
            isValid = false;
        }
    }

    if (formData.end_date && formData.start_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        if (endDate < startDate) {
            errors.end_date = 'La date de fin doit être après la date de début';
            isValid = false;
        }
    }

    if (!formData.time_start_at) {
        errors.time_start_at = 'L\'heure de début est requise';
        isValid = false;
    }

    if (!formData.time_end_at) {
        errors.time_end_at = 'L\'heure de fin est requise';
        isValid = false;
    }

    if (formData.time_start_at && formData.time_end_at) {
        const [startHour, startMin] = formData.time_start_at.split(':').map(Number);
        const [endHour, endMin] = formData.time_end_at.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        if (endMinutes <= startMinutes) {
            errors.time_end_at = 'L\'heure de fin doit être après l\'heure de début';
            isValid = false;
        }
    }

    if (!formData.required_diploma || formData.required_diploma.trim() === '') {
        errors.required_diploma = 'Le diplôme requis est obligatoire';
        isValid = false;
    }

    return isValid;
};

const createServiceQuick = async () => {
    if (!quickServiceForm.name.trim()) {
        $toast({
            description: 'Le nom du service est requis',
            status: 'error',
            variant: 'destructive',
        });
        return;
    }

    isCreatingService.value = true;
    try {
        const payload = {
            name: quickServiceForm.name,
            phoneNumber: quickServiceForm.phoneNumber || undefined,
            address: quickServiceForm.address,
        };

        const newService = await createService(payload);

        if (newService?.data) {
            await getAll(1, 50);
            formData.service_id = newService.data.id;
            showServiceModal.value = false;

            quickServiceForm.name = '';
            quickServiceForm.phoneNumber = '';
            quickServiceForm.address = {
                street: '',
                city: '',
                zipCode: '',
                country: '',
                additionnalInformation: '',
            };

            $toast({
                description: 'Service créé avec succès',
            });
        }
    }
    catch (err) {
        if (err.data?.errors) {
            const firstError = Object.values(err.data.errors)[0][0];
            $toast({
                description: firstError,
                status: 'error',
                variant: 'destructive',
            });
        }
    }
    finally {
        isCreatingService.value = false;
    }
};

function toDateLocal(value?: string | null) {
    if (!value) return null;

    const date = new Date(value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function fromDateLocal(value?: string | null) {
    if (!value) return null;

    return value;
}

const startDate = computed({
    get() {
        return toDateLocal(formData.start_date);
    },
    set(value) {
        formData.start_date = fromDateLocal(value);
    },
});

const endDate = computed({
    get() {
        return toDateLocal(formData.end_date);
    },
    set(value) {
        formData.end_date = fromDateLocal(value);
    },
});

const canSaveAsTemplate = computed(() => {
    return !props.mission?.id && formData.service_id && formData.time_start_at && formData.time_end_at && formData.required_diploma;
});

const loadTemplate = async (templateId: string | number | null) => {
    if (!templateId) {
        return;
    }

    try {
        const response = await getTemplateById(Number(templateId));
        const template = response?.data || response;

        if (template) {
            formData.service_id = template.service_id || formData.service_id;
            formData.time_start_at = template.time_start_at || formData.time_start_at;
            formData.time_end_at = template.time_end_at || formData.time_end_at;
            formData.description = template.description || '';
            formData.required_diploma = template.required_diploma || '';

            // Update selected diploma
            if (template.required_diploma && commonDiplomas.includes(template.required_diploma)) {
                selectedDiploma.value = template.required_diploma;
            }
            else if (template.required_diploma) {
                selectedDiploma.value = '__custom__';
            }

            toast.success('Template chargé avec succès');
        }
    }
    catch (err: any) {
        console.error('Erreur lors du chargement du template:', err);
        $toast({
            description: err?.message || 'Erreur lors du chargement du template',
            status: 'error',
            variant: 'destructive',
        });
    }
};

const saveTemplate = async () => {
    if (!templateName.value.trim()) {
        $toast({
            description: 'Le nom du template est requis',
            status: 'error',
            variant: 'destructive',
        });
        return;
    }

    if (!canSaveAsTemplate.value) {
        $toast({
            description: 'Veuillez remplir les champs obligatoires avant de sauvegarder comme template',
            status: 'error',
            variant: 'destructive',
        });
        return;
    }

    isSavingTemplate.value = true;
    try {
        const templateData = {
            name: templateName.value.trim(),
            service_id: formData.service_id,
            time_start_at: formData.time_start_at,
            time_end_at: formData.time_end_at,
            description: formData.description || null,
            required_diploma: formData.required_diploma || null,
        };

        await createTemplate(templateData);

        $toast({
            description: 'Template enregistré avec succès',
        });

        showSaveTemplateModal.value = false;
        templateName.value = '';
        selectedTemplateId.value = null;
        saveAsTemplate.value = false;

        resetForm();
        await navigateTo('/dashboard/institution/missions');
    }
    catch (err: any) {
        if (err.data?.errors) {
            const firstError = Object.values(err.data.errors)[0][0];
            $toast({
                description: firstError,
                status: 'error',
                variant: 'destructive',
            });
        }
        else {
            $toast({
                description: 'Erreur lors de l\'enregistrement du template',
                status: 'error',
                variant: 'destructive',
            });
        }
    }
    finally {
        isSavingTemplate.value = false;
    }
};

const resetForm = () => {
    Object.assign(formData, {
        start_date: '',
        end_date: '',
        time_start_at: '',
        time_end_at: '',
        description: '',
        required_diploma: '',
        service_id: undefined,
    });
    selectedTemplateId.value = null;
};

const router = useRouter();

const { submit, inProgress } = useSubmit(async () => {
    if (!validateForm()) {
        $toast({
            description: 'Veuillez corriger les erreurs dans le formulaire',
            status: 'error',
            variant: 'destructive',
        });
        return;
    }

    try {
        if (formData.id == undefined) {
            formData.institution_id = user.value.institution.id;
            const response = await create(formData);

            if (response?.data && typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('lastMission', JSON.stringify({
                    service_id: formData.service_id,
                    time_start_at: formData.time_start_at,
                    time_end_at: formData.time_end_at,
                }));
            }

            $toast({
                description: 'Mission créée avec succès',
            });

            // Si la checkbox "Enregistrer comme template" est cochée, ouvrir le modal
            if (saveAsTemplate.value) {
                showSaveTemplateModal.value = true;
                // Ne pas reset le formulaire ni naviguer, attendre la sauvegarde du template
            }
            else {
                resetForm();
                await navigateTo('/dashboard/institution/missions');
            }
        }
        else {
            await update(formData.id, formData);
            $toast({
                description: 'Mission mise à jour avec succès',
            });
        }
    }
    catch (err) {
        if (err.data?.errors) {
            const backendErrors = err.data.errors;
            Object.keys(backendErrors).forEach((key) => {
                if (errors.hasOwnProperty(key)) {
                    errors[key] = backendErrors[key][0];
                }
            });

            const firstError = Object.values(backendErrors)[0][0];
            $toast({
                description: firstError,
                status: 'error',
                variant: 'destructive',
            });
        }
    }
});
</script>
