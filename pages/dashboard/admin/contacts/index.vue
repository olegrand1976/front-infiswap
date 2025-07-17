<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Contacts" />

        <DashboardAdminPageContent>
            <Tabs v-model="selectedType">
                <TabsList class="w-full">
                    <TabsTrigger
                        value="nurstech"
                        class="w-full md:w-48"
                    >
                        Nurstech
                    </TabsTrigger>
                    <TabsTrigger
                        value="nursassur"
                        class="w-full md:w-48"
                    >
                        Nursassur
                    </TabsTrigger>
                    <TabsTrigger
                        value="infiswap"
                        class="w-full md:w-48"
                    >
                        Infiswap
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <!-- <DataTable
                :data="contacts"
                :columns="columns"
                :pagination="pagination"
                @page-change="fetchContacts"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="count"
                    @update:page="refresh"
                    @update:per-page="handlePerPageChange"
                />
            </div> -->
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { PERPAGE } from '~/lib/constants';

useHead({ title: 'Gestion des contacts' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const perPage = ref(PERPAGE);
const page = ref(1);
const initialFilter = {
    name: null,
};
const option = ref({ ...initialFilter });

const { getContacts } = useContact();
const selectedType = ref('nurstech');

await getContacts(selectedType, page.value, perPage.value, option.value);

// const handlePerPageChange = async (value: number) => {
//     perPage.value = value;
//     await useContact(selectedType, page.value, value, option.value);
// };

// const refresh = async (page: number) => {
//     await useContact(selectedType, page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
// };

// const sort = reactive({
//     order: 'DESC',
//     by: null,
// });

// const toggleSort = () => {
//     sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
// };

// const setSort = (columnKey: string) => {
//     if (sort.by === columnKey) {
//         toggleSort();
//     }
//     else {
//         sort.by = columnKey;
//         sort.order = 'DESC';
//     }
// };

// watch(
//     () => sort,
//     async (newVal) => {
//         await useContact(page.value, perPage.value, {
//             sortOrder: newVal.order,
//             sortKey: newVal.by });
//     },
//     { deep: true },
// );

// const columns = [
//     {
//         id: 'name',
//         accessorKey: 'name',
//         header: 'Nom',
//     },
//     {
//         id: 'email',
//         accessorKey: 'email',
//         header: 'Email',
//     },
//     {
//         id: 'phone',
//         accessorKey: 'phone',
//         header: 'Téléphone',
//     },
//     {
//         id: 'description',
//         accessorKey: 'description',
//         header: 'Description',
//     },
//     {
//         id: 'created_at',
//         accessorKey: 'created_at',
//         header: 'Date',
//     },
// ];
</script>
