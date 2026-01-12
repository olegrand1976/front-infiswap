<template>
    <div class="mb-4">
        test
    </div>
</template>

<script lang="ts" setup>
useHead({ title: 'Tableau de bord' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});
</script>
