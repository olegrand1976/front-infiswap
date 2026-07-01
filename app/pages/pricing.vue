<template>
    <div class="mt-4 lg:mt-10">
        <Pricing />
    </div>
</template>

<script setup lang="ts">
import Pricing from '@/components/Pricing.vue';

const seoDescription = 'Tarifs InfiSwap : compte gratuit (recherche de remplacements, alertes, consultations), accès plateforme 9,90 € paiement unique (publier, postuler, gérer vos annonces), boost visibilité 5 €/semaine en tête de liste.';

useSeoMeta({
    title: 'Tarifs InfiSwap — Gratuit, Accès 9,90 € & Boost remplacement',
    description: seoDescription,
    ogTitle: 'Tarifs InfiSwap — Gratuit, Accès 9,90 € & Boost remplacement',
    ogDescription: seoDescription,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Tarifs InfiSwap',
    twitterDescription: seoDescription,
});

useHead({
    link: [
        { rel: 'canonical', href: '/pricing' },
    ],
});

definePageMeta({
    layout: 'guest',
});
</script>
