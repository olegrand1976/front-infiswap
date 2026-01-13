<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Missions"
            :count="missions.meta.total"
        >
            <template #action>
                <Button class="rounded-md">
                    <NuxtLink
                        to="/dashboard/institution/missions/create"
                        class="flex gap-3 items-center"
                    >
                        <PlusIcon class="w-6 h-6" />
                        <span>Nouveau</span>
                    </NuxtLink>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div class="p-4 flex gap-3 items-end overflow-x-auto pb-3 px-4 scrollbar-hide mb-4">
                <div class="space-y-1">
                    <label class="font-medium text-gray-500">Filtrer par date</label>
                    <InputIcon
                        v-model="option.date"
                        rounded="md"
                        class="w-[250px]"
                        type="date"
                        @input="debouncedFilterMissions"
                    />
                </div>
                <Button
                    class="rounded-md h-11"
                >
                    <ArrowPathIcon class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>

            <DataTable
                :data="dataMissions"
                :columns="columns"
            />

            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="missions.meta.total"
                    @update:page="refreshMissions"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import type { ColumnDef } from '@tanstack/vue-table';
import { PlusIcon, ArrowPathIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import UsersName from '@/components/users/Name.vue';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { PERPAGE } from '~/lib/constants';
import type { Mission } from '~/lib/types';
import { debounce } from '~/lib/utils';

const { getAll, missions } = useMissions();

useHead({ title: 'Mission' });

definePageMeta({
    layout: 'dashboard',
    middleware: 'institution',
});

const perPage = ref(PERPAGE);
const page = ref(1);

const initialFilter = {
    date: '',
};

const option = ref({ ...initialFilter });

await getAll(page.value, perPage.value, option.value);
const dataMissions = computed(() => missions.value.data ?? []);

const filterMissions = async () => {
    const currentFilter = { ...option.value };

    await getAll(
        page.value,
        perPage.value,
        {
            date: currentFilter.date,
        });
};

const debouncedFilterMissions = debounce(filterMissions, 100);

const refreshMissions = async (pge: number) => {
    page.value = pge;
    await filterMissions();
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await filterMissions();
};

const columns: ColumnDef<Mission>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'checked': table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                    ? 'indeterminate'
                    : false,
            'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
            'class': 'mx-2',
        }),
        cell: ({ row }) => h(Checkbox, {
            'checked': row.getIsSelected(),
            'onUpdate:checked': value => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
            'class': 'mx-2',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'start_date',
        accessorFn: row => row.start_date,
        header: () =>
            h(Button, {
                variant: 'ghost',
                onClick: () => setSort('start_date'),
            }, () => ['Date de début', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const startDate = row.original.start_date;
            return h('div', { class: 'ml-4' }, formatToDMY(startDate, true));
        },
    },
    {
        id: 'end_date',
        accessorFn: row => row.end_date,
        header: () =>
            h(Button, {
                variant: 'ghost',
                onClick: () => setSort('end_date'),
            }, () => ['Date de fin', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const endDate = row.original.end_date;
            return h('div', { class: 'ml-4' }, formatToDMY(endDate, true));
        },
    },
    {
        id: 'Service',
        accessorFn: row => row.service,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Service', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const service = row.original.service;
            return h('div', { class: 'ml-4 w-40 truncate' }, service);
        },
    },
    {
        id: 'required_diploma',
        accessorFn: row => row.required_diploma,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Diplôme', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const diploma = row.original.required_diploma;
            return h('div', { class: 'ml-4' }, diploma);
        },
    },
    {
        id: 'accepted_candidate',
        accessorFn: row => row.accepted_candidate,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Candidat retenu', h('', { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            const user = row.original.accepted_candidate;
            return h(UsersName, { user });
        },
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_at'),
            }, () => ['Création', h(ChevronUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: '' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: () => {
            const actions = [
                {
                    label: 'Modifier',
                },
                {
                    label: 'Voir les candidatures',
                },
                {
                    label: 'Supprimer',
                },
            ];

            return h('div', { class: 'ml-4' }, [
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
        await getAll(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);
</script>
