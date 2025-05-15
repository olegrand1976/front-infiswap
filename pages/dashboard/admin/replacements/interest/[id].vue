<template>
    <div>
        <DashboardAdminPageHeader title="Liste des infirmiers intéressées" />
        <DashboardAdminPageContent class="bg-gray-100">
            <ReplacementsNurseInterest />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ReplacementsNurseInterest } from '#components';

// import type { Replacement } from '~/lib/types';

useHead({ title: 'Liste des infirmiers intéressées' });

definePageMeta({
    layout: 'dashboard',
});

// const route = useRoute();
// const replacement = ref<Replacement>(null);
// const { fetchListResponse } = useReplacements();
// const id = computed(() => route.params.id);

// await fetchListResponse(Number(id.value)).then((response) => {
//     replacement.value = response.replacement;
// });
</script>
