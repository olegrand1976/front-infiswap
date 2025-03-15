<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            <p class="font-light">
                Politique de Protection des Données Personnelles
            </p>
            <p class="mt-2 font-bold">
                & sécurité
            </p>
        </template>
        <div class="max-w-7xl mx-auto p-6">
            <div class="container md:mx-8 lg:mx-16 mx-auto font-light mb-4 lg:mb-6">
                La présente politique a pour objectif de vous informer sur la manière dont <a
                    class="text-primary"
                    href="https://ll-it-sc.be/"
                    target="_blank"
                    rel="noopener noreferrer"
                >LL-IT Software & Computer</a> collecte, utilise, protège et conserve vos données personnelles, ainsi que sur les mesures de sécurité mises en place pour garantir leur confidentialité.
            </div>
            <div class="container grid grid-cols-1 md:grid-cols-3 gap-8 font-light">
                <ol class="space-y-4 list-decimal pl-6 mt-2">
                    <li
                        v-for="(privacy, index) in privacyPolicy"
                        :key="index"
                        class="cursor-pointer"
                        @click="scrollToSection(index)"
                    >
                        {{ privacy.title }}
                    </li>
                </ol>

                <ul class="md:col-span-2 flex flex-col space-y-4">
                    <li
                        v-for="(privacy, index) in privacyPolicy"
                        :id="index"
                        :key="index"
                    >
                        <h3 class="text-lg font-semibold text-gray-800">
                            {{ index+ 1 + '. ' }} {{ privacy.title }}
                        </h3>
                        <div
                            class="mt-1 text-gray-600"
                            v-html="privacy.text"
                        />
                    </li>
                </ul>
            </div>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
useHead({
    title: 'Politique & Sécurité',
    meta: [{ name: 'description', content: 'Découvrez notre politique de protection des données personnelles et les mesures de sécurité mises en place par LL-IT Software & Computer. Transparence, confidentialité et conformité RGPD assurées.' }],
});

definePageMeta({
    layout: false,
});

const { scrollToSection } = useScroll();

const privacyPolicy = [
    {
        title: 'Collecte des Données Personnelles',
        text: `<h4 class="font-semibold mt-2">Types de données collectées</h4>
            <ul class="list-disc pl-5 mt-1">
                <li><strong>Informations fournies directement par l’utilisateur :</strong> lors de l’inscription, de la prise de contact via notre formulaire ou de l’utilisation de services spécifiques, des informations telles que votre nom, prénom, adresse e-mail et tout autre renseignement que vous choisissez de communiquer.</li>
                <li><strong>Données de navigation :</strong> informations collectées automatiquement lors de la consultation du Site (adresse IP, type de navigateur, pages visitées, durée de visite, etc.) via l’utilisation de cookies et autres technologies similaires.</li>
            </ul>
            <h4 class="font-semibold mt-2">Finalités de la collecte</h4>
            <ul class="list-disc pl-5 mt-1">
                <li>Assurer la gestion et le suivi des demandes ou inscriptions.</li>
                <li>Optimiser et personnaliser l’expérience utilisateur sur le Site.</li>
                <li>Réaliser des statistiques de fréquentation et améliorer nos services.</li>
                <li>Garantir la sécurité et la protection des données lors des échanges.</li>
            </ul>`,
    },
    {
        title: 'Utilisation et Traitement des Données',
        text: `<h4 class="font-semibold mt-2">Utilisation des données</h4>
            <ul class="list-disc pl-5 mt-1">
                <li>Répondre à vos demandes et assurer la gestion de vos comptes.</li>
                <li>Vous fournir des informations relatives à nos services ou mises à jour du Site, dans le respect de vos préférences.</li>
                <li>Améliorer nos services grâce à des analyses statistiques internes.</li>
            </ul>
            <h4 class="font-semibold mt-2">Partage des données</h4>
            <p>Vos données personnelles ne sont en aucun cas cédées à des tiers sans votre consentement préalable, sauf si cela s’avère nécessaire pour répondre à une obligation légale ou pour assurer la sécurité du Site.</p>`,
    },
    {
        title: 'Sécurité des Données',
        text: `<h4 class="font-semibold mt-2">Mesures techniques et organisationnelles</h4>
            <ul class="list-disc pl-5 mt-1">
                <li><strong>Sécurisation des accès :</strong> systèmes d’authentification et de contrôle d’accès afin de limiter l’accès aux données sensibles aux seules personnes habilitées.</li>
                <li><strong>Chiffrement :</strong> utilisation de protocoles de chiffrement pour la transmission de données sensibles (par exemple, via HTTPS).</li>
                <li><strong>Sauvegardes régulières :</strong> procédures de sauvegarde afin de garantir l’intégrité et la disponibilité des données en cas d’incident.</li>
                <li><strong>Surveillance et audits :</strong> suivi régulier de nos systèmes et audits de sécurité afin d’identifier et corriger les vulnérabilités potentielles.</li>
            </ul>`,
    },
    {
        title: 'Cookies et Technologies Similaires',
        text: `Le Site utilise des cookies pour :
            <ul class="list-disc pl-5 mt-1">
                <li>Améliorer votre expérience de navigation.</li>
                <li>Analyser le comportement des utilisateurs et adapter les contenus proposés.</li>
            </ul>
            <p>Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur.</p>`,
    },
    {
        title: 'Vos Droits',
        text: `Conformément à la législation en vigueur, vous disposez des droits suivants concernant vos données personnelles :
            <ul class="list-disc pl-5 mt-1">
                <li><strong>Accès :</strong> obtenir confirmation de l’existence d’un traitement de données vous concernant et accéder aux informations collectées.</li>
                <li><strong>Rectification :</strong> demander la correction ou la mise à jour de vos données inexactes ou incomplètes.</li>
                <li><strong>Suppression :</strong> solliciter l’effacement de vos données personnelles, dans les limites prévues par la loi.</li>
                <li><strong>Limitation du traitement :</strong> demander la limitation du traitement de vos données dans certaines situations.</li>
                <li><strong>Opposition :</strong> vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière.</li>
                <li><strong>Portabilité :</strong> obtenir vos données dans un format structuré et couramment utilisé, afin de les transférer à un autre responsable de traitement.</li>
            </ul>
            <p>Pour exercer ces droits, vous pouvez nous contacter par e-mail à l’adresse suivante : 
                <a href="mailto:info@infiswap.be" class='text-primary font-semibold'>info@infiswap.be</a>.</p>`,
    },
    {
        title: 'Conservation des Données',
        text: `Les données personnelles collectées sont conservées pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, dans le respect des obligations légales et réglementaires.`,
    },
    {
        title: 'Modifications de la Politique',
        text: `<a class="text-primary" href="https://www.ll-it-sc.be" target="_blank" rel="noopener noreferrer">LL-IT Software & Computer</a> se réserve le droit de modifier la présente politique afin de tenir compte notamment des évolutions législatives ou des pratiques de l’industrie. Toute modification sera publiée sur le Site avec une mise à jour de la date de dernière révision.`,
    },
];
</script>
