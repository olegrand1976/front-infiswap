<template>
    <div class="h-screen w-full grid grid-cols-2">
        <Button
            class="hidden lg:inline-block absolute left-5 top-5 z-30 w-24 text-sm"
            @click="goBack"
        >
            Retour
        </Button>
        <div class="hidden lg:block h-screen">
            <NuxtImg
                src="/auth/register-image.jpg"
                alt="Image d'authentification"
                class="object-fill w-full h-screen"
            />
        </div>
        <div class="col-span-2 lg:col-span-1 items-center md:flex flex-col justify-center text-primary text-center">
            <div class="h-48 col-span-1 w-full">
                <NuxtImg
                    src="/auth/bg-top-auth.jpg"
                    alt="Image d'authentification"
                    class="h-full md:hidden w-full"
                />
                <LayoutsLogo class="max-w-[90vw] -mt-40 md:mt-0 md:w-1/2 mx-auto" />
            </div>
            <div class="container w-full max-w-lg mx-auto mt-10 md:mt-0">
                <h1 class="text-xl lg:text-2xl mb-10">
                    <span class="font-bold">Inscription</span> <span class="font-extralight">BETA</span>
                </h1>
                <form
                    class="w-full flex flex-col gap-4 lg:gap-6"
                >
                    <div class="w-full">
                        <FormField name="lastname">
                            <FormItem class="w-full items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <UserCircleIcon class="text-primary w-7 h-7 ml-2" />
                                        <Input
                                            v-model="formData.lastname"
                                            type="text"
                                            placeholder="Nom"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="">
                        <FormField name="firstname">
                            <FormItem class="w-full items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <UserCircleIcon class="text-primary ml-2 w-7 h-7" />
                                        <Input
                                            v-model="formData.firstname"
                                            type="text"
                                            placeholder="Prénom"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-2">
                        <FormField name="email">
                            <FormItem class="w-full items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <EnvelopeIcon class="text-primary ml-3 w-6 h-6" />
                                        <Input
                                            v-model="formData.email"
                                            type="email"
                                            placeholder="Email"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-1 lg:col-span-2">
                        <FormField name="zipCode">
                            <FormItem class="flex space-x-1 px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <NuxtImg
                                            src="/icons/boite.png"
                                            class="h-4"
                                        />
                                        <Input
                                            v-model="formData.zipCode"
                                            type="text"
                                            placeholder="Code postal"
                                            class="text-sm"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-2 lg:col-span-4 mt-4 flex justify-center items-center">
                        <Button
                            class="w-[50%]"
                            type="submit"
                        >
                            S'inscrire
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useHead, useRouter } from 'nuxt/app';
import {
    UserCircleIcon,
    EnvelopeIcon,
} from '@heroicons/vue/24/solid';
import { reactive } from 'vue';

useHead({
    title: 'Inscription Beta',
});

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});
const router = useRouter();
const goBack = () => {
    if (window.history.length > 1) {
        router.back();
    }
    else {
        router.push('/');
    }
};

const formData = reactive({
    lastname: '',
    firstname: '',
    email: '',
    zipCode: '',
});
</script>
