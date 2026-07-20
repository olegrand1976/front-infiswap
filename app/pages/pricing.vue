<template>
    <div class="mt-4 lg:mt-10">
        <Pricing />
    </div>
</template>

<script setup lang="ts">
import Pricing from '@/components/Pricing.vue';

const seoDescription = 'Tarifs InfiSwap : compte gratuit (recherche, alertes, publication et candidatures aux remplacements), boost visibilité dès 2 € (3 jours) ou 4,40 € (7 jours) en tête de liste.';

useSeoMeta({
    title: 'Tarifs InfiSwap — Gratuit & Boost remplacement',
    description: seoDescription,
    ogTitle: 'Tarifs InfiSwap — Gratuit & Boost remplacement',
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
