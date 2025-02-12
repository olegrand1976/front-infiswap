<template>
    <div class="">
        <div class="hidden sm:flex flex-row justify-center md:h-auto lg:pt-0 sm:pt-48">
            <div class="bg-tertiary/30 xl:h-screen lg:h-auto lg:block w-[115vw] hidden relative container">
                <div class="xl:absolute z-20 bottom-0 left-44">
                    <NuxtImg
                        src="/auth/Group_1164.png"
                        class="xl:w-[20rem] z-20 lg:w-64 mt-24 relative lg:flex lg:justify-center lg:mx-auto"
                    />
                </div>
                <div class="absolute lg:top-36 lg:left-20">
                    <NuxtImg
                        src="/icons/plus.png"
                        class="xl:w-24 xl:h-24 lg:w-20 lg:h-20"
                    />
                </div>
                <div class="absolute md:bottom-32 lg:right-20">
                    <NuxtImg
                        src="/icons/Unin.png"
                        class="xl:w-16 xl:h-16 lg:w-12 lg:h-12"
                    />
                </div>

                <div class="absolute md:right-6 md:top-6 sm:right-4 sm:top-3">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute bottom-24 left-24">
                    <NuxtImg
                        src="/icons/cog.png"
                        class="w-52 h-52"
                    />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white overflow-hidden container sm:w-full md:w-[80%] lg:w-full flex flex-col space-y-12 justify-center items-center">
                <div>
                    <LayoutsLogo class="lg:w-[22rem] lg:h-28 md:w-[20rem] md:h-[6.5rem] sm:w-[17rem] sm:h-[5rem]" />
                </div>

                <div class="w-full max-w-md container">
                    <form @submit.prevent="submit">
                        <div class="flex flex-col space-y-4">
                            <!-- <FormField name="inami">
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
                            </FormField> -->

                            <FormField name="inami">
                            <FormItem class="flex space-x-1 px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex w-full items-center space-x-1">
                                        <span class="text-primary font-extrabold">N°</span>
                                        <Input
                                            v-model="inami"
                                            type="text"
                                            placeholder="INAMI"
                                            class="text-sm"
                                            v-bind="inamiAttrs" 
                                        />
                                    </div>
                                    
                                </FormControl>
                            </FormItem>
                            <ErrorMessage name="inami" class="text-red-500 text-xs mt-5     " />
                        </FormField> 

                            <!-- <FormField name="password">
                                <FormItem class="flex justify-between px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                    <FormControl>
                                        <div class="flex w-full items-center space-x-1">
                                            <KeyIcon class="text-primary w-6 h-6" />
                                            <Input
                                                v-model="credentials.password"
                                                type="password"
                                                placeholder="Mot de passe"
                                                class="text-sm"
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            </FormField> -->

                            <FormField name="password">
                                <FormItem class="flex justify-between px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                    <FormControl>
                                        <div class="flex w-full items-center space-x-1">
                                            <KeyIcon class="text-primary w-6 h-6" />
                                            <Input
                                                v-model="password"
                                                type="password"
                                                placeholder="Mot de passe"
                                                class="text-sm"
                                                v-bind="passwordAttrs" 
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                                <ErrorMessage name="password" class="text-red-500 text-xs mt-5     " />

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
                                to="/auth/reset-password"
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
                                    class="w-4 h-4"
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
            <div class="relative flex flex-col">
                <div class="absolute inset-0 z-0">
                    <NuxtImg
                        src="/Mask_group.png"
                        class="w-full h-48"
                    />
                </div>
                <div class="flex z-20 pt-2 relative space-x-3 justify-end items-center px-4">
                    <div>
                        <LayoutsDropdownLang />
                    </div>
                    <div>
                        <LayoutsSheetMenu />
                    </div>
                </div>
                <div class="mt-5 z-20 relative flex justify-center">
                    <LayoutsLogo class="w-[15rem] h-20" />
                </div>
            </div>

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
                                            v-bind="inamiAttrs" 
                                        />
                                    </div>

                                </FormControl>
                            </FormItem>
                        </FormField> 

                       

                        <FormField name="password">
                            <FormItem class="flex justify-between px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex w-full items-center space-x-1">
                                        <KeyIcon class="text-primary w-5 h-5" />
                                        <Input
                                            v-model="credentials.password"
                                            type="password"
                                            placeholder="Mot de passe"
                                            class="text-sm"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
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
                            to="/"
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
                                class="w-4 h-4"
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from "@/components/ui/input";
import { useForm, defineRule, configure, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { localize } from '@vee-validate/i18n';
import fr from '@vee-validate/i18n/dist/locale/fr.json';


definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});

useHead({
    title: 'Connexion',
});


configure({
  generateMessage: localize({ fr }),
  validateOnBlur: true,
  validateOnInput: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
});



const schema = yup.object({
    password: yup.string()
        .required('Le mot de passe est obligatoire')
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .max(50, 'Le mot de passe ne peut pas dépasser 50 caractères')
        .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
        .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .matches(/\d/, 'Le mot de passe doit contenir au moins un chiffre'),
        //.matches(/[\W_]/, 'Le mot de passe doit contenir au moins un caractère spécial'),

    inami: yup.string()
        .required('Le numéro INAMI est obligatoire')
        .matches(/^\d+$/, 'Le numéro INAMI ne peut contenir que des chiffres')
        .min(2, 'Le numéro INAMI doit contenir au moins 2 chiffres')
        .max(50, 'Le numéro INAMI ne peut pas dépasser 50 chiffres'),
});



const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
});

const [password, passwordAttrs] = defineField('password');
const [inami, inamiAttrs] = defineField('inami');

const router = useRouter();
const route = useRoute();
const { login } = useAuth();

const status = ref(
    (route.query.reset ?? '').length > 0 ? atob(route.query.reset as string) : '',
);

const credentials = reactive({
    inami: null,
    password: '',
});

const {
    submit,
    inProgress,
    // validationErrors: errors,
} = useSubmit(
    () => {
        status.value = '';
        return login(credentials).then(() => router.push('/dashboard/replacement'));
    },
);
</script>

<style scoped>
html, body {
  height: 100%;
  overflow: hidden;
}
</style>
