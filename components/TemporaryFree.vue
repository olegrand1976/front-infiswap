<template>
    <div class="container flex flex-col items-center px-4 py-12 mx-auto text-center">
        <div class="max-w-2xl flex flex-col gap-2 items-center justify-center mx-auto text-4xl font-semibold tracking-tight text-success xl:text-5xl text-center">
            <StarIcon class="size-36" />
            <h1>100% gratuit</h1>
        </div>

        <div class="max-w-4xl mt-6 text-center text-gray-500 dark:text-gray-300">
            <p>
                InfiSwap est accessible et utilisable 100% gratuitement. Profitez en pour utiliser et tester l'ensemble de nos services qui vont évoluer ces prochains mois.
                N'hésitez à <NuxtLink
                    to="/contact"
                    class="text-primary"
                >nous contacter</NuxtLink> sur : <a
                    href="mailto:info@infiswap.be"
                    class="text-primary font-bold"
                    target="_blank"
                >info@infiswap.be</a> ou au 0478.02.33.77 pour plus d'informations.
            </p>
            <p class="mt-2">
                Après cette période de lancement un tarif de 18 €/mois ou 180 €/an sera demandé aux infirmières souhaitant continuer à utiliser InfiSwap.
            </p>
        </div>

        <div class="inline-flex w-full mt-6 sm:w-auto justify-center">
            <Button href="/register">
                Commencer dès maintenant
            </Button>
        </div>
    </div>
</template>

<script setup>
import { StarIcon } from '@heroicons/vue/24/solid';
</script>
