<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Des remplacements" />

        <DashboardAdminPageContent>
            <div class="p-4 flex flex-wrap gap-3 items-center overflow-x-auto pb-3 px-4 scrollbar-hide">
                <InputIcon
                    v-model="option.name"
                    rounded="md"
                    placeholder="Filtrer par Nom ou Prénom"
                    class="w-full lg:w-[250px]"
                    @input="debouncedFilterReplacements"
                />
                <InputIcon
                    v-model="option.zip"
                    rounded="md"
                    placeholder="Code postal"
                    class="w-full lg:w-[250px]"
                    type="number"
                    @input="debouncedFilterReplacements"
                />
                <InputIcon
                    v-model="option.city"
                    rounded="md"
                    placeholder="Ville"
                    class="w-full lg:w-[250px]"
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
                                <span class="ml-2">Classique</span>
                            </SelectItem>
                            <SelectItem :value="'immediate'">
                                <span class="ml-2">Urgente</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    v-model="option.role"
                    @update:model-value="debouncedFilterReplacements"
                >
                    <SelectTrigger class="w-full lg:max-w-sm rounded-md">
                        <span>Rôle</span>
                        <span class="ml-4 font-semibold text-nowrap w-40">
                            {{
                                option.role === 'nurse' ? 'Infirmier(ère)' : option.role === 'caregiver' ? 'Aide soignant(e)' : option.role === 'midwife' ? 'Sage-femme' : 'tous'
                            }}
                        </span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="'nurse'">
                                <span class="ml-2">Infirmier(ère)</span>
                            </SelectItem>
                            <SelectItem :value="'caregiver'">
                                <span class="ml-2">Aide soignant(e)</span>
                            </SelectItem>
                            <SelectItem :value="'midwife'">
                                <span class="ml-2">Sage-femme</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    v-model="option.status"
                    @update:model-value="debouncedFilterReplacements"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Statut</span>
                        <span class="ml-4 font-semibold text-nowrap w-40">
                            {{
                                option.status === 'open' ? 'Ouvert' : option.status === 'closed' ? 'Fermé' : 'tous'
                            }}
                        </span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="'open'">
                                <span class="ml-2">Ouvert</span>
                            </SelectItem>
                            <SelectItem :value="'closed'">
                                <span class="ml-2">Fermé</span>
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
                    v-for="tab in countryTabs"
                    :key="tab.value"
                    :class="[
                        'px-4 py-2 cursor-pointer rounded-md whitespace-nowrap text-sm font-medium transition-colors',
                        (tab.value === '' && option.country === '') || (tab.value !== '' && option.country === tab.value)
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700']"
                    @click="handleShowRegion(tab.value)"
                >
                    {{ tab.label }}
                </button>
            </div>

            <Dialog
                v-model:open="regionDialog"
                class="pb-8 sm:pb-0"
            >
                <DialogContent class="max-h-[60vh] overflow-y-scroll pb-8 sm:max-h-auto max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Zone géographique</DialogTitle>
                        <DialogDescription>
                            Sélectionner la région souhaitée pour le filtrage
                        </DialogDescription>
                    </DialogHeader>
                    <template v-if="selectedCountry == 'fr'">
                        <div class="py-4">
                            <InputIcon
                                v-model="searchQuery"
                                placeholder="Entrer un département"
                                rounded="md"
                            />

                            <div class="grid sm:grid-cols-2 gap-4 mt-8">
                                <button
                                    v-for="region in filteredDepartments"
                                    :key="region"
                                    :class="[
                                        'px-4 py-2 cursor-pointer rounded-md whitespace-nowrap text-sm font-medium transition-colors',
                                        (option.province === region)
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700']"
                                    @click="setProvinceFilter('fr', region)"
                                >
                                    <span>{{ region }}</span>
                                </button>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="grid sm:grid-cols-2 gap-4 py-4">
                            <div
                                v-for="region in regions"
                                :key="region"
                                :class="[
                                    'px-4 py-2 cursor-pointer rounded-md whitespace-nowrap text-sm font-medium transition-colors',
                                    (option.province === region)
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700']"
                                @click="setProvinceFilter('be', region)"
                            >
                                <span>{{ region }}</span>
                            </div>
                        </div>
                    </template>
                </DialogContent>
            </Dialog>

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

            <ReplacementDetailsModal
                :replacement-id="selectedReplacementId"
                :open="isModalOpen"
                @update:open="isModalOpen = $event"
            />

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
import { EyeIcon, ArrowPathIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline';
import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { NuxtLink } from '#components';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { PERPAGE } from '~/lib/constants';
import type { Replacement } from '~/lib/types';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { regions, departments, formatPhoneNumber, getErrorMessage } from '~/lib/utils';
import ReplacementPeriod from '~/components/replacements/ReplacementPeriod.vue';
import ReplacementDetailsModal from '~/components/replacements/ReplacementDetailsModal.vue';
import FormatTimePeriod from '~/components/replacements/FormatTimePeriod.vue';

import UsersName from '@/components/users/Name.vue';

useHead({ title: 'Remplacements' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { replacements, getReplacementsForAdmin, updateReplacement, forceDelete, extractPostalDataFromReplacement } = useReplacements();
const { relaunchMailToCreator, relaunchMailToRegion, fetchRelaunchHistory } = useRelaunch();
const { isSuperAdmin } = useAuth();

const perPage = ref(PERPAGE);
const page = ref(1);

const initialFilter = {
    name: null,
    zip: null,
    city: null,
    type: null,
    role: null,
    status: null,
    country: '',
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

const regionDialog = ref(false);
const countryTabs = [
    { label: 'Toutes', value: '' },
    { label: 'Belgique', value: 'be' },
    { label: 'France', value: 'fr' },
];

const selectedCountry = ref('');
const searchQuery = ref('');
const displayedDepartments = ref([]);

const handleShowRegion = async (region) => {
    if (region !== '') {
        if (region === 'fr') {
            displayedDepartments.value = getRandomItems(departments, 6);
        }
        selectedCountry.value = region;
        regionDialog.value = true;
    }
    else {
        option.value.country = '';
        option.value.province = '';
        selectedCountry.value = '';
        page.value = 1;

        await filterReplacements();
    }
};

const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const filteredDepartments = computed(() => {
    if (!searchQuery.value) return displayedDepartments.value;
    return departments.filter(dep =>
        dep.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
});

const setProvinceFilter = (country, region) => {
    option.value.country = country;
    option.value.province = region;
    page.value = 1;
    filterReplacements();
};

const filterReplacements = async () => {
    const currentFilter = {
        ...option.value,
        country: option.value.country,
        province: option.value.province,
    };
    await getReplacementsForAdmin(page.value, perPage.value, currentFilter);
    regionDialog.value = false;
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

const refreshReplacement = async (page: number) => {
    await getReplacementsForAdmin(page, perPage.value);
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getReplacementsForAdmin(page.value, value);
};

const isModalOpen = ref(false);
const selectedReplacementId = ref<number | null>(null);

function handleViewDetails(id: number) {
    selectedReplacementId.value = id;
    isModalOpen.value = true;
}

const columns: ColumnDef<Replacement>[] = [
    {
        id: 'view_details',
        accessorKey: 'start_date',
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            style: 'white-space: nowrap;',
        }, () => ['Période', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            return h('div', {
                class: 'font-medium cursor-pointer',
                style: 'white-space: nowrap; min-width: 200px;',
                onClick: () => handleViewDetails(row.original.id),
            }, [
                h(ReplacementPeriod, {
                    replacement: row.original,
                    hideStatus: true,
                }),
            ]);
        },

        sortingFn: (rowA, rowB) => {
            const a = rowA.original;
            const b = rowB.original;

            const getDate = (rep): string => {
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
        accessorKey: 'status',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Statut', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            const status = row.original.status;
            const isClosed = status === 'closed';

            return h('div', { class: 'flex gap-2 items-center' }, [
                isClosed
                    ? h('span', {
                            class: 'bg-warning text-white px-2 py-1 rounded-full text-xs font-bold',
                        }, 'FERMÉ')
                    : h('span', {
                            class: 'bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold',
                        }, 'OUVERT'),
            ]);
        },
        sortingFn: 'alphanumeric',
    },
    {
        accessorKey: 'time_slot',
        header: ({ column }) => h(Button, {
            variant: 'ghost',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            style: 'white-space: nowrap;',
        }, () => ['Heures', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            return h(FormatTimePeriod, {
                style: 'white-space: nowrap; min-width: 200px;',
                replacement: row.original,
            });
        },

        sortingFn: (rowA, rowB) => {
            const repA = rowA.original;
            const repB = rowB.original;

            const getFirstStartTime = (rep): string => {
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
                () => ['C.P', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })],
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
                () => ['Villes', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })],
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
        accessorKey: 'user_owner',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Créateur', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            const user = row.original.user_owner;
            return h(UsersName, { user });
        },
    },
    {
        accessorKey: 'user_owner_phone_number',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [
                'Téléphone',
                h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' }),
            ]);
        },
        cell: ({ row }: { row: { getValue: (key: string) => string | null } }) => {
            const phone: string | null = row.getValue('user_owner_phone_number');
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
                () => ['Remplaçant', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })],
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
        id: 'matching_user',
        header: () => h(Button, { variant: 'ghost' }, () => 'Notifiés'),
        cell: ({ row }) => {
            const users = row.original.matching_users || [];
            const displayText = users.map(u => u.full_name).join(', ');
            const replacementId = row.original.id;

            return h('div', { class: 'flex items-center text-center' }, [
                h('div', {
                    class: 'ml-2 capitalize truncate max-w-[180px] whitespace-nowrap overflow-hidden',
                    title: displayText,
                }, displayText || '-'),
                users.length > 0
                && h(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => navigateTo(`/dashboard/admin/replacements/notified/${replacementId}`),
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
            }, () => ['Intéressés', h(ChevronUpDownIcon, { class: 'ml-2 h-2 w-2' })]),
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
            }, () => ['Type', h(ChevronUpDownIcon, { class: 'ml-2 h-2 w-2' })]);
        },
        cell: ({ row }) => {
            const type = row.original.type;
            const isImmediate = type === 'immediate';

            return h('div', { class: 'flex gap-2 items-center' }, [
                isImmediate && h('span', {
                    class: 'bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold',
                }, 'URGENT'),
            ]);
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Date', h(ChevronUpDownIcon, { class: '' })]);
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
                ...(isSuperAdmin.value
                    ? [
                            {
                                label: 'Supprimer',
                                confirm: true,
                                onClick: () => handleDelete(replacement),
                            },
                        ]
                    : []),
            ];

            return h('div', { class: 'flex justify-center' }, [
                h(DropdownMenuAction, {
                    actions: actions,
                }),
            ]);
        },
    },
];

const excludedColumnsForModal = ['user_owner', 'substitute_user'];

columns.forEach((col: any) => {
    if (col.id !== 'actions') {
        const originalCell = col.cell;
        col.cell = (ctx) => {
            const vnode = originalCell ? originalCell(ctx) : h('div', ctx.getValue?.() ?? '');

            return h(
                'div',
                {
                    class: 'cursor-pointer hover:bg-gray-100 hover:scale-105 transition-all duration-150 text-sm',
                    style: 'padding: 4px;',
                    onClick: (e: MouseEvent) => {
                        const target = e.target as HTMLElement;
                        if (['BUTTON', 'A', 'SVG', 'PATH'].includes(target.tagName)) return;
                        if (excludedColumnsForModal.includes(col.id) || excludedColumnsForModal.includes(col.accessorKey)) return;
                        handleViewDetails(ctx.row.original.id);
                    },
                },
                [vnode],
            );
        };
    }
});

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

    try {
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
    }
    catch (error) {
        $toast({
            description: getErrorMessage(error),
            variant: 'destructive',
        });
    }
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
