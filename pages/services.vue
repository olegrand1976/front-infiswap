<template>
    <NuxtLayout name="guest">
        <div class="relative font-light ">
            <div class="absolute inset-0 bg-tertiary/30 h-[300px] lg:h-full w-full" />
            <div class="container">
                <div class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-8 lg:py-20 mt-20">
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
                        <div class="flex justify-between items-center gap-4">
                            <div class="order-1 flex flex-col items-center">
                                <NuxtImg
                                    src="/home/Serum.png"
                                    alt="serum"
                                    class="w-auto h-49 mb-6 z-20 -mt-36"
                                />
                            </div>

                            <div class="order-2 flex flex-col justify-between items-center">
                                <NuxtImg
                                    src="/home/sphygmomanometer.png"
                                    alt="appareil tensionnel"
                                    class="w-auto h-49 mb-4 z-20"
                                />
                                <NuxtImg
                                    src="/home/Dressing.png"
                                    alt="pansement"
                                    class="w-auto h-49  mb-4 z-20"
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
        <div class="container">
            <div class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6">
                <div>
                    <NuxtImg
                        src="/home/equipe_infirmier.png"
                        alt="equipe infirmier"
                        class="w-full"
                    />
                </div>

                <div class="space-y-6">
                    <h3 class="xl:text-4xl lg:text-3xl md:text-xl lg:w-96 md:w-80 text-primary font-bold">
                        Recherche et Gestion <br>
                        de Remplacement
                    </h3>
                    <h4 class="text-lg lg:text-xl text-primary">Accès rapide aux offres</h4>
                    <p>
                        Intègre des outils de gestion administrative et financière,
                        notamment le suivi des véhicules, la facturation et la
                        centralisation des informations essentielles.
                    </p>
                    <div>
                        <Button
                            href="/"
                            class="mx-auto inline-flex lg:text-sm sm:text-xs px-10"
                        >
                            En savoir plus
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10">
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3 class="xl:text-3xl lg:text-3xl md:text-xl lg:w-96 md:w-80 text-primary font-bold">
                        Notification en temps réel
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
                    <div>
                        <Button
                            href="/"
                            class="mx-auto inline-flex lg:text-sm sm:text-xs px-10"
                        >
                            En savoir plus
                        </Button>
                    </div>
                </div>
                <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <NuxtImg
                        src="/home/cart.png"
                        alt="cart"
                        class="w-full max-w-2xs lg:max-w-none z-20"
                    />
                </div>
            </div>
        </div>
        <div class="container">
            <div class="-mt-10 relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6">
                <div>
                    <NuxtImg
                        src="/home/nurse_with_elderly_man.png"
                        alt="un infirmier with vielle homme"
                        class="w-full"
                    />
                </div>

                <div class="space-y-6">
                    <h3 class="xl:text-3xl lg:text-3xl md:text-xl lg:w-96 md:w-80 text-primary font-bold">
                        Planification et <br>
                        Organisation
                    </h3>
                    <h4 class="text-lg lg:text-xl text-primary">Gestion automatisé de tourné</h4>
                    <p>
                        Intègre des outils de gestion administrative et financière,
                        notamment le suivi des véhicules, la facturation et la
                        centralisation des informations essentielles.
                    </p>
                    <div>
                        <Button
                            href="/"
                            class="mx-auto inline-flex lg:text-sm sm:text-xs px-10"
                        >
                            En savoir plus
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="-mt-10 relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-20">
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3 class="xl:text-3xl lg:text-3xl md:text-xl lg:w-96 md:w-80 text-primary font-bold">
                        Historique et suivi personnalisé
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
                    <div>
                        <Button
                            href="/"
                            class="mx-auto inline-flex lg:text-sm sm:text-xs px-10"
                        >
                            En savoir plus
                        </Button>
                    </div>
                </div>
                <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <NuxtImg
                        src="/home/A group of young people.png"
                        alt="ensemble des jeunes"
                        class="w-full max-w-2xs lg:max-w-none z-20"
                    />
                </div>
            </div>
        </div>
        <div class="container">
            <div class="-mt-10 relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6">
                <div>
                    <NuxtImg
                        src="/home/male nurse.png"
                        alt="un infirmier"
                        class="w-full"
                    />
                </div>

                <div class="space-y-6">
                    <h3 class="xl:text-3xl lg:text-3xl md:text-xl lg:w-96 md:w-80 text-primary font-bold">
                        Communication et <br>
                        Réseau
                    </h3>
                    <h4 class="text-lg lg:text-xl text-primary">Mise en relation faciliter</h4>
                    <p>
                        Intègre des outils de gestion administrative et financière,
                        notamment le suivi des véhicules, la facturation et la
                        centralisation des informations essentielles.
                    </p>
                    <div>
                        <Button
                            href="/"
                            class="mx-auto inline-flex lg:text-sm sm:text-xs px-10"
                        >
                            En savoir plus
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10">
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3 class="xl:text-3xl lg:text-3xl md:text-xl lg:w-96 md:w-80 text-primary font-bold">
                        Developpement <br>
                        de votre réseau professionnelles
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
                    <div>
                        <Button
                            href="/"
                            class="mx-auto inline-flex lg:text-sm sm:text-xs px-10"
                        >
                            En savoir plus
                        </Button>
                    </div>
                </div>
                <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <NuxtImg
                        src="/home/computer.png"
                        alt="un ordinateur"
                        class="w-full max-w-2xs lg:max-w-none z-20"
                    />
                </div>
            </div>
        </div>
        <div class="container">
            <div class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10">
                <div>
                    <NuxtImg
                        src="/home/nurse_woman.png"
                        alt="une infirmier"
                        class="w-full"
                    />
                </div>

                <div class="space-y-6">
                    <h3 class="xl:text-3xl lg:text-3xl md:text-xl lg:w-96 md:w-80 text-primary font-bold">
                        Gestion administrative <br>
                        et Suivi des formartion <br>
                        (Bientôt disponible)
                    </h3>
                    <h4 class="text-lg lg:text-xl text-primary">Outil de gestion complete</h4>
                    <p>
                        Intègre des outils de gestion administrative et financière,
                        notamment le suivi des véhicules, la facturation et la
                        centralisation des informations essentielles.
                    </p>
                    <div>
                        <Button
                            href="/"
                            class="mx-auto inline-flex lg:text-sm sm:text-xs px-10"
                        >
                            En savoir plus
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10">
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3 class="xl:text-3xl lg:text-3xl md:text-xl lg:w-96 md:w-80 text-primary font-bold">
                        Suivi des formation <br>
                        professionnelles
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
                    <div>
                        <Button
                            href="/"
                            class="mx-auto inline-flex lg:text-sm sm:text-xs px-10"
                        >
                            En savoir plus
                        </Button>
                    </div>
                </div>
                <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <NuxtImg
                        src="/home/A nurse looking for medicine.png"
                        alt="une infirmier cherche medicament"
                        class="w-full max-w-2xs lg:max-w-none z-20"
                    />
                </div>
            </div>
        </div>

        <div class="my-8">
            <LayoutsLogo class="w-72 flex justify-center items-center mx-auto" />
            <h2 class="text-3xl text-center text-primary font-bold my-10">
                Plus de temps pour soigner, Moins de temps à gérer !
            </h2>

            <section class="grid grid-cols-2 gap-44 items-center bg-tertiary/30 p-20">
                <div class="space-y-8">
                    <h3
                        class="text-primary text-3xl"
                    >
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
                        src="/home/A nurse with a woman.png"
                        alt="A nurse with a woman"
                        class="w-full max-w-2xs lg:max-w-none z-20"
                    />
                </div>
            </section>
        </div>

        <div class="container grid grid-cols-1 lg:grid-cols-2 items-center my-10">
            <div class="order-1 lg:order-2 text-center lg:text-right">
                <h3 class="text-primary text-3xl font-semibold text-center lg:text-left">
                    Inscris-toi maintenant pour garantir ton activité
                </h3>
                <Button
                    href="/register"
                    class="w-44 mx-auto lg:mx-0 mt-8 flex justify-center items-center"
                >
                    S'inscrire
                </Button>
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
