<template>
    <div class="pt-28 pb-20 sm:py-20">
        <div class="bg-white sm:bg-tertiary/30 sm:h-80 flex justify-center items-center relative">
            <h1 class="text-primary text-3xl lg:text-4xl text-center">
                Contactez-<strong>nous</strong>
            </h1>
            <div class="hidden sm:block absolute -bottom-12 inset-x-auto">
                <LayoutsLogo class="w-[26rem] h-32 md:w-[30rem] md:h-36" />
            </div>
        </div>

        <form
            class="pt-8 sm:pt-24 container flex flex-col space-y-5 sm:w-[70%] lg:w-[55%]"
            @submit.prevent="onSubmit"
        >
            <FormField name="nom">
                <FormItem class="flex space-x-1 px-4 items-center rounded-full border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary border-gray-300">
                    <FormControl>
                        <div class="flex w-full items-center space-x-1">
                            <UserCircleIcon class="text-primary w-6 h-6" />
                            <Input
                                v-model="nom"
                                type="text"
                                placeholder="Nom, prénom"
                                class="text-sm"
                                v-bind="nomAttrs"
                            />
                        </div>
                    </FormControl>
                </FormItem>
                <ErrorMessage
                    name="nom"
                    class="text-red-500 text-xs mt-5     "
                />
            </FormField>

            <FormField name="email">
                <FormItem class="flex space-x-1 px-4 items-center rounded-full border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary border-gray-300">
                    <FormControl>
                        <div class="flex w-full items-center space-x-1">
                            <EnvelopeIcon class="text-primary w-6 h-6" />
                            <Input
                                v-model="email"
                                type="email"
                                placeholder="Email"
                                class="text-sm"
                                v-bind="emailAttrs"
                            />
                        </div>
                    </FormControl>
                </FormItem>
                <ErrorMessage
                    name="email"
                    class="text-red-500 text-xs mt-5     "
                />
            </FormField>

            <FormField name="numero">
                <FormItem class="flex space-x-1 px-4 items-center rounded-full border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary border-gray-300">
                    <FormControl>
                        <div class="flex w-full items-center space-x-1">
                            <PhoneIcon class="text-primary w-6 h-6" />
                            <Input
                                v-model="numeros"
                                type="numeros"
                                placeholder="N° de téléphone"
                                class="text-sm w-96"
                                v-bind="numerosAttrs"
                            />
                        </div>
                    </FormControl>
                </FormItem>
                <ErrorMessage
                    name="numeros"
                    class="text-red-500 text-xs mt-5     "
                />
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
                                v-model="message"
                                placeholder="Votre message..."
                                class="bg-gray-200 h-40"
                                v-bind="messageAttrs"
                            />
                        </div>
                    </FormControl>
                </FormItem>
                <ErrorMessage
                    name="message"
                    class="text-red-500 text-xs mt-5     "
                />
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

        <!-- <section class="mt-12 sm:w-[70%] lg:w-[55%] container">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.9860057087326!2d4.262952197233401!3d50.81289797013747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c6f75b8a8a8d%3A0x8f8a1b1436ea2521!2sH%C3%B4pital%20Erasme%20-%20Cliniques%20universitaires%20de%20Bruxelles!5e0!3m2!1sfr!2smg!4v1737985810191!5m2!1sfr!2smg"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                class="w-full h-64 rounded-3xl"
            >
                .
            </iframe>
        </section> -->
    </div>
</template>

<script lang="ts" setup>
import { useForm, defineRule, configure, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { localize } from '@vee-validate/i18n';
import fr from '@vee-validate/i18n/dist/locale/fr.json';

import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    GlobeAltIcon,
} from '@heroicons/vue/24/solid';

useHead({
    title: 'Contact',
    meta: [{ name: 'description', content: 'Page d\'entrée en contact....' }],
});

const formData = ref({
    nom: '',
    email: '',
    numeros: '',
    message: '',
});

configure({
    generateMessage: localize({ fr }),
    validateOnBlur: true,
    validateOnInput: true,
    validateOnChange: true,
    validateOnModelUpdate: true,
});

const schema = yup.object({

    // Validation pour le champ 'nom'
    nom: yup.string()
        .required('Le nom est obligatoire') // Le nom est obligatoire
        .min(2, 'Le nom doit contenir au moins 2 caractères') // Minimum de 2 caractères
        .max(50, 'Le nom ne peut pas dépasser 50 caractères') // Maximum de 50 caractères
        .matches(/^[a-zA-Z\s]+$/, 'Le nom ne peut contenir que des lettres et des espaces'), // Permet seulement des lettres et des espaces

    // Validation pour le champ 'email'
    email: yup.string()
        .email('L\'email doit être valide') // Vérification si l'email est valide
        .required('L\'email est obligatoire') // L'email est obligatoire
        .max(100, 'L\'email ne peut pas dépasser 100 caractères'), // Maximum de 100 caractères

    // Validation pour le champ 'numero'
    numeros: yup.string()
        .required('Le numéro est obligatoire') // Le numéro est obligatoire
        .matches(/^[0-9]+$/, 'Le numéro doit contenir uniquement des chiffres') // Vérifie si le numéro contient uniquement des chiffres
        .min(10, 'Le numéro doit contenir au moins 10 chiffres') // Minimum de 10 chiffres
        .max(15, 'Le numéro ne peut pas dépasser 15 chiffres'), // Maximum de 15 chiffres

    // Validation pour le champ 'message'
    message: yup.string()
        .required('Le message est obligatoire') // Le message est obligatoire
        .min(10, 'Le message doit contenir au moins 10 caractères') // Minimum de 10 caractères
        .max(500, 'Le message ne peut pas dépasser 500 caractères'), // Maximum de 500 caractères
});

const { handleSubmit, defineField, errors } = useForm({
    validationSchema: schema,
});

const [nom, nomAttrs] = defineField('nom');
const [email, emailAttrs] = defineField('email');
const [numeros, numerosAttrs] = defineField('numeros');
const [message, messageAttrs] = defineField('message');

const onSubmit = handleSubmit(async (values) => {
    console.log('Données du formulaire:', values);
//   alert('Formulaire soumis avec succès !');
});
</script>
