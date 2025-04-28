<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Des utilisateurs">
            <template #action>
                <UsersCreateUserButton />
            </template>
        </DashboardAdminPageHeader>
        <DashboardAdminPageContent>
            <DataTable
                :data="dataUsers"
                :columns="columns"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="users.total"
                    @update:page="refreshUsers"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import { XCircleIcon, ArrowsUpDownIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import { formatInamiNumber, formatPhoneNumber } from '~/lib/utils';
import type { User } from '~/lib/types';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { PERPAGE } from '~/lib/constants';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import ConfirmDialog from '~/components/ui/alert-dialog/ConfirmDialog.vue';

useHead({ title: 'Utilisateurs' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
const { users, getUsers, forceDelete, resendEmailVerification, validate } = useAuth();

const perPage = ref(PERPAGE);
const page = ref(1);
await getUsers(page.value, perPage.value);

const dataUsers = computed(() => users.value?.data ?? []);

const refreshUsers = async (page: number) => {
    await getUsers(page, perPage.value);
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getUsers(page.value, value);
};

const columns: ColumnDef<User>[] = [
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
        accessorKey: 'full_name',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Nom', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('full_name')),
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Email', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            const isVerified = row.original.email_verified_at !== null;

            return h('div', { class: 'flex items-center gap-2 lowercase' }, [
                h('span', row.getValue('email')),
                isVerified
                    ? h('div', { class: '' })
                    : [
                            h(XCircleIcon, {
                                class: 'w-4 h-4 text-red-500 cursor-pointer',
                                title: 'Renvoyer le mail de vérification',
                                onClick: () => resendEmailVerification(row.original.email),
                            }),
                            h(ConfirmDialog, {
                                title: 'Valider l\'email',
                                description: 'Veux-tu valider cet email manuellement ?',
                                onConfirm: () => validateEmail(row.original.id),
                                cancelText: 'Non',
                                confirmText: 'Oui, valider',
                            }, {
                                trigger: () =>
                                    h(Button, {
                                        variant: 'success',
                                        size: 'sm',
                                        class: 'h-6 text-xs',
                                    }, 'Valider'),
                            }),
                        ],
            ]);
        },
    },
    {
        accessorKey: 'identifier_number',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['INAMI', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'lowercase text-center' }, formatInamiNumber(row.getValue('identifier_number'))),
    },
    {
        accessorKey: 'phone_number',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Téléphone', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, formatPhoneNumber(row.getValue('phone_number')));
        },
    },
    {
        accessorKey: 'street_address',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Rue', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('street_address'));
        },
    },
    {
        accessorKey: 'city',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Ville', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('city'));
        },
    },
    {
        accessorKey: 'zip_code',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['C.P', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('zip_code'));
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
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
            const user = row.original;
            const actions = [
                {
                    label: 'Modifier',
                    onClick: () => handleEdit(user),
                },
                {
                    label: 'Supprimer',
                    confirm: true,
                    onClick: () => handleDelete(user),
                },
            ];

            if (user.email_verified_at == null) {
                actions.push({
                    label: 'Renvoie mail',
                    onClick: () => resendEmailVerification(user.email),
                });
            }

            return h('div', { class: 'flex justify-center' }, [
                h(DropdownMenuAction, {
                    actions: actions,
                }),
            ]);
        },
    },

];

const handleEdit = (user: User) => {
    navigateTo(`/dashboard/admin/users/${user.id}`);
};

const handleDelete = async (user: User) => {
    return await forceDelete(user.id).then(async () => {
        await getUsers(page.value, perPage.value);
    });
};

const validateEmail = async (id: number) => {
    const response = await validate(id);

    users.value.data = users.value.data.map(user =>
        user.id === id ? { ...user, email_verified_at: response.email_verified_at } : user,
    );
};
</script>
