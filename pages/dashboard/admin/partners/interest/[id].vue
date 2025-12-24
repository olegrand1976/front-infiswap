<template>
    <div>
        <DashboardAdminPageHeader title="Liste des infirmiers intéressées" />
        <DashboardAdminPageContent class="bg-gray-100">
            <PartnersInterest :responses="partnership" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { UserPartner } from '~/lib/types';

useHead({ title: 'Liste des infirmiers intéressées' });

definePageMeta({
    layout: 'dashboard',
});

const route = useRoute();
const id = computed(() => route.params.id);

const partnership = ref<UserPartner>(null);

const { demandResponses, fetchResponses } = usePartners();

onMounted(async () => {
    await fetchResponses(Number(id.value));
    partnership.value = demandResponses.value;
});
</script>
