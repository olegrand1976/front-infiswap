<script setup lang="ts">
definePageMeta({
    middleware: [
        defineNuxtRouteMiddleware(() => navigateTo('/dashboard', { replace: true })),
    ],
});
</script>

<template>
    <div class="min-h-screen flex items-center justify-center text-slate-600">
        Redirection…
    </div>
</template>
