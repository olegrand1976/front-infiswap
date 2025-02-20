<template>
    <div class="md:flex min-h-screen flex-row justify-center">
        <div class="hidden lg:block bg-tertiary/30 xl:w-[110vw] lg:w-[95vw] md:w-[95vw] sm:w-[70vw] relative container">
            <div class="absolute bottom-0 xl:left-32 lg:left-20">
                <NuxtImg
                    src="/auth/Group_1171.png"
                    class="xl:w-[24rem] lg:w-[22rem] relative z-20 flex justify-center mx-auto"
                />
            </div>
            <div class="absolute lg:top-36 lg:left-20 md:top-32 sm:top-64 sm:left-12 ">
                <NuxtImg
                    src="/icons/plus.png"
                    class="xl:w-24 xl:h-24 lg:w-20 lg:h-20 md:w-16 md:h-16 sm:w-11 sm:h-11"
                />
            </div>
            <div class="absolute md:bottom-32 lg:right-20 md:right-12 sm:bottom-28 sm:right-6">
                <NuxtImg
                    src="/icons/Unin.png"
                    class="xl:w-16 xl:h-16 lg:w-12 lg:h-12 md:w-8 md:h-8 sm:w-6 sm:h-6"
                />
            </div>
            <div class="absolute xl:left-24 lg:left-16 md:left-8 xl:bottom-24 lg:bottom-20 md:bottom-16 sm:bottom-12">
                <NuxtImg
                    src="/icons/cog.png"
                    class="xl:w-52 xl:h-52 lg:h-44 lg:w-44 md:h-28 md:w-28 sm:h-20 sm:w-20"
                />
            </div>

            <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                .
            </div>
        </div>

        <div class="container my-14 overflow-y-hidden lg:w-full md:h-auto flex flex-col justify-center items-center">
            <div>
                <NuxtImg
                    src="/logo.png"
                    class="h-14 lg:h-28 mb-4"
                />
            </div>

            <h1 class="mb-4 lg:mb-8 xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl font-bold text-primary">
                Inscription
            </h1>

            <div class="w-full max-w-lg">
                <form
                    class="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    @submit.prevent="submit"
                >
                    <div class="col-span-2">
                        <FormField name="lastname">
                            <FormItem class="w-full items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <UserCircleIcon class="text-primary w-7 h-7 ml-2" />
                                        <Input
                                            v-model="formData.lastname"
                                            type="text"
                                            placeholder="Nom"
                                            class="bg-transparent"
                                            @blur="validateField('lastname')"
                                            @input="validateField('lastname')"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            <p
                                v-if="error.lastname"
                                class="text-red-500 text-xs mt-1 ms-[5%]"
                            >
                                {{ error.lastname }}
                            </p>
                        </FormField>
                    </div>

                    <div class="col-span-2">
                        <FormField name="firstname">
                            <FormItem class="w-full items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <UserCircleIcon class="text-primary ml-2 w-7 h-7" />
                                        <Input
                                            v-model="formData.firstname"
                                            type="text"
                                            placeholder="Prénom"
                                            class="bg-transparent"
                                            @blur="validateField('firstname')"
                                            @input="validateField('firstname')"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            <p
                                v-if="error.firstname"
                                class="text-red-500 text-xs mt-1 ms-[5%]"
                            >
                                {{ error.lastname }}
                            </p>
                        </FormField>
                    </div>

                    <div class="col-span-2">
                        <FormField name="email">
                            <FormItem class="w-full items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <EnvelopeIcon class="text-primary ml-3 w-6 h-6" />
                                        <Input
                                            v-model="formData.email"
                                            placeholder="Email"
                                            class="bg-transparent"
                                            @blur="validateField('email')"
                                            @input="validateField('email')"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            <p
                                v-if="error.email"
                                class="text-red-500 text-xs mt-1 ms-[5%]"
                            >
                                {{ error.email }}
                            </p>
                        </FormField>
                    </div>

                    <div class="col-span-2">
                        <FormField name="email">
                            <FormItem class="w-full items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <PhoneIcon class="text-primary ml-3 w-6 h-6" />
                                        <Input
                                            v-model="formData.phoneNumber"
                                            placeholder="N° de téléphone"
                                            class="bg-transparent"
                                            @blur="validateField('phoneNumber')"
                                            @input="validateField('phoneNumber')"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            <p
                                v-if="error.phoneNumber"
                                class="text-red-500 text-xs mt-1 ms-[5%]"
                            >
                                {{ error.phoneNumber }}
                            </p>
                        </FormField>
                    </div>

                    <div class="col-span-2">
                        <FormField name="password">
                            <FormItem class="w-full items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <LockClosedIcon class="text-primary ml-3 h-6" />
                                        <Input
                                            v-model="formData.password"
                                            type="password"
                                            placeholder="Mot de passe"
                                            class="bg-transparent"
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

                    <div class="col-span-2">
                        <FormField name="passwordConfirm">
                            <FormItem class="w-full items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <LockClosedIcon class="text-primary ml-3 h-6" />
                                        <Input
                                            v-model="formData.passwordConfirmation"
                                            type="password"
                                            placeholder="Confirmer mot de passe"
                                            class="bg-transparent"
                                            @blur="validateField('passwordConfirmation')"
                                            @input="validateField('passwordConfirmation')"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            <p
                                v-if="error.passwordConfirmation"
                                class="text-red-500 text-xs mt-1 ms-[5%]"
                            >
                                {{ error.passwordConfirmation }}
                            </p>
                        </FormField>
                    </div>

                    <div class="col-span-1 lg:col-span-2">
                        <!-- <FormField name="naissance">
                            <FormItem class="w-full">
                                <Popover>
                                    <PopoverTrigger as-child>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                :class="cn(
                                                    'w-full flex justify-start items-center rounded-full font-light border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90',
                                                    !formData.dateOfBirth && 'text-gray-400',
                                                )"
                                            >
                                                <CalendarIcon class="mr-2 text-primary" />
                                                <span
                                                    v-if="formData.dateOfBirth"
                                                    class="text-black/90 xl:text-sm sm:text-xs"
                                                >
                                                    {{ df.format(formData.dateOfBirth.toDate(getLocalTimeZone())) }}
                                                </span>
                                                <span
                                                    v-else
                                                    class="text-gray-400 text-sm"
                                                >
                                                    Naissance
                                                </span>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent class="w-auto p-0">
                                        <Calendar
                                            v-model="formData.dateOfBirth"
                                            initial-focus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        </FormField> -->
                        <FormField name="dateOfBird">
                            <FormItem class="w-full items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <CalendarIcon class="text-primary ml-3 h-6" />
                                        <Input
                                            v-model="formData.dateOfBirth"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-1 lg:col-span-2">
                        <FormField name="gender">
                            <FormItem>
                                <Select v-model="formData.gender">
                                    <FormControl>
                                        <SelectTrigger
                                            class="flex xl:h-auto sm:h-8 items-center rounded-full border border-gray-300"
                                            position="right"
                                        >
                                            <NuxtImg
                                                src="/icons/gender.png"
                                                class="h-5"
                                            />
                                            <SelectValue
                                                placeholder="Sexe"
                                                class="ml-3"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
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
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-2">
                        <FormField name="streer_address">
                            <FormItem class="flex w-full space-x-1 px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <NuxtImg
                                            src="/icons/road.png"
                                            class="h-5"
                                        />
                                        <Input
                                            v-model="formData.address.street"
                                            type="text"
                                            placeholder="Rue"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-2">
                        <FormField name="City">
                            <FormItem class="flex w-full space-x-1 px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center space-x-1">
                                        <NuxtImg
                                            src="/icons/city.png"
                                            class="w-6 h-6"
                                        />
                                        <Input
                                            v-model="formData.address.city"
                                            type="text"
                                            placeholder="Ville"
                                            clas="text-sm"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-1 lg:col-span-2">
                        <FormField name="country">
                            <FormItem class="w-full">
                                <Select v-model="formData.address.country">
                                    <FormControl>
                                        <SelectTrigger
                                            class="flex justify-between items-center rounded-full border border-gray-300"
                                            position="right"
                                        >
                                            <NuxtImg
                                                src="/icons/flag.png"
                                                class="h-4 ml-2"
                                            />
                                            <SelectValue
                                                placeholder="Pays"
                                                class="ml-3"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent class="border border-none">
                                        <SelectGroup>
                                            <div
                                                v-for="country in countries"
                                                :key="country.value"
                                                class="flex justify-center items-center -ms-3"
                                            >
                                                <SelectItem :value="country.value">
                                                    <div class="flex space-x-1">
                                                        <NuxtImg
                                                            :src="country.icon"
                                                            :alt="country.name"
                                                            class="xl:w-4 xl:h-3 sm:w-3 sm:h-2 my-auto mr-2"
                                                            format="png"
                                                        />
                                                        <span class="sm:text-xs xl:text-sm">{{ country.label }}</span>
                                                    </div>
                                                </SelectItem>
                                            </div>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-1 lg:col-span-2">
                        <FormField name="codePostal">
                            <FormItem class="flex space-x-1 px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <NuxtImg
                                            src="/icons/boite.png"
                                            class="h-4"
                                        />
                                        <Input
                                            v-model="formData.address.zipCode"
                                            type="text"
                                            placeholder="Code postal"
                                            class="text-sm"
                                            @blur="validateField('address.zipCode')"
                                            @input="validateField('address.zipCode')"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            <p
                                v-if="error.address.zipCode"
                                class="text-red-500 text-xs mt-1 ms-[5%]"
                            >
                                {{ error.address.zipCode }}
                            </p>
                        </FormField>
                    </div>

                    <div class="col-span-2">
                        <FormField name="complement">
                            <FormItem class="flex w-full space-x-1 px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center space-x-1">
                                        <EllipsisHorizontalCircleIcon class="w-6 h-6 text-primary" />
                                        <Input
                                            v-model="formData.address.additionnalInformation"
                                            type="text"
                                            placeholder="Autres"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-1 lg:col-span-2">
                        <FormField name="accountType">
                            <FormItem class="w-full">
                                <Select v-model="formData.accountType">
                                    <FormControl>
                                        <SelectTrigger
                                            class="flex w-full space-x-4 text-sm justify-start items-center rounded-3xl border border-gray-300"
                                            position="right"
                                        >
                                            <UsersIcon class="text-primary w-9 h-9 sm:w-7 sm:h-7" />
                                            <SelectValue
                                                placeholder="Compte"
                                                class="text-nowrap w-full text-sm ml-3 my-auto"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
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
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-1 lg:col-span-2">
                        <FormField name="language">
                            <FormItem class="w-full">
                                <Select v-model="formData.language">
                                    <FormControl>
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
                                    </FormControl>
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
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="col-span-2 sm:col-span-1 lg:col-span-2">
                        <FormField name="identifierNumber">
                            <FormItem class="flex w-full space-x-1 px-4 items-center rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center">
                                        <IdentificationIcon class="text-primary w-6 h-6" />
                                        <Input
                                            v-model="formData.identifierNumber"
                                            type="text"
                                            placeholder="Numéro INAMI"
                                            class="text-sm"
                                            @blur="validateField('identifierNumber')"
                                            @input="validateField('identifierNumber')"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                            <p
                                v-if="error.identifierNumber"
                                class="text-red-500 text-xs mt-1 ms-[5%]"
                            >
                                {{ error.identifierNumber }}
                            </p>
                        </FormField>
                    </div>

                    <div class="col-span-2 lg:col-span-4 mt-4 flex justify-center items-center">
                        <Button
                            class="w-[50%]"
                            type="submit"
                        >
                            S'inscrire
                        </Button>
                    </div>
                </form>
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
    CalendarIcon,
} from '@heroicons/vue/24/solid';

