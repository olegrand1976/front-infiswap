<template>
    <div>
        <DashboardAdminPageHeader title="Mise à jour de la demande" />
        <DashboardAdminPageContent class="bg-gray-100">
            <PartnersAdminForm :partnership="partnership" />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import type { UserPartner } from '~/lib/types';

useHead({ title: 'Mise à jour demande' });

definePageMeta({
    layout: 'dashboard',
});

const route = useRoute();
const partnership = ref<UserPartner>(null);
const { detailDemandPartner, demandPartner } = usePartners();
const id = computed(() => route.params.id);

await detailDemandPartner(Number(id.value), true);
partnership.value = demandPartner.value;
</script>
