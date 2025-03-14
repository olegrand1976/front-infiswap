<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            Rechercher un(e) infirmier(e)
        </template>
        <div class="container sm:my-24 max-w-3xl">
            <form @submit.prevent="submit">
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                            <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center gap-2 pl-4 pr-2">
                                <UserCircleIcon class="w-6 text-primary sm:text-white" />
                                <span class="font-light hidden sm:inline text-primary sm:text-white">Nom</span>
                            </div>
                            <Input
                                v-model="formData.lastname"
                                placeholder="Nom"
                                variant="transparent"
                                class="w-full text-black placeholder:text-black/80"
                                @blur="validateField('lastname')"
                                @input="validateField('lastname')"
                            />
                        </div>
                        <p
                            v-if="error.lastname"
                            class="text-red-500 text-xs mt-1 ms-[25%]"
                        >
                            {{ error.lastname }}
                        </p>
                    </div>

                    <div>
                        <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                            <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                <div class="flex space-x-4 text-white items-center ms-4 relative">
                                    <UserCircleIcon class="w-6 text-primary sm:text-white" />
                                    <PlusIcon class="w-3 text-primary sm:text-white absolute top-0 left-1" />
                                    <span class="font-light hidden sm:inline text-primary sm:text-white">Prénom</span>
                                </div>
                            </div>
                            <Input
                                v-model="formData.firstname"
                                variant="transparent"
                                placeholder="Prenom"
                                class="w-full text-black placeholder:text-black/80"
                                @blur="validateField('firstname')"
                                @input="validateField('firstname')"
                            />
                        </div>
                        <p
                            v-if="error.firstname"
                            class="text-red-500 text-xs mt-1 ms-[25%]"
                        >
                            {{ error.firstname }}
                        </p>
                    </div>

                    <div>
                        <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                            <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                <div class="flex space-x-4 text-white items-center ms-4 relative">
                                    <div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                        <NuxtImg
                                            src="/icons/zip_code.png"
                                            class="w-4"
                                        />
                                    </div>
                                    <span class="font-light hidden sm:inline text-primary sm:text-white">Code postal</span>
                                </div>
                            </div>
                            <Input
                                v-model="formData.zipCode"
                                variant="transparent"
                                placeholder="Code Postal"
                                class="w-full text-black placeholder:text-black/80"
                                @blur="validateField('zipCode')"
                                @input="validateField('zipCode')"
                            />
                        </div>
                        <p
                            v-if="error.zipCode"
                            class="text-red-500 text-xs mt-1 ms-[25%]"
                        >
                            {{ error.zipCode }}
                        </p>
                    </div>

                    <div>
                        <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                            <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                <div class="flex space-x-4 text-white items-center ms-4 relative">
                                    <div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                        <NuxtImg
                                            src="/icons/city_white.png"
                                            class="w-8"
                                        />
                                    </div>
                                    <span class="font-light hidden sm:inline text-primary sm:text-white">Ville</span>
                                </div>
                            </div>
                            <Input
                                v-model="formData.city"
                                variant="transparent"
                                placeholder="Ville"
                                class="w-full text-black placeholder:text-black/80"
                                @blur="validateField('city')"
                                @input="validateField('city')"
                            />
                        </div>
                        <p
                            v-if="error.city"
                            class="text-red-500 text-xs mt-1 ms-[25%]"
                        >
                            {{ error.city }}
                        </p>
                    </div>

                    <div>
                        <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                            <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                <div class="flex space-x-4 text-white items-center ms-4 relative">
                                    <PhoneIcon class="w-6 text-primary sm:text-white" />
                                    <span class="font-light hidden sm:inline text-primary sm:text-white">N° de téléphone</span>
                                </div>
                            </div>
                            <Input
                                v-model="formData.phoneNumber"
                                variant="transparent"
                                placeholder="97 12 25 - 123 - 45"
                                class="w-full text-black placeholder:text-black/80"
                                @blur="validateField('phoneNumber')"
                                @input="validateField('phoneNumber')"
                            />
                        </div>
                        <p
                            v-if="error.phoneNumber"
                            class="text-red-500 text-xs mt-1 ms-[25%]"
                        >
                            {{ error.phoneNumber }}
                        </p>
                    </div>
                </div>

                <div class="mt-6">
                    <Checkbox
                        id="accept"
                        v-model="formData.accept"
                        class="mt-2"
                    />
                    <label
                        for="accept"
                        class="text-xs font-light ml-2"
                    >
                        Vous acceptez que vos coordonnées soient enregistrées dans notre base de données pour être transmises à notre réseau d'infirmières. Vos informations personnelles ne seront ni vendues ni transmises à des sociétés tierces.
                    </label>
                </div>

                <div class="mt-12 flex justify-center items-center">
                    <Button
                        type="submit"
                        class="w-96 flex justify-center items-center mx-auto"
                        :disabled="inProgress || !formData.accept || Object.values(error).some(msg => msg)"
                    >
                        <span>{{ inProgress ? 'Envoi en cours...' : 'Envoyer' }}</span>
                    </Button>
                </div>

                <div class="mt-12 flex justify-center items-center">
                    <span class="text-center text-xs">
                        Vous serez contacté prochainement par une infirmière de notre réseau, proche de chez vous.
                    </span>
                </div>
            </form>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import {
    UserCircleIcon,
    PlusIcon,
    PhoneIcon,
} from '@heroicons/vue/24/solid';
import * as yup from 'yup';
import { searchNurse } from '~/composables/usePatients';

