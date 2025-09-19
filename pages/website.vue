<template>
    <div class="fixed inset-0 bg-white z-[9999]" />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNuxtApp } from '#app';

definePageMeta({
    layout: false,
});

const route = useRoute();
const { $apifetch } = useNuxtApp();

onMounted(() => {
    const id = route.query.id as string | undefined;

    if (!id) {
        navigateTo('/');
        return;
    }

    $apifetch(`/api/website?id=${id}`)
        .catch((error) => {
            console.error('Erreur lors de l\'incrément du compteur:', error);
        })
        .finally(() => {
            navigateTo('/');
        });
});
</script>

<style scoped>
div {
    pointer-events: none;
}
</style>
