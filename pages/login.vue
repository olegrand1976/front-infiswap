<template>
    <div>
        <div class="hidden sm:flex flex-row justify-center md:h-auto xl:pt-0 sm:pt-48">
            <div class="bg-tertiary/30 xl:h-screen lg:h-auto lg:block w-[115vw] hidden relative container">
                <div class="xl:absolute z-20 bottom-0 left-1/3">
                    <LayoutsAppImage
                        src="/auth/Group_1164.png"
                        class="xl:w-[20rem] z-20 lg:w-64 mt-24 relative flex justify-center mx-auto"
                    />
                </div>
                <div class="absolute top-36 left-20">
                    <LayoutsAppImage
                        src="/icons/plus.png"
                        class="xl:w-24 lg:w-20"
                    />
                </div>
                <div class="absolute bottom-32 right-20">
                    <LayoutsAppImage
                        src="/icons/Unin.png"
                        class="xl:w-16 lg:w-12"
                    />
                </div>

                <div class="absolute right-6 top-6">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute bottom-24 left-24">
                    <LayoutsAppImage
                        src="/icons/cog.png"
                        class="w-52"
                    />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white overflow-hidden container sm:w-full md:w-[80%] lg:w-full flex flex-col space-y-12 justify-center items-center relative">
                <BackButton to="/" />
                <div>
                    <LayoutsLogo class="lg:w-80 sm:w-72" />
                </div>

                <div class="w-full max-w-md container">
                    <form @submit.prevent="submit">
                        <div class="flex flex-col space-y-4">
                            <div class="flex w-full items-center space-x-1">
                                <InputIcon
                                    v-model="credentials.identifier"
                                    :icon="UserIcon"
                                    type="text"
                                    placeholder="Email"
                                    class="text-sm w-full"
                                />
                            </div>

                            <div class="flex w-full items-center space-x-1">
                                <InputIcon
                                    v-model="credentials.password"
                                    :icon="LockClosedIcon"
                                    type="password"
                                    placeholder="Mot de passe"
                                    class="text-sm w-full"
                                />
                            </div>
                        </div>

                        <div class="flex justify-between lg:text-sm text-xs items-center md:mt-6 sm:mt-4">
                            <div class="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label
                                    for="remember"
                                    class="font-sans font-light text-primary leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Se souvenir de moi
                                </label>
                            </div>

                            <NuxtLink
                                to="/password/reset-password"
                                class="text-primary"
                            >
                                *Mot de passe oublié
                            </NuxtLink>
                        </div>

                        <div class="flex flex-col justify-center items-center mx-auto mt-12 space-y-7">
                            <!-- <Button
                                variant="secondary"
                                class="md:w-80 sm:w-64 shadow flex justify-center space-x-2 items-center md:text-base sm:text-xs"
                            >
                                <LayoutsAppImage
                                    src="/icons/google.png"
                                    alt="Google"
                                    class="w-4"
                                />
                                <span>
                                    Se connecter avec Google
                                </span>
                            </Button> -->
                            <Button
                                class="md:w-80 sm:w-64 hover:shadow-lg md:text-base sm:text-xs"
                                type="submit"
                                :in-progress="inProgress"
                            >
                                Se connecter
                            </Button>
                        </div>
                    </form>
                </div>

                <div>
                    <p class="text-xs">
                        Vous n'avez pas encore de compte ?
                        <NuxtLink
                            to="/register"
                            class="font-bold text-primary underline"
                        >
                            Inscrivez-vous
                        </NuxtLink>
                    </p>
                </div>
            </div>
        </div>

        <div class="sm:hidden min-h-screen w-screen flex flex-col justify-between relative overflow-hidden">
            <LayoutsHeaderMobile />

            <BackButton to="/" />

            <div class="flex flex-col justify-center items-center px-6 flex-grow">
                <form
                    class="w-full max-w-sm"
                    @submit.prevent="submit"
                >
                    <div class="flex flex-col space-y-6">
                        <div class="flex w-full items-center space-x-1">
                            <InputIcon
                                v-model="credentials.identifier"
                                :icon="UserIcon"
                                type="text"
                                placeholder="Email"
                                class="text-sm w-full"
                            />
                        </div>

                        <div class="flex w-full items-center space-x-1">
                            <InputIcon
                                v-model="credentials.password"
                                :icon="LockClosedIcon"
                                type="password"
                                placeholder="Mot de passe"
                                class="text-sm w-full"
                            />
                        </div>
                    </div>

                    <div class="flex justify-between text-xs mt-4">
                        <div class="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <label
                                for="remember"
                                class="font-light text-primary leading-none"
                            >Se souvenir de moi</label>
                        </div>

                        <NuxtLink
                            to="/password/reset-password"
                            class="text-primary"
                        >*Mot de passe oublié</NuxtLink>
                    </div>

                    <div class="flex flex-col justify-center items-center mx-auto mt-12 space-y-7">
                        <!-- <Button
                            variant="secondary"
                            class="w-80"
                        >
                            <LayoutsAppImage
                                src="/icons/google.png"
                                alt="Google"
                                class="w-4"
                            />
                            <span>Se connecter avec Google</span>
                        </Button> -->
                        <Button
                            class="w-80"
                            type="submit"
                            :in-progress="inProgress"
                        >
                            Se connecter
                        </Button>
                    </div>
                </form>
            </div>

            <div class="text-xs text-center mt-4 mb-8">
                <p>
                    Vous n'avez pas encore de compte ?
                    <NuxtLink
                        to="/register"
                        class="font-bold text-primary underline"
                    >Inscrivez-vous</NuxtLink>
                </p>
            </div>

            <div class="bg-primary text-primary h-10 w-full mt-auto" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { LockClosedIcon, UserIcon } from '@heroicons/vue/24/solid';
import { useCookie } from '#app';
import { Checkbox } from '@/components/ui/checkbox';
import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';
import Button from '~/components/ui/button/Button.vue';
import BackButton from '~/components/ui/back-button/BackButton.vue';
import { getErrorMessage } from '~/lib/utils';

const router = useRouter();
const { login } = useAuth();

const credentials = reactive({
    identifier: null,
    password: '',
});

const { submit, inProgress } = useSubmit(
    async () => {
        await login(credentials);

        await nextTick();

        if (useCookie('2fa_hash').value) {
            return router.push('/2fa-challenge');
        }
        else {
            return router.push('/dashboard');
        }
    },
);

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});

useHead({
    title: 'Connexion',
    meta: [
        {
            name: 'description',
            content:
                'Connectez-vous à InfiSwap pour accéder à votre espace professionnel, gérer vos remplacements infirmiers, consulter vos missions et profiter de toutes les fonctionnalités de la plateforme. Authentification sécurisée pour infirmiers indépendants en Belgique et en France.',
        },
    ],
});
</script>

<style scoped>
html, body {
  height: 100%;
  overflow: hidden;
}
</style>
