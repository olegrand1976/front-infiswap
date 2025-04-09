<template>
    <div class="lg:flex min-h-screen flex-row justify-center">
        <div class="hidden lg:block bg-tertiary/30 xl:w-[110vw] lg:w-[95vw] md:w-[95vw] sm:w-[70vw] relative container">
            <div class="absolute bottom-0 xl:left-32 lg:left-20">
                <LayoutsAppImage
                    src="/auth/Group_1171.png"
                    class="xl:w-[24rem] lg:w-[22rem] relative z-20 flex justify-center mx-auto"
                />
            </div>
            <div class="absolute lg:top-36 lg:left-20 md:top-32 sm:top-64 sm:left-12 ">
                <LayoutsAppImage
                    src="/icons/plus.png"
                    class="xl:w-24 xl:h-24 lg:w-20 lg:h-20 md:w-16 md:h-16 sm:w-11 sm:h-11"
                />
            </div>
            <div class="absolute md:bottom-32 lg:right-20 md:right-12 sm:bottom-28 sm:right-6">
                <LayoutsAppImage
                    src="/icons/Unin.png"
                    class="xl:w-16 xl:h-16 lg:w-12 lg:h-12 md:w-8 md:h-8 sm:w-6 sm:h-6"
                />
            </div>
            <div class="absolute xl:left-24 lg:left-16 md:left-8 xl:bottom-24 lg:bottom-20 md:bottom-16 sm:bottom-12">
                <LayoutsAppImage
                    src="/icons/cog.png"
                    class="xl:w-52 xl:h-52 lg:h-44 lg:w-44 md:h-28 md:w-28 sm:h-20 sm:w-20"
                />
            </div>

            <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                .
            </div>
        </div>

        <div class="lg:hidden">
            <LayoutsHeaderMobile />
        </div>

        <div class="container my-14 overflow-y-hidden lg:w-full md:h-auto flex flex-col justify-center items-center">
            <div class="hidden lg:block">
                <LayoutsAppImage
                    src="logo.png"
                    class="h-14 lg:h-28 mb-4"
                />
            </div>

            <div class="w-full max-w-lg overflow-x-hidden font-light">
                <h1 class="mb-4 px-4 text-sm lg:mb-6 xl:text-base text-center">
                    <span>Bienvenue sur <span class="font-bold text-primary">InfiSwap</span>, la plateforme pour vos remplacements!</span>
                    <span> Pour vous inscrire, veuillez remplir le formulaire ci-dessous.</span>
                </h1>
                <form
                    class="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    @submit.prevent="submit"
                >
                    <div class="col-span-2 relative w-full items-center">
                        <InputIcon
                            v-model="formData.lastname"
                            :icon="UserCircleIcon"
                            size="md"
                            class="border border-gray-300"
                            placeholder="Nom *"
                        />
                    </div>

                    <div class="col-span-2 relative w-full items-center">
                        <InputIcon
                            v-model="formData.firstname"
                            :icon="UserCircleIcon"
                            size="md"
                            class="border border-gray-300"
                            placeholder="Prénoms *"
                        />
                    </div>

                    <div class="col-span-2 relative w-full items-center">
                        <InputIcon
                            v-model="formData.email"
                            :icon="EnvelopeIcon"
                            size="md"
                            class="border border-gray-300"
                            placeholder="Email *"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.phoneNumber"
                            :icon="PhoneIcon"
                            size="md"
                            class="border border-gray-300"
                            placeholder="N° de téléphone"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.password"
                            :icon="LockClosedIcon"
                            size="md"
                            type="password"
                            class="border border-gray-300"
                            placeholder="Mot de passe *"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.passwordConfirmation"
                            :icon="LockClosedIcon"
                            size="md"
                            type="password"
                            placeholder="Mot de passe *"
                            class="border border-gray-300"
                        />
                    </div>

                    <div class="col-span-2">
                        <Select v-model="formData.gender">
                            <SelectTrigger
                                class="flex xl:h-auto sm:h-8 items-center rounded-full border border-gray-300"
                                position="right"
                            >
                                <LayoutsAppImage
                                    src="/icons/gender.png"
                                    class="h-5"
                                />
                                <SelectValue
                                    placeholder="Sexe"
                                    class="ml-3"
                                />
                            </SelectTrigger>
                            <SelectContent class="border border-none">
                                <SelectGroup>
                                    <div
                                        v-for="gender in genders"
                                        :key="gender.value"
                                        class="flex justify-center items-center -ms-3"
                                    >
                                        <SelectItem :value="gender.value">
                                            <span class="text-sm">{{ gender.label }}</span>
                                        </SelectItem>
                                    </div>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.address.street"
                            :icon="MapPinIcon"
                            size="md"
                            class="border border-gray-300"
                            placeholder="Rue *"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.address.zipCode"
                            :icon="InboxArrowDownIcon"
                            size="md"
                            class="border border-gray-300"
                            placeholder="Code postal *"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.address.city"
                            :icon="BuildingOffice2Icon"
                            size="md"
                            class="border border-gray-300"
                            placeholder="Ville *"
                        />
                    </div>

                    <div class="col-span-2">
                        <Select v-model="formData.address.country">
                            <SelectTrigger
                                class="flex justify-between items-center rounded-full border border-gray-300"
                                position="right"
                            >
                                <LayoutsAppImage
                                    src="/icons/flag.png"
                                    class="h-4 ml-2"
                                />
                                <SelectValue
                                    placeholder="Pays"
                                    class="ml-3 block w-full"
                                />
                            </SelectTrigger>
                            <SelectContent class="border border-none w-full">
                                <SelectGroup>
                                    <div
                                        v-for="country in countries"
                                        :key="country.value"
                                        class="flex justify-center items-center -ms-3 w-full"
                                    >
                                        <SelectItem :value="country.value">
                                            <div class="flex w-full">
                                                <LayoutsAppImage
                                                    :src="country.icon"
                                                    :alt="country.name"
                                                    class="xl:w-4 xl:h-3 sm:w-3 sm:h-2 my-auto mr-2"
                                                    format="png"
                                                />
                                                <div class="sm:text-xs xl:text-sm">
                                                    {{ country.label }}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    </div>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.address.additionnalInformation"
                            :icon="EllipsisHorizontalCircleIcon"
                            size="md"
                            class="border border-gray-300"
                            placeholder="Complément d'adresse"
                        />
                    </div>

                    <div class="col-span-2">
                        <Select v-model="formData.accountType">
                            <SelectTrigger
                                class="flex w-full space-x-4 text-sm justify-start items-center rounded-3xl border border-gray-300 disabled:opacity-100 disabled:cursor-default"
                                position="right"
                                disabled
                            >
                                <UsersIcon class="text-primary w-9 h-9 sm:w-7 sm:h-7" />
                                <SelectValue
                                    placeholder="Compte"
                                    class="text-nowrap w-full text-sm ml-3 my-auto"
                                />
                            </SelectTrigger>
                            <SelectContent class="border border-none">
                                <SelectGroup>
                                    <div
                                        v-for="accountOption in accountOptions"
                                        :key="accountOption.value"
                                        class="flex justify-center items-center -ms-3"
                                    >
                                        <SelectItem :value="accountOption.value">
                                            <span class="xl:text-sm sm:text-xs">{{ accountOption.label }}</span>
                                        </SelectItem>
                                    </div>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="col-span-2">
                        <Select v-model="formData.language">
                            <SelectTrigger
                                class="flex w-full space-x-4 xl:text-sm sm:text-xs xl:h-auto sm:h-8 justify-start items-center rounded-3xl border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90"
                                position="right"
                            >
                                <LanguageIcon class="text-primary w-6 h-6" />
                                <SelectValue
                                    placeholder="Langue"
                                    class="text-sm ml-3 my-auto"
                                />
                            </SelectTrigger>
                            <SelectContent class="border border-none">
                                <SelectGroup>
                                    <div
                                        v-for="language in languages"
                                        :key="language.value"
                                        class="flex justify-center items-center -ms-3"
                                    >
                                        <SelectItem :value="language.value">
                                            <span class="xl:text-sm sm:text-xs">{{ language.label }}</span>
                                        </SelectItem>
                                    </div>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="col-span-2 sm:col-span-1 lg:col-span-2">
                        <InputIcon
                            v-model="formData.identifierNumber"
                            :icon="IdentificationIcon"
                            size="md"
                            class="border border-gray-300"
                            placeholder="Numéro INAMI"
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
                <div class="text-sm text-center mt-4">
                    <span>Vous avez déjà un compte ?</span>
                    <NuxtLink
                        to="/login"
                        class="font-bold text-primary underline"
                    >
                        Connexion
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    LockClosedIcon,
    EllipsisHorizontalCircleIcon,
    LanguageIcon,
    IdentificationIcon,
    UsersIcon,
    BuildingOffice2Icon,
    MapPinIcon,
    InboxArrowDownIcon,
} from '@heroicons/vue/24/solid';

