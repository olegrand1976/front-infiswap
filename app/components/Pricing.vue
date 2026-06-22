<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="flex flex-col justify-center items-center">
        <div class="flex flex-col items-center justify-center xl:mx-8 mb-8">
            <p class="mt-4 font-medium text-center text-gray-500 dark:text-gray-300">
                Accédez à InfiSwap avec un abonnement simple et transparent.
            </p>
        </div>

        <div
            v-if="loading && !plans?.platform"
            class="mt-8"
        >
            <Skeleton class="h-[220px] w-full max-w-sm rounded-xl bg-gray-200" />
        </div>

        <div
            v-else-if="plans?.platform"
            class="max-w-sm mx-auto border rounded-lg dark:border-gray-700"
        >
            <div class="p-6">
                <h1 class="text-xl text-center font-medium text-success capitalize lg:text-2xl dark:text-white">
                    Accès InfiSwap
                </h1>

                <p class="mt-4 text-gray-500 dark:text-gray-300 text-center">
                    {{ plans.platform.description || 'Accès complet à la plateforme pour gérer vos remplacements.' }}
                </p>

                <h2 class="mt-4 text-2xl text-center font-semibold text-gray-700 sm:text-3xl dark:text-gray-300">
                    {{ plans.platform.amount }} €
                    <span class="text-base font-medium">/mois</span>
                </h2>

                <Button
                    class="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-success rounded-md hover:bg-success-500"
                    :in-progress="loading"
                    @click="handleSubscribe"
                >
                    S'abonner
                </Button>
            </div>
        </div>

        <div
            v-else
            class="text-center text-gray-500 py-8"
        >
            Aucun plan disponible pour le moment.
        </div>

        <div
            v-if="plans?.boost"
            class="container mt-10 max-w-2xl ml-5 lg:ml-12 font-medium text-gray-500 dark:text-gray-300 mb-14"
        >
            <p class="text-sm md:text-base">
                Option disponible sur vos remplacements :
                <strong>mise en avant en tête de liste</strong> à {{ plans.boost.amount }} € / semaine.
                Les remplacements publiés par les institutions sont mis en avant automatiquement.
            </p>
        </div>

        <div class="container mt-4 ml-5 lg:ml-12 font-medium text-gray-500 dark:text-gray-300 mb-14">
            <ul class="font-bold pl-5 md:pl-20 text-sm md:text-base">
                <li>Inclus dans votre abonnement :</li>
            </ul>
            <ul class="list-[circle] pl-8 md:pl-32 mt-2 space-y-2 text-sm md:text-base">
                <li>Créer et consulter vos remplacements</li>
                <li>Rechercher des remplacements disponibles</li>
                <li>Recevoir les notifications selon vos préférences</li>
                <li>Accéder aux informations de tournées</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSubscription } from '~/composables/useSubscription';

const { plans, getPlans, create, loading } = useSubscription();

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

useHead({ title: 'Abonnements' });

await getPlans();

const handleSubscribe = async () => {
    if (!plans.value?.platform?.stripe_price_id) {
        return;
    }

    const response = await create(plans.value.platform.stripe_price_id);

    if (response?.url) {
        window.location.href = response.url;
    }
};
</script>
