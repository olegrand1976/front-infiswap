<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Des remplacements" />

        <DashboardAdminPageContent>
            <DataTable
                :data="replacements.data"
                :columns="columns"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="replacements.total"
                    @update:page="refreshReplacement"
                    @update:per-page="handlePerPageChange"
                />
            </div>

            <Dialog v-model:open="dialogOpen">
                <DialogContent class="max-h-[30rem] overflow-y-scroll overflow-x-hidden">
                    <DialogHeader>
                        <DialogTitle>
                            <template v-if="selectedNurses.length === 1">
                                Personne notifiée ({{ selectedNurses.length }})
                            </template>
                            <template v-else>
                                Personnes notifiées ({{ selectedNurses.length }})
                            </template>
                        </DialogTitle>
                    </DialogHeader>
                    <div class="mt-4">
                        <ul class="space-y-2">
                            <li
                                v-for="nurse in selectedNurses"
                                :key="nurse.id"
                                class="flex justify-between items-center"
                            >
                                <span>
                                    {{ nurse.full_name }}
                                </span>
                                <span>
                                    {{ nurse.zip_code }}
                                </span>
                            </li>
                        </ul>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog v-model:open="isDialogOpen">
                <DialogContent class="h-[28vh]">
                    <DialogHeader>
                        <DialogTitle>Confirmation</DialogTitle>
                        <DialogDescription class="mt-2">
                            Voulez-vous vraiment relancer tous les infirmiers par mail ?
                        </DialogDescription>
                    </DialogHeader>
                    <div class="flex space-x-8 justify-end items-center">
                        <Button
                            variant="secondary"
                            @click="closeDialog"
                        >
                            Annuler
                        </Button>
                        <Button @click="confirmRelaunch">
                            Oui, relancer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown } from 'lucide-vue-next';
import { EyeIcon } from '@heroicons/vue/24/outline';
import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { NuxtLink } from '#components';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { PERPAGE } from '~/lib/constants';
import type { Replacement, Nurse } from '~/lib/types';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { formatPhoneNumber } from '~/lib/utils';
import ReplacementPeriod from '~/components/replacements/ReplacementPeriod.vue';
// import ReplacementStatus from '~/components/dashboard/ReplacementStatus.vue';

useHead({ title: 'Remplacements' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { replacements, getReplacementsForAdmin, updateReplacement, forceDelete, extractPostalDataFromReplacement, relaunchMail } = useReplacements();

const perPage = ref(PERPAGE);
const page = ref(1);
await getReplacementsForAdmin(page.value, perPage.value);

const dialogOpen = ref(false);
const { $toast } = useNuxtApp();
const selectedNurses = ref<Nurse[]>([]);

const refreshReplacement = async (page: number) => {
    await getReplacementsForAdmin(page, perPage.value);
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getReplacementsForAdmin(page.value, value);
};

const columns: ColumnDef<Replacement>[] = [
    {
        accessorKey: 'start_date',
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            style: 'white-space: nowrap;',
        }, () => ['Période', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            return h(ReplacementPeriod, { style: 'white-space: nowrap; min-width: 200px;', replacement: row.original });
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

            const formatTime = time => (time ? time.slice(0, 5) : '-');
            const start = formatTime(slot?.start_at);
            const end = formatTime(slot?.end_at);

            const timeText = start === end ? start : `${start} - ${end}`;

            return h('div', {}, timeText);
        },
    },
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
            const zipCodes = row.zip_codes;

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

            return h('div', { class: 'capitalize truncate max-w-[120px] lg:max-w-[150px] whitespace-nowrap overflow-hidden' }, zipCodes);
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
            const cities = row.cities;

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

            return h('div', { class: 'capitalize truncate max-w-[120px] lg:max-w-[150px] whitespace-nowrap overflow-hidden' }, cities);
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
            return h('div', { class: 'capitalize truncate max-w-[120px] whitespace-nowrap overflow-hidden' }, row.original.nurse_owner_full_name);
        },
    },
    {
        accessorKey: 'nurse_owner_phone_number',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [
                'Téléphone',
                h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
            ]);
        },
        cell: ({ row }: { row: { getValue: (key: string) => string | null } }) => {
            const phone: string | null = row.getValue('nurse_owner_phone_number');
            return h('div', { class: 'text-center' }, formatPhoneNumber(phone));
        },
        filterFn: (row, columnId, filterValue) => {
            const value = (row.getValue(columnId) as string | null)?.replace(/\D/g, '') ?? '';
            const search = (filterValue as string)?.replace(/\D/g, '') ?? '';
            return value.includes(search);
        },
        sortingFn: 'alphanumeric',
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
            return h('div', { class: 'capitalize truncate max-w-[120px] whitespace-nowrap overflow-hidden' }, row.original.substitute_nurse);
        },
    },
    {
        accessorFn: row => (row.matching_nurses || []).map(nurse => nurse.full_name).join(', '),
        id: 'matching_nurses',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Notifiés', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            const nurses = (row.original.matching_nurses || []).map(nurse => nurse);
            const displayText = nurses.map(nurse => nurse.full_name).join(', ');

            return h('div', { class: 'flex items-center' }, [
                h('div', {
                    class: 'ml-2 capitalize truncate max-w-[120px] whitespace-nowrap overflow-hidden',
                }, displayText),
                nurses.length > 0 && h(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => {
                        selectedNurses.value = nurses;
                        dialogOpen.value = true;
                    },
                }, () => h(EyeIcon, { class: 'h-4 w-4' })),
            ]);
        },
    },
    {
        id: 'response_count',
        accessorKey: 'response_count',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Intéressés', h(ArrowUpDown, { class: 'ml-2 h-2 w-2' })]),
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
            }, () => ['Type', h(ArrowUpDown, { class: 'ml-2 h-2 w-2' })]);
        },
        cell: ({ row }) => {
            const type = row.original.type;

            const isImmediate = type === 'immediate';
            const badgeClass = isImmediate
                ? 'bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold'
                : 'bg-transparent text-gray-800 px-2 py-1 rounded-full text-xs font-bold';

            const displayText = isImmediate ? 'URGENT' : '';

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
                    label: 'Relance',
                    // onClick: () => handleRelaunch(replacement),
                    onClick: () => openConfirmDialog(replacement),
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
const isDialogOpen = ref(false);
const selectedReplacement = ref<Replacement | null>(null);

const openConfirmDialog = (replacement: Replacement) => {
    selectedReplacement.value = replacement;
    isDialogOpen.value = true;
};

const closeDialog = () => {
    isDialogOpen.value = false;
    selectedReplacement.value = null;
};

const confirmRelaunch = async () => {
    if (!selectedReplacement.value) return;

    await relaunchMail(selectedReplacement.value);
    $toast({
        description: 'Mail renvoyé avec succès à tous',
    });
    await getReplacementsForAdmin();

    closeDialog();
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
