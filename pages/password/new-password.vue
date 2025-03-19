<template>
    <!-- <div> -->
        <div class="hidden sm:flex flex-row justify-center h-auto sm:pt-[25vh] xl:pt-0">
            <div class="bg-tertiary/30 hidden lg:flex flex-col items-center lg:w-[115vw] sm:w-[85vw] relative container">
                <div class="flex justify-center items-center mb-auto mt-[30%]">
                    <NuxtImg
                        src="/icons/unlock.png"
                        class="lg:w-52"
                    />
                </div>
                <div class="absolute top-[10%] left-[4%]">
                    <NuxtImg
                        src="/icons/plus.png"
                        class="lg:w-24"
                    />
                </div>
                <div class="absolute bottom-[18%] right-[6%]">
                    <NuxtImg
                        src="/icons/Unin.png"
                        class="lg:w-16"
                    />
                </div>

                <div class="absolute right-6 top-6">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute bottom-[20%] left-[15%]">
                    <NuxtImg
                        src="/icons/cog_2.png"
                        class="lg:w-52"
                    />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white container w-full xl:h-[100vh] lg:h-[55vh] flex flex-col space-y-12 justify-center items-center">
                <div>
                    <LayoutsLogo class="sm:w-64 lg:w-72" />
                </div>
                <h1 class="md:text-2xl sm:text-xl text-center text-primary">
                    Réinitialisez votre <span class="font-bold">mot de passe</span>
                </h1>
                <div class="w-full container">
                    <form
                        class="flex flex-col space-y-4"
                        @submit.prevent="resetPassword"
                    >
                        <FormField name="email">
                            <FormItem>
                                <FormLabel class="text-xs text-primary font-bold mb-12">
                                    Nouveau mot de passe
                                </FormLabel>
                                <div class="flex flex-col space-x-1 px-4 h-10 rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                    <FormControl>
                                        <div class="flex items-center space-x-1">
                                            <LockClosedIcon class="text-primary w-7" />
                                            <Input
                                                v-model="formData.password"
                                                type="password"
                                                placeholder="Saisissez votre mot de passe"
                                                class="md:text-sm sm:text-xs"
                                            />
                                        </div>
                                    </FormControl>
                                </div>
                            </FormItem>
                        </FormField>

                        <FormField name="email">
                            <FormItem>
                                <FormLabel class="text-xs text-primary font-bold mb-12">
                                    Confirmer le nouveau mot de passe
                                </FormLabel>
                                <div class="flex flex-col space-x-1 px-4 h-10 rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                    <FormControl>
                                        <div class="flex items-center space-x-1">
                                            <LockClosedIcon class="text-primary w-7" />
                                            <Input
                                                v-model="formData.passwordConfirm"
                                                type="password"
                                                placeholder="Saisissez votre mot de passe"
                                                class="md:text-sm sm:text-xs"
                                            />
                                        </div>
                                    </FormControl>
                                </div>
                            </FormItem>
                        </FormField>

                        <div class="flex justify-center items-center mx-auto pt-8">
                            <Button
                                type="submit"
                                class="font-bold px-16 md:text-sm sm:text-xs"
                            >
                                Réinitialisez le mot de passe
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="sm:hidden w-screen flex flex-col justify-between relative overflow-hidden">
            <LayoutsHeaderMobile />

            <h1 class="text-lg text-center text-primary mt-32">
                Réinitialisez votre <span class="font-bold">mot de passe</span>
            </h1>

            <div class="w-full container mt-12">
                <form
                    class="flex flex-col space-y-8"
                    @submit.prevent="resetPassword"
                >
                    <FormField name="email">
                        <FormItem>
                            <FormLabel class="text-xs text-primary font-bold mb-12">
                                Nouveau mot de passe
                            </FormLabel>
                            <div class="flex flex-col space-x-1 px-4 h-10 rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center space-x-1">
                                        <LockClosedIcon class="text-primary w-7" />
                                        <Input
                                            v-model="formData.password"
                                            type="password"
                                            placeholder="Saisissez votre mot de passe"
                                            class="md:text-sm sm:text-xs"
                                        />
                                    </div>
                                </FormControl>
                            </div>
                        </FormItem>
                    </FormField>

                    <FormField name="email">
                        <FormItem>
                            <FormLabel class="text-xs text-primary font-bold mb-12">
                                Confirmer le nouveau mot de passe
                            </FormLabel>
                            <div class="flex flex-col space-x-1 px-4 h-10 rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                <FormControl>
                                    <div class="flex items-center space-x-1">
                                        <LockClosedIcon class="text-primary w-7" />
                                        <Input
                                            v-model="formData.passwordConfirm"
                                            type="password"
                                            placeholder="Saisissez votre mot de passe"
                                            class="md:text-sm sm:text-xs"
                                        />
                                    </div>
                                </FormControl>
                            </div>
                        </FormItem>
                    </FormField>

                    <div class="flex justify-center items-center mx-auto pt-12">
                        <Button
                            type="submit"
                            class="font-bold px-16 md:text-sm sm:text-xs"
                        >
                            Réinitialisez le mot de passe
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    <!-- </div> -->
</template>

<!-- <script lang="ts" setup> -->
// import { LockClosedIcon } from '@heroicons/vue/24/solid';
// import { ref } from 'vue';
// import { useRoute } from 'vue-router';
// import axios from 'axios';

// const { $toast } = useNuxtApp();

// definePageMeta({
    // layout: 'auth',
// });

// useHead({
    // title: 'Réinitialisation de mot de passe',
// });

// const formData = ref({
    // email: '',
    // password: '',
    // passwordConfirm: '',
    // token: '',
// });

// // Méthode pour récupérer les paramètres de l'URL
// const getUrlParams = () => {
    // const urlParams = new URLSearchParams(window.location.search);
    // formData.value.email = urlParams.get('email');
    // formData.value.token = urlParams.get('token');
// };

// const route = useRoute();
// const token = ref(route.query.token as string || '');

// const resetPassword = async () => {
    // getUrlParams();
    // if (formData.value.password !== formData.value.passwordConfirm) {
        // alert('Les mots de passe ne correspondent pas.');
        // return;
    // }

    // const data = {
        // email: formData.value.email,
        // password: formData.value.password,
        // password_confirmation: formData.value.passwordConfirm,
        // token: formData.value.token,
    // };

    // try {
        // // Envoi de la requête POST à l'API
        // const response = await axios.post('http://localhost:8094/api/forgot-password', data);

        // // Traitement de la réponse
        // if (response.data.success) {
            // $toast({
                // title: 'Succès',
                // description: 'Vérifiez votre boîte de réception.',
            // });
            // // setTimeout(() => {
            // //     window.location.href = '/login';
            // // }, 3000);
        // }
        // else {
            // $toast({
                // title: 'Succès',
                // description: 'Vérifiez votre boîte de réception.',
            // });
        // }
    // }
    // catch (error) {
        // console.error('Erreur lors de l\'envoi des données :', error);
        // $toast({
            // title: 'Oups! Une erreur s\'est produite',
            // description: 'Échec de l\'envoi du formulaire',
            // variant: 'destructive',
        // });
    // }
// };
</script>
