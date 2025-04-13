<template>
    <div class="w-full">
        <div class="px-6 h-20 mb-10 flex items-center justify-between text-gray-700 shadow-md rounded-md bg-white">
            <h1 class="font-bold text-xl">
                Des utilisateurs
            </h1>
            <Button class="rounded-md">
                <span><PlusCircleIcon /></span> Ajouter un utilisateur
            </Button>
        </div>

        <DataTable
            :data="users.data"
            :columns="columns"
        />
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown } from 'lucide-vue-next';
import { h } from 'vue';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';

import { formatInamiNumber, formatPhoneNumber } from '~/lib/utils';
import type { User } from '~/lib/types';
import EditAndDeleteAction from '~/components/EditAndDeleteAction.vue';
import DropdownMenuAction from '~/components/dashboard/DropdownMenuAction.vue';

useHead({ title: 'Utilisateurs' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
const { users, getUsers } = useAuth();

await getUsers();

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
            return h(DropdownMenuAction, {
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
</script>
