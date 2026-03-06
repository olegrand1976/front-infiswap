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
import FileUpload from '@/components/ui/file-upload/FileUpload.vue';
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
    logo: null,
});

const fetchInstitution = async () => {
    try {
        await getSettings();
        if (institution.value) {
            formData.name = institution.value.name || '';
            formData.company_number = institution.value.company_number || '';
            const logoUrl = getLogoUrl(institution.value?.logo);

            logoFile.value = logoUrl || null;
        }
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
    }
};

const handleDeleteLogo = async () => {
    try {
        await deleteLogo();
        logoFile.value = null;
        imageUploadKey.value += 1;
    } catch (error) {
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
        if (logoFile.value instanceof File) {
            formDataToSend.append('logo', logoFile.value);
        }

        const response = await createOrUpdate(formDataToSend);
        
        imageUploadKey.value += 1;
    } catch (error) {
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
