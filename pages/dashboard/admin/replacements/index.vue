<template>
    <div class="w-full">
        <div class="px-6 h-20 mb-10 flex items-center justify-between text-gray-700 shadow-md rounded-md bg-white">
            <h1 class="font-bold text-xl">
                Des replacements
            </h1>
        </div>

        <DataTable
            :data="replacements.data"
            :columns="columns"
        />
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown } from 'lucide-vue-next';
import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';

import type { Replacement } from '~/lib/types';
import EditAndDeleteAction from '~/components/EditAndDeleteAction.vue';
import ReplacementStatus from '~/components/dashboard/ReplacementStatus.vue';

useHead({ title: 'Remplacements' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { replacements, getReplacementsForAdmin, extractPostalDataFromReplacement } = useReplacements();

await getReplacementsForAdmin();

const columns: ColumnDef<Replacement>[] = [
    {
        accessorKey: 'start_date',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Période', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            const period = formatToDMY(row.original.start_date) + ' - ' + formatToDMY(row.original.end_date);

            return h('div', { class: 'capitalize' }, period);
        },
    },
    {
        header: 'Nombre patient',
        cell: ({ row }) => {
            const patients = extractPostalDataFromReplacement(row.original).patients;

            return h('div', { class: '' }, patients.length);
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Status', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            const status = row.original.status;

            return h(ReplacementStatus, { status: status });
        },
    },
    {
        header: 'Villes',
        cell: ({ row }) => {
            const cities = extractPostalDataFromReplacement(row.original).cities.join(', ');

            return h('div', { class: 'capitalize' }, cities);
        },
    },
    {
        header: 'C.P',
        cell: ({ row }) => {
            const zipCodes = extractPostalDataFromReplacement(row.original).zip_codes.join(', ');

            return h('div', { class: 'capitalize' }, zipCodes);
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
        accessorKey: 'nurse_owner_full_name',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Créateur', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'capitalize' }, row.original.nurse_owner_full_name);
        },
    },
    {
        accessorKey: 'substitute_nurse',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Remplaçant', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'capitalize' }, row.original.substitute_nurse);
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
            const replacement = row.original;
            return h(EditAndDeleteAction, {
                onEdit: () => handleEdit(replacement),
                onDelete: () => handleDelete(replacement),
            });
        },
    },
];

const handleEdit = (replacement: Replacement) => {
    console.log(replacement);
};

const handleDelete = (replacement: Replacement) => {
    console.log(replacement);
};
</script>
