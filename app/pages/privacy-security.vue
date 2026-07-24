<!-- eslint-disable vue/no-v-html -->
<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            <p class="font-light">
                Politique de Protection des Données Personnelles
            </p>
            <p class="mt-2 font-bold">
                &amp; sécurité
            </p>
        </template>
        <div class="max-w-7xl mx-auto p-6">
            <div class="container md:mx-8 lg:mx-16 mx-auto font-light mb-4 lg:mb-6 space-y-2">
                <p>
                    La présente politique informe sur la manière dont
                    <a
                        class="text-primary"
                        href="https://ll-it-sc.be/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >LL-IT Software &amp; Computer</a>
                    (ci-après «&nbsp;nous&nbsp;», «&nbsp;InfiSwap&nbsp;») collecte, utilise, protège et conserve vos données personnelles
                    dans le cadre du service InfiSwap, conformément au RGPD et à la législation belge applicable.
                </p>
                <p class="text-sm text-gray-500">
                    Dernière mise à jour : 24 juillet 2026.
                </p>
            </div>
            <div class="container grid grid-cols-1 md:grid-cols-3 gap-8 font-light">
                <ol class="space-y-4 list-decimal pl-6 mt-2">
                    <li
                        v-for="(privacy, index) in privacyPolicy"
                        :key="index"
                        class="cursor-pointer"
                        @click="scrollToSection(String(index))"
                    >
                        {{ privacy.title }}
                    </li>
                </ol>

                <ul class="md:col-span-2 flex flex-col space-y-4">
                    <li
                        v-for="(privacy, index) in privacyPolicy"
                        :id="String(index)"
                        :key="index"
                    >
                        <h3 class="text-lg font-semibold text-gray-800">
                            {{ index + 1 + '. ' }} {{ privacy.title }}
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
    meta: [{
        name: 'description',
        content: 'Politique de protection des données personnelles InfiSwap (RGPD) : finalités, non-vente des données, sous-traitants, droits et sécurité.',
    }],
});

definePageMeta({
    layout: false,
});

const { scrollToSection } = useScroll();

