<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Des replacements" />

        <DashboardAdminPageContent>
            <DataTable
                :data="replacements.data"
                :columns="columns"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown } from 'lucide-vue-next';
import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { NuxtLink } from '#components';

import type { Replacement } from '~/lib/types';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
// import ReplacementStatus from '~/components/dashboard/ReplacementStatus.vue';

useHead({ title: 'Remplacements' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { replacements, getReplacementsForAdmin, updateReplacement, forceDelete, extractPostalDataFromReplacement } = useReplacements();

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
        id: 'time_slot',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Heures', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
            );
        },
        accessorFn: (row) => {
            let slot = null;
            if (typeof row.timeSlot === 'string') {
                try {
                    slot = JSON.parse(row.timeSlot);
                }
                catch (e) {
                    console.error(e);
                    slot = null;
                }
            }
            else if (typeof row.timeSlot === 'object' && row.timeSlot !== null) {
                slot = row.timeSlot;
            }
            if (!slot && row.details?.length > 0) {
                slot = {
                    start_at: row.details[0].start_at,
                    end_at: row.details[0].end_at,
                };
            }

            return slot?.start_at || '';
        },
        sortingFn: 'alphanumeric',
        cell: ({ row }) => {
            let slot = null;
            if (typeof row.original.timeSlot === 'string') {
                try {
                    slot = JSON.parse(row.original.timeSlot);
                }
                catch (e) {
                    console.error(e);
                    slot = null;
                }
            }
            else if (typeof row.original.timeSlot === 'object' && row.original.timeSlot !== null) {
                slot = row.original.timeSlot;
            }
            if (!slot && row.original.details?.length > 0) {
                slot = {
                    start_at: row.original.details[0].start_at,
                    end_at: row.original.details[0].end_at,
                };
            }

            const formatTime = (time) => (time ? time.slice(0, 5) : '-');
            const start = formatTime(slot?.start_at);
            const end = formatTime(slot?.end_at);

            return h('div', {}, `${start} - ${end}`);
        },
    },
    {
        id: 'patients',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Patients', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
            );
        },
        accessorFn: (row) => {
            let patients = row.patient_count;

            if (patients && typeof patients === 'string') {
                try {
                    const parsed = JSON.parse(patients);
                    return Array.isArray(parsed) ? parsed.length : 0;
                } catch (e) {
                    console.error(e);
                    return 0;
                }
            } else if (!patients) {
                const extracted = extractPostalDataFromReplacement(row);
                return extracted?.patients?.length || 0;
            }

            return patients;
        },
        sortingFn: 'basic',
        cell: ({ row }) => {
            let patients = row.original.patient_count;

            if (patients && typeof patients === 'string') {
                try {
                    const parsed = JSON.parse(patients);
                    patients = Array.isArray(parsed) ? parsed.length : patients;
                }
                catch (e) {
                    console.error(e);
                }
            }
            else if (!patients) {
                patients = extractPostalDataFromReplacement(row.original)?.patients?.length || 0;
            }

            return h('div', {}, patients);
        },
    },
    // {
    //     accessorKey: 'status',
    //     header: ({ column }) => {
    //         return h(Button, {
    //             variant: 'ghost',
    //             onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    //         }, () => ['Status', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
    //     },
    //     cell: ({ row }) => {
    //         const status = row.original.status;

    //         return h(ReplacementStatus, { status: status });
    //     },
    // },
    {
        id: 'zip_codes',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['C.P', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
            );
        },
        accessorFn: (row) => {
            let zipCodes = row.zip_codes;

            if (zipCodes && typeof zipCodes === 'string') {
                try {
                    const parsed = JSON.parse(zipCodes);
                    return Array.isArray(parsed) ? parsed.join(', ') : zipCodes;
                }
                catch (e) {
                    console.error(e);
                    return '';
                }
            }
            else {
                const extracted = extractPostalDataFromReplacement(row);
                return extracted?.zip_codes?.join(', ') || '';
            }
        },
        sortingFn: 'alphanumeric',
        cell: ({ row }) => {
            let zipCodes = row.original.zip_codes;

            if (zipCodes && typeof zipCodes === 'string') {
                try {
                    const parsed = JSON.parse(zipCodes);
                    zipCodes = Array.isArray(parsed) ? parsed.join(', ') : zipCodes;
                }
                catch (e) {
                    console.error(e);
                }
            }
            else {
                zipCodes = extractPostalDataFromReplacement(row.original)?.zip_codes?.join(', ') || '';
            }

            return h('div', { class: 'capitalize' }, zipCodes);
        },
    },
    {
        id: 'cities',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Villes', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
            );
        },
        accessorFn: (row) => {
            let cities = row.cities;

            if (cities) {
                if (typeof cities === 'string') {
                    try {
                        const parsed = JSON.parse(cities);
                        return Array.isArray(parsed) ? parsed.join(', ') : cities;
                    }
                    catch (e) {
                        console.error(e);
                        return '';
                    }
                }
                else if (Array.isArray(cities)) {
                    return cities.join(', ');
                }
            }
            else {
                const extracted = extractPostalDataFromReplacement(row);
                return extracted?.cities?.join(', ') || '';
            }
        },
        sortingFn: 'alphanumeric',
        cell: ({ row }) => {
            let cities = row.original.cities;

            if (cities) {
                if (typeof cities === 'string') {
                    try {
                        const parsed = JSON.parse(cities);
                        cities = Array.isArray(parsed) ? parsed.join(', ') : cities;
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else if (Array.isArray(cities)) {
                    cities = cities.join(', ');
                }
            }
            else {
                cities = extractPostalDataFromReplacement(row.original)?.cities?.join(', ') || '';
            }

            return h('div', { class: 'capitalize' }, cities);
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
        id: 'response_count',
        accessorKey: 'response_count',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Intéressé', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const nurses = row.original.response_count ?? 0;
            const id = row.original.id;

            return h(
                NuxtLink,
                {
                    to: `/dashboard/admin/replacements/interest/${id}`,
                    class: 'text-blue-600 hover:underline',
                    style: 'display: block; text-align: center;',
                },
                () => nurses.toString(),
            );
        },
        sortingFn: 'alphanumeric',
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Type', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            const type = row.original.type;

            const isImmediate = type === 'immediate';
            const badgeClass = isImmediate
                ? 'bg-red-500 text-white px-2 py-1 rounded-full text-xs'
                : 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs';

            const displayText = isImmediate ? 'URGENT' : 'classique';

            return h('span', { class: badgeClass }, displayText);
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
            const replacement = row.original;
            const actions = [
                {
                    label: 'Modifier',
                    onClick: () => handleEdit(replacement),
                },
                {
                    label: replacement.status === 'closed' ? 'Ouvrir' : 'Fermer',
                    onClick: () => replacement.status === 'closed'
                        ? handleOpen(replacement)
                        : handleClosed(replacement),
                },
                {
                    label: 'Supprimer',
                    confirm: true,
                    onClick: () => handleDelete(replacement),
                },
            ];

            return h('div', { class: 'flex justify-center' }, [
                h(DropdownMenuAction, {
                    actions: actions,
                }),
            ]);
        },
    },
];

const handleEdit = (replacement: Replacement) => {
    navigateTo(`/dashboard/admin/replacements/${replacement.id}`);
};

const handleClosed = async (replacement: Replacement) => {
    replacement.status = 'closed';
    await updateReplacement(replacement);
    await getReplacementsForAdmin();
};

const handleOpen = async (replacement: Replacement) => {
    replacement.status = 'open';
    await updateReplacement(replacement);
    await getReplacementsForAdmin();
};

const handleDelete = async (replacement: Replacement) => {
    await forceDelete(replacement.id);
    await getReplacementsForAdmin();
};
</script>
