<template>
    <div>
        <DashboardAdminPageHeader title="Modifier le service" />
        <DashboardAdminPageContent class="bg-gray-50">
            <ServicesAdminForm :service="service" />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const { getById } = useInstitutionServices();

useHead({ title: 'Modifier le service' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

const service = ref(null);

await getById(Number(route.params.id)).then((response) => {
    service.value = response.data;
});
</script>
