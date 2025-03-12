<template>
    <div>
        <div class="bg-tertiary/30 h-screen relative mx-auto flex justify-center items-center">
            <div class="container relative mx-auto lg:p-6 sm:p-4 mb-16 flex flex-col xl:space-y-8 sm:space-y-6 justify-center items-center bg-white shadow-lg rounded-2xl md:w-[65%] sm:w-[70%]">
                <div class="absolute sm:top-4 sm:right-4">
                    <span @click="navigateTo('/')"><XCircle class="h-4 w-4 text-primary cursor-pointer" /></span>
                </div>

                <div class="mx-auto flex justify-center space-x-5 items-center">
                    <div>
                        <NuxtImg
                            src="/auth/Group_1108.png"
                            alt="Boite email"
                            class="xl:w-36 xl:h-48 lg:w-28 lg:h-40 md:w-24 md:h-36 sm:w-20 sm:h-32"
                        />
                    </div>
                    <div>
                        <NuxtImg
                            src="/stetho.png"
                            alt="Boite email"
                            class="xl:w-36 lg:w-28 md:w-24 sm:w-20"
                        />
                    </div>
                </div>

                <div>
                    <h1 class="text-primary md:text-2xl sm:text-xl text-center">
                        Confirmation <span class="font-bold">par email</span>
                    </h1>
                    <p class="md:text-sm sm:text-xs text-center xl:mx-44 lg:mx-32 md:mx-16 sm:mx-12 mt-6">
                        Nous avons envoyé un email à <span class="text-primary font-semibold"> {{ user.email }}</span>
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
                            @click="resendEmailVerification"
                        >
                            renvoyer le mail de confirmation
                        </Button>.
                    </p>
                </div>
            </div>

            <div class="absolute text-primary w-full bg-primary lg:h-12 md:h-16 sm:h-20 bottom-0">
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
