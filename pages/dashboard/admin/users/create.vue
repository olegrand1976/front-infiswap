<template>
    <div>
        <DashboardAdminPageHeader title="Nouvel utilisateur" />
        <DashboardAdminPageContent class="bg-gray-100">
            <form>
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
                                rounded="md"
                                label="Nom"
                                name="lastname"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Prénom"
                                name="firstname"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="INAMI"
                                name="identifier_number"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                type="email"
                                label="Email"
                                name="email"
                            />
                        </div>
                        <div>
                            <Select label="Sexe">
                                <SelectTrigger position="right" class="rounded-md">
                                    <SelectValue placeholder="Séléctionner..." />
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
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Téléphone"
                                name="phone_number"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Date de naissance"
                                name="date_of_birth"
                            />
                        </div>
                        <div>
                            <Select label="Langue">
                                <SelectTrigger position="right" class="rounded-md">
                                    <SelectValue placeholder="Séléctionner..." />
                                </SelectTrigger>
                                <SelectContent class="border border-none">
                                    <SelectGroup>
                                        <div
                                            v-for="lang in languages"
                                            :key="lang.value"
                                            class="flex justify-center items-center -ms-3"
                                        >
                                            <SelectItem :value="lang.value">
                                                <span class="text-sm">{{ lang.label }}</span>
                                            </SelectItem>
                                        </div>
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
                                rounded="md"
                                label="N° et rue"
                                name="street"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Ville"
                                name="city"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Code postale"
                                name="zipCode"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Complément d'adresse"
                                name="additionnalInformation"
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
                            <Select label="Type de compte">
                                <SelectTrigger position="right" class="rounded-md">
                                    <SelectValue placeholder="Séléctionner..." />
                                </SelectTrigger>
                                <SelectContent class="border border-none">
                                    <SelectGroup>
                                        <div
                                            v-for="account in accountOptions"
                                            :key="account.value"
                                            class="flex justify-center items-center -ms-3"
                                        >
                                            <SelectItem :value="account.value">
                                                <span class="text-sm">{{ account.label }}</span>
                                            </SelectItem>
                                        </div>
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
                    >
                        Enregistrer
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
        label: 'Infirmier(ère)',
        value: 'nurse',
    },
    {
        label: 'Administrateur',
        value: 'admin',
    },
    {
        label: 'Collaborateur',
        value: 'collaborator',
    },
    {
        label: 'Testeur',
        value: 'test_manager',
    },
    {
        label: 'Commercial',
        value: 'sale_manager',
    },
];
</script>
