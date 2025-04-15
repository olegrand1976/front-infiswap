<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { $apifetch } = useNuxtApp();

onMounted(async () => {
    const nurse = route.query.nurse;
    const replacement = route.query.replacement;

    try {
        await $apifetch(`/api/replacements/interest/${replacement}/${nurse}`, {
            method: 'GET',
        });

        navigateTo('/');
    }
    catch (err) {
        console.error('Erreur:', err);
        navigateTo('/');
    }
});
</script>

<template>
    <div>Traitement en cours...</div>
</template>
