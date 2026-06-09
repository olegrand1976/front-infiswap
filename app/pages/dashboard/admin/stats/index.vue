<template>
    <div>
        <DashboardAdminPageHeader
            title="Suivi des liens"
        />
        <DashboardAdminPageContent>
            <DataTable
                :data="dataStats"
                :columns="columns"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="count"
                    @update:page="refresh"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { PERPAGE } from '~/lib/constants';
import { Button } from '@/components/ui/button';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import type { Stat } from '~/lib/types';

useHead({ title: 'Suivi des liens' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { stats, getStats, count } = useStat();
const perPage = ref(PERPAGE);
const page = ref(1);
const initialFilter = {
    name: null,
};
const option = ref({ ...initialFilter });
await getStats(page.value, perPage.value, option.value);
const dataStats = computed(() => stats.value ?? []);

const refresh = async (page: number) => {
    await getStats(page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getStats(page.value, value, option.value);
};

const sort = reactive({
    order: 'DESC',
    by: null,
});

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
};

const columns: ColumnDef<Stat>[] = [
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
        accessorKey: 'web_site_name',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('web_site_name'),
                class: 'flex justify-center items-center w-full',
            }, () => [
                'Nom du site',
                h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
            ]);
        },
        cell: ({ row }) =>
            h('div', { class: 'flex justify-center items-center capitalize text-center' }, row.getValue('web_site_name')),
    },
    {
        accessorKey: 'count',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('count'),
                class: 'flex justify-center items-center w-full',
            }, () => [
                'Nombre de visites',
                h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
            ]);
        },
        cell: ({ row }) =>
            h('div', { class: 'flex justify-center items-center whitespace-pre-wrap text-center' }, row.getValue('count')),
    },
    {
        accessorKey: 'last_count',
        header: () => {
            return h('div', { class: 'text-center flex items-center justify-center gap-1' }, [
                h(Button, {
                    variant: 'ghost',
                    onClick: () => setSort('last_count'),
                    class: 'flex items-center gap-1',
                }, () => [
                    'Création',
                    h(ArrowUpDown, { class: '' }),
                ]),
            ]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, formatRelativeDate(row.getValue('last_count')));
        },
    },
];

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
        await getStats(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);
</script>
