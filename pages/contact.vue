<template>
    <NuxtLayout name="guest">
        <template #title>
            Contactez-<strong>nous</strong>
        </template>
        <template #logo>
            <LayoutsLogo class="w-[26rem] h-32 md:w-[30rem] md:h-36" />
        </template>

        <div>
            <form
                class="pt-8 sm:pt-24 container flex flex-col space-y-3 sm:w-[70%] lg:w-[55%]"
                @submit.prevent="submit"
            >
                <FormField name="fullname">
                    <FormItem class="flex space-x-1 px-4 items-center rounded-full border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary border-gray-300">
                        <FormControl>
                            <div class="flex w-full items-center space-x-1">
                                <UserCircleIcon class="text-primary w-6 h-6" />
                                <Input
                                    v-model="formData.fullname"
                                    type="text"
                                    placeholder="Nom, prénom"
                                    class="text-sm"
                                    @blur="validateField('fullname')"
                                    @input="validateField('fullname')"
                                />
                            </div>
                        </FormControl>
                    </FormItem>
                    <p
                        v-if="error.fullname"
                        class="text-red-500 text-xs mt-1 ms-[8%]"
                    >
                        {{ error.fullname }}
                    </p>
                </FormField>

                <FormField name="email">
                    <FormItem class="flex space-x-1 px-4 items-center rounded-full border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary border-gray-300">
                        <FormControl>
                            <div class="flex w-full items-center space-x-1">
                                <EnvelopeIcon class="text-primary w-6 h-6" />
                                <Input
                                    v-model="formData.email"
                                    placeholder="Email"
                                    class="text-sm"
                                    @blur="validateField('email')"
                                    @input="validateField('email')"
                                />
                            </div>
                        </FormControl>
                    </FormItem>
                    <p
                        v-if="error.email"
                        class="text-red-500 text-xs mt-1 ms-[8%]"
                    >
                        {{ error.email }}
                    </p>
                </FormField>

                <FormField name="phoneNumber">
                    <FormItem class="flex space-x-1 px-4 items-center rounded-full border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary border-gray-300">
                        <FormControl>
                            <div class="flex w-full items-center space-x-1">
                                <PhoneIcon class="text-primary w-6 h-6" />
                                <Input
                                    v-model="formData.phoneNumber"
                                    placeholder="N° de téléphone"
                                    class="text-sm w-96"
                                    @blur="validateField('phoneNumber')"
                                    @input="validateField('phoneNumber')"
                                />
                            </div>
                        </FormControl>
                    </FormItem>
                    <p
                        v-if="error.phoneNumber"
                        class="text-red-500 text-xs mt-1 ms-[8%]"
                    >
                        {{ error.phoneNumber }}
                    </p>
                </FormField>

                <FormField name="message">
                    <FormItem class="flex flex-col py-2 px-4 rounded-3xl border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary border-gray-300">
                        <div class="flex space-x-3 items-center">
                            <EnvelopeIcon class="text-primary w-6 h-6" />
                            <span class="text-primary text-sm">
                                Message
                            </span>
                        </div>
                        <FormControl>
                            <div class="flex w-full items-center space-x-1">
                                <Textarea
                                    v-model="formData.message"
                                    placeholder="Votre message..."
                                    class="bg-gray-200 h-40"
                                />
                            </div>
                        </FormControl>
                    </FormItem>
                </FormField>

                <Button
                    class="mt-4 md:mx-44 mx-20 font-bold"
                    type="submit"
                >
                    Envoyer
                </Button>
            </form>

            <section class="grid lg:grid-cols-4 grid-cols-2 container sm:w-[70%] lg:w-[55%] gap-4 mt-12">
                <div class="bg-white cursor-pointer shadow hover:bg-primary hover:scale-105 p-4 rounded-2xl transform transition duration-300 ease-in-out group">
                    <h4 class="flex space-x-2 items-center justify-center text-sm text-primary group-hover:text-white font-bold">
                        <EnvelopeIcon class="w-6 h-6" />
                        <span>Téléphone</span>
                    </h4>
                    <p class="mt-6 text-sm text-center group-hover:text-white">
                        0478.02.33.77
                    </p>
                </div>

                <div class="bg-white cursor-pointer shadow hover:bg-primary hover:scale-105 p-4 rounded-2xl transform transition duration-300 ease-in-out group">
                    <h4 class="flex space-x-2 items-center justify-center text-sm text-primary group-hover:text-white font-bold">
                        <MapPinIcon class="w-6 h-6" />
                        <span>Emplacement</span>
                    </h4>
                    <p class="mt-6 text-sm text-center group-hover:text-white">
                        Rue de la Résistance 92/A 7131 Waudrez
                    </p>
                </div>

                <div class="bg-white cursor-pointer shadow hover:bg-primary hover:scale-105 p-4 rounded-2xl transform transition duration-300 ease-in-out group">
                    <h4 class="flex space-x-2 items-center justify-center text-sm text-primary group-hover:text-white font-bold">
                        <EnvelopeIcon class="w-6 h-6" />
                        <span>Email</span>
                    </h4>
                    <p class="mt-6 text-sm text-center group-hover:text-white">
                        info@infiswap.be
                    </p>
                </div>

                <div class="bg-white cursor-pointer shadow hover:bg-primary hover:scale-105 p-4 rounded-2xl transform transition duration-300 ease-in-out group">
                    <h4 class="flex space-x-2 items-center justify-center text-sm text-primary group-hover:text-white font-bold">
                        <GlobeAltIcon class="w-6 h-6" />
                        <span>Site</span>
                    </h4>
                    <p class="mt-6 text-sm text-center group-hover:text-white">
                        infiswap.be
                    </p>
                </div>
            </section>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    GlobeAltIcon,
} from '@heroicons/vue/24/solid';

import * as yup from 'yup';

const formData = reactive({
    fullname: '',
    email: '',
    phoneNumber: '',
    message: '',
    accept: false,
});

const error = reactive({
    fullname: '',
    email: '',
    phoneNumber: '',
});

const schema = yup.object().shape({
    fullname: yup.string()
        .required('Le nom complet est requis')
        .min(2, 'Le nom doit avoir minimum 2 caractères'),
    email: yup.string()
        .required('L\'email est requis')
        .email('Email invalide'),
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

const { submit } = useSubmit(
    () => {
        console.log('');
    },
    {
        onError: () => {
            useNuxtApp().$toast.error('Une erreur est survenue lors de l\'envoi du formulaire');
        },
    },
);

useHead({
    title: 'Contact',
    meta: [{ name: 'description', content: 'Page d\'entrée en contact....' }],
});
</script>
