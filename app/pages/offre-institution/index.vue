<template>
    <OffreInstitutionPage :contact="DEFAULT_OFFRE_INSTITUTION_CONTACT" />
</template>

<script setup lang="ts">
import OffreInstitutionPage from '~/components/offre-institution/OffreInstitutionPage.vue';
import { DEFAULT_OFFRE_INSTITUTION_CONTACT } from '~/lib/offreInstitutionContacts';

definePageMeta({
    layout: false,
});

useHead({
    title: 'Offre Institutions & Maisons de Repos',
    link: [
        {
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        },
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
        },
    ],
    meta: [
        {
            name: 'description',
            content: 'Offre institutionnelle InfiSwap et Jaumana Soins : remplacements infirmiers, comparateur intérim, formules DIY et Premium.',
        },
    ],
});
</script>
