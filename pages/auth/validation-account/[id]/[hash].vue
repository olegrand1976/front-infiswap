<template>
    <div class="bg-tertiary/30 h-screen relative mx-auto flex justify-center items-center">
        <div class="container relative mx-auto lg:p-6 sm:p-4 mb-16 flex flex-col xl:space-y-8 sm:space-y-6 justify-center items-center bg-white shadow-lg rounded-2xl md:w-[65%] sm:w-[85%] w-[90%]">
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

            <div class="mx-auto flex justify-center space-x-5 items-center">
                <LayoutsAppImage
                    src="auth/Group_1108.png"
                    alt="Boite email"
                    class="pt-4 w-28 h-30 sm:w-24 sm:h-24 md:w-28 md:h-36 lg:w-32 lg:h-44 xl:w-36 xl:h-48"
                />
            </div>

            <div>
                <h1 class="text-primary md:text-2xl sm:text-xl text-center">
                    Validation de votre compte
                </h1>
                <p
                    class="md:text-sm sm:text-xs text-center xl:mx-44 lg:mx-32 md:mx-16 sm:mx-12 mt-6"
                >
                    <RollingLoader
                        v-if="loading"
                        :loading="loading"
                    />
                    <template v-else-if="errorMessage">
                        <span class="text-red-500">{{ errorMessage }}</span>
                    </template>
                    <template v-else>
                        <span>Votre compte a été validé avec succès ! Vous allez être redirigé vers notre page de connexion.</span>
                    </template>
                </p>
            </div>

            <div>
                <hr class="mx-8">
                <p class="md:text-sm sm:text-xs xl:mt-8 sm:mt-6 text-center">
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

definePageMeta({
    layout: 'guest',
});

const user = useUser();
const { validateEmail } = useAuth();
const route = useRoute();
const loading = ref(true);
const errorMessage = ref('');

useHead({
    title: 'Validation de compte',
});

onMounted(async () => {
    const id = route.params.id as string;
    const hash = route.params.hash as string;

    if (!id || !hash) {
        errorMessage.value = 'Lien de vérification invalide.';
        loading.value = false;
        return;
    }

    try {
        await validateEmail(id, hash);
        setTimeout(() => {
            navigateTo('/login');
        }, 2000);
    }
    catch (error) {
        errorMessage.value = error.message;
    }
    finally {
        loading.value = false;
    }
});

const { resendEmailVerification } = useAuth();
</script>