import * as yup from 'yup';
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
];

const countries = [
    {
        value: 'be',
        label: 'Belgique',
        name: 'belgique',
        icon: '/icons/belgium.png',
    },
    {
        value: 'fr',
        label: 'France',
        name: 'france',
        icon: '/icons/fr.png',
    },
];

const languages = [
    {
        value: 'nl',
        label: 'Nederlands',
        name: 'nederlands',
    },
    {
        value: 'fr',
        label: 'Français',
        name: 'francais',
    },
];

const accountOptions = [
    {
        label: 'Patient',
        value: 'patient',
    },
    {
        label: 'Infirmière',
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
    accountType: '',
    passwordConfirmation: '',
    gender: '',
    language: '',
    phoneNumber: undefined,
    dateOfBirth: null,
    identifierNumber: null,
    address: {
        street: '',
        city: '',
        zipCode: '',
        country: '',
        additionnalInformation: '',
    },
});

const error = reactive({
    lastname: '',
    firstname: '',
    email: '',
    password: '',
    accountType: '',
    passwordConfirmation: '',
    gender: '',
    language: '',
    phoneNumber: undefined,
    dateOfBirth: null,
    identifierNumber: null,
    address: {
        street: '',
        city: '',
        zipCode: '',
        country: '',
        additionnalInformation: '',
    },
});

