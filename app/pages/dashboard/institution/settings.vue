<template>
    <div>
        <DashboardAdminPageHeader title="Paramètres de l'institution" />
        <DashboardAdminPageContent>
            <div
                v-if="loading"
                class="flex justify-center items-center py-12"
            >
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>

            <form
                v-else-if="!loading"
                enctype="multipart/form-data"
                @submit.prevent="handleSubmit"
            >
                <div class="grid grid-cols-3 gap-4 lg:gap-8 mb-4 lg:mb-5">
                    <div class="p-4 hidden lg:block">
                        <h1 class="font-semibold text-gray-600">
                            Paramètres de l'institution
                        </h1>
                        <p class="mt-2 text-md text-gray-500">
                            Les informations à compléter
                        </p>
                    </div>

                    <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                        <InputIcon
                            v-model="formData.name"
                            rounded="md"
                            label="Nom de l'institution"
                            placeholder="Nom de l'institution"
                        />

                        <InputIcon
                            v-model="formData.company_number"
                            rounded="md"
                            label="Numéro d'entreprise"
                            placeholder="Numéro d'entreprise"
                        />

                        <InputIcon
                            v-model="formData.phone_number"
                            rounded="md"
                            label="Téléphone"
                            placeholder="Téléphone"
                            type="tel"
                        />

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Logo de l'institution
                            </label>
                            <FileUpload
                                :key="imageUploadKey"
                                v-model="logoFile"
                                accept="image/*"
                                :max-size="5 * 1024 * 1024"
                                image-class="rounded-lg"
                                class="w-full"
                                @change="handleLogoChange"
                            />
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4 lg:gap-8 mb-4 lg:mb-5">
                    <div class="p-4 hidden lg:block">
                        <h1 class="font-semibold text-gray-600">
                            Adresse
                        </h1>
                        <p class="mt-2 text-md text-gray-500">
                            Adresse de l'institution
                        </p>
                    </div>

                    <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                        <InputIcon
                            v-model="formData.address.street_address"
                            rounded="md"
                            label="Rue et numéro"
                            placeholder="Rue et numéro"
                        />

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputIcon
                                v-model="formData.address.city"
                                rounded="md"
                                label="Ville"
                                placeholder="Ville"
                            />

                            <InputIcon
                                v-model="formData.address.zip_code"
                                rounded="md"
                                label="Code postal"
                                placeholder="Code postal"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Pays
                            </label>
                            <Select
                                v-model="countryDisplayName"
                            >
                                <SelectTrigger class="rounded-md">
                                    <SelectValue placeholder="Sélectionner un pays" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Belgique">
                                            <span>Belgique</span>
                                        </SelectItem>
                                        <SelectItem value="France">
                                            <span>France</span>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4 lg:gap-8 mb-4 lg:mb-5">
                    <div class="p-4 hidden lg:block">
                        <h1 class="font-semibold text-gray-600">
                            Permissions
                        </h1>
                        <p class="mt-2 text-md text-gray-500">
                            Paramètres de postulation
                        </p>
                    </div>

                    <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                        <div class="flex items-center space-x-2">
                            <Checkbox
                                :id="'can_apply_replacements'"
                                :checked="formData.can_apply_replacements"
                                @update:checked="formData.can_apply_replacements = $event"
                            />
                            <label
                                :for="'can_apply_replacements'"
                                class="text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                Poster des remplacements
                            </label>
                        </div>
                    </div>
                </div>

                <div class="col-span-3 grid place-content-center">
                    <Button
                        type="submit"
                        class="rounded-md w-52"
                        :in-progress="saving"
                    >
                        Mettre à jour
                    </Button>
                </div>
            </form>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import FileUpload from '@/components/ui/file-upload/FileUpload.vue';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInstitutions } from '@/composables/useInstitution';

const {
    currentInstitution: institution,
    loading,
    saving,
    getSettings,
    createOrUpdate,
    deleteLogo,
    getLogoUrl,
} = useInstitutions();

const logoFile = ref<File | string | null>(null);
const imageUploadKey = ref(0);

const formData = reactive({
    name: '',
    company_number: '',
    phone_number: '',
    logo: null,
    can_apply_replacements: false,
    address: {
        street_address: '',
        city: '',
        zip_code: '',
        country: '',
    },
});

const countryMap: Record<string, string> = {
    be: 'Belgique',
    fr: 'France',
    nl: 'Pays-Bas',
};

// Reverse map: name to code
const countryCodeMap: Record<string, string> = {
    'belgique': 'be',
    'france': 'fr',
    'pays-bas': 'nl',
};

const getCountryDisplayName = (countryCode: string | null | undefined): string => {
    if (!countryCode) return '';
    return countryMap[countryCode.toLowerCase()] || countryCode;
};

const getCountryCode = (countryName: string | null | undefined): string => {
    if (!countryName) return '';
    const normalized = countryName.toLowerCase().trim();
    return countryCodeMap[normalized] || countryName;
};

// Reactive variable for country display (for Select component)
const countryDisplayName = ref<string>('');

// Watch formData.address.country to update countryDisplayName
watch(() => formData.address.country, (newCode) => {
    countryDisplayName.value = getCountryDisplayName(newCode);
}, { immediate: true });

// Watch countryDisplayName to update formData.address.country
watch(countryDisplayName, (newName) => {
    formData.address.country = getCountryCode(newName);
});

const fetchInstitution = async () => {
    try {
        await getSettings();
        if (institution.value) {
            formData.name = institution.value.name || '';
            formData.company_number = institution.value.company_number || '';
            formData.phone_number = institution.value.phone_number || institution.value.contact?.phone_number || '';
            formData.can_apply_replacements = !!institution.value.can_apply_replacements;

            if (institution.value.address) {
                formData.address.street_address = institution.value.address.street_address || '';
                formData.address.city = institution.value.address.city || '';
                formData.address.zip_code = institution.value.address.zip_code || '';
                // Keep the country code in formData, the computed will handle display
                formData.address.country = institution.value.address.country || '';
            }

            const logoUrl = getLogoUrl(institution.value?.logo);
            logoFile.value = logoUrl || null;
        }
    }
    catch (error) {
        console.error('Erreur lors du chargement:', error);
    }
};

const handleDeleteLogo = async () => {
    try {
        await deleteLogo();
        logoFile.value = null;
        imageUploadKey.value += 1;
    }
    catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
};

const handleLogoChange = (file: File | string | null) => {
    if (file === null && institution.value?.logo) {
        handleDeleteLogo();
    }
};

const handleSubmit = async () => {
    try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('company_number', formData.company_number || '');
        formDataToSend.append('phone_number', formData.phone_number || '');
        formDataToSend.append('can_apply_replacements', formData.can_apply_replacements ? '1' : '0');

        formDataToSend.append('address[street_address]', formData.address.street_address || '');
        formDataToSend.append('address[city]', formData.address.city || '');
        formDataToSend.append('address[zip_code]', formData.address.zip_code || '');
        formDataToSend.append('address[country]', formData.address.country || '');

        if (logoFile.value instanceof File) {
            formDataToSend.append('logo', logoFile.value);
        }

        const response = await createOrUpdate(formDataToSend);
        imageUploadKey.value += 1;

        await fetchInstitution();
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
    }
};

onMounted(() => {
    fetchInstitution();
});

useHead({
    title: 'Paramètres de l\'institution',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'institution'],
});
</script>
