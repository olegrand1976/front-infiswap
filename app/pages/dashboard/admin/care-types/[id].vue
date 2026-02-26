<template>
    <div>
        <DashboardAdminPageHeader :title="`Modification`" />
        <DashboardAdminPageContent class="bg-gray-100">
            <CareTypesAdminModalForm :care="care" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { CareType } from '~/lib/types';

useHead({ title: 'Modification type de soin' });

const route = useRoute();
const care = ref<CareType>(null);
const { get } = useCareTypes();
const id = computed(() => route.params.id);

await get(Number(id.value)).then((response) => {
    care.value = response.data;
});

definePageMeta({
    layout: 'dashboard',
});
</script>
