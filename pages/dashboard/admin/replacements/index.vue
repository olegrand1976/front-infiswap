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
                                Personne notifiée (1)
                            </template>
                            <template v-else>
                                Personnes notifiées ({{ selectedNurses.length }})
                            </template>
                        </DialogTitle>
                    </DialogHeader>

                    <div
                        v-if="loadingUsers"
                        class="mt-4 text-center text-gray-500 italic"
                    >
                        Chargement des notifiées...
                    </div>

                    <div
                        v-else
                        class="mt-4"
                    >
                        <ul class="space-y-2">
                            <li
                                v-for="user in selectedNurses"
                                :key="user.id"
                                class="flex justify-between items-center"
                            >
                                <UsersName :user="user" />
                                <span>{{ user.zip_code ?? '—' }}</span>
                            </li>
                        </ul>
                    </div>
                </DialogContent>
            </Dialog>

            <!-- <Dialog v-model:open="isDialogOpen">
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmation</DialogTitle>
                        <DialogDescription class="mt-2">
                            Êtes-vous sûr de vouloir notifier à nouveau par email les infirmières de la région du remplacement ?
                        </DialogDescription>
                    </DialogHeader>
                    <div class="flex space-x-8 justify-end items-center">
                        <Button
                            variant="secondary"
                            class="rounded"
                            @click="closeDialog"
                        >
                            Annuler
                        </Button>
                        <Button
                            class="rounded"
                            @click="confirmRelaunch"
                        >
                            Oui, relancer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog> -->
            <Dialog v-model:open="isDialogOpen">
                <DialogContent class="rounded-xl p-6 shadow-2xl bg-white dark:bg-gray-900 max-w-3xl mx-auto">
                    <DialogHeader>
                        <DialogTitle class="text-xl font-semibold text-gray-800 dark:text-white">
                            Relancer une notification
                        </DialogTitle>
                        <DialogDescription class="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Choisissez qui doit recevoir une relance par email.
                        </DialogDescription>
                    </DialogHeader>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div
                            class="cursor-pointer border rounded-lg p-5 hover:shadow-lg transition-all duration-200 border-blue-400"
                        >
                            <h3 class="text-lg font-bold text-blue-600">Relancer le créateur</h3>
                            <p class="text-sm text-gray-700 mt-2 dark:text-gray-300">
                                Envoie un email de rappel uniquement au créateur de ce remplacement.
                            </p>
                        </div>

                        <div
                            class="cursor-pointer border rounded-lg p-5 hover:shadow-lg transition-all duration-200 border-purple-400"
                        >
                            <h3 class="text-lg font-bold text-purple-600">Relancer les infirmiers</h3>
                            <p class="text-sm text-gray-700 mt-2 dark:text-gray-300">
                                Notifie par email tous les infirmiers de la région associés à ce remplacement.
                            </p>
                        </div>
                    </div>

                    <div class="mt-8 border-t pt-4">
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Historique des relances</h4>
                        <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                            <li>Relance envoyée au créateur le 12 juin 2025</li>
                            <li>Relance régionale le 10 juin 2025</li>
                            <li>Création du remplacement le 08 juin 2025</li>
                        </ul>
                    </div>

                    <div class="flex justify-end mt-6 space-x-4">
                        <Button
                            variant="ghost"
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                            @click="closeDialog"
                        >
                            Annuler
                        </Button>
                        <Button
                            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2"
                        >
                            Confirmer
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
import type { Replacement, Nurse, User } from '~/lib/types';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { formatPhoneNumber } from '~/lib/utils';
import ReplacementPeriod from '~/components/replacements/ReplacementPeriod.vue';
import FormatTimePeriod from '~/components/replacements/FormatTimePeriod.vue';
// import ReplacementStatus from '~/components/dashboard/ReplacementStatus.vue';

import UsersName from '@/components/users/Name.vue';

