<template>
    <div
        class="relative min-h-96"
    >
        <div>
            <div class="flex flex-col justify-center items-center">
                <div class="flex flex-col items-center xl:items-center xl:mx-8 mb-8">
                    <h1 class="text-2xl font-medium text-success capitalize lg:text-3xl dark:text-white">
                        Merci pour votre abonnement !
                    </h1>
                    <div class="mt-4">
                        <span class="inline-block w-40 h-1 bg-success rounded-full" />
                        <span class="inline-block w-3 h-1 mx-1 bg-success rounded-full" />
                        <span class="inline-block w-1 h-1 bg-success rounded-full" />
                    </div>
                </div>

                <div
                    class="flex-1 xl:mx-8"
                >
                    <div class="mt-8 space-y-8 md:-mx-4 md:flex md:items-center md:justify-center md:space-y-0 xl:mt-0">
                        <div class="max-w-sm mx-auto h-full border rounded-lg md:mx-4 dark:border-gray-700">
                            <div class="p-6 text-center">
                                <h1 class="text-xl font-medium text-success capitalize lg:text-2xl dark:text-white">
                                    Mensuel
                                </h1>

                                <p class="mt-4 max-w-sm text-gray-500 dark:text-gray-300">
                                    Nous vous remercions pour votre confiance et votre abonnement à notre service. Vous pouvez profiter dès maintenant de toutes les fonctionnalités que nous proposons.
                                </p>

                                <!-- <span>Vous êtes désormais abonnée à [Nom du service]</span> -->
                                <!-- <h2 class="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl dark:text-gray-300">
                                    20 €<span class="text-base font-medium">/mois</span>
                                </h2> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
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
    middleware: 'verified',
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
