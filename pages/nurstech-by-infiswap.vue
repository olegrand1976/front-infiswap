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
    title: 'NursTech - by infiswap',
});

definePageMeta({
    layout: 'nurse',
});
</script>
