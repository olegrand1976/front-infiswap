<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            Mentions Légales
        </template>
        <div class="max-w-7xl mx-auto p-6">
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
                        :id="index"
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
    layout: false,
});

const { scrollToSection } = useScroll();

const legalNotices = {
    siteEditor: {
        title: 'Éditeur du Site',
        text: `Le présent site, accessible à l’adresse <a class='text-primary font-semibold' href="https://www.infiswap.be" target="_blank" rel="noopener noreferrer">www.infiswap.be</a>, est édité par la société :
                <ul class='mt-1'>
                    <li><a
                        class="text-primary"
                        href="https://ll-it-sc.be/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >LL-IT Software & Computer</a></li>
                    <li>Rue de la Résistance, 92 / A</li>
                    <li>7131 Waudrez</li>
                    <li>TVA : BE1007132489</li>
                </ul>`,
    },
    publicationDirector: {
        title: 'Directeur de Publication',
        text: `Pour toute question concernant le contenu du site, merci de contacter le directeur de la publication à l’adresse suivante :
                <a href="mailto:info@infiswap.be" class='text-primary font-semibold'>info@infiswap.be</a>.`,
    },
    hosting: {
        title: 'Hébergement',
        text: `Le site est hébergé par :
                <ul class='mt-1'>
                    <li><strong>OVH France</strong></li>
                    <li>2 rue Kellermann, 59100 Roubaix, France</li>
                    <li>Téléphone : +33 9 72 10 10 07</li>
                </ul>`,
    },
    intellectualProperty: {
        title: 'Propriété Intellectuelle',
        text: `L’ensemble des contenus (textes, images, graphismes, logos, icônes, sons, vidéos, etc.) présents sur ce Site est protégé par le droit d’auteur et constitue la propriété exclusive de <a
                        class="text-primary"
                        href="https://ll-it-sc.be/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >LL-IT Software & Computer</a> ou de ses partenaires. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du Site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de LL-IT Software & Computer.`,
    },
    liability: {
        title: 'Responsabilité',
        text: `<a
                        class="text-primary"
                        href="https://ll-it-sc.be/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >LL-IT Software & Computer</a> s’efforce de fournir sur le Site des informations précises et à jour. Cependant, il ne saurait garantir l’exactitude, la complétude ou l’actualité des informations diffusées. En conséquence, l’utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive. En aucun cas, LL-IT Software & Computer ne pourra être tenu responsable des dommages directs ou indirects résultant de l’accès ou de l’utilisation du Site.`,
    },
    hyperlinks: {
        title: 'Liens Hypertextes',
        text: `Le Site peut contenir des liens vers d’autres sites présents sur le réseau Internet. LL-IT Software & Computer n’exerce aucun contrôle sur ces sites et ne saurait, en aucun cas, être responsable de leur contenu ou de leur politique de confidentialité.`,
    },
    personalData: {
        title: 'Données Personnelles',
        text: `Les informations recueillies sur ce Site (via formulaires de contact ou inscriptions) sont destinées exclusivement à LL-IT Software & Computer. Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée, l’utilisateur dispose d’un droit d’accès, de modification, de rectification et de suppression des données le concernant. Pour exercer ce droit, l’utilisateur est invité à contacter l’éditeur par mail à l’adresse :
                <a href="mailto:info@infiswap.be" class='text-primary font-semibold'>info@infiswap.be</a>.`,
    },
    cookies: {
        title: 'Cookies',
        text: `Le Site peut utiliser des cookies afin d’améliorer l’expérience utilisateur. L’utilisateur peut configurer son navigateur pour refuser l’installation de cookies, sachant que cette modification pourrait altérer l’accès à certaines fonctionnalités du Site.`,
    },
    applicableLaw: {
        title: 'Loi Applicable et Juridiction Compétente',
        text: `Les présentes mentions légales sont régies par le droit belge. En cas de litige relatif à l’interprétation ou à l’exécution des présentes, les tribunaux compétents seront ceux de Charleroi (Belgique).`,
    },
};
</script>
