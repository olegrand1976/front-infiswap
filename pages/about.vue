<template>
    <div class="sm:mt-0 -mt-20">
        <div class="relative font-light">
            <div class="absolute inset-0 bg-tertiary/30 h-[300px] lg:h-full w-full" />
            <div class="container">
                <div
                    class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-8 lg:py-20 mt-20"
                >
                    <div class="lg:hidden text-center mb-8">
                        <h2 class="text-primary text-4xl font-semibold">
                            À propos
                        </h2>
                    </div>
                    <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                        <h3
                            class="text-primary md:text-3xl text-2xl text-center md:text-left"
                        >
                            InfiSwap...
                        </h3>
                        <p>
                            est une plateforme innovante conçue pour optimiser la gestion des
                            infirmiers libéraux. Elle simplifie les remplacements, la
                            planification des tournées et le suivi des formations. Grâce à des
                            outils intelligents et automatisés, InfiSwap améliore la
                            coordination, réduit le temps administratif et facilite
                            l'organisation quotidienne, offrant ainsi une meilleure qualité de
                            soins et un gain de temps précieux.
                        </p>
                        <p>
                            la gestion des tournées est optimisée avec une planification
                            automatisée, prenant en compte les contraintes horaires, les types
                            de soins et la réduction des déplacements inutiles (bientôt disponible).
                        </p>
                        <p>
                            InfiSwap permet également un suivi complet des formations
                            professionnelles, assurant la conformité aux obligations légales
                            avec des rappels et une gestion simplifiée des inscriptions (bientôt disponible).
                            <br>
                            Le suivi des patients est amélioré par un historique détaillé des
                            soins, facilitant la transmission entre soignants.
                        </p>
                        <Button
                            href="/register"
                            class="w-44 mx-auto lg:mx-0 mt-8 flex justify-center items-center font-bold"
                        >
                            S'inscrire
                        </Button>
                    </div>
                    <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <LayoutsAppImage
                            src="/home/woman_infirmier.png"
                            alt="Infirmière avec une vieille femme"
                            class="w-full max-w-2xs lg:max-w-none z-20"
                        />
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

        <!-- <div> -->
        <!-- <HomeServiceContainer /> -->
        <!-- </div> -->

        <div class="container">
            <div
                class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-8 lg:py-20"
            >
                <div>
                    <LayoutsAppImage
                        src="/home/black_infirmier.png"
                        alt="Jeune infirmière noire"
                        class="w-full"
                    />
                </div>

                <div class="space-y-6">
                    <h3 class="text-xl md:text-3xl text-primary text-center md:text-left">
                        Enfin, <strong>la plateforme...</strong>
                    </h3>
                    <p>
                        Accessible sur mobile(bientôt disponible) et ordinateur, InfiSwap apporte un gain de
                        temps significatif, améliore la coordination entre professionnels et
                        contribue à une meilleure qualité de soins. Une solution moderne et
                        indispensable pour un exercice serein et efficace du métier
                        d'infirmier. <br>
                    </p>
                    <div>
                        <h5 class="font-semibold">
                            InfiSwap:
                            <span class="text-primary">
                                Plus de temps pour soigner, moins de temps à gérer
                            </span>
                        </h5>
                        <p>
                            Avec InfiSwap, trouvez et gérez vos remplacements facilement. Plus
                            de visibilité pour les annonces, une recherche optimisée par
                            localisation et une mise en relation rapide entre infirmiers.
                            Gagnez du temps, développez votre réseau et exercez en toute
                            sérénité!
                        </p>
                    </div>
                    <Button
                        href="/register"
                        class="w-44 mx-auto lg:mx-0 mt-8 flex justify-center items-center font-bold"
                    >
                        S'inscrire
                    </Button>
                </div>
            </div>
        </div>

        <div class="container">
            <div
                v-for="(card, index) in cards"
                :key="index"
            >
                <Card
                    class="border border-gray-300 hover:bg-transparent hover:scale-100 cursor-default mb-6 -ml-4 -mr-4"
                >
                    <CardHeader class="p-4 rounded-lg bg-primary text-white">
                        <CardTitle class="text-xs sm:text-lg">
                            {{ card.title }}
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="p-4 text-xl text-black space-y-0">
                        <div class="hidden sm:block sm:space-y-6">
                            <p
                                v-for="(item, key) in card.content"
                                :key="key"
                                class="m-0 p-0 leading-5 text-xs sm:text-sm"
                            >
                                {{ item }}
                            </p>
                        </div>
                        <div class="sm:hidden pl-1">
                            <ul class="list-disc pl-1 space-y-2">
                                <li
                                    v-for="(item, key) in card.content"
                                    :key="key"
                                    class="text-black text-xs sm:text-sm leading-5 list-item marker:text-[#d83b58]"
                                >
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Card from '~/components/ui/card/Card.vue';
import CardContent from '~/components/ui/card/CardContent.vue';
import CardHeader from '~/components/ui/card/CardHeader.vue';
import CardTitle from '~/components/ui/card/CardTitle.vue';

const cards = [
    {
        title: '🔍 Recherche rapide et ciblée',
        content: [
            'Recherchez facilement les offres de remplacement disponibles.',
            'Filtrez les annonces par localisation, date et type de soins.',
            'Recevez des notifications en temps réel dès qu\'une nouvelle opportunité correspond à vos critères.',
        ],
    },
    {
        title: '🤝 Mise en relation instantanée',
        content: [
            'Contactez directement l\'infirmier ou l\'établissement en quelques secondes.',
            'Obtenez toutes les informations nécessaires sur la mission avant de postuler.',
            'Echangez via le messagerie integrée pour finaliser votre engagement en toute simplicité.',
        ],
    },
    {
        title: '📅 Gestion flexible et optimisée',
        content: [
            'Planifiez vos remplacements en fonction de vos disponibilités.',
            'Ajoutez directement les missions acceptées à votre agenda.',
            'Suivez l\'historique de vos remplacements et optimisez votre planning.',
        ],
    },
    {
        title: '🚀 Développez votre activité et votre réseau',
        content: [
            'Multipliez les opportunités de travail sans effort.',
            'Renforcez votre réseau professionnel avec de nouvelles collaborations.',
            'Augmentez votre visibilité auprès des infirmiers et établissements recherchant des remplaçants.',
        ],
    },
];

useHead({
    title: 'A propos',
});

definePageMeta({
    layout: 'guest',
});
</script>
