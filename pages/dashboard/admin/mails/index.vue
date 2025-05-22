<template>
    <div class="w-full">
        <MailComposer />
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Mail' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
