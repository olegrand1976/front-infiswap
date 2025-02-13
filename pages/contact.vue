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
            class="pt-8 sm:pt-24 container flex flex-col space-y-3 sm:w-[70%] lg:w-[55%]"
            @submit.prevent="submit"
        >
            <FormField name="lastname">
                <FormItem class="flex space-x-1 px-4 items-center rounded-full border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary border-gray-300">
                    <FormControl>
                        <div class="flex w-full items-center space-x-1">
                            <UserCircleIcon class="text-primary w-6 h-6" />
                            <Input
                                v-model="formData.lastname"
                                type="text"
                                placeholder="Nom, prénom"
                                class="text-sm"
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
                                v-model="formData.email"
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
                                v-model="formData.phoneNumber"
                                placeholder="N° de téléphone"
                                class="text-sm w-96"
                            />
                        </div>
                    </FormControl>
                </FormItem>
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
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    GlobeAltIcon,
} from '@heroicons/vue/24/solid';

import * as yup from 'yup';

const formData = reactive({
    lastname: '',
    firstname: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
    accept: false
});

const error = reactive({
    lastname: '',
    firstname: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
});

useHead({
    title: 'Contact',
    meta: [{ name: 'description', content: 'Page d\'entrée en contact....' }],
});
</script>
