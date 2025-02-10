<template>
    <div class="mt-20">
  

        <div class="relative bg-tertiary/30 h-64 sm:h-72 md:h-80 lg:h-96 xl:h-112 flex flex-col items-center justify-center m-auto space-y-4 px-4 sm:px-8 md:px-16">

        <!-- Logo centré avec une taille réactive -->
        <LayoutsLogo class="w-[20rem] h-32 sm:w-[22rem] md:w-[25rem] lg:w-[27rem] xl:w-[30rem] 2xl:w-[32rem]" />

        <!-- Titre centré avec un espace entre l'image et le texte -->
        <h1 class="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center">
            <strong>Chercher</strong> un(e) infirmier(e) ?
        </h1>

        </div>



        <div class="container mt-36 mb-24 w-[65%]">
            <Form @submit="handleSubmit">
                <div class="grid grid-cols-1 gap-4">
                    <FormField name="fullname">
                        <FormItem>
                            <FormControl>

                    <div class="h-10 rounded-full border border-primary grid grid-cols-[18%_82%] 
                                sm:grid-cols-[15%_85%] md:grid-cols-[12%_88%] lg:grid-cols-[10%_90%]">
                        <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary rounded-s-full 
                                    flex items-center justify-center gap-2 px-2">
                            <UserCircleIcon class="w-6 h-6 text-primary sm:text-white md:text-white lg:text-white" />
                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">Nom</span>
                        </div>
                        <Input
                            v-model="formData.lastname"
                            placeholder="Nom"
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
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary  rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <UserCircleIcon class="w-6 h-6 text-primary sm:text-white md:text-white lg:text-white "  />
                                            <PlusIcon class="w-3 h-3 text-primary sm:text-white md:text-white lg:text-white absolute top-0 left-1" />

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
                                <!-- <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <NuxtImg
                                                src="/icons/zip_code.png"
                                                class="w-5 h-5"
                                            />
                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">Code postal</span>
                                        </FormLabel>
                                    </div>

                                    <Input
                                        v-model="formData.zipCode"
                                        variant="transparent"
                                        placeholder="Code Postal"
                                        class="w-full text-black placeholder:text-black/80"
                                        :maxlength="4"
                                        @keypress="onlyNumbers"
                                        @paste.prevent
                                    />
                                </div> -->

                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary  rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                            <NuxtImg
                                src="/icons/zip_code.png"
                                class="w-5 h-5 filter invert saturate-200 hue-rotate-180 text-primary" />


                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">Code postal</span>
                                        </FormLabel>
                                    </div>

                                    <Input
                                        v-model="formData.zipCode"
                                        variant="transparent"
                                        placeholder="Code Postal"
                                        class="w-full text-black placeholder:text-black/80"
                                        :maxlength="4"
                                        @keypress="onlyNumbers"
                                        @paste.prevent
                                    />
                                </div>




                             

                                
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="city">
                        <FormItem>
                            <FormControl>
                                <!-- <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <NuxtImg
                                                src="/icons/city_white.png"
                                                class="w-5 h-5"
                                            />
                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">Ville</span>
                                        </FormLabel>
                                    </div>

                                    <Input
                                        v-model="formData.city"
                                        variant="transparent"
                                        placeholder="Ville"
                                        class="w-full text-black placeholder:text-black/80"
                                    />
                                </div> -->


                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary  rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <NuxtImg
                                                src="/icons/city_white.png"
                                                class="w-5 h-5 filter invert saturate-200 hue-rotate-180 text-primary"
                                            />
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
                                 <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <PhoneIcon class="w-6 h-6 text-primary sm:text-white md:text-white lg:text-white " />
                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">N° de téléphone</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="formData.phoneNumber"
                                        variant="transparent"
                                        placeholder="97 12 25 - 123 - 45"
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

                <div class="mt-12 flex justify-center itemss-center" >
                    <Button
                        :disabled="patientStore.isSubmitting"
                        type="submit"
                        class="w-96 flex justify-center items-center mx-auto"
                    >
                        <span v-if="patientStore.isSubmitting">Envoi en cours...</span>
                        <span v-else>Envoyer</span>
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
import { usePatientStore } from '@/stores/usePatientStore';

const patientStore = usePatientStore();
const errorMessage = ref('');

const formData = reactive({
    lastname: '',
    firstname: '',
    dateOfBirth: '',
    zipCode: '',
    city: '',
    // careType: '',
    // frequency: '',
     phoneNumber: '',
});

const onlyNumbers = (event) => {
    // Empêche la saisie si ce n'est pas un chiffre (0-9)
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
};

useHead({
    title: 'Chercher un infirmier',
});

const formatPostalCode = (event) => {
    // Supprime tout caractère qui n'est pas un chiffre
    formData.zipCode = event.target.value.replace(/\D/g, '');

    // Validation si exactement 4 chiffres
    if (!/^\d{4}$/.test(formData.zipCode)) {
        errorMessage.value = 'Le code postal doit contenir exactement 4 chiffres.';
    }
    else {
        errorMessage.value = '';
    }
};

const { careTypes, fetchCareTypes } = useCareTypes();

onMounted(() => {
    fetchCareTypes();
});

const selectedCareTypes = ref([]);

const isSelected = (care) => {
    return selectedCareTypes.value.some(item => item.id === care.id);
};

const toggleSelectionCare = (care) => {
    const index = selectedCareTypes.value.findIndex(item => item.id === care.id);
    if (index > -1) {
        selectedCareTypes.value.splice(index, 1);
    }
    else {
        selectedCareTypes.value.push(care);
    }
};

const handleSubmit = async () => {
    await patientStore.submitForm(formData);
};
</script>
