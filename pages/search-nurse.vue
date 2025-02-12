

<!-- <script setup>
import { useForm, defineRule, configure, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { localize } from '@vee-validate/i18n';
import fr from '@vee-validate/i18n/dist/locale/fr.json';

// 📌 Configurer la validation en français
configure({
  generateMessage: localize({ fr }),
  validateOnBlur: true,
  validateOnInput: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
});

// 📌 Définir le schéma de validation
const schema = yup.object({
  name: yup.string()
    .required('Le nom est obligatoire')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
});

// 📌 Initialiser le formulaire
const { handleSubmit, defineField } = useForm({
  validationSchema: schema,
});

const [name, nameAttrs] = defineField('name');

// 📌 Fonction de soumission du formulaire
const onSubmit = handleSubmit(values => {
  console.log('Données du formulaire:', values);
  alert('Formulaire soumis avec succès !');
});
</script>

<template>
  <div class="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
    <h2 class="text-xl font-bold mb-4">Formulaire de Nom</h2>

    <form @submit="onSubmit">
      
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700">Nom :</label>
        <Field v-model="name" v-bind="nameAttrs" id="name" name="name" class="w-full px-3 py-2 border rounded-lg" placeholder="Entrez votre nom" />
        <ErrorMessage name="name" class="text-red-500 text-xs mt-1" />
      </div>

   
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
        Envoyer
      </button>
    </form>
  </div>
</template> -->
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
            <form @submit.prevent="onSubmit">
                <div class="grid grid-cols-1 gap-4">

                    <FormField name="lastname">
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
                                        v-model="lastname"
                                        placeholder="Nom"
                                        variant="transparent"
                                        class="w-full text-black placeholder:text-black/80"
                                        v-bind="lastnameAttrs" 
                                    />


                                </div>
                                
                                <ErrorMessage name="lastname" class="text-red-500 text-xs mt-5" />
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
                                        v-model="firstname"
                                        variant="transparent"
                                        placeholder="Prenom"
                                        class="w-full text-black placeholder:text-black/80"
                                        v-bind="firstnameAttrs" 
                                    />
                                </div> 
                                <ErrorMessage name="firstname" class="text-red-500 text-xs mt-1" />
                            </FormControl>
                        </FormItem>
                    </FormField>
                    <FormField name="zipCode">
                        <FormItem>
                            <FormControl>
                              

                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary  rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                            <!-- <NuxtImg
                                src="/icons/zip_code.png"
                                class="w-5 h-5 filter invert saturate-200 hue-rotate-180 text-primary" /> -->

                                <div class="w-5 h-5 bg-primary flex items-center justify-center">
                                        <NuxtImg
                                            src="/icons/zip_code.png"
                                            class="w-4 h-4" />
                                    </div>
                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">Code postal</span>
                                        </FormLabel>
                                    </div>
                                    <Input
                                        v-model="zipCode"
                                        variant="transparent"
                                        placeholder="Code Postal"
                                        class="w-full text-black placeholder:text-black/80"
                                        :maxlength="4"
                                        @paste.prevent
                                        v-bind="zipCodeAttrs" 
                                    />
                                </div>
                                <ErrorMessage name="zipCode" class="text-red-500 text-xs mt-1" />
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="city">
                        <FormItem>
                            <FormControl>
                            


                                <div class="h-10 rounded-full border border-primary grid grid-cols-[25%_75%]">
                                    <div class="bg-transparent sm:bg-primary md:bg-primary lg:bg-primary  rounded-s-full flex items-center">
                                        <FormLabel class="flex space-x-4 text-white items-center ms-4 relative">
                                            <!-- <NuxtImg
                                                src="/icons/city_white.png"
                                                class="w-5 h-5 filter invert saturate-200 hue-rotate-180 text-primary"
                                            /> -->


                                            <div class="w-5 h-5 bg-primary flex items-center justify-center">
                                        <NuxtImg
                                            src="/icons/city_white.png"
                                            class="w-4 h-4" />
                                    </div>

                                            <span class="font-light hidden sm:inline text-primary sm:text-white md:text-white lg:text-white">Ville</span>
                                        </FormLabel>
                                    </div>

                                    <Input
                                        v-model="city"
                                        variant="transparent"
                                        placeholder="Ville"
                                        class="w-full text-black placeholder:text-black/80"
                                        v-bind="cityAttrs" 
                                    />
                                </div>
                                <ErrorMessage name="city" class="text-red-500 text-xs mt-1" />

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
                                        v-model="phoneNumber"
                                        variant="transparent"
                                        placeholder="97 12 25 - 123 - 45"
                                        class="w-full text-black placeholder:text-black/80"
                                        v-bind="phoneNumberAttrs" 
                                    />
                                </div> 
                            
                                <ErrorMessage name="phoneNumber" class="text-red-500 text-xs mt-1" />


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
            </form>
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
import { useForm, defineRule, configure, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { localize } from '@vee-validate/i18n';
import fr from '@vee-validate/i18n/dist/locale/fr.json';
useHead({
    title: 'Chercher un infirmier',
});
const patientStore = usePatientStore();

configure({
  generateMessage: localize({ fr }),
  validateOnBlur: true,
  validateOnInput: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
});


const schema = yup.object({
  lastname: yup.string()
    .required('Le nom est obligatoire')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),

  firstname: yup.string()
    .required('Le prénom est obligatoire')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),

  zipCode: yup.string()
    .required('Le code postal est obligatoire')
    .matches(/^\d{4,5}$/, 'Le code postal doit contenir 4 ou 5 chiffres'),

  city: yup.string()
    .required('La ville est obligatoire')
    .min(2, 'La ville doit contenir au moins 2 caractères'),

  phoneNumber: yup.string()
    .required('Le numéro de téléphone est obligatoire')
    .matches(/^\d{10}$/, 'Le numéro de téléphone doit contenir 10 chiffres'),

  accept: yup.boolean()
    .oneOf([true], 'Vous devez accepter les conditions'),
});


const { handleSubmit, defineField, errors } = useForm({
  validationSchema: schema,
});


const [name, nameAttrs] = defineField('name');
const [lastname, lastnameAttrs] = defineField('lastname');
const [firstname, firstnameAttrs] = defineField('firstname');
const [zipCode, zipCodeAttrs] = defineField('zipCode');
const [city, cityAttrs] = defineField('city');
const [phoneNumber, phoneNumberAttrs] = defineField('phoneNumber');

const onSubmit = handleSubmit(async values => {
//   console.log('Données du formulaire:', values);
//   alert('Formulaire soumis avec succès !');
  await patientStore.submitForm(values);
});

</script>






