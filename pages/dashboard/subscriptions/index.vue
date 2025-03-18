<template>
    <div>
        <div>
            <Stepper>
                <StepperContent>
                    <StepperItem v-if="currentStep === 0">
                        <div class="flex flex-col">
                            <div class="container px-6 py-8 mx-auto">
                                <div class="flex flex-col justify-center items-center">
                                    <div class="flex flex-col items-center xl:items-start xl:mx-8 mb-8">
                                        <h1 class="text-2xl font-medium text-gray-800 capitalize lg:text-3xl dark:text-white">
                                            Abonnement
                                        </h1>
                                        <div class="mt-4">
                                            <span class="inline-block w-40 h-1 bg-blue-500 rounded-full" />
                                            <span class="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full" />
                                            <span class="inline-block w-1 h-1 bg-blue-500 rounded-full" />
                                        </div>

                                        <p class="mt-4 font-medium text-gray-500 dark:text-gray-300">
                                            Obtenez un accès complet en choisissant votre formule !
                                        </p>
                                    </div>

                                    <div class="flex-1 xl:mx-8">
                                        <div class="mt-8 space-y-8 md:-mx-4 md:flex md:items-center md:justify-center md:space-y-0 xl:mt-0">
                                            <div class="max-w-sm mx-auto h-full border rounded-lg md:mx-4 dark:border-gray-700">
                                                <div class="p-6">
                                                    <h1 class="text-xl font-medium text-gray-700 capitalize lg:text-2xl dark:text-white">
                                                        Mensuel
                                                    </h1>

                                                    <p class="mt-4 text-gray-500 dark:text-gray-300">
                                                        Un abonnement flexible pour gérer vos remplacements et tournées sans engagement. Payez au mois et profitez de toutes les fonctionnalités essentielles.
                                                    </p>

                                                    <h2 class="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl dark:text-gray-300">
                                                        10eur <span class="text-base font-medium">/mois</span>
                                                    </h2>

                                                    <button class="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                                                        Commencez maintenant
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="max-w-sm mx-auto border rounded-lg md:mx-4 dark:border-gray-700">
                                                <div class="p-6">
                                                    <h1 class="text-xl font-medium text-gray-700 capitalize lg:text-2xl dark:text-white">
                                                        Annuel
                                                    </h1>

                                                    <p class="mt-4 text-gray-500 dark:text-gray-300">
                                                        Économisez en choisissant un abonnement annuel ! Profitez de toutes les fonctionnalités tout en réduisant vos coûts sur l’année.
                                                    </p>

                                                    <h2 class="mt-4 text-2xl font-semibold text-gray-700 sm:text-3xl dark:text-gray-300">
                                                        10eur <span class="text-base font-medium">/an</span>
                                                    </h2>

                                                    <button class="w-full px-4 py-2 mt-6 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                                                    @click="nextStep()">
                                                    >
                                                        Commencez maintenant
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </StepperItem>
                    <StepperItem v-if="currentStep === 1">
                        <div class="flex flex-col">
                            <h2 class="text-primary font-secondary">
                                Bienvenue
                            </h2>
                            <p>
                                amet consectetur adipisicing elit. Animi reprehenderit dolor dicta vitae repellat. Voluptatum dolorem cumque cupiditate pariatur recusandae Lorem ipsum dolor sit !
                            </p>
                        </div>
                    </StepperItem>
                </StepperContent>
            </Stepper>
        </div>
    </div>
</template>

<script setup>
import {
    Stepper,
    StepperItem,
} from '@/components/ui/stepper';

const currentStep = ref(0);

const nextStep = () => {
    currentStep.value = (currentStep.value + 1) % 3;
};

definePageMeta({
    layout: 'dashboard',
    middleware: 'verified',
});

useHead({
    title: 'Abonnements',
});
</script>