const route = useRoute();
const { register } = useAuth();

const status = ref(
    (route.query.reset ?? '').length > 0 ? atob(route.query.reset as string) : '',
);

const schema = yup.object({
    lastname: yup.string().required('Le nom est obligatoire').min(2, 'Le nom doit comporter au moins 2 caractères'),
    firstname: yup.string().required('Le prénom est obligatoire').min(2, 'Le prénom doit comporter au moins 2 caractères'),
    email: yup.string().email('L\'email doit être valide').required('L\'email est obligatoire'),
    password: yup.string()
        .required('Le mot de passe est obligatoire')
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .max(50, 'Le mot de passe ne peut pas dépasser 50 caractères')
        .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
        .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
        .matches(/\d/, 'Le mot de passe doit contenir au moins un chiffre')
        .matches(/[\W_]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
        .required('La confirmation du mot de passe est obligatoire'),
    accountType: yup.string().required('Le type de compte est obligatoire'),
    gender: yup.string().required('Le genre est obligatoire'),
    phoneNumber: yup.string().matches(/^\d{10}$/, 'Numéro invalide'),
    dateOfBirth: yup.date().required('La date de naissance est obligatoire').nullable(),
    address: yup.object({
        street: yup.string().required('L\'adresse est obligatoire'),
        city: yup.string().required('La ville est obligatoire'),
        zipCode: yup.string().required('Le code postal est obligatoire').max(7, 'Le code postal ne doit pas dépasser 7 caractères'),
        country: yup.string().required('Le pays est obligatoire'),
        additionnalInformation: yup.string(),
    }).required('L\'adresse est obligatoire'),
    identifierNumber: yup.string()
        .required('Le numéro INAMI est obligatoire')
        .matches(/^\d+$/, 'Le numéro INAMI ne peut contenir que des chiffres')
        .max(11, 'Le numéro INAMI ne peut pas dépasser 11 chiffres'),
});

const validateField = async (field) => {
    try {
        if (field.includes('.')) {
            // Sépare le champ imbriqué
            const [parentField, childField] = field.split('.');
            const childValue = formData[parentField] ? formData[parentField][childField] : undefined;

            // Validation du champ imbriqué
            await schema.fields[parentField].fields[childField].validate({ [childField]: childValue });
        }
        else {
            // Validation pour un champ simple
            await schema.validateAt(field, toRaw(formData));
        }

        // Si la validation réussit, on efface l'erreur
        error[field] = '';
    }
    catch (err) {
        // Si la validation échoue, on stocke l'erreur
        error[field] = (err as yup.ValidationError).message;
    }
};

const { submit, inProgress } = useSubmit(
    () => {
        status.value = '';
        return register(formData).then(() => {
            useNuxtApp().$toast.success('Inscription réussie');

            Object.keys(formData).forEach((key) => {
                formData[key as keyof typeof formData] = key === 'accept' ? false : '';
            });
            inProgress.value = true;
        });
    },
    {
        onError: () => {
            useNuxtApp().$toast.error('L\'inscription a échouée');
        },
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
