<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Contacts" />

        <DashboardAdminPageContent>
            <Tabs v-model="selectedType">
                <TabsList class="w-full">
                    <TabsTrigger value="nurstech" class="w-full md:w-48">Nurstech</TabsTrigger>
                    <TabsTrigger value="nursassur" class="w-full md:w-48">Nursassur</TabsTrigger>
                    <TabsTrigger value="infiswap" class="w-full md:w-48">Infiswap</TabsTrigger>
                </TabsList>
            </Tabs>

            <DataTable
                v-if="!loading"
                :data="contacts"
                :columns="columns"
                :pagination="pagination"
                @page-change="fetchContacts"
            />
            <p v-else>Chargement...</p>
            <p v-if="error" class="text-red-500">
                Erreur: {{ getErrorMessage(error) }}
            </p>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Gestion des contacts' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const selectedType = ref('nurstech');
const { contacts, loading, error, pagination, fetchContacts } = useContact(selectedType);

const columns = [
    {
        id: 'name',
        accessorKey: 'name',
        header: 'Nom',
    },
    {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
    },
    {
        id: 'phone',
        accessorKey: 'phone',
        header: 'Téléphone',
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: 'Date',
    },
];

function getErrorMessage(err) {
    if (!err) return '';
    if (typeof err === 'string') return err;
    if (err.message) return err.message;
    try {
        return JSON.stringify(err);
    } catch {
        return 'Une erreur est survenue';
    }
}
</script>