import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const genders = [
    {
        value: 'M',
        label: 'Homme',
        name: 'homme',
    },
    {
        value: 'F',
        label: 'Femme',
        name: 'femme',
    },
    {
        value: 'X',
        label: 'X',
        name: 'neutre',
    },
];

const countries = [
    {
        value: 'be',
        label: 'Belgique',
        name: 'belgique',
        icon: '/icons/belgium.png',
    },
    {
        value: 'nl',
        label: 'Pays-Bas',
        name: 'paysBas',
        icon: '/icons/pays-bas.png',
    },
];

const languages = [
    {
        value: 'fr',
        label: 'Français',
        name: 'francais',
    },
    {
        value: 'nl',
        label: 'Nederlands',
        name: 'nederlands',
    },
];

const accountOptions = [
    {
        label: 'Infirmier(ère)',
        value: 'nurse',
    },
    {
        label: 'Groupe d\'infirmiers',
        value: 'group',
    },
];

const formData = reactive({
    lastname: '',
    firstname: '',
    email: '',
    password: '',
    accountType: accountOptions[0].value,
    passwordConfirmation: '',
    gender: 'F',
    language: languages[0].value,
    phoneNumber: undefined,
    identifierNumber: '',
    address: {
        street: '',
        city: '',
        zipCode: '',
        country: countries[0].value,
        additionnalInformation: '',
    },
});

const route = useRoute();
const { register } = useAuth();

const status = ref(
    (route.query.reset ?? '').length > 0 ? atob(route.query.reset as string) : '',
);

const { submit, inProgress } = useSubmit(
    async () => {
        status.value = '';
        return register(formData);
    },
);

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});

useHead({
    title: 'Inscription',
});
</script>
