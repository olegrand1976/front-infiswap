<template>
    <div>
        <NurstechBanner id="banner" />
        <NurstechValuation id="valuation" />
        <NurstechWebsiteCreation id="website-creation" />
        <NurstechTarget id="target" />
        <NurstechProcess id="process" />
        <NurstechSpecialOffer id="special-offer" />
        <NurstechInformationForm id="information-form" />
        <NurstechCommunity id="community" />
        <!-- <NurstechPartners id="partners" /> -->
    </div>
</template>

<script setup lang="ts">
useHead({
    title: 'NursTech',
    meta: [
        {
            name: 'description',
            content:
                'NursTech - InfiSwap : solutions digitales pour infirmiers indépendants. Création de sites web, outils numériques, valorisation de votre activité et accompagnement marketing pour booster votre visibilité professionnelle.',
        },
    ],
});

definePageMeta({
    layout: 'nurse',
});
</script>
