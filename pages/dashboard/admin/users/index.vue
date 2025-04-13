<template>
    <div class="w-full">
        <div class="p-6 mb-10 flex justify-between text-gray-700 shadow-md rounded-md bg-white">
            <h1 class="font-bold text-xl">
                Des utilisateurs
            </h1>
            <Button class="rounded-md">
                <span><PlusCircleIcon /></span> Ajouter un utilisateur
            </Button>
        </div>

        <div class="rounded-md border">
            <Table>
                <TableHeader class="h-14">
                    <TableRow
                        v-for="headerGroup in table.getHeaderGroups()"
                        :key="headerGroup.id"
                    >
                        <TableHead
                            v-for="header in headerGroup.headers"
                            :key="header.id"
                        >
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody class="bg-white">
                    <template v-if="table.getRowModel().rows?.length">
                        <template
                            v-for="row in table.getRowModel().rows"
                            :key="row.id"
                        >
                            <TableRow :data-state="row.getIsSelected() && 'selected'">
                                <TableCell
                                    v-for="cell in row.getVisibleCells()"
                                    :key="cell.id"
                                >
                                    <FlexRender
                                        :render="cell.column.columnDef.cell"
                                        :props="cell.getContext()"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="row.getIsExpanded()">
                                <TableCell :colspan="row.getAllCells().length">
                                    {{ JSON.stringify(row.original) }}
                                </TableCell>
                            </TableRow>
                        </template>
                    </template>

                    <TableRow v-else>
                        <TableCell
                            :colspan="columns.length"
                            class="h-24 text-center"
                        >
                            Aucune donnée à afficher
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    type ColumnDef,
    type ColumnFiltersState,
    type ExpandedState,
    type SortingState,
    type VisibilityState,
    FlexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table';

import { ArrowUpDown } from 'lucide-vue-next';
import { h, ref } from 'vue';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';

import { formatInamiNumber, formatPhoneNumber, valueUpdater } from '~/lib/utils';
import type { User } from '~/lib/types';
import EditAndDeleteAction from '~/components/layouts/EditAndDeleteAction.vue';

useHead({ title: 'Utilisateurs' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
const { users, getUsers } = useAuth();

await getUsers();

const data: User[] = users.value.data;

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'full_name',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Nom', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('full_name')),
    },
    {
        accessorKey: 'identifier_number',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['INAMI', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => h('div', { class: 'lowercase' }, formatInamiNumber(row.getValue('identifier_number'))),
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
    },
    {
        accessorKey: 'phone_number',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Téléphone', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: '' }, formatPhoneNumber(row.getValue('phone_number')));
        },
    },
    {
        accessorKey: 'street_address',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Rue', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: '' }, row.getValue('street_address'));
        },
    },
    {
        accessorKey: 'city',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Ville', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: '' }, row.getValue('city'));
        },
    },
    {
        accessorKey: 'zip_code',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['C.P', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: '' }, row.getValue('zip_code'));
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Date', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: '' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original;
            return h(EditAndDeleteAction, {
                onEdit: () => handleEdit(user),
                onDelete: () => handleDelete(user),
            });
        },
    },
];

const handleEdit = (user: User) => {
    console.log(user);
};

const handleDelete = (user: User) => {
    console.log(user);
};

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
    onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
    state: {
        get sorting() { return sorting.value; },
        get columnFilters() { return columnFilters.value; },
        get columnVisibility() { return columnVisibility.value; },
        get rowSelection() { return rowSelection.value; },
        get expanded() { return expanded.value; },
    },
});
</script>
