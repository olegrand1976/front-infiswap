<template>
    <div class="min-h-screen">
        <div class="hidden lg:flex flex-row justify-center h-auto min-h-screen">
            <div class="hidden lg:flex bg-tertiary/30 flex-col items-center lg:w-[115vw] relative container">
                <div class="lg:flex justify-center items-center mb-auto mt-[30%]">
                    <LayoutsAppImage
                        src="/icons/unlock.png"
                        class="lg:w-52"
                    />
                </div>
                <div class="absolute top-[10%] left-[4%]">
                    <LayoutsAppImage
                        src="/icons/plus.png"
                        class="lg:w-24"
                    />
                </div>
                <div class="absolute bottom-[18%] right-[6%]">
                    <LayoutsAppImage
                        src="/icons/Unin.png"
                        class="lg:w-16"
                    />
                </div>

                <div class="absolute right-6 top-6">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute bottom-[20%] left-[15%]">
                    <LayoutsAppImage
                        src="/icons/cog_2.png"
                        class="lg:w-52"
                    />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="hidden lg:flex bg-white container w-full flex-col space-y-12 justify-center items-center relative">
                <BackButton to="/login" />
                <div>
                    <LayoutsLogo class="sm:w-64 lg:w-72" />
                </div>
                <h1 class="md:text-2xl sm:text-xl text-center text-primary">
                    Réinitialisez votre <span class="font-bold">mot de passe</span>
                </h1>
                <div class="w-full container max-w-xl">
                    <form
                        class="flex flex-col"
                        @submit.prevent="submitForm"
                    >
                        <div class="text-xs text-primary font-bold mb-2">
                            Votre adresse e-mail
                        </div>
                        <InputIcon
                            v-model="email"
                            type="email"
                            placeholder="Votre email"
                            :icon="EnvelopeIcon"
                        />

                        <div class="px-8 pt-8">
                            <h4 class="font-light lg:text-sm text-xs text-center">
                                Saisissez votre adresse éléctronique et nous vous enverrons un code
                                pour réinitialiser votre mot de passe
                            </h4>
                        </div>

                        <div class="flex w-full justify-center items-center mx-auto pt-4">
                            <Button
                                type="submit"
                                class="font-bold w-[70%] md:text-sm sm:text-xs"
                            >
                                Réinitialiser
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="lg:hidden min-h-screen w-full flex flex-col justify-between relative overflow-y-auto">
            <LayoutsHeaderMobile />
            <BackButton to="/login" />

            <div class="flex flex-col justify-center items-center px-6 flex-grow py-12">
                <h1 class="text-lg text-center text-primary mb-8">
                    Réinitialisez votre <span class="font-bold">mot de passe</span>
                </h1>

                <div class="w-full max-w-sm">
                    <form
                        class="flex flex-col"
                        @submit.prevent="submitForm"
                    >
                        <FormField name="email">
                            <FormItem>
                                <FormLabel class="text-xs text-primary font-bold mb-2 block">
                                    Votre adresse e-mail
                                </FormLabel>
                                <FormControl>
                                    <InputIcon
                                        v-model="email"
                                        type="email"
                                        placeholder="Votre email"
                                        :icon="EnvelopeIcon"
                                    />
                                </FormControl>
                            </FormItem>
                        </FormField>

                        <div class="pt-8">
                            <h4 class="font-light text-xs text-center px-4">
                                Saisissez votre adresse éléctronique et nous vous enverrons un code
                                pour réinitialiser votre mot de passe
                            </h4>
                        </div>

                        <div class="flex justify-center items-center mx-auto pt-8">
                            <Button
                                type="submit"
                                class="font-bold px-12 text-xs"
                            >
                                Réinitialiser
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="bg-primary text-primary h-10 w-full mt-auto" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { EnvelopeIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue';
import { getErrorMessage } from '~/lib/utils';
import BackButton from '~/components/ui/back-button/BackButton.vue';
import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';

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
        $toast({
            description: 'Veuillez entrer une adresse email valide.',
            variant: 'destructive',
        });
        return;
    }

    try {
        const response = await $apifetch('/api/forgot-password', {
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
            setTimeout(() => {
                navigateTo('/');
            }, 2000);
        }
        else {
            $toast({
                title: 'Succès',
                description: 'Vérifiez votre boîte de réception.',
            });
            setTimeout(() => {
                navigateTo('/');
            }, 2000);
        }
    }
    catch (error) {
        console.error('Erreur API:', error);
        $toast({
            title: 'Oups! Une erreur s\'est produite',
            description: getErrorMessage(error),
            variant: 'destructive',
        });
    }
};
</script>

<style scoped>
html, body {
  height: 100%;
  overflow-x: hidden;
}
</style>
