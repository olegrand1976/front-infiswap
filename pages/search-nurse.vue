<template>
    <div class="mt-20">
        <div class="relative bg-tertiary/30 h-64 flex items-center justify-center m-auto">
            <h1 class="text-primary text-4xl text-center">
                <strong>Chercher</strong> un(e) infirmier(e) ?
            </h1>
            <div class="absolute -bottom-16 left-1/3">
                <LayoutsLogo class="w-[27rem] h-32" />
            </div>
        </div>

        <div class="container mt-36 mb-24 w-[65%]">
            <Form>
                <div class="grid grid-cols-1 gap-4">
                    <FormField name="fullname">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4">
                                            <UserCircleIcon class="w-6 h-6 text-white" />
                                            <span class="font-light">Nom</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.lastname"
                                        variant="transparent"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="firstname">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <UserCircleIcon class="w-6 h-6 text-white" />
                                            <PlusIcon class="w-3 h-3 text-white absolute top-0 left-1" />
                                            <span class="font-light">Prénoms</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.firstname"
                                        variant="transparent"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="dateOfBirth">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <CalendarDaysIcon class="w-6 h-6 text-white" />
                                            <span class="font-light">Date de naissance</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.dateOfBirth"
                                        variant="transparent"
                                        type="date"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="zipCode">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <NuxtImg
                                                src="/icons/zip_code.png"
                                                class="w-5 h-5"
                                            />
                                            <span class="font-light">Code postal</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.zipCode"
                                        variant="transparent"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="city">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <NuxtImg
                                                src="/icons/city_white.png"
                                                class="w-5 h-5"
                                            />
                                            <span class="font-light">Ville</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.city"
                                        variant="transparent"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="careType">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <PlusCircleIcon class="w-6 h-6" />
                                            <span class="font-light text-nowrap">Type de soin à effectuer</span>
                                        </FormLabel>
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="frequency">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <ChartBarSquareIcon class="w-6 h-6 text-white" />
                                            <span class="font-light">Fréquence</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.frequency"
                                        type="number"
                                        variant="transparent"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="phoneNumber">
                        <FormItem>
                            <FormControl>
                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <PhoneIcon class="w-6 h-6 text-white" />
                                            <span class="font-light">N° de téléphone</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.phoneNumber"
                                        variant="transparent"
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

                <div class="mt-12">
                    <Button class="w-96 flex justify-center items-center mx-auto">
                        Envoyer
                    </Button>
                </div>

                <div class="mt-12 flex justify-center itemss-center">
                    <span class="text-center text-xs">
                        Vous serez contacté prochainement par une infirmière de notre réseau proche
                        de chez vous
                    </span>
                </div>
            </Form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    UserCircleIcon,
    PlusIcon,
    PhoneIcon,
    CalendarDaysIcon,
    ChartBarSquareIcon,
    PlusCircleIcon,
} from '@heroicons/vue/24/solid';

const formData = reactive({
    lastname: '',
    firstname: '',
    dateOfBirth: '',
    zipCode: '',
    city: '',
    careType: '',
    frequency: '',
    phoneNumber: '',
});

useHead({
    title: 'Chercher un infirmier',
});

const { careTypes, fetchCareTypes } = useCareTypes();

onMounted(() => {
    fetchCareTypes();
});
</script>
