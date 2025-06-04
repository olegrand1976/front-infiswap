<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Suivi utilisateurs - CRM" />

        <DashboardAdminPageContent>
            <div class="p-4 flex gap-3 items-center">
                <InputIcon
                    rounded="md"
                    placeholder="Code postal"
                    class="max-w-sm"
                    type="number"
                />
                <InputIcon
                    rounded="md"
                    placeholder="Ville"
                    class="max-w-sm"
                />
                <InputIcon
                    rounded="md"
                    placeholder="Biotrax"
                    class="max-w-sm"
                />
                <InputIcon
                    rounded="md"
                    placeholder="Assurances"
                    class="max-w-sm"
                />
                <InputIcon
                    rounded="md"
                    placeholder="Sites"
                    class="max-w-sm"
                />
                <Button
                    class="rounded-md"
                >
                    <ArrowPathIcon class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>
            <!-- <DataTable
                :data="dataUsers"
                :columns="columns"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="users.total"
                    @update:page="refreshUsers"
                    @update:per-page="handlePerPageChange"
                />
            </div> -->
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { ArrowsUpDownIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import { formatInamiNumber, formatPhoneNumber } from '~/lib/utils';
import type { User } from '~/lib/types';
import { InputIcon } from '~/components/ui/input-with-icon';
import { PERPAGE } from '~/lib/constants';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';

useHead({ title: 'Suivi utilisateurs' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { users, getUsers } = useAuth();

const perPage = ref(PERPAGE);
const page = ref(1);
const initialFilter = {
    name: null,
    zip: null,
};
const option = ref({ ...initialFilter });

await getUsers(page.value, perPage.value, option.value);

const dataUsers = computed(() => users.value?.data ?? []);
console.log('comment çaaa => ', dataUsers);

// const refreshUsers = async (page: number) => {
//     await getUsers(page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
// };

// const handlePerPageChange = async (value: number) => {
//     perPage.value = value;
//     await getUsers(page.value, value, option.value);
// };

// const columns: ColumnDef<User>[] = [
//     {
//         id: 'select',
//         header: ({ table }) => h(Checkbox, {
//             'checked': table.getIsAllPageRowsSelected()
//                 ? true
//                 : table.getIsSomePageRowsSelected()
//                     ? 'indeterminate'
//                     : false,
//             'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
//             'ariaLabel': 'Select all',
//             'class': 'mx-2',
//         }),
//         cell: ({ row }) => h(Checkbox, {
//             'checked': row.getIsSelected(),
//             'onUpdate:checked': value => row.toggleSelected(!!value),
//             'ariaLabel': 'Select row',
//             'class': 'mx-2',
//         }),
//         enableSorting: false,
//         enableHiding: false,
//     },
//     {
//         accessorKey: 'full_name',
//         header: () => {
//             return h(Button, {
//                 variant: 'ghost',
//                 onClick: () => setSort('firstname'),
//             }, () => ['Nom', h(ArrowsUpDownIcon, { class: '' })]);
//         },
//         cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('full_name')),
//     },
//     {
//         accessorKey: 'identifier_number',
//         header: () => {
//             return h(Button, {
//                 variant: 'ghost',
//                 onClick: () => setSort('identifier_number'),
//             }, () => ['INAMI', h(ArrowsUpDownIcon, { class: '' })]);
//         },
//         cell: ({ row }) => h('div', { class: 'lowercase text-center' }, formatInamiNumber(row.getValue('identifier_number'))),
//     },
//     {
//         accessorKey: 'phone_number',
//         header: () => {
//             return h(Button, {
//                 variant: 'ghost',
//                 onClick: () => setSort('phone_number'),
//             }, () => ['Téléphone', h(ArrowsUpDownIcon, { class: '' })]);
//         },
//         cell: ({ row }) => {
//             return h('div', { class: 'text-center' }, formatPhoneNumber(row.getValue('phone_number')));
//         },
//     },
//     {
//         accessorKey: 'street_address',
//         header: () => {
//             return h(Button, {
//                 variant: 'ghost',
//                 onClick: () => setSort('street_address'),
//             }, () => ['Rue', h(ArrowsUpDownIcon, { class: '' })]);
//         },
//         cell: ({ row }) => {
//             return h('div', { class: 'text-center' }, row.getValue('street_address'));
//         },
//     },
//     {
//         accessorKey: 'city',
//         header: () => {
//             return h(Button, {
//                 variant: 'ghost',
//                 onClick: () => setSort('city'),
//             }, () => ['Ville', h(ArrowsUpDownIcon, { class: '' })]);
//         },
//         cell: ({ row }) => {
//             return h('div', { class: 'text-center' }, row.getValue('city'));
//         },
//     },
//     {
//         accessorKey: 'zip_code',
//         header: () => {
//             return h(Button, {
//                 variant: 'ghost',
//                 onClick: () => setSort('zip_code'),
//             }, () => ['C.P', h(ArrowsUpDownIcon, { class: '' })]);
//         },
//         cell: ({ row }) => {
//             return h('div', { class: 'text-center' }, row.getValue('zip_code'));
//         },
//     },
//     {
//         accessorKey: 'settings',
//         header: ({ column }) => {
//             return h(Button, {
//                 variant: 'ghost',
//                 onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
//             }, () => ['Préférences', h(ArrowsUpDownIcon, { class: '' })]);
//         },
//         cell: ({ row }) => {
//             try {
//                 const settings = JSON.parse(row.getValue('settings'));
//                 // Récupère tous les codes postaux et les joint avec une virgule
//                 const zipCodes = settings?.replacement?.zip_codes?.join(', ') || 'Aucun code postal';
//                 return h('div', { class: 'text-center capitalize truncate whitespace-nowrap overflow-hidden' }, zipCodes);
//             }
//             catch (e) {
//                 return h('div', { class: 'text-center' }, 'Erreur de format');
//             }
//         },
//     },
//     {
//         accessorKey: 'created_at',
//         header: () => {
//             return h(Button, {
//                 variant: 'ghost',
//                 onClick: () => setSort('created_at'),
//             }, () => ['Création', h(ArrowsUpDownIcon, { class: '' })]);
//         },
//         cell: ({ row }) => {
//             return h('div', { class: 'text-center' }, formatRelativeDate(row.getValue('created_at')));
//         },
//     },
// ];

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
//         await getUsers(page.value, perPage.value, {
//             sortOrder: newVal.order,
//             sortKey: newVal.by });
//     },
//     { deep: true },
// );
</script>
