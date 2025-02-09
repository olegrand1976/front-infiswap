<template>
    <div class="h-screen w-full grid grid-cols-2">
        <Button
            class="hidden lg:inline-block absolute left-5 top-5 z-30 w-24 text-sm"
            @click="goBack"
        >
            Retour
        </Button>
        <div class="hidden lg:block h-screen">
            <NuxtImg
                src="/auth/register-image.jpg"
                alt="Image d'authentification"
                class="object-fill w-full h-screen"
            />
        </div>
        <div class="col-span-2 lg:col-span-1 items-center md:flex flex-col justify-center text-primary text-center">
            <div class="h-48 col-span-1 w-full">
                <NuxtImg
                    src="/auth/bg-top-auth.jpg"
                    alt="Image d'authentification"
                    class="h-full md:hidden w-full"
                />
                <LayoutsLogo class="max-w-[90vw] -mt-40 md:mt-0 md:w-1/2 mx-auto" />
            </div>
            <div class="container w-full max-w-lg mx-auto mt-10 md:mt-0">
                <h1 class="text-xl lg:text-2xl mb-10">
                    <span class="font-bold">Inscription</span> <span class="font-extralight">BETA</span>
                </h1>
                <form
                    class="w-full flex flex-col gap-4 lg:gap-6"
                    @submit.prevent="submit"
                >
                    <div class="relative w-full items-center">
                        <InputIcon
                            v-model="credentials.lastname"
                            :icon="UserIcon"
                            size="md"
                            placeholder="Nom"
                        />
                    </div>
                    <div class="relative w-full items-center">
                        <InputIcon
                            v-model="credentials.firstname"
                            :icon="UserPlusIcon"
                            size="md"
                            placeholder="Prénom"
                        />
                    </div>

                    <div class="relative w-full items-center">
                        <InputIcon
                            v-model="credentials.email"
                            :icon="EnvelopeIcon"
                            type="email"
                            size="md"
                            placeholder="Email"
                            icon-class="h-5"
                        />
                    </div>

                    <div class="relative w-full items-center">
                        <InputIcon
                            v-model="credentials.phoneNumber"
                            :icon="PhoneIcon"
                            placeholder="Téléphone"
                            size="md"
                            icon-class="h-5"
                        />
                    </div>

                    <div class="relative w-full items-center">
                        <InputIcon
                            v-model="credentials.zipCode"
                            :icon="MapIcon"
                            placeholder="Code postale"
                            size="md"
                            icon-class="h-5"
                        />
                    </div>
                    <div class="col-span-2 lg:col-span-4 mt-4 flex justify-center items-center">
                        <Button
                            class="w-[50%]"
                            type="submit"
                        >
                            S'inscrire
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    UserIcon,
    UserPlusIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapIcon,
} from '@heroicons/vue/24/solid';
import { reactive } from 'vue';
import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';

useHead({
    title: 'Inscription Beta',
});

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});
const router = useRouter();
const route = useRoute();
const { registerBeta } = useAuth();

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
    // inProgress,
    // validationErrors,
} = useSubmit(
    () => {
        status.value = '';
        return registerBeta(credentials);
    },
    {
        // onSuccess: () => router.push('/dashboard'),
        onSuccess: () => router.push('/'),
    },
);
</script>
