<template>
    <div>
        <DashboardAdminPageHeader title="Mettre à jour la mission" />
        <DashboardAdminPageContent class="bg-gray-50">
            <MissionsAdminForm :mission="mission" />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import type { Mission } from '~/lib/types';

useHead({ title: 'Mettre à jour la mission' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

const route = useRoute();
const mission = ref<Mission>(null);
const id = computed(() => route.params.id);

const { getById } = useMissions();
await getById(Number(id.value)).then((response) => {
    mission.value = response.data;
});
</script>
