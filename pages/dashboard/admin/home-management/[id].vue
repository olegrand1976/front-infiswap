<template>
    <div>
        <DashboardAdminPageHeader :title="`Modification de : ${home?.title || ''}`" />
        <DashboardAdminPageContent class="bg-gray-100">
            <HomeAdminModalForm :home="home" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { HomeType } from '~/lib/types';

useHead({ title: 'Modification texte d\'Accueil' });

const route = useRoute();
const home = ref<HomeType>(null);
const { get } = useHome();
const id = computed(() => route.params.id);

await get(Number(id.value)).then((response) => {
    home.value = response;
});

definePageMeta({
    layout: 'dashboard',
});
</script>
