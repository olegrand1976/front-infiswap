<template>
    <div>
        <div class="hidden sm:flex flex-row justify-center h-auto sm:pt-[25vh] xl:pt-0">
            <div class="bg-tertiary/30 sm:hidden lg:flex flex-col items-center lg:w-[115vw] relative container">
                <div class="hidden lg:flex justify-center items-center mb-auto mt-[30%]">
                    <NuxtImg
                        src="/icons/unlock.png"
                        class="lg:w-52"
                    />
                </div>
                <div class="absolute top-[10%] left-[4%]">
                    <NuxtImg
                        src="/icons/plus.png"
                        class="lg:w-24"
                    />
                </div>
                <div class="absolute bottom-[18%] right-[6%]">
                    <NuxtImg
                        src="/icons/Unin.png"
                        class="lg:w-16"
                    />
                </div>

                <div class="absolute right-6 top-6">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute bottom-[20%] left-[15%]">
                    <NuxtImg
                        src="/icons/cog_2.png"
                        class="lg:w-52"
                    />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white container w-full xl:h-screen flex flex-col space-y-12 justify-center items-center">
                <div>
                    <LayoutsLogo class="sm:w-64 lg:w-72" />
                </div>
                <h1 class="md:text-2xl sm:text-xl text-center text-primary">
                    Réinitialisez votre <span class="font-bold">mot de passe</span>
                </h1>
                <div class="w-full container">
                    <form
                        @submit.prevent="submitForm"
                        class="flex flex-col">
                        <FormField name="email">
                            <FormItem>
                                <FormLabel class="text-xs text-primary font-bold mb-12">
                                    Votre adresse e-mail
                                </FormLabel>
                                <div class="flex flex-col space-x-1 px-4 h-10 rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                    <FormControl>
                                        <div class="flex items-center space-x-1">
                                            <EnvelopeIcon class="text-primary w-5" />
                                            <Input
                                                v-model="email"
                                                type="email"
                                                placeholder="Email"
                                                class="md:text-sm sm:text-xs"
                                            />
                                        </div>
                                    </FormControl>
                                </div>
                            </FormItem>
                        </FormField>

                        <div class="px-8 pt-12">
                            <h4 class="font-light lg:text-sm text-xs text-primary text-center">
                                Saisissez votre adresse éléctronique et nous vous enverrons un code
                                pour réinitialiser votre mot de passe
                            </h4>
                        </div>

                        <div class="flex justify-center items-center mx-auto pt-8">
                            <Button
                                type="submit"
                                class="font-bold px-16 md:text-sm sm:text-xs"
                            >
                                Envoyer un email
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="sm:hidden w-screen flex flex-col justify-between relative overflow-hidden">
            <LayoutsHeaderMobile />

            <h1 class="text-lg text-center text-primary mt-32">
                Réinitialisez votre <span class="font-bold">mot de passe</span>
            </h1>

            <div class="w-full container mt-16">
                <form
                    @submit.prevent="submitForm"
                    class="flex flex-col flex-grow">
                    <FormField name="email">
                        <FormItem>
                            <FormLabel class="text-xs text-primary font-bold mb-12">
                                Votre adresse e-mail
                            </FormLabel>
                            <div class="flex flex-col space-x-1 px-4 h-10 rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center space-x-1">
                                        <EnvelopeIcon class="text-primary w-5" />
                                        <Input
                                            v-model="email"
                                            type="email"
                                            placeholder="Email"
                                            class="text-xs"
                                        />
                                    </div>
                                </FormControl>
                            </div>
                        </FormItem>
                    </FormField>

                    <div class="px-8 pt-16">
                        <h4 class="font-light text-xs text-primary text-center">
                            Saisissez votre adresse éléctronique et nous vous enverrons un code
                            pour réinitialiser votre mot de passe
                        </h4>
                    </div>

                    <div class="flex justify-center items-center mx-auto pt-20">
                        <Button
                            type="submit"
                            class="font-bold px-16 text-xs"
                        >
                            Envoyer un email
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { EnvelopeIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue';

const { $toast } = useNuxtApp();

definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Réinitialisation de mot de passe',
});

const email = ref('');

const { $apifetch } = useNuxtApp();

const submitForm = async (event: Event) => {
    event.preventDefault();

    if (!email.value) {
        $toast.error('Veuillez entrer une adresse email valide.');
        return;
    }

    try {
        const response = await $apifetch('http://localhost:8094/api/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email: email.value }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            $toast({
                title: 'Succès',
                description: 'Vérifiez votre boîte de réception.',
            });
        }
        else {
            $toast({
                title: 'Succès',
                description: 'Vérifiez votre boîte de réception.',
            });
        }
    }
    catch (error) {
        console.error('Erreur API:', error);
        $toast({
            title: 'Oups! Une erreur s\'est produite',
            description: 'Échec de l\'envoi du formulaire',
            variant: 'destructive',
        });
    }
};
</script>
