<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Des remplacements" />

        <DashboardAdminPageContent>
            <div class="p-4 flex gap-3 items-center overflow-x-auto pb-3 px-4 scrollbar-hide">
                <InputIcon
                    v-model="option.name"
                    rounded="md"
                    placeholder="Filtrer par Nom ou Prénom"
                    class="w-[250px]"
                    @input="debouncedFilterReplacements"
                />
                <InputIcon
                    v-model="option.zip"
                    rounded="md"
                    placeholder="Code postal"
                    class="w-[250px]"
                    type="number"
                    @input="debouncedFilterReplacements"
                />
                <InputIcon
                    v-model="option.city"
                    rounded="md"
                    placeholder="Ville"
                    class="w-[250px]"
                    @input="debouncedFilterReplacements"
                />
                <Select
                    v-model="option.type"
                    @update:model-value="debouncedFilterReplacements"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Type</span>
                        <strong class="ml-4">
                            {{
                                option.type === 'classic' ? 'classique' : option.type === 'immediate' ? 'urgente' : 'tous'
                            }}
                        </strong>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="'classic'">
                                <span class="ml-2">Classqiue</span>
                            </SelectItem>
                            <SelectItem :value="'immediate'">
                                <span class="ml-2">Urgente</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    class="rounded-md"
                    @click="resetFilter"
                >
                    <ArrowPathIcon class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>
            <div class="ml-4 my-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    v-for="tab in provinceTabs"
                    :key="tab.value"
                    :class="[
                        'px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium transition-colors',
                        (tab.value === '' && option.province === '') || (tab.value !== '' && option.province === tab.value)
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700']"
                    @click="setProvinceFilter(tab.value)"
                >
                    {{ tab.label }}
                </button>
            </div>
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
                            <template v-if="selectedUsers.length === 1">
                                Personne notifiée (1)
                            </template>
                            <template v-else>
                                Personnes notifiées ({{ selectedUsers.length }})
                            </template>
                        </DialogTitle>
                    </DialogHeader>

                    <div
                        v-if="selectedUsers.length === 0"
                        class="mt-4 text-center text-gray-500 italic"
                    >
                        Aucune personne notifiée.
                    </div>

                    <div
                        v-else
                        class="mt-4"
                    >
                        <ul class="space-y-2">
                            <li
                                v-for="user in selectedUsers"
                                :key="user.id"
                                class="flex justify-between items-center"
                            >
                                <UsersName :user="user" />
                                <span>{{ user.profile?.zip_code ?? '—' }}</span>
                            </li>
                        </ul>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog v-model:open="isDialogOpen">
                <DialogContent class="rounded-2xl p-6 shadow-2xl bg-white dark:bg-gray-900 max-w-3xl mx-auto">
                    <DialogHeader>
                        <DialogTitle class="text-xl font-medium text-gray-800 dark:text-white">
                            Relancer une notification
                        </DialogTitle>
                        <DialogDescription class="text-sm text-gray-500 dark:text-gray-300 mt-1">
                            Choisissez qui doit recevoir une relance par email.
                        </DialogDescription>
                    </DialogHeader>

                    <div class="flex flex-col md:flex-row gap-4 mt-6">
                        <button
                            type="button"
                            :class="[
                                'w-full md:w-auto px-4 py-3 rounded-lg border text-left focus:outline-none focus:ring-2 transition',
                                selectedOption === 'creator'
                                    ? 'border-primary bg-primary/10 text-primary ring-primary'
                                    : 'border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']"
                            @click="selectedOption = 'creator'"
                        >
                            <h3 class="font-bold">
                                Relancer le créateur
                            </h3>
                            <p class="text-sm mt-1">
                                Envoie un email uniquement au créateur de ce remplacement.
                            </p>
                        </button>

                        <button
                            type="button"
                            :class="[
                                'w-full md:w-auto px-4 py-3 rounded-lg border text-left focus:outline-none focus:ring-2 transition',
                                selectedOption === 'interested'
                                    ? 'border-primary bg-primary/10 text-primary ring-primary'
                                    : 'border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300']"
                            @click="selectedOption = 'interested'"
                        >
                            <h3 class="font-bold">
                                Relancer les infirmiers
                            </h3>
                            <p class="text-sm mt-1">
                                Notifie tous les infirmiers de la région associés à ce remplacement.
                            </p>
                        </button>
                    </div>

                    <div
                        v-if="selectedOption"
                        class="mt-8"
                    >
                        <h4 class="text-base font-semibold text-gray-700 dark:text-white mb-3 flex items-center gap-2">
                            Historique des relances –
                            <span class="ml-1 font-normal text-sm italic text-gray-500">
                                {{ selectedOption === 'creator' ? 'Créateur' : 'Infirmiers' }}
                            </span>
                        </h4>
                        <div v-if="getFilteredHistory.length > 0">
                            <ul class="space-y-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                                <li
                                    v-for="item in getFilteredHistory"
                                    :key="item.id"
                                    class="ml-4"
                                >
                                    Relance envoyée le {{ formatDate(item.relaunched_at) }}
                                </li>
                            </ul>
                        </div>

                        <div
                            v-else
                            class="text-sm italic text-gray-500 dark:text-gray-400 ml-4"
                        >
                            Aucune relance n’a encore été effectuée pour ce remplacement.
                        </div>

                        <button
                            v-if="!showAll && relaunchHistory.filter(h => h.type === selectedOption).length > 1"
                            class="text-sm text-blue-500 hover:underline mt-2 ml-4"
                            @click="showAll = true"
                        >
                            Voir plus
                        </button>
                    </div>

                    <div class="flex justify-end mt-8 space-x-3">
                        <Button
                            variant="secondary"
                            class="rounded"
                            @click="closeDialog"
                        >
                            Annuler
                        </Button>
                        <Button
                            class="rounded"
                            :disabled="!selectedOption"
                            @click="confirmRelaunch"
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
import { EyeIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { NuxtLink } from '#components';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { PERPAGE } from '~/lib/constants';
import type { Replacement, User } from '~/lib/types';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { formatPhoneNumber } from '~/lib/utils';
import ReplacementPeriod from '~/components/replacements/ReplacementPeriod.vue';
import FormatTimePeriod from '~/components/replacements/FormatTimePeriod.vue';

import UsersName from '@/components/users/Name.vue';

useHead({ title: 'Remplacements' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { replacements, getReplacementsForAdmin, updateReplacement, forceDelete, extractPostalDataFromReplacement } = useReplacements();
const { relaunchMailToCreator, relaunchMailToRegion, fetchRelaunchHistory } = useRelaunch();

const perPage = ref(PERPAGE);
const page = ref(1);

const initialFilter = {
    name: null,
    zip: null,
    city: null,
    type: null,
    province: '',
};

const option = ref({ ...initialFilter });

const debounce = (func, delay) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const provinceTabs = [
    { label: 'Toutes', value: '' },
    { label: 'Bruxelles-Capitale', value: 'Bruxelles-Capitale' },
    { label: 'Brabant Wallon', value: 'Brabant wallon' },
    { label: 'Brabant Flamand', value: 'Brabant flamand' },
    { label: 'Brabant flamand - Overijse', value: 'Brabant flamand - Overijse' },
    { label: 'Anvers', value: 'Anvers' },
    { label: 'Limbourg', value: 'Limbourg' },
    { label: 'Liège', value: 'Liège' },
    { label: 'Namur', value: 'Namur' },
    { label: 'Hainaut', value: 'Hainaut' },
    { label: 'Luxembourg', value: 'Luxembourg' },
    { label: 'Flandre-Occidentale', value: 'Flandre-Occidentale' },
    { label: 'Flandre-Orientale', value: 'Flandre-Orientale' },
    { label: 'Autres', value: 'Autres' },
];

const setProvinceFilter = (province) => {
    option.value.province = province;
    page.value = 1;
    filterReplacements();
};

const filterReplacements = async () => {
    const currentFilter = {
        ...option.value,
        province: option.value.province || '',
    };
    await getReplacementsForAdmin(page.value, perPage.value, currentFilter);
};

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(initialFilter);
    if (isSame) {
        return;
    }

    option.value = { ...initialFilter };
    page.value = 1;
    await getReplacementsForAdmin(page.value, perPage.value, option.value);
};

const debouncedFilterReplacements = debounce(filterReplacements, 100);

await getReplacementsForAdmin(page.value, perPage.value);

const { $toast } = useNuxtApp();
const dialogOpen = ref(false);
const selectedUsers = ref<User[]>([]);

function showUsersInDialog(users: User[]) {
    selectedUsers.value = users;
    dialogOpen.value = true;
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
        accessorFn: row => (row.matching_nurses || []).map(user => user.full_name).join(', '),
        id: 'matching_nurses',
        header: () => h(Button, { variant: 'ghost' }, () => ['Notifiés']),
        cell: ({ row }) => {
            const users = row.original.matching_nurses || [];
            const displayText = users.map(u => u.full_name).join(', ');

            return h('div', { class: 'flex items-center' }, [
                h('div', {
                    class: 'ml-2 capitalize truncate max-w-[180px] whitespace-nowrap overflow-hidden',
                    title: displayText,
                }, displayText),
                users.length > 0 && h(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => showUsersInDialog(users),
                }, () => h(EyeIcon, { class: 'h-4 w-4 ml-1' })),
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
const selectedReplacement = ref(null);
const selectedOption = ref<'creator' | 'interested'>('creator');
const relaunchHistory = ref([]);
const showAll = ref(false);

const openConfirmDialog = async (replacement) => {
    selectedReplacement.value = replacement;
    selectedOption.value = 'creator';
    showAll.value = false;
    isDialogOpen.value = true;

    const response = await fetchRelaunchHistory(replacement.id);

    if (response?.data) {
        relaunchHistory.value = response.data;
    }
    else {
        relaunchHistory.value = [];
    }
};

const closeDialog = () => {
    isDialogOpen.value = false;
    selectedReplacement.value = null;
    selectedOption.value = 'creator';
    relaunchHistory.value = [];
    showAll.value = false;
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'Date invalide' : date.toLocaleString();
};

const getFilteredHistory = computed(() => {
    const filtered = relaunchHistory.value.filter(
        item => item.type === selectedOption.value,
    );
    return showAll.value ? filtered : filtered.slice(0, 1);
});

const confirmRelaunch = async () => {
    if (!selectedReplacement.value || !selectedOption.value) return;

    if (selectedOption.value === 'creator') {
        const response = await relaunchMailToCreator(selectedReplacement.value);
        if (response.success === false) {
            $toast({
                description: 'Ce remplacement ne remplit pas les conditions pour un renvoi de mail.',
                variant: 'destructive',
            });
            return;
        }
    }
    else if (selectedOption.value === 'interested') {
        await relaunchMailToRegion(selectedReplacement.value);
    }

    $toast({
        description: 'Mail renvoyé avec succès',
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
