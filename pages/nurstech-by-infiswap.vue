<template>
    <div>
        <NurseBanner />
        <NurseValuation />
        <NurseWebsiteCreation />
        <NurseProcess />
        <NurseSpecialOffer />
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
