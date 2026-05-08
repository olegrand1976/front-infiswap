<template>
    <div class="lg:flex min-h-screen flex-row justify-center">
        <div class="hidden lg:block bg-tertiary/30 xl:w-[110vw] lg:w-[95vw] md:w-[95vw] sm:w-[70vw] relative container">
            <div class="absolute bottom-0 xl:left-32 lg:left-20">
                <LayoutsAppImage
                    src="/auth/Group_1171.png"
                    class="xl:w-[24rem] lg:w-88 relative z-20 flex justify-center mx-auto"
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
                    <span>Bienvenue sur <span class="font-bold text-primary">InfiSwap</span>, pour une inscription rapide</span>
                </h1>
                <h2 class="mb-4 px-4 text-sm lg:mb-6 xl:text-base text-center">
                    Nos infirmiers sont aussi souvent sur les routes et se déplacent de patients à patients pendant leurs tournées qui sont planifiées de semaine en semaine.
                </h2>
                <form
                    class="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    @submit.prevent="submit"
                >
                    <div class="col-span-2 relative w-full items-center">
                        <InputIcon
                            v-model="formData.lastname"
                            :icon="CircleUser"
                            size="md"
                            placeholder="Nom *"
                        />
                    </div>

                    <div class="col-span-2 relative w-full items-center">
                        <InputIcon
                            v-model="formData.firstname"
                            :icon="CircleUser"
                            size="md"
                            placeholder="Prénoms *"
                        />
                    </div>

                    <div class="col-span-2 relative w-full items-center">
                        <InputIcon
                            v-model="formData.email"
                            :icon="Mail"
                            size="md"
                            placeholder="Email *"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.phoneNumber"
                            :icon="Phone"
                            size="md"
                            placeholder="N° de téléphone"
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
                <div class="text-sm text-center mt-6">
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
import { CircleUser, Mail, Phone, Star } from 'lucide-vue-next';

import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';

const formData = reactive({
    lastname: '',
    firstname: '',
    email: '',
    phoneNumber: undefined,
});

const route = useRoute();
const { registerImmediate } = useAuth();
const { sendUrgentReplacement } = useReplacements();
const { $toast, $apifetch } = useNuxtApp();

const status = ref(
    (route.query.reset ?? '').length > 0 ? atob(route.query.reset as string) : '',
);

const { submit, inProgress } = useSubmit(
    async () => {
        status.value = '';
        await registerImmediate(formData);
        const pendingReplacement = useState('pendingReplacement');

        if (pendingReplacement.value) {
            const result = await sendUrgentReplacement(pendingReplacement.value);

            if (result === true) {
                pendingReplacement.value = null;
                $toast({
                    description: 'Création du remplacement rapide effectuée',
                });
                await $apifetch('api/logout', { method: 'post' });
                setTimeout(() => {
                    navigateTo('/');
                }, 2000);
            }
        }
    },
);

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});

useHead({
    title: 'Inscription rapide',
});
</script>
