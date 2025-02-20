<template>
    <div>
        <div class="hidden sm:flex flex-row justify-center md:h-auto xl:pt-0 sm:pt-48">
            <div class="bg-tertiary/30 xl:h-screen lg:h-auto lg:block w-[115vw] hidden relative container">
                <div class="xl:absolute z-20 bottom-0 left-1/3">
                    <NuxtImg
                        src="/auth/Group_1164.png"
                        class="xl:w-[20rem] z-20 lg:w-64 mt-24 relative flex justify-center mx-auto"
                    />
                </div>
                <div class="absolute top-36 left-20">
                    <NuxtImg
                        src="/icons/plus.png"
                        class="xl:w-24 lg:w-20"
                    />
                </div>
                <div class="absolute bottom-32 right-20">
                    <NuxtImg
                        src="/icons/Unin.png"
                        class="xl:w-16 lg:w-12"
                    />
                </div>

                <div class="absolute right-6 top-6">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute bottom-24 left-24">
                    <NuxtImg
                        src="/icons/cog.png"
                        class="w-52"
                    />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white overflow-hidden container sm:w-full md:w-[80%] lg:w-full flex flex-col space-y-12 justify-center items-center">
                <div>
                    <LayoutsLogo class="lg:w-80 sm:w-72" />
                </div>

                <div class="w-full max-w-md container">
                    <form @submit.prevent="submit">
                        <div class="flex flex-col space-y-4">
                            <FormField name="inami">
                                <FormItem class="flex space-x-1 px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                    <FormControl>
                                        <div class="flex w-full items-center space-x-1">
                                            <span class="text-primary font-extrabold">N°</span>
                                            <Input
                                                v-model="credentials.inami"
                                                type="text"
                                                placeholder="INAMI"
                                                class="text-sm"
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            </FormField>

                            <FormField name="password">
                                <FormItem class="flex justify-between px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                    <FormControl>
                                        <div class="flex w-full items-center space-x-1">
                                            <KeyIcon class="text-primary w-6" />
                                            <Input
                                                v-model="credentials.password"
                                                type="password"
                                                placeholder="Mot de passe"
                                                class="text-sm"
                                                @blur="validateField('password')"
                                                @input="validateField('password')"
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                                <p
                                    v-if="error.password"
                                    class="text-red-500 text-xs mt-1 ms-[5%]"
                                >
                                    {{ error.password }}
                                </p>
                            </FormField>
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
                                to="/password/reset/reset-password"
                                class="text-primary"
                            >
                                *Mot de passe oublié
                            </NuxtLink>
                        </div>

                        <div class="flex flex-col justify-center items-center mx-auto mt-12 space-y-7">
                            <Button
                                variant="secondary"
                                class="md:w-80 sm:w-64 shadow flex justify-center space-x-2 items-center md:text-base sm:text-xs"
                            >
                                <NuxtImg
                                    src="/icons/google.png"
                                    alt="Google"
                                    class="w-4"
                                />
                                <span>
                                    Se connecter avec Google
                                </span>
                            </Button>
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

            <div class="flex flex-col justify-center items-center px-6 flex-grow">
                <form
                    class="w-full max-w-sm"
                    @submit.prevent="submit"
                >
                    <div class="flex flex-col space-y-6">
                        <FormField name="inami">
                            <FormItem class="flex space-x-1 px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex w-full items-center space-x-1">
                                        <span class="text-primary font-extrabold">N°</span>
                                        <Input
                                            v-model="credentials.inami"
                                            type="text"
                                            placeholder="INAMI"
                                            class="text-sm"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>

                        <FormField name="password">
                            <FormItem class="flex justify-between px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex w-full items-center space-x-1">
                                        <KeyIcon class="text-primary w-5" />
                                        <Input
                                            v-model="credentials.password"
                                            type="password"
                                            placeholder="Mot de passe"
                                            class="text-sm"
                                            @blur="validateField('password')"
                                            @input="validateField('password')"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            <p
                                v-if="error.password"
                                class="text-red-500 text-xs mt-1 ms-[5%]"
                            >
                                {{ error.password }}
                            </p>
                        </FormField>
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
                            to="/password/reset/reset-password"
                            class="text-primary"
                        >*Mot de passe oublié</NuxtLink>
                    </div>

                    <div class="flex flex-col justify-center items-center mx-auto mt-12 space-y-7">
                        <Button
                            variant="secondary"
                            class="w-80"
                        >
                            <NuxtImg
                                src="/icons/google.png"
                                alt="Google"
                                class="w-4"
                            />
                            <span>Se connecter avec Google</span>
                        </Button>
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
import { KeyIcon } from '@heroicons/vue/24/solid';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const router = useRouter();
const route = useRoute();
const { login } = useAuth();
const { $toast } = useNuxtApp();

const status = ref(
    (route.query.reset ?? '').length > 0 ? atob(route.query.reset as string) : '',
);

const credentials = reactive({
    inami: null,
    password: '',
});

const error = reactive({
    password: '',
});

const schema = yup.object({
    password: yup.string()
        .required('Le mot de passe est obligatoire')
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
        .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .matches(/\d/, 'Le mot de passe doit contenir au moins un chiffre'),
});

const validateField = async (field: keyof typeof credentials) => {
    try {
        await schema.validateAt(field, toRaw(credentials));
        error[field] = '';
    }
    catch (err) {
        error[field] = (err as yup.ValidationError).message;
    }
};

const { submit, inProgress } = useSubmit(
    () => {
        status.value = '';
        return login(credentials).then(() => {
            Object.keys(credentials).forEach((key) => {
                credentials[key as keyof typeof credentials] = key === 'accept' ? false : '';
            });
            inProgress.value = true;

            setTimeout(() => {
                router.push('/dashboard/replacement');
            }, 3000);
        });
    },
    {
        onError: () => {
            $toast({
                title: 'Erreur',
                description: 'Identifiant ou mot de passe incorrect',
                variant: 'destructive',
            });
        },
    },
);

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});

useHead({
    title: 'Connexion',
});
</script>

<style scoped>
html, body {
  height: 100%;
  overflow: hidden;
}
</style>
