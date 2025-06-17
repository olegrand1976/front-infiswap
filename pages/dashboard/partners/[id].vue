<template>
    <div>
        .
    </div>
</template>

<script lang="ts" setup>
import { usePartners } from '@/composables/usePartners';

const { detailDemandPartner } = usePartners();

const route = useRoute();
const id = route.params.id;

onMounted(async () => {
    await detailDemandPartner(id);
});

useHead({
    title: 'Chercher un partenaire',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>

<style>
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
