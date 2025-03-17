<template>
    <NuxtLayout name="guest">
        <div class="relative font-light ">
            <div class="absolute inset-0 bg-tertiary/30 h-[300px] lg:h-full w-full" />
            <div class="container">
                <div class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-8 lg:py-20 mt-20">
                    <div class="lg:hidden text-center mb-8">
                        <h2 class="text-primary text-4xl font-semibold">
                            À propos
                        </h2>
                    </div>
                    <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                        <h3 class="text-primary md:text-3xl text-2xl text-center md:text-left">
                            Nos <span class="font-bold">Services</span>
                        </h3>
                        <p>
                            Chez INFISWAP, nous mettons à votre disposition une plateforme complète et intuitive conçue pour faciliter la vie des infirmiers libéraux. Notre objectif est de simplifier la gestion des remplacements, la planification des tournées et l’organisation quotidienne, afin que vous puissiez vous concentrer sur l’essentiel : soigner vos patients. Découvrez nos services clés :
                        </p>
                        <Button
                            href="/register"
                            class="w-44 mx-auto lg:mx-0 mt-8 flex justify-center items-center"
                        >
                            S'inscrire
                        </Button>
                    </div>
                    <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div class="flex justify-between items-center">
                            <div class="order-1 flex flex-col items-center">
                                <NuxtImg
                                    src="/home/woman_infirmier.png"
                                    alt="Infirmière"
                                    class="w-auto h-48 mb-4 z-20"
                                />
                            </div>

                            <div class="order-2 flex flex-col justify-between items-center">
                                <NuxtImg
                                    src="/home/woman_infirmier.png"
                                    alt="Infirmière"
                                    class="w-auto h-48 mb-4 z-20"
                                />
                                <NuxtImg
                                    src="/home/woman_infirmier.png"
                                    alt="Infirmière"
                                    class="w-auto h-48 mb-4 z-20"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute bottom-0 right-0 hidden lg:block z-0">
                <NuxtImg
                    src="/Vector_2.png"
                    class="w-64 lg:w-[32rem] relative"
                />
            </div>
            <div class="absolute bottom-[20%] left-2 hidden lg:block z-0">
                <NuxtImg
                    src="/icons/Unin.png"
                    class="w-8 lg:w-12 relative"
                />
            </div>
        </div>

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

        <div class="container grid grid-cols-1 lg:grid-cols-2 items-center my-10">
            <div class="order-1 lg:order-2 text-center lg:text-right">
                <h3 class="text-primary text-3xl font-semibold text-center lg:text-left">
                    Inscris-toi maintenant pour garantir ton activité
                </h3>
            </div>
            <div class="order-2 lg:order-1 flex justify-center lg:justify-start">
                <NuxtImg
                    src="/home/nurse_with_stetho.png"
                    alt="Infirmière avec un stéthoscope"
                    class="w-full max-w-md lg:max-w-lg h-auto object-cover rounded-lg"
                />
            </div>
        </div>
    </NuxtLayout>
    <!-- <ErrorUnderConstruction /> -->
</template>

<script lang="ts" setup>
useHead({
    title: 'Services',
});

definePageMeta({
    layout: 'auth',
});
</script>
