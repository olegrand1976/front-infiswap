<template>
    <div>
        <div class="hidden sm:flex flex-row justify-center h-auto sm:pt-[25vh] xl:pt-0">
            <div class="bg-tertiary/30 hidden lg:flex flex-col items-center lg:w-[115vw] sm:w-[85vw] relative container">
                <div class="flex justify-center items-center mb-auto mt-[30%]">
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

            <div class="bg-white container w-full xl:h-[100vh] lg:h-[55vh] flex flex-col space-y-12 justify-center items-center relative">
                <BackButton to="/login" />
                <div>
                    <LayoutsLogo class="sm:w-64 lg:w-72" />
                </div>
                <div class="flex flex-col items-center space-y-2">
                    <h1 class="md:text-2xl sm:text-xl text-center text-primary">
                        Nouveau <span class="font-bold">mot de passe</span>
                    </h1>
                    <p class="text-gray-400 text-sm text-center">
                        Veuillez saisir votre nouveau mot de passe sécurisé.
                    </p>
                </div>
                <div class="w-full container">
                    <form
                        class="flex flex-col space-y-6 mx-24"
                        @submit.prevent="resetPassword"
                    >
                        <InputIcon
                            v-model="formData.password"
                            :icon="LockClosedIcon"
                            type="password"
                            placeholder="Nouveau mot de passe"
                            class="text-sm w-full"
                        />

                        <InputIcon
                            v-model="formData.passwordConfirm"
                            :icon="LockClosedIcon"
                            type="password"
                            placeholder="Confirmer mot de passe"
                            class="text-sm w-full"
                        />

                        <div class="flex justify-center items-center mx-auto pt-8">
                            <Button
                                type="submit"
                                class="font-bold px-16 md:text-sm sm:text-xs"
                            >
                                Réinitialisez le mot de passe
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="sm:hidden w-screen flex flex-col justify-between relative overflow-hidden">
            <LayoutsHeaderMobile />

            <BackButton to="/login" />

            <div class="flex flex-col items-center space-y-2 px-6 mt-32 text-center">
                <h1 class="text-lg text-primary">
                    Nouveau <span class="font-bold">mot de passe</span>
                </h1>
                <p class="text-gray-400 text-xs">
                    Veuillez saisir votre nouveau mot de passe sécurisé.
                </p>
            </div>

            <div class="w-full container mt-12">
                <form
                    class="flex flex-col space-y-6 px-6"
                    @submit.prevent="resetPassword"
                >
                    <div class="space-y-4">
                        <InputIcon
                            v-model="formData.password"
                            :icon="LockClosedIcon"
                            type="password"
                            label="Nouveau mot de passe"
                            label-class="text-xs text-primary font-bold mb-2 uppercase"
                            placeholder="Saisissez votre mot de passe"
                            class="text-sm w-full"
                        />

                        <InputIcon
                            v-model="formData.passwordConfirm"
                            :icon="LockClosedIcon"
                            type="password"
                            label="Confirmer le nouveau mot de passe"
                            label-class="text-xs text-primary font-bold mb-2 uppercase"
                            placeholder="Saisissez votre mot de passe"
                            class="text-sm w-full"
                        />
                    </div>

                    <div class="flex justify-center items-center mx-auto pt-8">
                        <Button
                            type="submit"
                            class="font-bold px-16 md:text-sm sm:text-xs"
                        >
                            Réinitialisez le mot de passe
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { LockClosedIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue';
import { getErrorMessage } from '~/lib/utils';
import BackButton from '~/components/ui/back-button/BackButton.vue';

const { $toast } = useNuxtApp();

definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Réinitialisation de mot de passe',
});

const formData = ref({
    email: '',
    password: '',
    passwordConfirm: '',
    token: '',
});

// Méthode pour récupérer les paramètres de l'URL
const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    formData.value.email = urlParams.get('email');
    formData.value.token = urlParams.get('token');
};

const { $apifetch } = useNuxtApp();

const resetPassword = async () => {
    getUrlParams();
    if (formData.value.password !== formData.value.passwordConfirm) {
        $toast({
            title: 'Oups! Une erreur s\'est produite',
            description: 'Les mots de passe ne correspondent pas.',
            variant: 'destructive',
        });
    }

    const data = {
        email: formData.value.email,
        password: formData.value.password,
        password_confirmation: formData.value.passwordConfirm,
        token: formData.value.token,
    };

    try {
        const response = await $apifetch('api/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response && response.data && response.data.success) {
            $toast({
                title: 'Succès',
            });
            setTimeout(() => {
                navigateTo('/login');
            }, 2000);
        }
        else {
            $toast({
                title: 'Succès',
                description: 'Votre nouveau mot de passe a été enregistré',
            });
            setTimeout(() => {
                navigateTo('/login');
            }, 2000);
        }
    }
    catch (error: any) {
        console.error('Erreur lors de l\'envoi des données :', error);
        $toast({
            title: 'Oups! Une erreur s\'est produite',
            description: getErrorMessage(error),
            variant: 'destructive',
        });
    }
};
</script>
