<!-- eslint-disable vue/no-v-html -->
<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            Mentions Légales
        </template>
        <div class="max-w-7xl mx-auto p-6">
            <p
                v-if="locale === 'nl'"
                class="container md:mx-8 lg:mx-16 mx-auto mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-4"
            >
                {{ $t('legal.noticeBody') }}
            </p>
            <div class="container md:mx-8 lg:mx-16 mx-auto font-light mb-4 text-sm text-gray-500">
                Dernière mise à jour : 24 juillet 2026.
            </div>
            <div class="container grid grid-cols-1 md:grid-cols-3 gap-8 font-light">
                <ol class="space-y-4 list-decimal pl-6 mt-2">
                    <li
                        v-for="(item, index) in legalNotices"
                        :key="index"
                        class="cursor-pointer"
                        @click="scrollToSection(String(index))"
                    >
                        {{ item.title }}
                    </li>
                </ol>

                <ul class="md:col-span-2 flex flex-col space-y-4">
                    <li
                        v-for="(item, index) in legalNotices"
                        :id="String(index)"
                        :key="index"
                    >
                        <h3 class="text-lg font-semibold text-gray-800">
                            {{ item.title }}
                        </h3>
                        <div
                            class="mt-1 text-gray-600"
                            v-html="item.text"
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
    title: () => t('legal.noticeTitle'),
    meta: [{
        name: 'description',
        content: () => t('legal.noticeBody'),
    }],
});

definePageMeta({
    layout: false,
});

const { scrollToSection } = useScroll();

const legalNotices = {
    siteEditor: {
        title: 'Éditeur du Site',
        text: `Le présent site, accessible à l’adresse <a class='text-primary font-semibold' href="https://www.infiswap.be" target="_blank" rel="noopener noreferrer">www.infiswap.be</a>, est édité par :
                <ul class='mt-1'>
                    <li><a class="text-primary" href="https://ll-it-sc.be/" target="_blank" rel="noopener noreferrer">LL-IT Software &amp; Computer</a></li>
                    <li>Rue de la Résistance, 92 / A</li>
                    <li>7131 Waudrez</li>
                    <li>TVA : BE1007132489</li>
                </ul>`,
    },
    publicationDirector: {
        title: 'Directeur de Publication',
        text: `Pour toute question concernant le contenu du site :
                <a href="mailto:info@infiswap.be" class='text-primary font-semibold'>info@infiswap.be</a>.`,
    },
    hosting: {
        title: 'Hébergement',
        text: `Le Site et l’API sont hébergés sur l’infrastructure <strong>Google Cloud Platform (GCP)</strong> (Cloud Run / services associés), opérée sous la responsabilité de LL-IT Software &amp; Computer.
                <ul class='mt-1'>
                    <li>Google Cloud EMEA Limited (et affiliés Google Cloud)</li>
                    <li>Coordonnées : voir documentation Google Cloud — région(s) de déploiement configurées pour InfiSwap</li>
                </ul>`,
    },
    intellectualProperty: {
        title: 'Propriété Intellectuelle',
        text: `L’ensemble des contenus présents sur ce Site est protégé par le droit d’auteur et constitue la propriété exclusive de
                    <a class="text-primary" href="https://ll-it-sc.be/" target="_blank" rel="noopener noreferrer">LL-IT Software &amp; Computer</a>
                    ou de ses partenaires. Toute reproduction non autorisée est interdite.`,
    },
    liability: {
        title: 'Responsabilité',
        text: `<a class="text-primary" href="https://ll-it-sc.be/" target="_blank" rel="noopener noreferrer">LL-IT Software &amp; Computer</a>
                    s’efforce de fournir des informations exactes. L’utilisateur utilise le Site sous sa responsabilité. LL-IT ne pourra être tenu responsable des dommages directs ou indirects résultant de l’accès ou de l’utilisation du Site.`,
    },
    hyperlinks: {
        title: 'Liens Hypertextes',
        text: `Le Site peut contenir des liens vers d’autres sites. LL-IT n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leur politique de confidentialité.`,
    },
    personalData: {
        title: 'Données Personnelles',
        text: `Les traitements de données personnelles sont décrits dans la
                <a href="/privacy-security" class="text-primary font-semibold">Politique de protection des données</a>,
                conformément au <strong>RGPD</strong> et au droit belge. Contact :
                <a href="mailto:info@infiswap.be" class='text-primary font-semibold'>info@infiswap.be</a>.
                Réclamation possible auprès de l’Autorité de protection des données (Belgique) :
                <a href="https://www.autoriteprotectiondonnees.be" class="text-primary" target="_blank" rel="noopener noreferrer">autoriteprotectiondonnees.be</a>.
                <p class="mt-2"><strong>InfiSwap ne revend pas</strong> les données personnelles à des tiers à des fins commerciales indépendantes du service.</p>`,
    },
    cookies: {
        title: 'Cookies',
        text: `Les cookies non essentiels sont soumis au consentement via le bandeau prévu sur le Site. Voir la politique de confidentialité.`,
    },
    applicableLaw: {
        title: 'Loi Applicable et Juridiction Compétente',
        text: `Les présentes mentions légales sont régies par le droit belge. En cas de litige, les tribunaux de Charleroi (Belgique) sont compétents.`,
    },
};
</script>
