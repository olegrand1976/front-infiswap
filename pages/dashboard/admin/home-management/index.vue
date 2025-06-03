<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Gestion d'accueil"
        >
            <template #action>
                <Button
                    class="rounded"
                    href="/dashboard/admin/home-management/create"
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
import { ArrowsUpDownIcon, PlusCircleIcon, EyeIcon } from '@heroicons/vue/24/solid';
import type { ColumnDef } from '@tanstack/vue-table';
import Button from '~/components/ui/button/Button.vue';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { Switch } from '~/components/ui/switch';
import { PERPAGE } from '~/lib/constants';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import type { HomeType } from '~/lib/types';

const { homes, getSpecifiedHome, edit } = useHome();

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

const selectedDescription = ref('');
const showDialog = ref(false);

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
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Description', h(ArrowsUpDownIcon, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            let fullDescription = row.getValue('description');

            if (typeof fullDescription === 'string') {
                fullDescription = fullDescription.replace(/\\r\\n|\\n/g, '\n');
            }

            const shortDescription = fullDescription.length > 50
                ? fullDescription.slice(0, 50) + '...'
                : fullDescription;

            return h('div', { class: 'flex items-center justify-between gap-2' }, [
                h('span', shortDescription),
                h(Dialog, {}, {
                    default: () => [
                        h(DialogTrigger, {
                            onClick: () => {
                                selectedDescription.value = fullDescription;
                                showDialog.value = true;
                            },
                            class: 'text-gray-600 hover:text-black cursor-pointer',
                        }, () => [h(EyeIcon, { class: 'w-4 h-4' })]),

                        showDialog.value && h(DialogContent, {}, {
                            default: () => [
                                h('h3', { class: 'font-semibold mb-2' }, 'Description complète'),
                                h('p', {
                                    class: 'text-sm text-gray-700 whitespace-pre-wrap',
                                }, fullDescription),
                            ],
                        }),
                    ],
                }),
            ]);
        },
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
        cell: ({ row }) => {
            const toggle = async (value: boolean) => {
                const index = homes.value.data.findIndex(item => item.id === row.original.id);
                if (index !== -1) {
                    homes.value.data[index].active = value ? 1 : 0;
                }

                await edit(Number(row.original.id), { active: homes.value.data[index].active == 1 });
            };

            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': row.original.active === 1,
                    'onUpdate:checked': toggle,
                }),
            ]);
        },
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
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
            const home = row.original;
            const actions = [
                {
                    label: 'Modifier',
                    onClick: () => handleEdit(home),
                },
                // {
                //     label: 'Supprimer',
                //     confirm: true,
                //     onClick: () => handleDelete(home),
                // },
            ];

            return h('div', { class: 'flex justify-center' }, [
                h(DropdownMenuAction, {
                    actions: actions,
                }),
            ]);
        },
    },
];

const handleEdit = (home: HomeType) => {
    navigateTo(`/dashboard/admin/home-management/${home.id}`);
};

// const handleDelete = async (home: HomeType) => {
//     await forceDelete(home.id);
//     await getSpecifiedHome();
// };
</script>
