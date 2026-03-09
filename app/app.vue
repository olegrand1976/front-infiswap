<template>
    <NuxtLoadingIndicator />
    <NuxtLayout class="overflow-x-hidden">
        <NuxtPage />
    </NuxtLayout>
    <Toaster position="top-center"/>
</template>

<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'

useHead({
    title: 'InfiSwap',
});
</script>
