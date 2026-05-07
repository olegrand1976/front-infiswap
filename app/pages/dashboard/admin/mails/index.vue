<template>
    <div class="w-full">
        <DashboardAdminPageContent>
            <MailComposer />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Gestion des mails' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
