<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Des binômes" />

        <DashboardAdminPageContent>
            <div class="p-4 flex gap-3 items-center overflow-x-auto pb-3 px-4 scrollbar-hide mb-4">
                <InputIcon
                    v-model="option.zip"
                    rounded="md"
                    placeholder="Code postal"
                    class="w-[250px]"
                    type="number"
                    @input="debouncedFilterPartnerships"
                />
                <InputIcon
                    v-model="option.city"
                    rounded="md"
                    placeholder="Ville"
                    class="w-[250px]"
                    @input="debouncedFilterPartnerships"
                />
                <Button
                    class="rounded-md"
                >
                    <ArrowPathIcon class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>

            <DataTable
                :data="dataPartners"
                :columns="columns"
            />

            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="demandPartners.meta.total"
                    @update:page="refreshReplacement"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { ArrowPathIcon, ArrowsUpDownIcon, ChevronUpDownIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';

import { PERPAGE } from '~/lib/constants';
import { debounce } from '~/lib/utils';
import type { UserPartner } from '~/lib/types';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import AdminDropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import UsersName from '@/components/users/Name.vue';
import { NuxtLink } from '#components';

useHead({ title: 'Gestion des binômes' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { fetchDemandPartners, demandPartners } = usePartners();

const perPage = ref(PERPAGE);
const page = ref(1);
const { isSuperAdmin } = useAuth();

const initialFilter = {
    zip: null,
    city: null,
    type: 'admin',
};

const option = ref({ ...initialFilter });

await fetchDemandPartners(page.value, perPage.value, option.value);
const dataPartners = computed(() => demandPartners.value.data ?? []);

const filterPartnerships = async () => {
    const currentFilter = { ...option.value };

    await fetchDemandPartners(
        page.value,
        perPage.value,
        {
            zip_code: currentFilter.zip,
            city: currentFilter.city,
            type: currentFilter.type,
        });
};

const debouncedFilterPartnerships = debounce(filterPartnerships, 100);

const refreshReplacement = async (pge: number) => {
    page.value = pge;
    await filterPartnerships();
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await filterPartnerships();
};

const columns: ColumnDef<UserPartner>[] = [
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
        accessorKey: 'zip_code',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Code postal', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const zip_code = row.original.user.zip_code;
            return h('div', { class: 'ml-4' }, zip_code);
        },
    },
    {
        accessorKey: 'city',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Ville', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const city = row.original.user.city;
            return h('div', { class: 'ml-4' }, city);
        },
    },
    {
        accessorKey: 'creator',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Créateur', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const user = row.original.user;
            return h(UsersName, { user });
        },
    },
    {
        accessorKey: 'partner',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Partenaire', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const user = row.original.partner;

            if (!user) {
                return h('span', { class: 'italic text-gray-400' }, ' ');
            }

            return h(UsersName, { user });
        },
    },
    {
        id: 'notified_users',
        header: () => h(Button, { variant: 'ghost' }, () => 'Notifiés'),
        cell: ({ row }) => {
            const users = row.original.notified_users || [];
            const displayText = users.map(u => u.full_name).join(', ');
            const userPartnerId = row.original.id;

            return h('div', { class: 'flex items-center text-center' }, [
                h('div', {
                    class: 'ml-2 capitalize truncate max-w-[180px] whitespace-nowrap overflow-hidden',
                    title: displayText,
                }, displayText || '-'),
                users.length > 0
                && h(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => navigateTo(`/dashboard/admin/partners/notified/${userPartnerId}`),
                }, () => h(EyeIcon, { class: 'h-4 w-4 ml-1' })),
            ]);
        },
    },
    {
        id: 'responses_count',
        accessorKey: 'responses_count',
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Intéressés', h(ChevronUpDownIcon, { class: 'ml-2 h-2 w-2' })]),
        cell: ({ row }) => {
            const users = row.original.responses_count ?? 0;
            const id = row.original.id;

            return h(
                NuxtLink,
                {
                    to: `/dashboard/admin/replacements/interest/${id}`,
                    class: 'text-blue-600 hover:underline',
                    style: 'display: block; margin-left: 3rem;',
                },
                () => users.toString(),
            );
        },
        sortingFn: 'alphanumeric',
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h('div', { class: 'flex items-center justify-center gap-1' }, [
                h(Button, {
                    variant: 'ghost',
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
        cell: () => {
            const actions = [
                {
                    label: 'Modifier',
                },
                ...(isSuperAdmin.value
                    ? [
                            {
                                label: 'Supprimer',
                                confirm: true,
                            },
                        ]
                    : []),
            ];

            return h('div', { class: 'flex justify-start ml-4' }, [
                h(AdminDropdownMenuAction, {
                    actions: actions,
                }),
            ]);
        },
    },
];
</script>
