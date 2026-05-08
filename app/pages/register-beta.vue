<template>
    <div class="h-screen w-full grid grid-cols-2">
        <Button
            class="hidden lg:inline-block absolute left-5 top-5 z-30 w-24 text-sm"
            @click="goBack"
        >
            Retour
        </Button>
        <div class="hidden lg:block h-screen">
            <LayoutsAppImage
                src="/auth/register-image.jpg"
                alt="Image d'authentification"
                class="object-fill w-full h-screen"
            />
        </div>
        <div class="col-span-2 lg:col-span-1 lg:mb-10 items-center md:flex flex-col justify-center text-primary text-center">
            <div class="h-48 col-span-1 w-full">
                <LayoutsAppImage
                    src="/auth/bg-top-auth.jpg"
                    alt="Image d'authentification"
                    class="h-full md:hidden w-full"
                />
                <LayoutsLogo class="max-w-[90vw] -mt-40 md:mt-4 md:w-1/2 mx-auto" />
            </div>
            <div class="container w-full max-w-lg mx-auto mt-10 md:mt-0">
                <h1 class="text-xl lg:text-2xl mb-10 lg:mb-5">
                    <span class="font-bold">Pré-inscription</span>
                </h1>
                <form
                    class="w-full flex flex-col gap-4 lg:gap-6"
                    @submit.prevent="submit"
                >
                    <div class="relative w-full items-center">
                        <InputIcon
                            v-model="credentials.lastname"
                            :icon="User"
                            size="md"
                            placeholder="Nom"
                            :errors="validationErrors.lastname"
                        />
                    </div>
                    <div class="relative w-full items-center">
                        <InputIcon
                            v-model="credentials.firstname"
                            :icon="UserPlus"
                            size="md"
                            placeholder="Prénom"
                            :errors="validationErrors.firstname"
                        />
                    </div>

                    <div class="relative w-full items-center">
                        <InputIcon
                            v-model="credentials.email"
                            :icon="Mail"
                            type="email"
                            size="md"
                            placeholder="Email"
                            icon-class="h-5"
                            :errors="validationErrors.email"
                        />
                    </div>

                    <div class="relative w-full items-center">
                        <InputIcon
                            v-model="credentials.phoneNumber"
                            :icon="Phone"
                            placeholder="Téléphone"
                            size="md"
                            icon-class="h-5"
                            :errors="validationErrors.phoneNumber"
                        />
                    </div>

                    <div class="relative w-full items-center">
                        <InputIcon
                            v-model="credentials.zipCode"
                            :icon="Map"
                            placeholder="Code postal"
                            size="md"
                            icon-class="h-5"
                            :errors="validationErrors.zipCode"
                        />
                    </div>
                    <div class="col-span-2 lg:col-span-4 mt-4 flex justify-center items-center">
                        <Button
                            class="w-[50%]"
                            type="submit"
                            :in-progress="inProgress"
                        >
                            S'inscrire
                        </Button>
                    </div>
                </form>
            </div>
            <p class="py-4 font-bold">
                Ouverture vers le 15 Mars 2025
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Mail, Map, Phone, Star, User, UserPlus } from 'lucide-vue-next';

import { reactive } from 'vue';
import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';

useHead({
    title: 'Inscription Beta',
});

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
    redirect: '/register',
});
const router = useRouter();
const route = useRoute();
const { registerBeta } = useAuth();

const { $toast } = useNuxtApp();

const goBack = () => {
    if (window.history.length > 1) {
        router.back();
    }
    else {
        router.push('/');
    }
};

const credentials = reactive({
    lastname: '',
    firstname: '',
    email: '',
    phoneNumber: '',
    zipCode: '',
});

const status = ref(
    (route.query.reset ?? '').length > 0 ? atob(route.query.reset as string) : '',
);

const {
    submit,
    inProgress,
    validationErrors,
} = useSubmit(
    () => {
        status.value = '';
        return registerBeta(credentials).then(() => {
            $toast({
                title: 'Succès !',
                description: 'Inscription réussie',
            });

            setTimeout(() => {
                router.push('/');
            }, 10000);
        });
    },
);
</script>
