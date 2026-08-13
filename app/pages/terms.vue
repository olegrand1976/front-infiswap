<!-- eslint-disable vue/no-v-html -->
<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            <p>{{ locale === 'nl' ? $t('legal.termsTitle') : 'Conditions' }}</p>
            <p
                v-if="locale !== 'nl'"
                class="mt-2 font-bold"
            >
                Générales d'Utilisation (CGU)
            </p>
        </template>
        <div class="max-w-7xl mx-auto p-6">
            <p
                v-if="locale === 'nl'"
                class="container md:mx-8 lg:mx-16 mx-auto mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-4"
            >
                {{ $t('legal.termsBody') }}
            </p>
            <div class="container md:mx-8 lg:mx-16 mx-auto font-light mb-4 text-sm text-gray-500">
                Dernière mise à jour : 24 juillet 2026.
            </div>
            <div class="container grid grid-cols-1 md:grid-cols-3 gap-8 font-light">
                <ol class="space-y-4 list-decimal pl-6 mt-2">
                    <li
                        v-for="(term, index) in terms"
                        :key="index"
                        class="cursor-pointer"
                        @click="scrollToSection(String(index))"
                    >
                        {{ term.title }}
                    </li>
                </ol>

                <ul class="md:col-span-2 flex flex-col space-y-4">
                    <li
                        v-for="(term, index) in terms"
                        :id="String(index)"
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
                </ul>
            </div>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
const { locale, t } = useI18n();

useHead({
    title: () => t('legal.termsTitle'),
    meta: [{
        name: 'description',
        content: () => t('legal.termsBody'),
    }],
});

definePageMeta({
    layout: false,
});

const { scrollToSection } = useScroll();

