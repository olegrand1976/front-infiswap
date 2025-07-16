<template>
    <div>
        <NursassurBanner id="banner" />
        <NursassurOverview id="overview" />
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
