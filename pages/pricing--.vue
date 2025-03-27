<template>
    <NuxtLayout name="guest-with-title">
        <div class="container px-4 sm:px-6 lg:px-8 -mt-32 sm:mt-6 lg:mt-0">
            <h6 class="text-primary text-xl md:text-2xl lg:text-4xl text-center">
                Prix abonnement infiswap
            </h6>
            <div class="text-center mt-6">
                <!-- <p>Bonjour</p> -->
            </div>
        </div>

        <div class="container mt-12 lg:mt-28 px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col items-center h-auto p-4">
                <div
                    v-if="plans"
                    class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center w-full max-w-4xl"
                >
                    <div
                        v-if="plans?.monthly"
                        class="flex flex-col w-full md:w-72 border-2 border-primary rounded-lg overflow-hidden"
                    >
                        <div class="bg-primary  text-white text-center p-3 border-t-2 border-primary">
                            Prix Mensuel
                        </div>
                        <div class="bg-gray-200 flex flex-col items-center justify-center p-6 space-y-4 w-full">
                            <div class="text-center border-b-2 border-primary pb-4 w-full">
                                <h1 class="text-lg leading-tight">
                                    <!-- Bonjour -->
                                </h1>
                                <div class="flex items-center justify-center space-x-2 mt-6">
                                    <h1 class="text-5xl font-bold text-primary my-6">
                                        {{ parseInt(plans.monthly.amount) }}
                                        <sup class="text-lg align-super">€</sup>
                                    </h1>
                                    <span class="text-sm">Par mois</span>
                                </div>
                            </div>
                            <button
                                class="m-6 w-32 bg-primary text-white py-2 rounded-full"
                                @click="handleClick('monthly')"
                            >
                                Consulter
                            </button>
                        </div>
                    </div>

                    <div
                        v-if="plans?.yearly"
                        class="flex flex-col w-full md:w-72 border-2 border-primary rounded-lg overflow-hidden"
                    >
                        <div class="bg-primary text-white text-center p-3 border-b-2 border-primary">
                            Prix Annuel
                        </div>
                        <div class="bg-gray-200 flex flex-col items-center justify-center p-6 space-y-4 w-full">
                            <div class="text-center border-b-2 border-primary pb-4 w-full">
                                <h1 class="text-lg leading-tight">
                                    <!-- Bonjour -->
                                </h1>
                                <div class="flex items-center justify-center space-x-2 mt-6">
                                    <h1 class="text-5xl font-bold text-primary my-6">
                                        {{ parseInt(plans.yearly.amount) }}
                                        <sup class="text-lg align-super">€</sup>
                                    </h1>
                                    <span class="text-sm">Par an</span>
                                </div>
                            </div>
                            <button
                                class="m-6 w-32 bg-primary text-white py-2 rounded-full"
                                @click="handleClick('yearly')"
                            >
                                Consulter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useSubscription } from '~/composables/useSubscription';

const isAuthenticated = ref(false);
const { plans, getPlans } = useSubscription();
const router = useRouter();

const handleClick = (type: string) => {
    router.push(isAuthenticated.value ? `/register` : `/login`);
};

onMounted(async () => {
    await getPlans();
});

useHead({
    title: 'Tarification',
});

definePageMeta({
    layout: false,
});
</script>
