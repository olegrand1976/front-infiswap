<template>
    <NuxtLayout name="guest">
        <div class="relative font-light">
            <div
                class="hidden lg:block absolute inset-x-0 bg-tertiary/30 md:h-[300px] lg:h-full w-full z-10"
            />
            <div class="lg:container">
                <div
                    class="relative md:my-8 lg:my-16 md:z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center py-8 lg:py-20 md:mt-20"
                >
                    <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                        <h3
                            class="text-primary text-4xl lg:text-5xl xl:text-7xl font-semibold text-center lg:text-left"
                        >
                            Nos <span class="font-bold">services</span>
                        </h3>

                        <p
                            class="text-center lg:text-left text-base px-8"
                        >
                            Chez InfiSwap, nous mettons à votre disposition une plateforme
                            complète et intuitive conçue pour faciliter la vie des infirmiers
                            libéraux.<br class="hidden lg:block">
                            Notre objectif est de simplifier la gestion des remplacements,<br
                                class="hidden lg:block"
                            >
                            la planification des tournées et l’organisation quotidienne,<br
                                class="hidden lg:block"
                            >
                            afin que vous puissiez vous concentrer sur l’essentiel:<br
                                class="hidden lg:block"
                            >
                            soignez vos patients. Découvrez nos services clés :
                        </p>
                    </div>

                    <div
                        class="hidden order-1 lg:order-2 lg:flex justify-center lg:justify-end"
                    >
                        <div class="flex justify-between items-center gap-4">
                            <div class="order-2 flex flex-col justify-center items-center">
                                <LayoutsAppImage
                                    src="/home/Dressing.png"
                                    alt="pansement"
                                    class="w-full z-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute bottom-0 right-0 hidden lg:block z-0">
                <LayoutsAppImage
                    src="Vector_2.png"
                    class="w-64 lg:w-[32rem] relative"
                />
            </div>
            <div class="absolute bottom-[20%] left-2 hidden lg:block z-0">
                <LayoutsAppImage
                    src="/icons/Unin.png"
                    class="w-8 lg:w-12 relative"
                />
            </div>
        </div>

        <div class="container">
            <NurstechPresentation />
        </div>

        <div class="container">
            <div
                class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6"
            >
                <div class="relative">
                    <LayoutsAppImage
                        src="/home/equipe_infirmier.png"
                        alt="equipe infirmier"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            Recherche et gestion de remplacement
                        </h3>
                    </div>
                </div>

                <div class="space-y-6">
                    <h3
                        class="hidden lg:block xl:text-4xl md:text-3xl lg:text-xl text-primary font-bold"
                    >
                        Recherche et gestion <br>
                        de remplacement
                    </h3>
                    <h4 class="hidden lg:flex text-lg lg:text-xl text-primary">
                        Accès rapide aux offres
                    </h4>
                    <p class="hidden lg:flex text-base">
                        Recherchez facilement les offres de remplacement disponibles grâce à
                        notre moteur de recherche intelligent.
                        <br>
                        Filtrez les annonces par localisation, date, type de soins et autres
                        critères spécifiques à vos besoins.
                    </p>
                </div>
            </div>
        </div>

        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3
                        class="lg:flex hidden xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        Notification en temps réel
                    </h3>
                    <p class="hidden lg:flex text-base">
                        Recevez des alertes instantanées dès qu’une nouvelle opportunité
                        correspond à vos critères. Ne manquez jamais une mission qui
                        pourrait optimiser votre planning et valoriser votre expertise.
                    </p>
                </div>
                <div
                    class="relative z-10 order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                    <LayoutsAppImage
                        src="/home/cart.png"
                        alt="cart"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            Notification en temps réel
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div
                class="-mt-10 relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6"
            >
                <div class="relative">
                    <LayoutsAppImage
                        src="/home/nurse_with_elderly_man.png"
                        alt="un infirmier with vielle homme"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            Planification et <br>
                            organisation
                        </h3>
                    </div>
                </div>

                <div class="space-y-6">
                    <h3
                        class="hidden lg:block xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        Planification et <br>
                        organisation
                    </h3>
                    <h4 class="hidden lg:flex text-lg lg:text-xl text-primary">
                        Gestion automatisé de tourné
                    </h4>
                    <p class="hidden lg:flex text-base">
                        Planifiez vos remplacements en fonction de vos disponibilités grâce
                        à une interface claire et intuitive.
                        <br>
                        Ajoutez directement les missions acceptées à votre agenda pour une
                        organisation sans faille.
                    </p>
                </div>
            </div>
        </div>
        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3
                        class="hidden lg:flex xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        Historique et suivi personnalisé
                    </h3>
                    <p class="hidden lg:block text-base">
                        Suivez l’historique de vos missions et analysez vos performances
                        pour optimiser votre activité. Bénéficiez d’un retour détaillé sur
                        vos interventions, pour toujours améliorer votre gestion de temps et
                        vos compétences.
                    </p>
                </div>
                <div
                    class="relative order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                    <LayoutsAppImage
                        src="/home/A group of young people.png"
                        alt="ensemble des jeunes"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            Historique et suivi personnalisé
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div
                class="-mt-10 relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6"
            >
                <div class="relative">
                    <LayoutsAppImage
                        src="/home/male nurse.png"
                        alt="un infirmier"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            Communication et <br>
                            réseau
                        </h3>
                    </div>
                </div>

                <div class="space-y-6">
                    <h3
                        class="hidden lg:flex xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        Communication et <br>
                        réseau
                    </h3>
                    <h4 class="hidden lg:flex text-lg lg:text-xl text-primary">
                        Mise en relation facilitée
                    </h4>
                    <p class="hidden lg:flex text-base">
                        Contactez directement l’infirmier ou l’établissement en quelques
                        clics pour finaliser rapidement vos engagements.
                        <br>
                        Échangez via la messagerie intégrée pour une communication sécurisée
                        et fluide.
                    </p>
                </div>
            </div>
        </div>
        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3
                        class="hidden lg:flex xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        Développement de votre réseau professionnel
                    </h3>
                    <p class="hidden lg:flex text-base">
                        Renforcez vos liens avec d’autres professionnels de la santé et
                        élargissez votre réseau grâce à de nouvelles collaborations.
                        Augmentez votre visibilité auprès des établissements et des
                        infirmiers à la recherche de remplaçants.
                    </p>
                </div>
                <div
                    class="relative order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                    <LayoutsAppImage
                        src="/home/computer.png"
                        alt="un ordinateur"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            Développement de votre réseau professionnel
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div class="relative">
                    <LayoutsAppImage
                        src="/home/nurse_woman.png"
                        alt="une infirmier"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            Gestion administrative
                            <br>
                            et suivi des formations
                            <br>
                            (bientôt disponible)
                        </h3>
                    </div>
                </div>

                <div class="space-y-6">
                    <h3
                        class="hidden lg:flex xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        Gestion administrative
                        <br>
                        et suivi des formations
                        <br>
                        (bientôt disponible)
                    </h3>
                    <h4 class="hidden lg:flex text-lg lg:text-xl text-primary">
                        Outil de gestion complet
                    </h4>
                    <p class="hidden lg:flex text-base">
                        Gérez vos remplacements et votre planning de manière centralisée,
                        tout en réduisant le temps administratif. Accédez à des outils de
                        suivi administratif et financier pour une vision claire de votre
                        activité.
                    </p>
                </div>
            </div>
        </div>
        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3
                        class="lg:block hidden xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        Suivi des formations
                    </h3>
                    <p class="hidden lg:flex text-base">
                        Assurez-vous de rester en conformité avec les obligations légales
                        grâce à un suivi détaillé de vos formations.
                        <br>
                        Recevez des rappels et gérez vos inscriptions pour maintenir vos
                        compétences à jour et valoriser votre expertise.
                    </p>
                </div>
                <div
                    class="relative order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                    <LayoutsAppImage
                        src="/home/A nurse looking for medicine.png"
                        alt="une infirmier cherche medicament"
                        class="w-full"
                    />
                    <div
                        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            Suivi des formation
                            <br>
                            professionnelles
                        </h3>
                    </div>
                </div>
            </div>
        </div>

        <div class="container lg:my-8 py-8">
            <LayoutsLogo class="w-72 flex justify-center items-center mx-auto" />
            <h2 class="text-3xl text-center text-primary font-bold lg:my-10">
                Plus de temps pour soigner, moins de temps à gérer !
            </h2>
        </div>
        <div class="relative font-light">
            <div class="absolute inset-0 bg-tertiary/30 h-full w-full" />

            <div class="container relative z-10 px-4 lg:px-8">
                <div
                    class="relative my-8 lg:my-16 z-20 flex flex-col lg:flex-row gap-8 lg:gap-44 items-center py-8 lg:py-20 mt-20"
                >
                    <div class="lg:space-y-6 space-y-8 order-1 relative z-30 flex-1">
                        <h3
                            class="lg:text-4xl text-3xl text-primary font-bold text-center lg:text-left"
                        >
                            Avec InfiSwap,
                        </h3>
                        <p class="text-center lg:text-start text-base">
                            Multipliez vos opportunités professionnelles en toute simplicité.
                            Notre solution moderne et sécurisée vous offre plus de temps pour
                            soigner, moins de temps à gérer et une expérience utilisateur
                            pensée pour répondre aux exigences d'un secteur en constante
                            évolution. Découvrez dès aujourd'hui comment nous pouvons
                            transformer votre quotidien professionnel!
                        </p>
                    </div>
                    <div class="order-2 flex justify-center lg:justify-end flex-1">
                        <LayoutsAppImage
                            src="/home/A nurse with a woman.png"
                            alt="A nurse with a woman"
                            class="w-full h-auto lg:h-full lg:w-full object-cover z-20"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div
            class="container grid grid-cols-1 lg:grid-cols-[60%_40%] gap-16 md:gap-8 items-center py-8 lg:py-24"
        >
            <div
                class="order-1 lg:order-2 text-center lg:text-right space-y-8 lg:space-y-32"
            >
                <h3
                    class="text-primary text-3xl font-semibold text-center lg:text-left max-w-xs sm:max-w-lg mx-auto lg:mx-0"
                >
                    Inscris-toi dès maintenant
                    <br>
                    pour développer ton activité!
                </h3>

                <div
                    class="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0"
                >
                    <Button
                        href="/register"
                        class="w-44 mx-auto lg:mx-0 flex justify-center items-center font-bold"
                    >
                        S'inscrire
                    </Button>
                    <Button
                        variant="outline"
                        class="w-44 mx-auto inline-flex rounded-3xl"
                        href="/login"
                    >
                        Se connecter
                    </Button>
                </div>
            </div>
            <div class="order-2 lg:order-1 flex justify-center lg:justify-start">
                <LayoutsAppImage
                    src="/home/nurse_with_stetho.png"
                    alt="Infirmière avec un stéthoscope"
                    class="h-full max-h-80 w-full object-cover rounded-3xl"
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
