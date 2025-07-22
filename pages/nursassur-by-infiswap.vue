<template>
    <div>
        <NursassurBanner id="banner" />
        <NursassurOverview id="overview" />
        <NursassurTargetAudience id="target" />
        <NursassurInterestedContent
            id="interested"
            v-model:selected-items="selectedItems"
            :items="items"
        />
        <NursassurQuoteForm
            id="quote"
            v-model:selected-items="selectedItems"
        />
    </div>
</template>

<script setup lang="ts">
const selectedItems = ref([]);

const items = [
    'Responsabilité civile professionnelle',
    'Protection juridique professionnelle',
    'Assurance véhicule professionnel',
    'Assurance prévoyance (arrêt maladie, invalidité...)',
    'Assurance hospitalisation adaptée',
    'Crédit (personnel, société, hypothécaire) -> solution sur mesure',
    'Autre (à préciser dans le formulaire)',
];

useHead({
    title: 'NursAssur - by infiswap',
});

definePageMeta({
    layout: 'nurse',
});
</script>