const { $toast } = useNuxtApp();

const router = useRouter();

useHead({
    title: 'Chercher un(e) infirmier(e)',
    meta: [{ name: 'description', content: 'Vous cherchez une infirmière qualifiée ? Trouvez une professionnelle de santé compétente pour vos soins à domicile ou en établissement. Consultez les profils des infirmières disponibles dans votre région.' }],
});

definePageMeta({
    layout: false,
});

const formData = reactive({
    lastname: '',
    firstname: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
    accept: true,
});

const error = reactive({
    lastname: '',
    firstname: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
});

const schema = yup.object().shape({
    lastname: yup.string()
        .required('Le nom est requis')
        .min(2, 'Le nom doit avoir minimum 2 caractères'),
    firstname: yup.string()
        .required('Le prénom est requis')
        .min(2, 'Le prénom doit avoir minimum 2 caractères'),
    zipCode: yup.string()
        .required('Le code postal est requis')
        .max(7, 'Le code postal ne doit pas dépasser les 7 caractères'),
    city: yup.string()
        .required('La ville est requise')
        .min(2, 'La ville doit avoir minimum 2 caractères'),
    phoneNumber: yup.string()
        .required('Le numéro est requis')
        .matches(/^\d{10}$/, 'Numéro invalide'),
});

const validateField = async (field: keyof typeof formData) => {
    try {
        await schema.validateAt(field, toRaw(formData));
        error[field] = '';
    }
    catch (err) {
        error[field] = (err as yup.ValidationError).message;
    }
};

const validateRequiredFields = async () => {
    let isValid = true;
    try {
        await schema.validate(toRaw(formData), { abortEarly: false });
    }
    catch (err) {
        if (err instanceof yup.ValidationError) {
            err.inner.forEach((e) => {
                error[e.path] = e.message;
                isValid = false;
            });
        }
    }
    return isValid;
};

const { submit, inProgress } = useSubmit(
    async () => { // Ajout de async
        console.log(formData);
        const isValid = await validateRequiredFields();
        if (isValid) {
            return searchNurse().submitSearchNurse(formData).then(() => {
                $toast({
                    title: 'Succès',
                    description: 'Envoi de formulaire effectué',
                });

                Object.keys(formData).forEach((key) => {
                    (formData as Record<string, string | boolean>)[key] = key === 'accept' ? false : '';
                });
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            });
        }
    },
    {
        onError: () => {
            $toast({
                title: 'Oups! Une erreur s\'est produite',
                description: 'Échec de l\'envoi du formulaire',
                variant: 'destructive',
            });
        },
    },
);
</script>
