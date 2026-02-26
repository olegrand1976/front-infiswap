<template>
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
                    <XCircleIcon class="h-5 w-5 sm:h-4 sm:w-4 text-primary cursor-pointer" />
                </span>
            </div>

            <div class="mx-auto flex justify-center space-x-5 items-center mb-4">
                <LayoutsAppImage
                    src="auth/Group_1108.png"
                    alt="Boite email"
                    class="pt-2 sm:pt-4 w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 lg:w-32 lg:h-40 xl:w-36 xl:h-44"
                />
            </div>

            <div class="w-full">
                <h1 class="text-primary text-xl sm:text-xl md:text-2xl text-center font-bold mb-4">
                    Validation de votre compte
                </h1>
                <p
                    class="text-sm sm:text-sm md:text-base text-center px-4 sm:px-6 mt-4"
                >
                    <span
                        v-if="validated"
                        class="flex justify-center py-12 text-success font-semibold"
                    >
                        Votre compte a été validé avec succès !
                    </span>
                    <span
                        v-else
                        class="flex justify-center py-12"
                    >
                        <RollingLoader
                            :loading="loading"
                        />
                    </span>
                </p>
            </div>

            <div class="mt-4 sm:mt-6 w-full">
                <hr class="mx-4 sm:mx-8 mb-3 sm:mb-4">
                <p class="text-xs sm:text-xs md:text-sm text-center px-4 sm:px-0">
                    Si vous rencontrez des problèmes, vous pouvez
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
</template>

<script lang="ts" setup>
import { XCircleIcon } from '@heroicons/vue/24/outline';
import { navigateTo } from '#app';
import RollingLoader from '~/components/RollingLoader.vue';

definePageMeta({
    layout: 'minimal',
});

const user = useUser();
const { validateEmail, resendEmailVerification, loading } = useAuth();
const route = useRoute();
const validated = ref(false);

useHead({
    title: 'Validation de compte',
});

onMounted(async () => {
    const { id, hash } = route.params;

    if (!id || !hash) {
        return;
    }

    validated.value = await validateEmail(id as string, hash as string);

    if (validated.value) {
        setTimeout(() => {
            navigateTo('/login');
        }, 1000);
    }
});
</script>
