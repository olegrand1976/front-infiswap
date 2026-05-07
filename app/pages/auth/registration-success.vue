<template>
    <div>
        <div class="bg-tertiary/30 h-screen relative mx-auto flex justify-center items-center">
            <div class="container relative mx-auto p-4 sm:p-4 md:p-5 lg:p-6 mb-12 sm:mb-16 flex flex-col space-y-4 sm:space-y-4 md:space-y-5 xl:space-y-6 justify-center items-center bg-white shadow-lg rounded-xl sm:rounded-2xl w-[90%] sm:w-[80%] md:w-[65%] lg:w-[55%] xl:w-[50%] max-w-2xl">
                <div class="absolute top-2 sm:top-4 left-2 right-2 flex justify-between items-center">
                    <Button
                        variant="link"
                        @click="navigateTo('/')"
                    >
                        Accueil
                    </Button>

                    <span
                        class="mt-[-10px] mr-2"
                        @click="navigateTo('/')"
                    >
                        <XCircle class="h-5 w-5 sm:h-4 sm:w-4 text-primary cursor-pointer" />
                    </span>
                </div>

                <div class="text-center w-full">
                    <div class="mb-4 sm:mb-6">
                        <svg
                            class="mx-auto h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 class="text-primary text-xl sm:text-xl md:text-2xl text-center font-bold mb-4">
                        Inscription réussie !
                    </h1>
                    <p class="text-sm sm:text-sm md:text-base text-center px-4 sm:px-6 mt-4 text-gray-700">
                        Félicitations ! Votre compte a été créé avec succès.
                    </p>
                    <p
                        v-if="userEmail"
                        class="text-xs sm:text-xs md:text-sm text-center px-4 sm:px-6 mt-4 text-gray-600"
                    >
                        Nous vous avons envoyé un email de confirmation à <span class="text-primary font-semibold">{{ userEmail }}</span>.
                        Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.
                    </p>
                    <p
                        v-else
                        class="text-xs sm:text-xs md:text-sm text-center px-4 sm:px-6 mt-4 text-gray-600"
                    >
                        Nous vous avons envoyé un email de confirmation à l'adresse que vous avez fournie lors de l'inscription.
                        Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.
                    </p>
                    <p class="text-xs text-center px-4 sm:px-6 mt-4 text-yellow-600 bg-yellow-50 p-2 sm:p-3 rounded-lg">
                        <strong>Astuce :</strong> Vérifiez également vos spams si vous ne trouvez pas l'email.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full max-w-sm justify-center px-4 sm:px-0">
                    <Button
                        class="w-full sm:w-auto px-4 sm:px-6 text-sm sm:text-base"
                        @click="navigateTo('/login')"
                    >
                        Se connecter
                    </Button>
                </div>

                <div
                    v-if="userEmail"
                    class="mt-4 sm:mt-6 w-full"
                >
                    <hr class="mx-4 sm:mx-8 mb-3 sm:mb-4">
                    <p class="text-xs sm:text-xs md:text-sm text-center text-gray-600 px-4 sm:px-0">
                        Vous n'avez pas reçu l'email ?
                        <Button
                            variant="link"
                            class="p-0 h-auto inline"
                            @click="resendEmail"
                        >
                            Renvoyer l'email de confirmation
                        </Button>
                    </p>
                </div>
            </div>

            <div class="absolute text-primary w-full bg-primary lg:h-12 md:h-16 sm:h-20 h-16 bottom-0">
                .
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Star, XCircle } from 'lucide-vue-next';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { navigateTo } from '#app';

definePageMeta({
    layout: 'minimal',
    middleware: 'guest',
});

const route = useRoute();
const { resendEmailVerification } = useAuth();
const userEmail = ref((route.query.email as string) || '');
const { $toast } = useNuxtApp();

useHead({
    title: 'Inscription réussie',
});

onMounted(() => {
    if (!userEmail.value) {
        $toast({
            variant: 'destructive',
            description: 'Email non trouvé. Redirection vers la page d\'inscription...',
        });
        setTimeout(() => {
            navigateTo('/register');
        }, 2000);
    }
});

const resendEmail = async () => {
    if (userEmail.value) {
        try {
            await resendEmailVerification(userEmail.value);
            $toast({
                description: 'Email de confirmation renvoyé avec succès',
            });
        }
        catch (error) {
            $toast({
                variant: 'destructive',
                description: 'Erreur lors de l\'envoi de l\'email',
            });
        }
    }
};
</script>

<style>

</style>
