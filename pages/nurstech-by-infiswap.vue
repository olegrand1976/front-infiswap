<template>
    <div>
        <NurseBanner />
        <NurseValuation />
        <NurseWebsiteCreation />
        <NurseProcess />
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
