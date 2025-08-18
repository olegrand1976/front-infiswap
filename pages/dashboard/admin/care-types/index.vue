<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Gestion des types de soins"
        >
            <template #action>
                <Button
                    class="rounded"
                    href="/dashboard/admin/care-types/create"
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
                :data="dataCareTypes"
                :columns="columns"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="count"
                    @update:page="refreshCareTypes"
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
import type { CareType } from '~/lib/types';

useHead({ title: 'Gestion des type de soins' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { careTypes, getCareTypes, count, forceDelete } = useCareTypes();
const { isSaleRepresentative } = useAuth();
const perPage = ref(PERPAGE);
const page = ref(1);
const initialFilter = {
    name: null,
};
const option = ref({ ...initialFilter });

await getCareTypes(page.value, perPage.value, option.value);
const dataCareTypes = computed(() => careTypes.value ?? []);

const refreshCareTypes = async (page: number) => {
    await getCareTypes(page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getCareTypes(page.value, value, option.value);
};

const columns: ColumnDef<CareType>[] = [
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
        accessorKey: 'duration',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('duration'),
            }, () => ['Durée', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('duration'));
        },
    },
    {
        accessorKey: 'price',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('price'),
            }, () => ['Prix', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('price'));
        },
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h('div', { class: 'flex items-center justify-center gap-1' }, [
                h(Button, {
                    variant: 'ghost',
                    onClick: () => setSort('created_at'),
                    class: 'flex items-center justify-center gap-1',
                }, () => [
                    'Création',
                    h(ArrowsUpDownIcon, { class: '' }),
                ]),
            ]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center justify-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'actions',
        header: () => {
            return h('div', { class: 'mx-2' }, 'Actions');
        },
        enableHiding: false,
        cell: ({ row }) => {
            const careType = row.original;
            const actions = [
                {
                    label: 'Modifier',
                    onClick: () => handleEdit(careType),
                },
                ...(!isSaleRepresentative.value
                    ? [
                            {
                                label: 'Supprimer',
                                confirm: true,
                                onClick: () => handleDelete(careType),
                            },
                        ]
                    : []),
            ];

            return h('div', { class: 'flex justify-start ml-4' }, [
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
        await getCareTypes(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);

const handleEdit = (careType: CareType) => {
    navigateTo(`/dashboard/admin/care-types/${careType.id}`);
};

const handleDelete = async (careType: CareType) => {
    return await forceDelete(careType.id).then(async () => {
        await getCareTypes(page.value, perPage.value);
    });
};
</script>
