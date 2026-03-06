<template>
    <div>
        <DashboardAdminPageHeader title="Modification institution" />
        <DashboardAdminPageContent class="bg-gray-100">
            <InstitutionsAdminModalForm :institution="institution" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { Institution } from '~/lib/types';

useHead({ title: 'Modification institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const route = useRoute();
const institution = ref<Institution | null>(null);
const { get } = useInstitutions();
const id = computed(() => route.params.id);

await get(Number(id.value)).then((response) => {
    institution.value = response.data;
});
</script>
