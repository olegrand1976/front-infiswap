<template>
    <div class="md:mt-16">
        <div class="relative bg-tertiary/30 h-64 sm:h-72 md:h-80 lg:h-96 xl:h-112 flex flex-col items-center justify-center m-auto space-y-4 px-4 sm:px-8 md:px-16">
            <LayoutsLogo class="w-60 md:w-[40vw] xl:w-[25vw]" />

            <h1 class="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center">
                <strong>Chercher</strong> un(e) infirmier(e) ?
            </h1>
        </div>

        <div class="container my-10 md:my-16 lg:w-6/12">
            <form @submit.prevent="submit">
                <div class="grid grid-cols-1 gap-4">
                    <FormField name="lastname">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[8%_92%] md:grid-cols-[25%_75%]">
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary  rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-2 md:ms-4 relative">
                                            <UserCircleIcon class="size-5 text-primary sm:text-white md:text-white lg:text-white " />

                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">Nom</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.lastname"
                                        variant="transparent"
                                        placeholder="Nom"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="firstname">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[8%_92%] md:grid-cols-[25%_75%]">
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary  rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-2 md:ms-4 relative">
                                            <UserCircleIcon class="size-5 text-primary sm:text-white md:text-white lg:text-white " />
                                            <PlusIcon class="size-2 text-primary sm:text-white md:text-white lg:text-white absolute top-0 left-1" />

                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">Prénoms</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.firstname"
                                        variant="transparent"
                                        placeholder="Prenom"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                    <FormField name="zipCode">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[8%_92%] md:grid-cols-[25%_75%]">
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary  rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-2 md:ms-4 relative">
                                            <MapIcon class="size-5 text-primary sm:text-white md:text-white lg:text-white " />
                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">Code postal</span>
                                        </FormLabel>
                                    </div>

                                    <Input
                                        v-model="formData.zipCode"
                                        variant="transparent"
                                        placeholder="Code Postal"
                                        class="w-full text-black placeholder:text-black/80"
                                        :maxlength="4"
                                        @paste.prevent
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="city">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[8%_92%] md:grid-cols-[25%_75%]">
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary  rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-2 md:ms-4 relative">
                                            <HomeModernIcon class="size-5 text-primary sm:text-white md:text-white lg:text-white " />
                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">Ville</span>
                                        </FormLabel>
                                    </div>

                                    <Input
                                        v-model="formData.city"
                                        variant="transparent"
                                        placeholder="Ville"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="phoneNumber">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[8%_92%] md:grid-cols-[25%_75%]">
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary  rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-2 md:ms-4 relative">
                                            <PhoneIcon class="size-5 text-primary sm:text-white md:text-white lg:text-white " />
                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">N° téléphone</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.phoneNumber"
                                        variant="transparent"
                                        placeholder="Numéro téléphone"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>

                <FormField name="accept">
                    <FormItem class="mt-6">
                        <FormControl>
                            <Checkbox
                                id="accept"
                                class="mt-2"
                            />
                            <FormLabel
                                for="accept"
                                class="text-xs font-light ml-2"
                            >
                                Vous acceptez que vos coordonnées soient enregistrées dans notre base de données
                                pour être transmises à notre réseau d'infirmières vos informations personnelles
                                ne seront ni vendues ni transmises à des sociétés tiers.
                            </FormLabel>
                        </FormControl>
                    </FormItem>
                </FormField>

                <div class="mt-12 flex justify-center itemss-center">
                    <Button
                        :disabled="inProgress"
                        type="submit"
                        class="w-96 flex justify-center items-center mx-auto"
                        :in-progress="inProgress"
                    >
                        Envoyer
                    </Button>
                </div>

                <div class="mt-12 flex justify-center itemss-center">
                    <span class="text-center text-xs">
                        Vous serez contacté prochainement par une infirmière de notre réseau proche
                        de chez vous
                    </span>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    UserCircleIcon,
    PlusIcon,
    PhoneIcon,
    MapIcon,
    HomeModernIcon,
} from '@heroicons/vue/24/solid';

const { searchNurse } = useNursePatients();

const initialValue = {
    lastname: '',
    firstname: '',
    zipCode: '',
    city: '',
    phoneNumber: '',
};

const formData = reactive(initialValue);

const resetForm = () => {
    formData.lastname = '';
    formData.firstname = '';
    formData.zipCode = '';
    formData.city = '';
    formData.phoneNumber = '';
};

useHead({
    title: 'Chercher un infirmier',
});

const {
    submit,
    inProgress,
    validationErrors,
} = useSubmit(
    () => {
        return searchNurse(formData).then(() => {
            resetForm();
            useNuxtApp().$toast.success('Demande envoyée avec succès !');
        }).catch(e => console.error(e));
    },
);
</script>
