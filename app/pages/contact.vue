<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            Contactez-nous
        </template>
        <div>
            <form
                class="container flex flex-col space-y-3 sm:w-[70%] lg:w-[55%] xl:w-[40%]"
                @submit.prevent="submit"
            >
                <FormField name="name">
                    <FormItem>
                        <FormControl>
                            <div class="relative items-center w-full">
                                <InputIcon
                                    v-model="formData.name"
                                    :icon="UserCircleIcon"
                                    size="md"
                                    placeholder="Nom, prénom"
                                    :errors="validationErrors.name"
                                    @blur="validateField('name')"
                                    @input="validateField('name')"
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="email">
                    <FormItem>
                        <FormControl>
                            <div class="relative items-center w-full">
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
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="phoneNumber">
                    <FormItem>
                        <FormControl>
                            <div class="relative items-center w-full">
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
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="message">
                    <FormItem class="flex flex-col px-4 py-2 border border-gray-300 rounded-3xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                        <div class="flex items-center space-x-3">
                            <EnvelopeIcon class="w-6 text-primary" />
                            <span class="text-sm text-primary">
                                Message
                            </span>
                        </div>
                        <FormControl>
                            <div class="flex items-center w-full space-x-1">
                                <Textarea
                                    v-model="formData.message"
                                    placeholder="Votre message..."
                                    class="h-40 bg-white"
                                />
                            </div>
                        </FormControl>
                    </FormItem>
                </FormField>

                <Button
                    class="mx-20 mt-4 font-bold md:mx-44"
                    type="submit"
                    :in-progress="inProgress"
                >
                    Envoyer
                </Button>
            </form>

            <section class="grid grid-cols-1 lg:grid-cols-4 container sm:w-[70%] lg:w-[55%] gap-4 my-12">
                <div class="p-4 transition duration-300 ease-in-out transform bg-white shadow cursor-pointer hover:bg-primary hover:scale-105 rounded-2xl group">
                    <h4 class="flex items-center justify-center space-x-2 text-sm font-bold text-primary group-hover:text-white">
                        <EnvelopeIcon class="w-6 h-6" />
                        <span>Téléphone</span>
                    </h4>
                    <p class="mt-6 text-sm text-center group-hover:text-white">
                        0478.02.33.77
                    </p>
                </div>

                <div class="p-4 transition duration-300 ease-in-out transform bg-white shadow cursor-pointer hover:bg-primary hover:scale-105 rounded-2xl group">
                    <h4 class="flex items-center justify-center space-x-2 text-sm font-bold text-primary group-hover:text-white">
                        <MapPinIcon class="w-6 h-6" />
                        <span>Emplacement</span>
                    </h4>
                    <p class="mt-6 text-sm text-center group-hover:text-white">
                        Rue de la Résistance 92/A 7131 Waudrez
                    </p>
                </div>

                <div class="p-4 transition duration-300 ease-in-out transform bg-white shadow cursor-pointer hover:bg-primary hover:scale-105 rounded-2xl group">
                    <h4 class="flex items-center justify-center space-x-2 text-sm font-bold text-primary group-hover:text-white">
                        <EnvelopeIcon class="w-6 h-6" />
                        <span>Email</span>
                    </h4>
                    <p class="mt-6 text-sm text-center group-hover:text-white">
                        info@infiswap.be
                    </p>
                </div>

                <div class="p-4 transition duration-300 ease-in-out transform bg-white shadow cursor-pointer hover:bg-primary hover:scale-105 rounded-2xl group">
                    <h4 class="flex items-center justify-center space-x-2 text-sm font-bold text-primary group-hover:text-white">
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
import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';
import { submitContact } from '~/composables/useContact';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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
    title: 'Contactez-nous',
    meta: [
        {
            name: 'description',
            content: 'Besoin d\'un remplacement infirmier ? Contactez l\'équipe InfiSwap pour toute demande d\'assistance ou d\'information.',
        },
    ],
});

definePageMeta({
    layout: false,
});
</script>
