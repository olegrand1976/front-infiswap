<template>
    <!-- <NuxtLayout name="home">
        <template #title>
            <LayoutsLogo class="w-96 flex justify-center items-center mx-auto" />
        </template>

        <div class="mt-48">
            <LayoutsGridCard />
        </div>

        <div class="my-16 z-20 relative grid grid-cols-2 gap-44 items-center bg-tertiary/30 p-20">
            <div class="space-y-6">
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
                    src="/home/nurse_with_old_woman2.png"
                    alt="Infirmière avec une vieille femme"
                    class="w-full z-20"
                />
            </div>

            <div class="absolute bottom-0 right-0">
                <NuxtImg
                    src="/Vector_2.png"
                    class="w-[32rem] -z-10 relative"
                />
            </div>

            <div class="absolute bottom-[20%] left-2">
                <NuxtImg
                    src="/icons/Unin.png"
                    class="w-12 -z-10 relative"
                />
            </div>
        </div>

        <div>
            <HomeServiceContainer />
        </div>

        <div>
            <HomeSubscribeBanner />
        </div>

        <div class="my-36 container grid grid-cols-2 items-center gap-20">
            <div>
                <NuxtImg
                    src="/home/black_nurse.png"
                    alt="Jeune infirmière noire"
                    class="w-full"
                />
            </div>

            <div class="space-y-6">
                <h3 class="text-3xl text-primary">
                    Enfin,
                    <strong>la plateforme...</strong>
                </h3>
                <p>
                    Intègre des outils de gestion administrative et financière,
                    notamment le suivi des véhicules, la facturation et la
                    centralisation des informations essentielles.
                </p>
                <p>
                    Accessible sur mobile et ordinateur, Infiswap apporte un gain de
                    temps significatif, améliore la coordination entre professionnels et
                    contribue à une meilleure qualité de soins. Une solution moderne et
                    indispensable pour un exercice serein et efficace du métier d'infirmier. <br>
                    Infiswap est une plateforme dédiée aux infirmiers libéraux, facilitant les
                    remplacements, la gestion des tournées et le suivi des formations. Elle
                    optimise la planification, réduit le temps administratif et améliore la
                    coordination, offrant ainsi plus d'efficacité, de flexibilité et une
                    meilleure qualité de soins.
                </p>
                <p>
                    Avec infiswap, trouvez et gérez vos remplacements facilement. Plus de visibilité
                    pour les annonces, une recherche optimisée par localisation et une mise en relation
                    rapide entre infirmiers. Gagnez du temps, développez votre réseau et exercez en toute
                    sérénité!
                </p>
                <Button
                    href="/register"
                >
                    S'inscrire
                </Button>
            </div>
        </div>

        <div class="container">
            <div
                v-for="(card, index) in cards"
                :key="index"
            >
                <Card class="border border-gray-300 hover:bg-transparent hover:scale-100 cursor-default mb-6">
                    <CardHeader class="p-4 rounded-lg bg-primary text-white">
                        <CardTitle>
                            {{ card.title }}
                        </CardTitle>
                    </CardHeader>

                    <CardContent class="p-4 text-sm text-black">
                        <span v-html="formatContent(card.content)" />
                    </CardContent>
                </Card>
            </div>
        </div>
    </NuxtLayout> -->
    <ErrorUnderConstruction />
</template>

<script lang="ts" setup>
const cards = [
    {
        title: 'Recherche rapide et ciblée',
        content: 'Accédez en quelques clics aux offres de remplacement disponibles. Filtrez les annonces par localisation, date et type de soins. Recevez des notifications en temps réel dès qu\'une nouvelle opportunité correspond à vos critères.',
    },
    {
        title: 'Mise en relation instantanée',
        content: 'Contactez directement l\'infirmier ou l\'établissement en quelques secondes. Obtenez toutes les informations nécessaires sur la mission avant de postuler. Echangez via le messagerie integrée pour finaliser votre engagement en toute simplicité.',
    },
    {
        title: 'Gestion flexible et optimisée',
        content: 'Planifiez vos remplacements en fonction de vos disponibilités. Ajoutez directement les missions acceptées à votre agenda. Suivez l\'historique de vos remplacements et optimisez votre planning',
    },
    {
        title: 'Développez votre activité et votre réseau',
        content: 'Multipliez les opportunités de travail sans effort. Renforcez votre réseau professionnel avec de nouvelles collaborations. Augmentez votre visibilité auprès des infirmiers et établissements recherchant des remplaçants.',
    },
];

const formatContent = (content) => {
    return content.replace(/\.\s*/g, '.<br>');
};

useHead({
    title: 'A propos',
});

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});
</script>
