<template>
    <div>
        <DashboardAdminPageHeader title="Liste des infirmiers intéressées" />
        <DashboardAdminPageContent class="bg-gray-100">
            <ReplacementsNurseInterest :responses="listResponse" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ReplacementsNurseInterest } from '#components';

import type { Replacement } from '~/lib/types';

useHead({ title: 'Liste des infirmiers intéressées' });

definePageMeta({
    layout: 'dashboard',
});

const route = useRoute();
const id = computed(() => route.params.id);

const replacement = ref<Replacement>(null);
const { listResponse, fetchListResponse } = useListResponse(id.value);

onMounted(async () => {
    await fetchListResponse();
    replacement.value = listResponse.value?.[0]?.replacement ?? null;
});
</script>