const privacyPolicy = [
    {
        title: 'Responsable du traitement',
        text: `<ul class="list-disc pl-5 mt-1 space-y-1">
            <li><strong>LL-IT Software &amp; Computer</strong></li>
            <li>Rue de la Résistance, 92 / A — 7131 Waudrez (Belgique)</li>
            <li>TVA : BE1007132489</li>
            <li>Contact privacy : <a href="mailto:info@infiswap.be" class="text-primary font-semibold">info@infiswap.be</a></li>
        </ul>
        <p class="mt-2">Pour les données traitées pour le compte d’une institution cliente (SaaS), LL-IT agit en qualité de <strong>sous-traitant</strong> (Art. 28 RGPD) ; l’institution est responsable de traitement.</p>`,
    },
    {
        title: 'Données collectées et finalités',
        text: `<h4 class="font-semibold mt-2">Professionnels et comptes</h4>
            <ul class="list-disc pl-5 mt-1">
                <li>Identité, coordonnées, numéro professionnel (ex. INAMI), profil, préférences, rôles.</li>
                <li>Finalités : inscription, authentification, mise en relation, support, facturation, sécurité.</li>
                <li>Base légale principale : <strong>exécution du contrat</strong> (Art. 6(1)(b) RGPD) ; intérêt légitime pour la sécurité et le CRM interne (Art. 6(1)(f)).</li>
            </ul>
            <h4 class="font-semibold mt-2">Données de patients (catégorie particulière — Art. 9)</h4>
            <ul class="list-disc pl-5 mt-1">
                <li>Lorsque le professionnel encode des informations de tournée / patients (identité, soins, code Katz, documents, horaires), ces données constituent des <strong>données de santé</strong> au sens de l’Art. 9 RGPD.</li>
                <li>Le professionnel demeure responsable du respect du secret professionnel et de la licéité de l’encodage à l’égard de ses patients. LL-IT traite ces données uniquement pour permettre le remplacement et la continuité des soins sur InfiSwap.</li>
                <li>Base légale : <strong>Art. 9(2)(h) RGPD</strong> (médecine préventive / diagnostics / soins de santé par un professionnel soumis au secret) combinée à l’exécution du service (Art. 6(1)(b)), sans revente ni usage marketing.</li>
                <li>Partage limité au remplaçant confirmé ou aux personnes habilitées dans le cadre du service.</li>
            </ul>
            <h4 class="font-semibold mt-2">Navigation et cookies</h4>
            <ul class="list-disc pl-5 mt-1">
                <li>Cookies strictement nécessaires au fonctionnement du Site.</li>
                <li>Mesure d’audience (ex. Google Analytics / GTM) et publicité (ex. Meta Pixel) : uniquement après <strong>consentement</strong> via le bandeau cookies.</li>
            </ul>`,
    },
    {
        title: 'Interdiction de revente des données',
        text: `<p>Nous <strong>ne vendons pas, ne louons pas et n’échangeons pas</strong> vos données personnelles ni les données de santé des patients à des tiers à des fins commerciales indépendantes du service InfiSwap.</p>
            <p class="mt-2">Le CRM et les analyses internes restent des traitements internes. Les emails présentant des services partenaires (ex. NursTech, NursAssur) sont envoyés par InfiSwap ; <strong>aucun fichier clients n’est transmis</strong> à ces partenaires sans votre demande explicite de mise en relation.</p>`,
    },
    {
        title: 'Sous-traitants et destinataires',
        text: `<p>Nous pouvons recourir à des sous-traitants pour héberger et opérer le service :</p>
            <ul class="list-disc pl-5 mt-1">
                <li><strong>Google Cloud Platform (GCP)</strong> — hébergement applicatif et données (UE / mécanismes de transfert adaptés).</li>
                <li><strong>Stripe</strong> — paiement et facturation.</li>
                <li><strong>Prestataire d’emailing / SMTP</strong> — envoi transactionnel et, le cas échéant, marketing opt-in.</li>
                <li><strong>Google / Meta</strong> — analytics et publicité <em>uniquement</em> si vous avez consenti aux cookies correspondants.</li>
            </ul>
            <p class="mt-2">Des données peuvent être communiquées à un autre professionnel dans le strict cadre d’un remplacement accepté, ou aux autorités si la loi l’exige.</p>`,
    },
    {
        title: 'Cession de la société ou du service',
        text: `<p>En cas de fusion, acquisition, apport ou cession de LL-IT Software &amp; Computer / du fonds de commerce ou des actifs InfiSwap, les données personnelles peuvent être <strong>transférées au successeur</strong> exclusivement pour poursuivre les <strong>mêmes finalités</strong> de service. Ce transfert s’inscrit dans la continuité du traitement ; il <strong>n’autorise pas</strong> une vente, licence ou monétisation séparée de la base utilisateurs ou des données de santé.</p>
            <p class="mt-2">Les utilisateurs concernés seront informés par email et/ou notice sur le Site <strong>dans un délai raisonnable et au plus tard sous 30 jours</strong> après le closing (ou dès que la loi l’autorise si une confidentialité transactionnelle s’applique). En cas de changement de finalité par le successeur, une nouvelle base légale et une information / un consentement adaptés seront requis.</p>`,
    },
    {
        title: 'Sécurité',
        text: `<ul class="list-disc pl-5 mt-1">
                <li>Contrôle d’accès et authentification.</li>
                <li>Chiffrement des flux (HTTPS / TLS).</li>
                <li>Sauvegardes et journalisation de sécurité.</li>
                <li>Mesures organisationnelles limitées au personnel habilité.</li>
            </ul>`,
    },
    {
        title: 'Cookies',
        text: `<p>Vous gérez vos préférences via le <strong>bandeau de consentement</strong> affiché sur le Site (acceptation, refus ou personnalisation des cookies analytics / marketing). Les cookies nécessaires au fonctionnement ne requièrent pas de consentement.</p>`,
    },
    {
        title: 'Vos droits',
        text: `<ul class="list-disc pl-5 mt-1">
                <li><strong>Accès</strong> et <strong>portabilité</strong> (export disponible depuis les paramètres du compte).</li>
                <li><strong>Rectification</strong>, <strong>limitation</strong>, <strong>opposition</strong>.</li>
                <li><strong>Effacement</strong> (suppression de compte avec anonymisation, sous réserve des obligations légales de conservation).</li>
                <li><strong>Retrait du consentement</strong> (cookies, emails marketing) sans affecter la licéité du traitement antérieur.</li>
            </ul>
            <p class="mt-2">Contact privacy / référent protection des données : <a href="mailto:info@infiswap.be" class="text-primary font-semibold">info@infiswap.be</a>.
            LL-IT n’a pas désigné de DPO au sens de l’Art. 37 RGPD dès lors que les critères de nomination obligatoire ne sont pas réunis ; cette analyse est revue périodiquement (notamment au regard du volume de données de santé).
            Vous pouvez également introduire une réclamation auprès de l’<strong>Autorité de protection des données (APD)</strong> — Belgique :
            <a href="https://www.autoriteprotectiondonnees.be" class="text-primary" target="_blank" rel="noopener noreferrer">autoriteprotectiondonnees.be</a>.</p>`,
    },
    {
        title: 'Conservation',
        text: `<ul class="list-disc pl-5 mt-1">
                <li>Compte : durée d’utilisation ; à la suppression, anonymisation des identifiants et révocation des accès.</li>
                <li>Données patients : tant que nécessaires au service du professionnel, puis purge / anonymisation.</li>
                <li>Facturation / paiements : conservation conformément aux obligations comptables et fiscales belges (en pratique jusqu’à <strong>7 ans</strong> pour les pièces justificatives).</li>
                <li>Logs techniques : durée limitée (sécurité / diagnostic), en principe 90 jours sauf incident.</li>
            </ul>`,
    },
    {
        title: 'Modifications',
        text: `<p>Nous pouvons mettre à jour la présente politique. La version en vigueur est publiée sur cette page avec sa date de révision. Les modifications substantielles pourront être signalées par email ou notice sur le Site.</p>`,
    },
];
</script>
