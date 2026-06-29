<template>
    <OffreInstitutionPage :contact="contact" />
</template>

<script setup lang="ts">
import OffreInstitutionPage from '~/components/offre-institution/OffreInstitutionPage.vue';
import { getOffreInstitutionContact } from '~/lib/offreInstitutionContacts';

definePageMeta({
    layout: false,
});

const route = useRoute();
const id = route.params.id as string;
const contact = getOffreInstitutionContact(id);

if (!contact) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
    });
}

const pageTitle = contact.contactName
    ? `Offre Institutions — ${contact.contactName}`
    : 'Offre Institutions & Maisons de Repos';

useHead({
    title: pageTitle,
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
