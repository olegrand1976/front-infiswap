<template>
    <div>
        <NursassurBanner id="banner" />
        <NursassurOverview id="overview" />
        <NursassurTargetAudience id="target" />
        <NursassurQuoteForm id="quote" />
    </div>
</template>

<script setup lang="ts">
useHead({
    title: 'NursAssur - by infiswap',
});

definePageMeta({
    layout: 'nurse',
});
</script>
