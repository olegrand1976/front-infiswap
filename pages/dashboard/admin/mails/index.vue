<template>
    <div class="w-full">
        <MailComposer />
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Gestion des mails' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
