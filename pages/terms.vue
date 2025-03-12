<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            <p>Conditions</p>
            <p class="mt-2 font-bold">
                Générales d'Utilisation (CGU)
            </p>
        </template>
        <div class="max-w-7xl mx-auto p-6">
            <div class="container grid grid-cols-1 md:grid-cols-3 gap-8 font-light">
                <ol class="space-y-4 list-decimal pl-6 mt-2">
                    <li
                        v-for="(term, index) in terms"
                        :key="index"
                        class="cursor-pointer"
                        @click="scrollToSection(index)"
                    >
                        {{ term.title }}
                    </li>
                </ol>

                <ul class="md:col-span-2 flex flex-col space-y-4">
                    <li
                        v-for="(term, index) in terms"
                        :id="index"
                        :key="index"
                    >
                        <h3 class="text-lg font-semibold text-gray-800">
                            {{ term.title }}
                        </h3>
                        <div
                            class="mt-1 text-gray-600"
                            v-html="term.text"
                        />
                    </li>
                    <a
                        href="http://"
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                </ul>
            </div>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
useHead({
    title: 'Conditions Générales d\'Utilisation',
    meta: [{ name: 'description', content: 'Découvrez les Conditions Générales d\'Utilisation d\'InfiSwap : accès, droits, responsabilités et protection des données.' }],
});

definePageMeta({
    middleware: ['guest'],
    layout: false,
});

const { scrollToSection } = useScroll();

const terms = {
    introduction: {
        title: 'Introduction',
        text: `Les présentes Conditions Générales d’Utilisation (ci-après « CGU ») ont pour objet de définir les modalités d’accès et d’utilisation du site <a class='text-primary font-semibold' href="https://www.infiswap.be" target="_blank" rel="noopener noreferrer">www.infiswap.com</a> (ci-après « le Site »), édité par la société :
                <ul class='mt-1'>
                    <li>LL-IT Software & Computer</li>
                    <li>Rue de la Résistance, 92 / A</li>
                    <li>7131 Waudrez</li>
                    <li>TVA : BE1007132489</li>
                </ul>`,
    },
    acceptance: {
        title: 'Acceptation des CGU',
        text: `L’accès et l’utilisation du Site impliquent l’acceptation sans réserve des présentes CGU par l’utilisateur. Si l’utilisateur n’accepte pas ces conditions, il lui est demandé de ne pas utiliser le Site.`,
    },
    siteObjetAndAccess: {
        title: 'Objet du Site et Accès',
        text: `Le Site propose :
        <ul class='list-disc ml-4 md:ml-6'>
            <li>de mise en relation entre infirmiers,</li>
            <li>encodage de remplacement,</li>
            <li>proposition de remplacement à effectuer,</li>
            <li>encodage de tournée,</li>
            <li>encodage de données patient</li>
            <li>enregistrement de patient à la recherche d'une infirmière pour affectation vers une infirmière de sa région.</li>
        </ul>
    L’accès au Site est gratuit, sauf indication contraire indiquée sur les pages de services spécifiques. L’utilisateur s’engage à utiliser le Site conformément aux présentes CGU et aux lois en vigueur.`,
    },
    registration: {
        title: 'Inscription et Comptes Utilisateurs',
        text: `Pour accéder à certains services ou contenus, l’utilisateur peut être amené à créer un compte. Dans ce cas, il s’engage à fournir des informations exactes et à jour. Il est de la responsabilité de l’utilisateur de maintenir la confidentialité de ses identifiants et de son mot de passe. Toute utilisation frauduleuse de ces identifiants pourra entraîner la suspension ou la suppression du compte.`,
    },
    intellectualProperty: {
        title: 'Propriété Intellectuelle',
        text: `Tous les contenus présents sur le Site (textes, images, logos, graphismes, vidéos, etc.) sont la propriété exclusive de LL-IT Software & Computer ou de ses partenaires et sont protégés par le droit d’auteur. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans l’autorisation écrite préalable de l’éditeur est strictement interdite.`,
    },
    userResponsibilities: {
        title: 'Responsabilités de l’Utilisateur',
        text: `L’utilisateur s’engage à utiliser le Site de manière loyale et conforme aux lois et règlements en vigueur. Il s’engage à ne pas porter atteinte aux droits de tiers, à ne pas diffuser de contenus illicites, diffamatoires ou contraires aux bonnes mœurs, et à ne pas perturber le fonctionnement du Site (par exemple, via l’introduction de virus ou autres logiciels malveillants).`,
    },
    publisherResponsibilities: {
        title: 'Responsabilités de l’Éditeur',
        text: `LL-IT Software & Computer s’efforce d’assurer l’exactitude et la disponibilité des informations diffusées sur le Site. Toutefois, l’éditeur ne saurait être tenu responsable :
                <ul class='list-disc ml-4 md:ml-6'>
                <li>Des interruptions ou dysfonctionnements du Site.</li>
                <li>Des informations erronées ou obsolètes.</li>
                <li>Des dommages directs ou indirects résultant de l’utilisation du Site.</li>
                </ul>
                En outre, le Site peut contenir des liens hypertextes vers des sites tiers. LL-IT Software & Computer n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.`,
    },
    cookies: {
        title: 'Cookies',
        text: `Le Site utilise des cookies pour améliorer l’expérience utilisateur et réaliser des statistiques de fréquentation. L’utilisateur peut, via les paramètres de son navigateur, refuser l’installation de cookies, en étant informé que cela pourrait altérer l’accès à certaines fonctionnalités du Site.`,
    },
    personalData: {
        title: 'Données Personnelles',
        text: `L’utilisation du Site peut impliquer la collecte et le traitement de données personnelles. Pour plus d’informations sur la gestion de ces données, veuillez consulter notre « Politique de Protection des Données Personnelles & Sécurité ». En vous inscrivant sur le Site, vous acceptez les modalités de collecte et d’utilisation de vos données telles qu’y décrites.`,
    },
    modifications: {
        title: 'Modifications des CGU',
        text: `LL-IT Software & Computer se réserve le droit de modifier à tout moment les présentes CGU. Les modifications seront publiées sur le Site et entreront en vigueur dès leur mise en ligne. Il est conseillé à l’utilisateur de consulter régulièrement cette page afin de prendre connaissance des éventuelles mises à jour.`,
    },
    applicableLawAndJurisdiction: {
        title: 'Loi Applicable et Juridiction Compétente',
        text: `Les présentes CGU sont régies par le droit belge. En cas de litige relatif à l’interprétation ou à l’exécution des présentes, les tribunaux compétents seront ceux du ressort de [préciser la localité].`,
    },
    miscellaneous: {
        title: 'Dispositions Diverses',
        text: `Si une ou plusieurs dispositions des présentes CGU devaient être déclarées nulles ou inapplicables, les autres dispositions demeureront en vigueur.
    L’éditeur se réserve le droit de suspendre ou de limiter l’accès à certaines parties du Site, sans préavis, pour des raisons de maintenance ou de sécurité.`,
    },
};
</script>