const terms = {
    introduction: {
        title: 'Introduction',
        text: `Les présentes Conditions Générales d’Utilisation (ci-après « CGU ») définissent les modalités d’accès et d’utilisation du site <a class='text-primary font-semibold' href="https://www.infiswap.be" target="_blank" rel="noopener noreferrer">www.infiswap.be</a> et des services associés (ci-après « le Site » / « InfiSwap »), édités par :
                <ul class='mt-1'>
                    <li>LL-IT Software &amp; Computer</li>
                    <li>Rue de la Résistance, 92 / A</li>
                    <li>7131 Waudrez</li>
                    <li>TVA : BE1007132489</li>
                </ul>`,
    },
    acceptance: {
        title: 'Acceptation des CGU',
        text: `L’accès et l’utilisation du Site impliquent l’acceptation des présentes CGU. Lors de l’inscription, l’utilisateur accepte également la Politique de protection des données et la Charte de bonne conduite. À défaut, il lui est demandé de ne pas utiliser le Site.`,
    },
    siteObjetAndAccess: {
        title: 'Objet du Site et Accès',
        text: `Le Site propose notamment :
        <ul class='list-disc ml-4 md:ml-6'>
            <li>la mise en relation entre professionnels de santé ;</li>
            <li>l’encodage et la proposition de remplacements ;</li>
            <li>l’aide à la gestion de tournées et, le cas échéant, d’informations patients nécessaires à un remplacement ;</li>
            <li>des services destinés aux institutions (SaaS).</li>
        </ul>
        <p class="mt-2">Les données patients constituent des données sensibles : l’utilisateur s’engage à ne les encoder que dans le cadre strictement nécessaire au service et conformément à la déontologie et à la Politique de confidentialité.</p>
        <p class="mt-2">L’accès au Site est gratuit, sauf services payants indiqués sur les pages concernées.</p>`,
    },
    registration: {
        title: 'Inscription et Comptes Utilisateurs',
        text: `L’utilisateur s’engage à fournir des informations exactes et à jour, à protéger ses identifiants, et à ne pas permettre d’accès non autorisé. Toute utilisation frauduleuse peut entraîner la suspension ou la suppression du compte.`,
    },
    intellectualProperty: {
        title: 'Propriété Intellectuelle',
        text: `Tous les contenus du Site sont la propriété de LL-IT Software &amp; Computer ou de ses partenaires et sont protégés. Toute reproduction ou exploitation non autorisée est interdite.`,
    },
    userResponsibilities: {
        title: 'Responsabilités de l’Utilisateur',
        text: `L’utilisateur s’engage à une utilisation loyale, légale et respectueuse des tiers, sans contenus illicites ni atteinte au fonctionnement du Site. Il reste responsable des données qu’il encode (y compris données patients) et des autorisations nécessaires.`,
    },
    dataNoSale: {
        title: 'Données personnelles — partage consenti',
        text: `L’utilisation du Site implique un traitement de données personnelles décrit dans la Politique de protection des données. <strong>Les données de santé des patients ne sont ni vendues ni louées.</strong> Les coordonnées professionnelles peuvent être transmises à des partenaires commerciaux (NursTech, NursAssur, etc.) <strong>uniquement avec votre consentement distinct</strong> lors d’une demande de mise en relation, y compris dans le cadre d’une monétisation de leads. Les sous-traitants techniques et les mises en relation nécessaires au service (remplacements) ne constituent pas une revente de données.`,
    },
    companyTransfer: {
        title: 'Cession de l’entreprise ou du service',
        text: `En cas de fusion, cession, apport ou transfert du fonds de commerce / actifs InfiSwap, le successeur peut reprendre le traitement des données pour les <strong>mêmes finalités</strong> de service, sans vente séparée de la base de données complète. Les transmissions ponctuelles de leads aux partenaires sous consentement distinct (formulaires de mise en relation) restent régies par la Politique de protection des données. Les utilisateurs seront informés dans un délai raisonnable (objectif : 30 jours après closing, sous réserve des contraintes de confidentialité transactionnelle).`,
    },
    publisherResponsibilities: {
        title: 'Responsabilités de l’Éditeur',
        text: `LL-IT s’efforce d’assurer la disponibilité du Site mais ne saurait être tenu responsable des interruptions, informations erronées, ou dommages indirects. Les liens vers des sites tiers relèvent de la responsabilité de leurs éditeurs.`,
    },
    cookies: {
        title: 'Cookies',
        text: `Les cookies non essentiels (mesure d’audience, publicité) sont soumis au consentement via le bandeau prévu à cet effet. Voir la Politique de protection des données.`,
    },
    personalData: {
        title: 'Données Personnelles',
        text: `Pour le détail des traitements, droits et contacts (y compris APD Belgique), consultez la « Politique de Protection des Données Personnelles &amp; Sécurité ».`,
    },
    proSubscription: {
        title: 'Abonnement Infiswap Premium',
        text: `<p>L’usage du réseau InfiSwap (recherche, publication, candidature, messagerie) demeure gratuit. L’abonnement « Infiswap Premium » est facultatif et ouvre trois avantages : alerte instantanée à la publication d’un remplacement, un boost de mise en avant de 7 jours offert par mois calendaire, et les contrats de remplacement inclus en nombre illimité.</p>
        <p class="mt-2"><strong>Formules et durées.</strong> Les tarifs sont exprimés toutes taxes comprises. La formule commercialisée en self-serve est l’abonnement annuel (10 mois facturés au tarif mensuel de référence en vigueur, soit 2 mois offerts). Les formules de 2 ans (18 mois facturés) et de 3 ans (24 mois facturés) sont réservées au canal de vente téléphonique et proposées nominativement. Une ancienne formule mensuelle peut subsister pour les abonnements déjà souscrits ; elle n’est plus proposée à la souscription.</p>
        <p class="mt-2"><strong>Boost offert.</strong> Le crédit de boost est attribué une fois par mois calendaire. <strong>Un crédit non consommé au cours du mois est perdu et n’est pas reporté</strong> sur les mois suivants, ni cumulable, ni convertible en remise ou en remboursement.</p>
        <p class="mt-2"><strong>Reconduction et indexation.</strong> L’abonnement se reconduit automatiquement à l’échéance pour une durée identique. Le client conserve son avantage tarifaire relatif : le montant de reconduction est recalculé en appliquant le nombre de mois facturés propre à sa formule au tarif mensuel de référence en vigueur à la date d’échéance. Si le tarif mensuel de référence n’a pas évolué depuis la souscription, une indexation minimale est appliquée sur la base de <strong>l’indice santé publié par le SPF Économie (Belgique)</strong> pour les clients établis en Belgique, et de <strong>l’indice INSEE des prix à la consommation — services (identifiant 001763852)</strong> pour les clients établis en France. Le nouveau montant est notifié au client au moins <strong>60 jours avant la date de reconduction</strong>, avec faculté de résilier sans frais avant l’échéance.</p>
        <p class="mt-2"><strong>Résiliation.</strong> L’abonnement est résiliable à tout moment depuis l’espace de gestion ; la résiliation prend effet au terme de la période déjà payée, sans remboursement au prorata. Les avantages restent acquis jusqu’à cette échéance.</p>
        <p class="mt-2"><strong>Droit de rétractation contractuel.</strong> Pour les seules formules de 2 et 3 ans souscrites à la suite d’un entretien téléphonique, InfiSwap accorde contractuellement un délai de rétractation de <strong>14 jours calendaires</strong> à compter de l’encaissement, exercé par simple demande écrite à info@infiswap.be et donnant lieu au remboursement intégral. Ce délai contractuel est accordé volontairement et est indépendant de tout délai légal, dont l’existence n’est pas reconnue pour les contrats conclus entre professionnels.</p>
        <p class="mt-2"><strong>Paiement.</strong> Tous les encaissements sont opérés exclusivement via Stripe. Aucune donnée bancaire n’est collectée par téléphone et aucun paiement ne peut être remis directement à un partenaire commercial.</p>`,
    },
    modifications: {
        title: 'Modifications des CGU',
        text: `LL-IT peut modifier les présentes CGU. La version publiée sur le Site fait foi. Il est conseillé de consulter régulièrement cette page.`,
    },
    applicableLawAndJurisdiction: {
        title: 'Loi Applicable et Juridiction Compétente',
        text: `Les présentes CGU sont régies par le <strong>droit belge</strong>. En cas de litige, les tribunaux de l’arrondissement judiciaire de <strong>Charleroi (Belgique)</strong> sont compétents, sous réserve de dispositions légales impératives contraires.`,
    },
    miscellaneous: {
        title: 'Dispositions Diverses',
        text: `Si une disposition est déclarée nulle, les autres demeurent en vigueur. L’éditeur peut suspendre ou limiter l’accès pour maintenance ou sécurité.`,
    },
};
</script>
