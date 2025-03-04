<template>
    <div>
        <div class="sm:hidden relative flex flex-col items-center">
            <div class="absolute inset-0 z-0">
                <NuxtImg
                    src="/Mask_group.png"
                    class="w-full h-48"
                />
            </div>
            <div class="mt-10 z-20 relative flex justify-center">
                <LayoutsLogo class="w-[15rem]" />
            </div>
        </div>
        <div class="mt-32 sm:mt-0 sm:bg-tertiary/30 sm:h-80 flex justify-center items-center relative">
            <h1 class="text-primary text-3xl lg:text-4xl text-center mt-0 sm:mt-8">
                Contactez-<span class="font-bold">nous</span>
            </h1>
            <div class="hidden sm:block absolute -bottom-12 inset-x-auto">
                <LayoutsLogo class="w-96" />
            </div>
        </div>

        <form
            class="sm:pt-24 pt-12 container flex flex-col space-y-3 sm:w-[70%] lg:w-[55%] xl:w-[40%]"
            @submit.prevent="submit"
        >
            <FormField name="name">
                <div class="relative w-full items-center">
                    <InputIcon
                        v-model="formData.name"
                        :icon="UserCircleIcon"
                        size="md"
                        placeholder="Nom, Prénom"
                        :errors="validationErrors.name"
                        @blur="validateField('name')"
                        @input="validateField('name')"
                    />
                </div>
                <p
                    v-if="error.name"
                    class="text-red-500 text-xs mt-1 ms-[8%]"
                >
                    {{ error.name }}
                </p>
            </FormField>

            <FormField name="email">
                <div class="relative w-full items-center">
                    <InputIcon
                        v-model="formData.email"
                        :icon="EnvelopeIcon"
                        size="md"
                        placeholder="Email"
                        :errors="validationErrors.email"
                        @blur="validateField('email')"
                        @input="validateField('email')"
                    />
                </div>
                <p
                    v-if="error.email"
                    class="text-red-500 text-xs mt-1 ms-[8%]"
                >
                    {{ error.email }}
                </p>
            </FormField>

            <FormField name="phoneNumber">
                <div class="relative w-full items-center">
                    <InputIcon
                        v-model="formData.phoneNumber"
                        :icon="PhoneIcon"
                        size="md"
                        placeholder="N° de téléphone"
                        :errors="validationErrors.phoneNumber"
                        @blur="validateField('phoneNumber')"
                        @input="validateField('phoneNumber')"
                    />
                </div>
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
                        <EnvelopeIcon class="text-primary w-6" />
                        <span class="text-primary text-sm">
                            Message
                        </span>
                    </div>
                    <FormControl>
                        <div class="flex w-full items-center space-x-1">
                            <Textarea
                                v-model="formData.message"
                                placeholder="Votre message..."
                                class="bg-white h-40"
                            />
                        </div>
                    </FormControl>
                </FormItem>
            </FormField>

            <Button
                class="mt-4 md:mx-44 mx-20 font-bold"
                type="submit"
                :in-progress="inProgress"
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
import { submitContact } from '~/composables/useContact';

const { $toast } = useNuxtApp();

const formData = reactive({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
});

const error = reactive({
    name: '',
    email: '',
    phoneNumber: '',
});

const schema = yup.object().shape({
    name: yup.string()
        .min(2, 'Le nom doit avoir minimum 2 caractères'),
    email: yup.string()
        .email('Email invalide'),
    phoneNumber: yup.string()
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

const {
    submit,
    inProgress,
    validationErrors,
} = useSubmit(
    () => {
        return submitContact(formData).then(() => {
            $toast({
                description: 'Votre message a été envoyé avec succès !',
            });

            formData.name = '';
            formData.email = '';
            formData.phoneNumber = '';
            formData.message = '';
        });
    },
);

useHead({
    title: 'Contact',
    meta: [{ name: 'description', content: 'Page d\'entrée en contact....' }],
});

definePageMeta({
    middleware: ['guest'],
    layout: 'guest',
});
</script>
