<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            Rechercher un(e) infirmier(e)
        </template>
        <div class="container">
            <form @submit.prevent="submit">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                                <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center gap-2 pl-4 pr-2">
                                    <UserCircleIcon class="w-6 text-primary sm:text-white" />
                                    <span class="font-light hidden sm:inline text-primary sm:text-white">Nom</span>
                                </div>
                                <Input
                                    v-model="formData.lastname"
                                    placeholder="Doe"
                                    variant="transparent"
                                    class="w-full text-black placeholder:text-black/80"
                                />
                            </div>
                        </div>

                        <div>
                            <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                                <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                    <div class="flex space-x-4 text-white items-center ms-4 relative">
                                        <UserCircleIcon class="w-6 text-primary sm:text-white" />
                                        <PlusIcon class="w-3 text-primary sm:text-white absolute top-0 left-1" />
                                        <span class="font-light hidden sm:inline text-primary sm:text-white">Prénom</span>
                                    </div>
                                </div>
                                <Input
                                    v-model="formData.firstname"
                                    variant="transparent"
                                    placeholder="John"
                                    class="w-full text-black placeholder:text-black/80"
                                />
                            </div>
                        </div>

                        <div>
                            <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                                <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                    <div class="flex space-x-4 text-white items-center ms-4 relative">
                                        <EnvelopeIcon class="w-6 text-primary sm:text-white" />
                                        <span class="font-light hidden sm:inline text-primary sm:text-white">Email</span>
                                    </div>
                                </div>
                                <Input
                                    v-model="formData.email"
                                    variant="transparent"
                                    placeholder="doejohn@gmail.com"
                                    class="w-full text-black placeholder:text-black/80"
                                />
                            </div>
                        </div>

                        <div>
                            <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                                <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                    <div class="flex space-x-4 text-white items-center ms-4 relative">
                                        <IdentificationIcon class="w-6 text-primary sm:text-white" />
                                        <span class="font-light hidden sm:inline text-primary sm:text-white">NISS *</span>
                                    </div>
                                </div>
                                <Input
                                    v-model="formData.niss"
                                    variant="transparent"
                                    placeholder="199648556596"
                                    class="w-full text-black placeholder:text-black/80"
                                />
                            </div>
                        </div>

                        <div>
                            <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                                <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                    <div class="flex space-x-4 text-white items-center ms-4 relative">
                                        <PhoneIcon class="w-6 text-primary sm:text-white" />
                                        <span class="font-light hidden sm:inline text-primary sm:text-white">Téléphone</span>
                                    </div>
                                </div>
                                <Input
                                    v-model="formData.phoneNumber"
                                    variant="transparent"
                                    placeholder="0499010203"
                                    class="w-full text-black placeholder:text-black/80"
                                />
                            </div>
                        </div>

                        <div>
                            <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                                <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                    <div class="flex space-x-4 text-white items-center ms-4 relative">
                                        <div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                            <LayoutsAppImage
                                                src="/icons/zip_code.png"
                                                class="w-4"
                                            />
                                        </div>
                                        <span class="font-light hidden sm:inline text-primary sm:text-white">Code postal</span>
                                    </div>
                                </div>
                                <Input
                                    v-model="formData.zipCode"
                                    variant="transparent"
                                    placeholder="99333"
                                    class="w-full text-black placeholder:text-black/80"
                                />
                            </div>
                        </div>

                        <div>
                            <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_75%]">
                                <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                    <div class="flex space-x-4 text-white items-center ms-4 relative">
                                        <div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                            <LayoutsAppImage
                                                src="/icons/city_white.png"
                                                class="w-8"
                                            />
                                        </div>
                                        <span class="font-light hidden sm:inline text-primary sm:text-white">Ville</span>
                                    </div>
                                </div>
                                <Input
                                    v-model="formData.city"
                                    variant="transparent"
                                    placeholder="Bruxelles"
                                    class="w-full text-black placeholder:text-black/80"
                                />
                            </div>
                        </div>

                        <div>
                            <div class="h-10 rounded-full border border-primary grid grid-cols-[30%_70%]">
                                <div class="bg-transparent sm:bg-primary rounded-s-full flex items-center">
                                    <div class="flex space-x-4 text-white items-center ms-4 relative">
                                        <HeartIcon class="w-6 text-primary sm:text-white" />
                                        <span class="font-light hidden sm:inline text-primary sm:text-white">Catégorie</span>
                                    </div>
                                </div>
                                <Select v-model="formData.category">
                                    <SelectTrigger
                                        class="w-full bg-transparent text-nowrap border border-none"
                                        position="right"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent class="border border-none">
                                        <template
                                            v-for="[key, value] in Object.entries(category)"
                                            :key="key"
                                        >
                                            <SelectItem :value="key">
                                                {{ value }}
                                            </SelectItem>
                                        </template>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div class="h-40 lg:h-[450px] rounded-3xl border border-primary">
                                <Textarea
                                    v-model="formData.description"
                                    placeholder="Veuillez préciser la raison de votre demande d’un infirmier"
                                    class="w-full h-full resize-none rounded-xl p-4 text-black placeholder:text-black/80 bg-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex items-center justify-center">
                    <Checkbox
                        id="accept"
                        v-model="formData.accept"
                        class="mt-2"
                    />
                    <label
                        for="accept"
                        class="text-xs font-light ml-2 mt-2"
                    >
                        Vos coordonnées seront enregistrées et transmises à notre réseau d'infirmières, sans être partagées avec des tiers.
                    </label>
                </div>

                <div class="mt-12 flex justify-center items-center">
                    <Button
                        type="submit"
                        class="w-96 flex justify-center items-center mx-auto"
                    >
                        <span>{{ inProgress ? 'Envoi en cours...' : 'Envoyer' }}</span>
                    </Button>
                </div>

                <div class="mt-12 flex justify-center items-center">
                    <span class="text-center text-xs">
                        Vous serez contacté prochainement par une infirmière de notre réseau, proche de chez vous.
                    </span>
                </div>
            </form>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import {
    UserCircleIcon,
    PlusIcon,
    PhoneIcon,
    HeartIcon,
    EnvelopeIcon,
    IdentificationIcon,
} from '@heroicons/vue/24/solid';
import { searchNurse } from '~/composables/usePatients';

