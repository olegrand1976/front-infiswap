<template>
    <div>
        <DashboardAdminPageHeader
            title="Gestion des produits"
        >
            <template #action>
                <Button
                    class="rounded"
                    href="/dashboard/admin/products/create"
                >
                    <PlusCircleIcon />
                    <span class="hidden md:inline-block">
                        Nouveau
                    </span>
                </Button>
            </template>
        </DashboardAdminPageHeader>
        <DashboardAdminPageContent>
            <DataTable
                :data="dataProducts"
                :columns="columns"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="count"
                    @update:page="refreshProducts"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { ArrowsUpDownIcon, PlusCircleIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { PERPAGE } from '~/lib/constants';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import type { Product } from '~/lib/types';

useHead({ title: 'Gestion des produits' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { products, getProducts, count, softDelete } = useProduct();
const perPage = ref(PERPAGE);
const page = ref(1);
const initialFilter = {
    name: null,
};
const option = ref({ ...initialFilter });
await getProducts(page.value, perPage.value, option.value);
const dataProducts = computed(() => products.value ?? []);

const refreshProducts = async (page: number) => {
    await getProducts(page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getProducts(page.value, value, option.value);
};

const columns: ColumnDef<Product>[] = [
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
        accessorKey: 'name',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('name'),
            }, () => ['Nom', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
    },
    {
        accessorKey: 'description',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('description'),
            }, () => ['Description', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'whitespace-pre-wrap' }, row.getValue('description')),
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_at'),
            }, () => ['Création', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'actions',
        header: () => {
            return h('div', { class: 'mx-2' }, 'Actions');
        },
        enableHiding: false,
        cell: ({ row }) => {
            const product = row.original;
            const actions = [
                {
                    label: 'Modifier',
                    onClick: () => handleEdit(product),
                },
                {
                    label: 'Supprimer',
                    confirm: true,
                    onClick: () => handleDelete(product),
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
        await getProducts(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);

const handleEdit = (product: Product) => {
    navigateTo(`/dashboard/admin/products/${product.id}`);
};

const handleDelete = async (product: Product) => {
    return await softDelete(product.id).then(async () => {
        await getProducts(page.value, perPage.value);
    });
};
</script>
