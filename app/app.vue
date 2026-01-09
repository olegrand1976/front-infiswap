<template>
    <NuxtLoadingIndicator />
    <NuxtLayout class="overflow-x-hidden">
        <NuxtPage />
    </NuxtLayout>
    <Toaster />
</template>

<script setup lang="ts">
useHead({
    title: 'InfiSwap',
});
</script>
