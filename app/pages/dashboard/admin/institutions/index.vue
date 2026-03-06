<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Gestion des institutions">
            <template #action>
                <Button
                    class="rounded"
                    href="/dashboard/admin/institutions/create"
                >
                    <PlusCircleIcon />
                    <span class="hidden md:inline-block">Nouvelle</span>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div class="p-4 flex flex-wrap gap-3 items-center">
                <InputIcon
                    v-model="option.name"
                    rounded="md"
                    placeholder="Filtrer par nom"
                    class="max-w-sm"
                    @input="debouncedFilter"
                />
                <Button
                    class="rounded-md"
                    @click="resetFilter"
                >
                    <ArrowPathIcon class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>

            <DataTable
                :data="dataInstitutions"
                :columns="columns"
            />

            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="count"
                    @update:page="refreshInstitutions"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { ArrowsUpDownIcon, PlusCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { PERPAGE } from '~/lib/constants';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import type { Institution } from '~/lib/types';

useHead({ title: 'Gestion des institutions' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { institutions, getInstitutions, count, forceDelete } = useInstitutions();
const { isSuperAdmin } = useAuth();

const perPage = ref(PERPAGE);
const page = ref(1);

const initialFilter = { name: '' };
const option = ref({ ...initialFilter });

onMounted(async () => {
    await getInstitutions(page.value, perPage.value, option.value);
});

const dataInstitutions = computed(() => institutions.value ?? []);

const refreshInstitutions = async (newPage: number) => {
    page.value = newPage;
    await getInstitutions(newPage, perPage.value, {
        ...option.value,
        sortOrder: sort.order,
        sortKey: sort.by,
    });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getInstitutions(page.value, value, option.value);
};

const resetFilter = async () => {
    option.value = { ...initialFilter };
    page.value = 1;
    await getInstitutions(1, perPage.value, {});
};

let debounceTimer: ReturnType<typeof setTimeout>;
const debouncedFilter = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        page.value = 1;
        await getInstitutions(1, perPage.value, option.value);
    }, 350);
};

const sort = reactive<{ order: string; by: string | null }>({
    order: 'DESC',
    by: null,
});

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
};

const setSort = (columnKey: string) => {
    if (sort.by === columnKey) toggleSort();
    else {
        sort.by = columnKey;
        sort.order = 'DESC';
    }
};

watch(
    () => sort,
    async (newVal) => {
        await getInstitutions(page.value, perPage.value, {
            ...option.value,
            sortOrder: newVal.order,
            sortKey: newVal.by,
        });
    },
    { deep: true },
);

const handleEdit = (institution: Institution) => {
    navigateTo(`/dashboard/admin/institutions/${institution.id}`);
};

const handleDelete = async (institution: Institution) => {
    await forceDelete(institution.id);
    await getInstitutions(page.value, perPage.value, option.value);
};

const columns: ColumnDef<Institution>[] = [
    {
        id: 'select',
        header: ({ table }) =>
            h(Checkbox, {
                'checked': table.getIsAllPageRowsSelected()
                    ? true
                    : table.getIsSomePageRowsSelected()
                        ? 'indeterminate'
                        : false,
                'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
                'ariaLabel': 'Select all',
                'class': 'mx-2',
            }),
        cell: ({ row }) =>
            h(Checkbox, {
                'checked': row.getIsSelected(),
                'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
                'ariaLabel': 'Select row',
                'class': 'mx-2',
            }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('name') }, () => [
                'Nom',
                h(ArrowsUpDownIcon, { class: '' }),
            ]),
        cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
    },
    {
        accessorKey: 'services_count',
        header: () => h('div', { class: 'text-center' }, 'Services'),
        cell: ({ row }) =>
            h(
                'div',
                { class: 'text-center' },
                row.getValue('services_count') ?? '—',
            ),
    },
    {
        accessorKey: 'users_count',
        header: () => h('div', { class: 'text-center' }, 'Utilisateurs'),
        cell: ({ row }) =>
            h(
                'div',
                { class: 'text-center' },
                row.getValue('users_count') ?? '—',
            ),
    },
    {
        accessorKey: 'created_at',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('created_at') }, () => [
                'Création',
                h(ArrowsUpDownIcon, { class: '' }),
            ]),
        cell: ({ row }) =>
            h(
                'div',
                { class: 'flex items-center justify-center' },
                formatRelativeDate(row.getValue('created_at')),
            ),
    },
    {
        id: 'actions',
        header: () => h('div', { class: 'mx-2' }, 'Actions'),
        enableHiding: false,
        cell: ({ row }) => {
            const institution = row.original;
            const actions = [
                {
                    label: 'Modifier',
                    onClick: () => handleEdit(institution),
                },
                ...(isSuperAdmin.value
                    ? [
                            {
                                label: 'Supprimer',
                                confirm: true,
                                onClick: () => handleDelete(institution),
                            },
                        ]
                    : []),
            ];
            return h('div', { class: 'flex justify-start ml-4' }, [
                h(DropdownMenuAction, { actions }),
            ]);
        },
    },
];
</script>
