<template>
    <div class="w-full">
        <div class="px-6 h-20 mb-10 flex items-center justify-between text-gray-700 shadow-md rounded-md bg-white">
            <h1 class="font-bold text-xl">
                Des patients
            </h1>
        </div>

        <DataTable
            :data="patients.data"
            :columns="columns"
        />
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown } from 'lucide-vue-next';
import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';

import { formatNISS, formatPhoneNumber } from '~/lib/utils';
import type { Patient } from '~/lib/types';
import DropdownMenuAction from '~/components/dashboard/DropdownMenuAction.vue';

useHead({ title: 'Patients' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { patients, getPatients } = usePatient();

await getPatients();

const columns: ColumnDef<Patient>[] = [
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
        accessorKey: 'social_security_number',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['NISS', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => h('div', { class: 'lowercase' }, formatNISS(row.getValue('social_security_number'))),
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
        accessorKey: 'nurse_id',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Infirmier(e)', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            const patient = row.original;
            return h('div', { class: '' }, patient.nurse.full_name);
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
            const patient = row.original;
            return h(DropdownMenuAction, {
                onEdit: () => handleEdit(patient),
                onDelete: () => handleDelete(patient),
            });
        },
    },
];

const handleEdit = (patient: Patient) => {
    console.log(patient);
};

const handleDelete = (patient: Patient) => {
    console.log(patient);
};
</script>