useHead({ title: 'Remplacements' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { replacements, getReplacementsForAdmin, updateReplacement, forceDelete, extractPostalDataFromReplacement, relaunchMail } = useReplacements();

const perPage = ref(PERPAGE);
const page = ref(1);
const { $apifetch } = useNuxtApp();
await getReplacementsForAdmin(page.value, perPage.value);

const { $toast } = useNuxtApp();
const dialogOpen = ref(false);
const selectedNurses = ref<User[]>([]);
const loadingUsers = ref(false);

async function loadUsersFromNurses(nurses: Nurse[]) {
    loadingUsers.value = true;
    dialogOpen.value = true;

    try {
        const plainNurses = Array.isArray(nurses)
            ? nurses
            : JSON.parse(JSON.stringify(nurses));

        const userIdPromises = plainNurses.map((n: Nurse) =>
            $apifetch<{ nurse: Nurse }>(`/api/nurses/${n.id}`)
                .then(res => res.nurse?.user_id)
                .catch(() => null),
        );

        const userIds = await Promise.all(userIdPromises);

        const userPromises = userIds
            .filter(id => !!id)
            .map(id => $apifetch<{ user: User }>(`/api/users/${id}`));

        const userResponses = await Promise.all(userPromises);

        selectedNurses.value = userResponses.map(r => r.user);
    }
    catch (err) {
        console.error('Erreur lors du chargement des users :', err);
    }
    finally {
        loadingUsers.value = false;
    }
}

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
            return h(ReplacementPeriod, {
                style: 'white-space: nowrap; min-width: 200px;',
                replacement: row.original,
            });
        },

        sortingFn: (rowA, rowB) => {
            const a = rowA.original;
            const b = rowB.original;

            const getDate = (rep: any): string => {
                if (Array.isArray(rep.periods) && rep.periods.length > 0) {
                    return rep.periods[0]?.start_date ?? '';
                }
                return rep.start_date ?? '';
            };

            const dateA = getDate(a);
            const dateB = getDate(b);

            const timeA = dateA ? new Date(dateA).getTime() : 0;
            const timeB = dateB ? new Date(dateB).getTime() : 0;

            return timeA - timeB;
        },
    },
    {
        accessorKey: 'time_slot',
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            style: 'white-space: nowrap;',
        }, () => ['Heures', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            return h(FormatTimePeriod, {
                style: 'white-space: nowrap; min-width: 200px;',
                replacement: row.original,
            });
        },

        sortingFn: (rowA, rowB) => {
            const repA = rowA.original;
            const repB = rowB.original;

            const getFirstStartTime = (rep: any): string => {
                try {
                    let ts = rep.timeSlot;
                    if (typeof ts === 'string') ts = JSON.parse(ts);

                    if (ts?.start_at) return ts.start_at;
                    if (ts?.morning?.start_at) return ts.morning.start_at;
                    if (rep.details?.[0]?.start_at) return rep.details[0].start_at;
                }
                catch {
                    return '';
                }

                return '';
            };

            const timeA = getFirstStartTime(repA) ?? '';
            const timeB = getFirstStartTime(repB) ?? '';

            return timeA.localeCompare(timeB);
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
        accessorKey: 'nurse_owner',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Créateur', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            const user = row.original.nurse_owner;
            return h(UsersName, { user });
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
        accessorKey: 'substitute_user',
        header: ({ column }) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['Remplaçant', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
            );
        },

        cell: ({ row }) => {
            const user = row.original.substitute_user;

            if (!user) {
                return h('span', { class: 'italic text-gray-400' }, ' ');
            }

            return h(UsersName, { user });
        },

        sortingFn: (rowA, rowB, columnId) => {
            const userA = rowA.getValue(columnId) as { firstname?: string; lastname?: string } | null;
            const userB = rowB.getValue(columnId) as { firstname?: string; lastname?: string } | null;

            const nameA = userA ? `${userA.firstname ?? ''} ${userA.lastname ?? ''}`.toLowerCase() : '';
            const nameB = userB ? `${userB.firstname ?? ''} ${userB.lastname ?? ''}`.toLowerCase() : '';

            return nameA.localeCompare(nameB);
        },
    },
    {
        accessorFn: row => (row.matching_nurses || []).map(nurse => nurse.full_name).join(', '),
        id: 'matching_nurses',
        header: () => {
            return h(Button, {
                variant: 'ghost',
            }, () => ['Notifiés', h({ class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            const nurses = row.original.matching_nurses || [];
            const displayText = nurses.map(n => n.full_name).join(', ');

            return h('div', { class: 'flex items-center' }, [
                h('div', {
                    class: 'ml-2 capitalize truncate max-w-[120px] whitespace-nowrap overflow-hidden',
                }, displayText),
                nurses.length > 0 && h(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => loadUsersFromNurses(nurses),
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
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('type'),
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

const sort = reactive({
    order: 'DESC',
    by: null,
});

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
};

const setSort = (columnKey: string) => {
    if (sort.by === columnKey) {
        toggleSort();
    }
    else {
        sort.by = columnKey;
        sort.order = 'DESC';
    }
};

watch(
    () => sort,
    async (newVal) => {
        await getReplacementsForAdmin(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);

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
