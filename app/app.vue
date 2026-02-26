<template>
    <NuxtLoadingIndicator />
    <NuxtLayout class="overflow-x-hidden">
        <NuxtPage />
    </NuxtLayout>
    <Toaster />
</template>

<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue';

useHead({
    title: 'InfiSwap',
});
</script>
