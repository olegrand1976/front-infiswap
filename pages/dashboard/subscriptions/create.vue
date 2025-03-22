<template>
    <div
        class="relative min-h-96"
    >
        <div>
            <div class="flex flex-col justify-center items-center">
                <div class="flex flex-col items-center xl:items-start xl:mx-8 mb-8">
                    <h1 class="text-2xl font-medium text-success capitalize lg:text-3xl dark:text-white">
                        Abonnement
                    </h1>
                    <div class="mt-4">
                        <span class="inline-block w-40 h-1 bg-success rounded-full" />
                        <span class="inline-block w-3 h-1 mx-1 bg-success rounded-full" />
                        <span class="inline-block w-1 h-1 bg-success rounded-full" />
                    </div>

                    <p class="mt-4 font-medium text-gray-500 dark:text-gray-300">
                        Obtenez un accès complet en choisissant votre formule !
                    </p>
                </div>

                <div
                    v-if="loading && Object.keys(plans ?? {}).length == 0"
                    class="mt-8 space-y-8 md:-mx-4 md:flex md:items-center md:justify-center md:space-y-0 xl:mt-0"
                >
                    <div class="grid grid-cols-2 gap-2 md:gap-4">
                        <div class="flex flex-col space-y-3">
                            <Skeleton class="h-[180px] w-[400px] rounded-xl bg-gray-200" />
                            <div class="space-y-2">
                                <Skeleton class="h-4 w-[400px]  bg-gray-200" />
                                <Skeleton class="h-4 w-[400px]  bg-gray-200" />
                            </div>
                        </div>
                        <div class="flex flex-col space-y-3">
                            <Skeleton class="h-[180px] w-[400px] rounded-xl  bg-gray-200" />
                            <div class="space-y-2">
                                <Skeleton class="h-4 w-[400px]  bg-gray-200" />
                                <Skeleton class="h-4 w-[400px] bg-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="flex-1 xl:mx-8"
                >
                    <div class="mt-8 space-y-8 md:-mx-4 md:flex md:items-center md:justify-center md:space-y-0 xl:mt-0">
                        <div class="max-w-sm mx-auto h-full border rounded-lg md:mx-4 dark:border-gray-700">
                            <div class="p-6">
                                <h1 class="text-xl font-medium text-success capitalize lg:text-2xl dark:text-white">
                                    Mensuel
                                </h1>

                                <p class="mt-4 text-gray-500 dark:text-gray-300">
                                    Un abonnement flexible pour gérer vos remplacements et tournées sans engagement. Payez au mois et profitez de toutes les fonctionnalités essentielles.
                                </p>

                                <h2 class="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl dark:text-gray-300">
                                    {{ plans?.monthly.amount }} €<span class="text-base font-medium">/mois</span>
                                </h2>

                                <Button
                                    class="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-success rounded-md hover:bg-success-500 focus:outline-none focus:bg-success-500 focus:ring focus:ring-success-300 focus:ring-opacity-10"
                                    :in-progress="loading && plan.stripe_price_id == plans?.monthly.stripe_price_id"
                                    @click="handleSelectPlan(plans.monthly)"
                                >
                                    Commencez maintenant
                                </Button>
                            </div>
                        </div>

                        <div class="max-w-sm mx-auto border rounded-lg md:mx-4 dark:border-gray-700">
                            <div class="p-6">
                                <h1 class="text-xl text-success font-bold capitalize lg:text-2xl dark:text-white">
                                    Annuel
                                </h1>

                                <p class="mt-4 text-gray-500 dark:text-gray-300">
                                    Économisez en choisissant un abonnement annuel ! Profitez de toutes les fonctionnalités tout en réduisant vos coûts sur l’année.
                                </p>

                                <h2 class="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl dark:text-gray-300">
                                    {{ plans?.yearly.amount }} €<span class="text-base font-medium">/an</span>
                                </h2>
                                <Button
                                    class="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-success rounded-md hover:bg-success-500 focus:outline-none focus:bg-success-500 focus:ring focus:ring-success-300 focus:ring-opacity-10"
                                    :in-progress="loading && plan.stripe_price_id == plans?.yearly.stripe_price_id"
                                    @click="handleSelectPlan(plans.yearly)"
                                >
                                    Commencez maintenant
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSubscription, type Plan } from '~/composables/useSubscription';

const {
    plans,
    getPlans,
    plan,
    selectPlan,
    loading,
    create,
} = useSubscription();

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified', 'unsubscribed'],
});

useHead({
    title: 'Abonnements',
});

const handleSelectPlan = async (product: Plan) => {
    selectPlan(product);
    const response = await create(product.stripe_price_id);

    if (response?.url) {
        window.location.href = response.url;
    }
};

onMounted(async () => {
    await getPlans();
});
</script>
