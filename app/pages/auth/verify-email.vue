<template>
    <div>
        <div class="bg-tertiary/30 h-screen relative mx-auto flex justify-center items-center">
            <div class="container relative mx-auto lg:p-6 sm:p-4 mb-16 flex flex-col xl:space-y-8 sm:space-y-6 justify-center items-center bg-white shadow-lg rounded-2xl md:w-[65%] sm:w-[85%] w-[90%]">
                <div class="absolute top-2 sm:top-4 left-2 right-2 flex justify-between items-center">
                    <Button
                        variant="link"
                        @click="navigateTo('/')"
                    >
                        Accueil
                    </Button>.

                    <span
                        class="mt-[-10px] mr-2"
                        @click="navigateTo('/')"
                    >
                        <XCircle class="h-5 w-5 sm:h-4 sm:w-4 text-primary cursor-pointer" />
                    </span>
                </div>

                <div class="mx-auto flex justify-center space-x-5 items-center">
                    <div>
                        <LayoutsAppImage
                            src="auth/Group_1108.png"
                            alt="Boite email"
                            class="pt-4 w-28 h-30 sm:w-24 sm:h-24 md:w-28 md:h-36 lg:w-32 lg:h-44 xl:w-36 xl:h-48"
                        />
                    </div>
                </div>

                <div>
                    <h1 class="text-primary md:text-2xl sm:text-xl text-center">
                        Confirmation <span class="font-bold">par email</span>
                    </h1>
                    <p class="md:text-sm sm:text-xs text-center xl:mx-44 lg:mx-32 md:mx-16 sm:mx-12 mt-6">
                        Nous vous avons envoyé un email à <span class="text-primary font-semibold">{{ user.email }}</span>
                        pour confirmer la validité de votre adresse email. Après avoir reçu l'email, suivez le
                        lien fourni pour finaliser votre inscription
                    </p>
                </div>

                <div>
                    <hr class="mx-8">
                    <p class="md:text-sm sm:text-xs xl:mt-8 sm:mt-6 text-center">
                        Si vous n'avez pas encore reçu de mail,
                        <Button
                            variant="link"
                            @click="resendEmailVerification(user.email)"
                        >
                            renvoyer le mail de confirmation
                        </Button>.
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
import { XCircle } from 'lucide-vue-next';
import { navigateTo } from '#app';

definePageMeta({
    layout: 'auth',
    middleware: 'unverified',
});

const user = useUser();
const { resendEmailVerification } = useAuth();
useHead({
    title: 'Vérification d\'adresse email ',
});
</script>

<style>

</style>
