<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Gestion d'accueil"
        >
            <template #action>
                <Button class="rounded">
                    <PlusCircleIcon />
                    <span class="hidden md:inline-block">
                        Nouveau
                    </span>
                </Button>
            </template>
        </DashboardAdminPageHeader>
        <DashboardAdminPageContent>
            <DataTable
                :data="homes.data"
                :columns="columns"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="homes.total"
                    @update:page="refresh"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ArrowsUpDownIcon, PlusCircleIcon } from '@heroicons/vue/24/solid';
import type { ColumnDef } from '@tanstack/vue-table';
import Button from '~/components/ui/button/Button.vue';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { Switch } from '~/components/ui/switch';
import { PERPAGE } from '~/lib/constants';

const { homes, getSpecifiedHome } = useHome();

await getSpecifiedHome();

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

useHead({
    title: 'Paramètre d\'accueil',
});

const perPage = ref(PERPAGE);
const page = ref(1);

const refresh = async (page: number) => {
    return await getSpecifiedHome({ page: page, perPage: perPage.value });
};

const handlePerPageChange = async (perPage: number) => {
    return await getSpecifiedHome({ perPage: perPage });
};

const columns: ColumnDef<HomeType>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
            'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
            'modelValue': row.getIsSelected(),
            'onUpdate:modelValue': value => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: 'Titre',
        cell: ({ row }) => h('div', { class: '' }, row.getValue('title')),
    },
    {
        accessorKey: 'description',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Description', h(ArrowsUpDownIcon, { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => h('div', { class: '' }, row.getValue('description')),
    },
    {
        accessorKey: 'active',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'w-full text-center',
            }, () => ['Status', h(ArrowsUpDownIcon, { class: 'text-center' })]);
        },
        cell: ({ row }) =>
            h(Switch, {
                'class': 'mx-auto',
                'modelValue': row.getValue('active') === 1,
                'onUpdate:modelValue': (value: boolean | number) => {
                    row.original.active = value ? 1 : 0;
                },
            }),
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'text-center w-full',
            }, () => ['Création', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
];
</script>
