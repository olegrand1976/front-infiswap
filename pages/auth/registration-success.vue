<template>
    <div>
        <div class="bg-tertiary/30 h-screen relative mx-auto flex justify-center items-center">
            <div class="container relative mx-auto lg:p-6 sm:p-4 mb-16 flex flex-col xl:space-y-6 sm:space-y-4 justify-center items-center bg-white shadow-lg rounded-2xl md:w-[50%] sm:w-[75%] w-[90%] max-w-2xl">
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
                        <XCircleIcon class="h-5 w-5 sm:h-4 sm:w-4 text-primary cursor-pointer" />
                    </span>
                </div>

                <div class="text-center w-full">
                    <div class="mb-6">
                        <svg
                            class="mx-auto h-16 w-16 text-green-500"
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
                    <h1 class="text-primary md:text-2xl sm:text-xl text-center font-bold mb-4">
                        Inscription réussie !
                    </h1>
                    <p class="md:text-base sm:text-sm text-center px-6 mt-4 text-gray-700">
                        Félicitations ! Votre compte a été créé avec succès.
                    </p>
                    <p class="md:text-sm sm:text-xs text-center px-6 mt-4 text-gray-600">
                        Nous vous avons envoyé un email de confirmation à <span class="text-primary font-semibold">{{ userEmail }}</span>.
                        Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.
                    </p>
                    <p class="md:text-xs sm:text-xs text-center px-6 mt-4 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                        <strong>Astuce :</strong> Vérifiez également vos spams si vous ne trouvez pas l'email.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-sm justify-center">
                    <Button
                        class="w-full sm:w-auto px-6"
                        @click="navigateTo('/login')"
                    >
                        Se connecter
                    </Button>
                </div>

                <div class="mt-6 w-full">
                    <hr class="mx-8 mb-4">
                    <p class="md:text-sm sm:text-xs text-center text-gray-600">
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
import { XCircleIcon } from '@heroicons/vue/24/outline';
import { navigateTo } from '#app';

definePageMeta({
    layout: 'empty',
    middleware: 'guest',
});

const route = useRoute();
const { resendEmailVerification } = useAuth();
const userEmail = ref(route.query.email as string || '');
const { $toast } = useNuxtApp();

useHead({
    title: 'Inscription réussie',
});

const resendEmail = async () => {
    if (userEmail.value) {
        try {
            await resendEmailVerification(userEmail.value);
            $toast({
                description: 'Email de confirmation renvoyé avec succès',
            });
        } catch (error) {
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
