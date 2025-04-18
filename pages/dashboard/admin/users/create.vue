<template>
    <div>
        <DashboardAdminPageHeader title="Nouvel utilisateur" />
        <DashboardAdminPageContent class="bg-gray-100">
            <form @submit.prevent="submit">
                <div class="grid grid-cols-3 gap-4 lg:gap-8">
                    <div class="p-4 hidden lg:block">
                        <h1 class="font-semibold text-gray-600">
                            Information
                        </h1>
                        <p class="mt-2 text-md text-gray-500">
                            Les information personnelles
                        </p>
                    </div>
                    <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                        <div>
                            <InputIcon
                                v-model="form.lastname"
                                rounded="md"
                                label="Nom"
                            />
                        </div>
                        <div>
                            <InputIcon
                                v-model="form.firstname"
                                rounded="md"
                                label="Prénom"
                            />
                        </div>
                        <div>
                            <InputIcon
                                v-model="form.identifierNumber"
                                rounded="md"
                                label="INAMI"
                            />
                        </div>
                        <div>
                            <InputIcon
                                v-model="form.email"
                                rounded="md"
                                type="email"
                                label="Email"
                            />
                        </div>
                        <div>
                            <Select
                                v-model="form.gender"
                                label="Sexe"
                            >
                                <SelectTrigger
                                    position="right"
                                    class="rounded-md"
                                >
                                    <SelectValue placeholder="Séléctionner..." />
                                </SelectTrigger>
                                <SelectContent class="border border-none">
                                    <SelectGroup>
                                        <SelectItem
                                            v-for="(gender, index) in genders"
                                            :key="index"
                                            :value="gender.value"
                                        >
                                            <span class="text-sm">{{ gender.label }}</span>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <InputIcon
                                v-model="form.phoneNumber"
                                rounded="md"
                                label="Téléphone"
                            />
                        </div>
                        <div>
                            <InputIcon
                                v-model="form.dateOfBirth"
                                rounded="md"
                                label="Date de naissance"
                            />
                        </div>
                        <div>
                            <Select
                                v-model="form.language"
                                label="Langue"
                            >
                                <SelectTrigger
                                    position="right"
                                    class="rounded-md"
                                >
                                    <SelectValue placeholder="Séléctionner..." />
                                </SelectTrigger>
                                <SelectContent class="border border-none">
                                    <SelectGroup>
                                        <SelectItem
                                            v-for="(lang, index) in languages"
                                            :key="index"
                                            :value="lang.value"
                                        >
                                            <span class="text-sm">{{ lang.label }}</span>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <Separator class="my-4 lg:my-10" />
                <div class="grid grid-cols-3 gap-4 lg:gap-8">
                    <div class="p-4 hidden lg:block">
                        <h1 class="font-semibold text-gray-600">
                            Adresse
                        </h1>
                        <p class="mt-2 text-md text-gray-500">
                            Les informations d'addresse
                        </p>
                    </div>
                    <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                        <div>
                            <InputIcon
                                v-model="form.address.street"
                                rounded="md"
                                label="N° et rue"
                            />
                        </div>
                        <div>
                            <InputIcon
                                v-model="form.address.city"
                                rounded="md"
                                label="Ville"
                            />
                        </div>
                        <div>
                            <InputIcon
                                v-model="form.address.zipCode"
                                rounded="md"
                                label="Code postale"
                            />
                        </div>
                        <div>
                            <InputIcon
                                v-model="form.address.additionalInformation"
                                rounded="md"
                                label="Complément d'adresse"
                            />
                        </div>
                    </div>
                </div>
                <Separator class="my-4 lg:my-10" />
                <div class="grid grid-cols-3 gap-4 lg:gap-8">
                    <div class="p-4 hidden lg:block">
                        <h1 class="font-semibold text-gray-600">
                            Compte
                        </h1>
                        <p class="mt-2 text-md text-gray-500">
                            Les informations de compte
                        </p>
                    </div>
                    <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                        <div>
                            <Select
                                v-model="form.accountType"
                                label="Type de compte"
                            >
                                <SelectTrigger
                                    position="right"
                                    class="rounded-md"
                                >
                                    <SelectValue placeholder="Séléctionner..." />
                                </SelectTrigger>
                                <SelectContent class="border border-none">
                                    <SelectGroup>
                                        <SelectItem
                                            v-for="(account, index) in accountOptions"
                                            :key="index"
                                            :value="account.value"
                                        >
                                            <span class="text-sm">{{ account.label }}</span>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <Separator class="my-4 lg:my-10" />
                <div class="col-span-3 grid place-content-center">
                    <Button
                        type="submit"
                        class="rounded-md w-52"
                        :in-progress="inProgress"
                    >
                        Créer un utilisateur
                    </Button>
                </div>
            </form>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Nouvel utilisateur' });

definePageMeta({
    layout: 'dashboard',
});

const { create } = useAuth();

const form = reactive({
    lastname: null,
    firstname: null,
    identifierNumber: null,
    email: null,
    gender: null,
    phoneNumber: null,
    dateOfBirth: null,
    language: 'fr',
    accountType: null,
    address: {
        street: null,
        city: null,
        country: null,
        zipCode: null,
        additionalInformation: null,
        accountType: null,
    },
});

const { submit, inProgress } = useSubmit(
    async () => {
        return create(form);
    },
);

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
        label: 'Administrateur',
        value: 'administrator',
    },
    {
        label: 'Développeur',
        value: 'developer',
    },
    {
        label: 'Infirmier(ère)',
        value: 'nurse',
    },
    {
        label: 'Testeur',
        value: 'tester',
    },
    {
        label: 'Commercial',
        value: 'sale_representative',
    },
];
</script>
