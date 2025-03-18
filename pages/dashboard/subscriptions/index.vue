<template>
    <div
        class="relative grid place-content-center min-h-96"
    >
        <div v-if="loading">
            Chargement des plans...
        </div>

        <Stepper
            v-else
            v-model="stepIndex"
        >
            <StepperContent>
                <StepperItem
                    v-if="stepIndex === 1"
                    :step="1"
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

                            <div class="flex-1 xl:mx-8">
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
                                                {{ plans?.monthly.amount }} <span class="text-base font-medium">/mois</span>
                                            </h2>

                                            <Button
                                                class="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-success rounded-md hover:bg-success-500 focus:outline-none focus:bg-success-500 focus:ring focus:ring-success-300 focus:ring-opacity-10"
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
                                                {{ plans?.yearly.amount }} <span class="text-base font-medium">/an</span>
                                            </h2>
                                            <Button
                                                class="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-success rounded-md hover:bg-success-500 focus:outline-none focus:bg-success-500 focus:ring focus:ring-success-300 focus:ring-opacity-10"
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
                </StepperItem>
                <StepperItem
                    v-if="stepIndex === 2"
                    :step="2"
                >
                    <div>
                        <button
                            class="text-primary absolute top-0 left-0"
                            type="button"
                            @click="back()"
                        >
                            <ArrowLeftCircleIcon class="size-7" />
                        </button>
                        <CheckoutStripe />
                    </div>
                </StepperItem>
            </StepperContent>
        </Stepper>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeftCircleIcon } from '@heroicons/vue/24/outline';

import {
    Stepper,
    StepperItem,
} from '@/components/ui/stepper';

const plans = useState('plans');

const {
    getPlans,
    selectPlan,
    loading,
} = useSubscription();

definePageMeta({
    layout: 'dashboard',
    middleware: 'verified',
});

useHead({
    title: 'Abonnements',
});

const stepIndex = ref(1);

const handleSelectPlan = (product: Plan) => {
    selectPlan(product);
    stepIndex.value = stepIndex.value + 1;
};

function back() {
    stepIndex.value = stepIndex.value - 1;
}

onMounted(async () => {
    await getPlans();
});
</script>
