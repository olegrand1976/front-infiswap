<template>
    <div
        class="relative min-h-96"
    >
        <div>
            <div class="flex flex-col items-center justify-center mb-8">
                <div
                    class="flex-1 xl:mx-8"
                >
                    <div class="mt-8 space-y-8 md:-mx-4 md:flex md:items-center md:justify-center md:space-y-0 xl:mt-0">
                        <div class="h-full max-w-lg mx-auto border rounded-lg md:mx-4 dark:border-gray-700">
                            <div class="p-6 text-center">
                                <Star class="flex justify-center w-24 mx-auto text-success" />

                                <h1 class="text-5xl font-semibold text-success">
                                    <span>100% gratuit</span>
                                </h1>

                                <div class="max-w-lg mt-4 text-gray-500 dark:text-gray-300">
                                    <p>
                                        InfiSwap est accessible et utilisable 100% gratuitement. Profitez en pour utiliser et tester l'ensemble de nos services qui vont évoluer ces prochains mois.
                                        N'hésitez pas à <NuxtLink
                                            to="/contact"
                                            class="text-primary"
                                        >nous contacter</NuxtLink> sur : <a
                                            href="mailto:info@infiswap.be"
                                            class="font-bold text-primary"
                                            target="_blank"
                                        >info@infiswap.be</a> ou au 0478.02.33.77 pour plus d'informations.
                                    </p>
                                    <p class="mt-2">
                                        Abonnement infirmière : 15 €/mois. Option de mise en avant des remplacements : 5 €/semaine.
                                    </p>
                                </div>

                                <h1
                                    v-if="current?.plan?.description"
                                    class="text-xl font-medium capitalize text-success lg:text-2xl dark:text-white"
                                >
                                    {{ current.plan.description }}
                                </h1>

                                <p class="max-w-sm mt-4 text-gray-500 dark:text-gray-300">
                                    Nous vous remercions pour votre confiance et votre abonnement à notre service. Vous pouvez profiter dès maintenant de toutes les fonctionnalités que nous proposons.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

useHead({
    title: 'Abonnements',
});

const { current, getCurrentAccess } = useSubscription();

onMounted(async () => {
    await getCurrentAccess();
});
</script>
