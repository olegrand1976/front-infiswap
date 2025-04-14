<template>
    <div>
        <div class="hidden sm:flex flex-row justify-center h-auto sm:pt-[25vh] xl:pt-0">
            <div class="bg-tertiary/30 hidden lg:flex flex-col items-center lg:w-[115vw] relative container">
                <div class="flex justify-center items-center my-auto">
                    <LayoutsAppImage
                        src="/auth/Group_1170.png"
                        class="w-72"
                    />
                </div>

                <div class="absolute right-6 top-6">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white container w-full xl:h-[100vh] lg:h-[50vh] flex flex-col lg:space-y-8 space-y-12 justify-center items-center">
                <div>
                    <LayoutsLogo class="w-64" />
                </div>
                <h1 class="md:text-2xl sm:text-xl text-center text-primary">
                    Vérifiez votre<span class="font-bold"> boite email</span>
                </h1>
                <p class="text-center lg:w-96">
                    Entrez le code à 6 chiffres qui a été envoyé à votre adresse e-mail
                </p>
                <NuxtLink
                    to="/"
                    class="underline text-blue-500 xl:text-sm sm:text-xs"
                >
                    Renvoyer l'email
                </NuxtLink>

                <Form @submit="submit">
                    <div class="flex items-center justify-center">
                        <PinInput
                            id="pin-input"
                            v-model="pinValue"
                            placeholder="○"
                        >
                            <PinInputGroup>
                                <PinInputInput
                                    v-for="(id, index) in 6"
                                    :key="id"
                                    :index="index"
                                    class="w-12 h-12"
                                />
                            </PinInputGroup>
                        </PinInput>
                    </div>

                    <div class="flex flex-row justify-center space-x-12 mt-16">
                        <div>
                            <NuxtLink to="/">
                                <Button
                                    variant="outline"
                                    class="w-full rounded-full px-16"
                                >
                                    Retour
                                </Button>
                            </NuxtLink>
                        </div>
                        <div>
                            <Button
                                type="submit"
                                class="w-full px-16"
                                :in-progress="inProgress"
                            >
                                Vérifier
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>

        <div class="sm:hidden w-screen flex flex-col justify-between relative overflow-hidden">
            <LayoutsHeaderMobile />

            <div class="container mt-32 flex flex-col space-y-8">
                <h1 class="text-lg text-center text-primary">
                    Vérifiez votre <span class="font-bold">email</span>
                </h1>
                <p class="text-center text-sm">
                    Entrez le code à 6 chiffres qui a été envoyé à votre adresse e-mail
                </p>
                <NuxtLink
                    to="/"
                    class="underline text-blue-500 text-xs text-center"
                >
                    Renvoyer l'email
                </NuxtLink>
            </div>

            <Form
                class="mt-12"
                @submit="submit"
            >
                <div class="flex items-center justify-center">
                    <PinInput
                        id="pin-input"
                        v-model="pinValue"
                        placeholder="○"
                    >
                        <PinInputGroup class="gap-x-4">
                            <template
                                v-for="(id, index) in 6"
                                :key="id"
                            >
                                <PinInputInput
                                    class="rounded-md border w-10 h-10"
                                    :index="index"
                                />
                                <template v-if="index !== 5">
                                    <PinInputSeparator class="hidden" />
                                </template>
                            </template>
                        </PinInputGroup>
                    </PinInput>
                </div>

                <div class="flex flex-row justify-center space-x-8 mt-16">
                    <div>
                        <NuxtLink to="/auth/login">
                            <Button
                                variant="outline"
                                class="w-full rounded-full px-16"
                            >
                                Retour
                            </Button>
                        </NuxtLink>
                    </div>
                    <div>
                        <Button
                            type="submit"
                            class="w-full rounded-full px-16"
                            :in-progress="inProgress"
                        >
                            Vérifier
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    PinInput,
    PinInputGroup,
    PinInputInput,
    PinInputSeparator,
} from '@/components/ui/pin-input';
import { useCookie, useRouter } from '#app';
import { AUTH_TOKEN } from '~/lib/constants';

const { $toast } = useNuxtApp();
const router = useRouter();

const { verify2fa, refresh } = useAuth();

const pinValue = ref<string[]>([]);
const hash = useCookie('2fa_hash');

const { submit, inProgress } = useSubmit(
    async () => {
        const credentials = {
            hash: hash.value,
            two_factor_code: pinValue.value.join(''),
        };

        const response = await verify2fa(credentials);
        useCookie(AUTH_TOKEN).value = response.token;
        await refresh();

        useCookie('2fa_hash').value = '';
        pinValue.value = [];

        return router.push('/dashboard');
    },
    {
        onError: () => {
            $toast({
                description: 'Code incorrect',
                variant: 'destructive',
            });
        },
    },
);

definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Vérification 2FA',
});
</script>