const { $toast } = useNuxtApp();

const router = useRouter();

useHead({
    title: 'Chercher un(e) infirmier(e)',
    meta: [{ name: 'description', content: 'Vous cherchez une infirmière qualifiée ? Trouvez une professionnelle de santé compétente pour vos soins à domicile ou en établissement. Consultez les profils des infirmières disponibles dans votre région.' }],
});

definePageMeta({
    layout: false,
});

const formData = reactive({
    lastname: '',
    firstname: '',
    email: '',
    niss: '',
    phoneNumber: '',
    zipCode: '',
    city: '',
    category: 'ordinary',
    description: '',
    accept: true,
});

const error = reactive({
    lastname: '',
    firstname: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
});

const category = {
    vipo: 'Vipo',
    ordinary: 'Ordinaire',
};

const { submit, inProgress } = useSubmit(
    async () => {
        Object.keys(error).forEach((key) => {
            error[key] = '';
        });

        try {
            await searchNurse().submitSearchNurse(formData);

            $toast({
                title: 'Succès',
                description: 'Envoi de formulaire effectué',
            });

            Object.keys(formData).forEach((key) => {
                (formData as Record<string, string | boolean>)[key] = key === 'accept' ? false : '';
            });

            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
        catch (err) {
            let errorMessage = 'Échec de l\'envoi du formulaire';

            if (err?.data?.errors) {
                const backendErrors = err.data.errors;
                const firstKey = Object.keys(backendErrors)[0];

                if (firstKey) {
                    const firstError = backendErrors[firstKey];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                    error[firstKey] = errorMessage;
                }
            }
            else if (err?.data?.message) {
                errorMessage = err.data.message;
            }

            $toast({
                title: 'Oups! Une erreur s\'est produite',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    },
);
</script>
