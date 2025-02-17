<template>
    <!-- <NuxtLayout name="home">
        <template #title>
            Nos <strong>services</strong>
        </template>

        <div class="mt-48">
            <LayoutsGridCard />
        </div>

        <div>
            <HomeServiceContainer />
        </div>

        <div class="my-36">
            <LayoutsLogo class="w-72 flex justify-center items-center mx-auto" />
            <h2 class="text-3xl text-center text-primary font-bold my-10">
                Plus de temps pour soigner, Moins de temps à gérer !
            </h2>

            <section class="grid grid-cols-2 gap-44 items-center bg-tertiary/30 p-20">
                <div class="space-y-8">
                    <h3 class="text-primary text-3xl">
                        Infiswap...
                    </h3>
                    <p>
                        est une plateforme innovante conçue pour optimiser
                        la gestion des infirmiers libéraux. Elle simplifie les
                        remplacements, la planification des tournées et le suivi
                        des formations. Grâce à des outils intelligents et automatisés,
                        Infiswap améliore la coordination, réduit le temps administratif
                        et facilite l'organisation quotidienne, offrant ainsi une meilleure
                        qualité de soins et un gain de temps précieux.
                    </p>
                    <p>
                        la gestion des tournées est optimisée avec une planification automatisée,
                        prenant en compte les contraintes horaires, les types de soins et la
                        réduction des déplacements inutiles.
                    </p>
                    <p>
                        Infiswap permet également un suivi complet des formations professionnelles,
                        assurant la conformité aux obligations légales avec des rappels et une gestion
                        simplifiée des inscriptions. <br>
                        Le suivi des patients est amélioré par un historique détaillé des soins,
                        facilitant la transmission entre soignants.
                    </p>
                    <Button
                        href="/register"
                    >
                        S'inscrire
                    </Button>
                </div>

                <div>
                    <NuxtImg
                        src="/home/nurse_with_old_woman.png"
                        alt="Infirmière avec une vieille femme"
                        class="w-full"
                    />
                </div>
            </section>
        </div>

        <div class="container grid grid-cols-2 items-center">
            <div>
                <NuxtImg
                    src="/home/nurse_with_stetho.png"
                    alt="Infirmière avec une stéthoscope"
                    class="h-full object-cover"
                />
            </div>

            <div>
                <h3 class="text-primary text-3xl font-semibold">
                    Inscris-toi maintenant pour garantir ton activité
                </h3>
            </div>
        </div>
    </NuxtLayout> -->
    <ErrorUnderConstruction />
</template>

<script lang="ts" setup>
useHead({
    title: 'Services',
});

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});
</script>
