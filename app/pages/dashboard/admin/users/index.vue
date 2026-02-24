<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Des utilisateurs"
            :count="count"
        >
            <template
                v-if="!isDeveloper || isManager"
                #action
            >
                <UsersCreateUserButton />
            </template>
        </DashboardAdminPageHeader>
        <DashboardAdminPageContent>
            <div class="p-4 flex gap-3 items-center">
                <InputIcon
                    v-model="option.name"
                    rounded="md"
                    placeholder="Filtrer par Nom ou Prénom"
                    class="max-w-sm"
                    @input="debouncedFilterUsers"
                />
                <InputIcon
                    v-model="option.zip"
                    rounded="md"
                    placeholder="Filtrer par C.P"
                    class="max-w-sm"
                    type="numeric"
                    @input="debouncedFilterUsers"
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
import { XCircleIcon, ArrowsUpDownIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import { formatInamiNumber, formatPhoneNumber } from '~/lib/utils';
import type { User } from '~/lib/types';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { PERPAGE } from '~/lib/constants';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import ConfirmDialog from '~/components/ui/alert-dialog/ConfirmDialog.vue';
import { Switch } from '~/components/ui/switch';

useHead({ title: 'Utilisateurs' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
const { users, isSuperAdmin, isManager, isDeveloper, count, getUsers, softDelete, resendEmailVerification, validate, edit, isCollaborator } = useAuth();

const perPage = ref(PERPAGE);
const page = ref(1);
const initialFilter = {
    name: null,
    zip: null,
};
const selectedUser = ref<User>(null);
const { $toast } = useNuxtApp();
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

const filterUsers = async () => {
    const currentFilter = { ...option.value };
    await getUsers(page.value, perPage.value, currentFilter);
};

const debouncedFilterUsers = debounce(filterUsers, 100);

await getUsers(page.value, perPage.value, option.value);

const dataUsers = computed(() => users.value?.data ?? []);

const refreshUsers = async (page: number) => {
    await getUsers(page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getUsers(page.value, value, option.value);
};

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(initialFilter);
    if (isSame) {
        return;
    }

    option.value = { ...initialFilter };
    page.value = 1;
    await getUsers(page.value, perPage.value, option.value);
};

const canManageValidation = computed(() =>
    isSuperAdmin.value || isManager.value,
);

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
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('firstname'),
            }, () => ['Nom', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('full_name')),
    },
    {
        accessorKey: 'email',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('email'),
            }, () => ['Email', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            const isVerified = row.original.email_verified_at !== null;

            return h('div', { class: 'flex items-center gap-2 lowercase' }, [
                h('span', row.getValue('email')),
                !isVerified && canManageValidation.value
                    ? [
                            h(XCircleIcon, {
                                class: 'w-4 h-4 text-red-500 cursor-pointer',
                                title: 'Renvoyer le mail de vérification',
                                onClick: () =>
                                    resendEmailVerification(row.original.email),
                            }),
                            h(ConfirmDialog, {
                                title: 'Valider l\'email',
                                description:
                        'Veux-tu valider cet email manuellement ?',
                                onConfirm: () =>
                                    validateEmail(row.original.id),
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
                        ]
                    : null,
            ]);
        },
    },
    {
        accessorKey: 'identifier_number',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('identifier_number'),
            }, () => ['INAMI', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'lowercase text-center' }, formatInamiNumber(row.getValue('identifier_number'))),
    },
    {
        accessorKey: 'phone_number',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('phone_number'),
            }, () => ['Téléphone', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, formatPhoneNumber(row.getValue('phone_number')));
        },
    },
    {
        accessorKey: 'street_address',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('street_address'),
            }, () => ['Rue', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('street_address'));
        },
    },
    {
        accessorKey: 'city',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('city'),
            }, () => ['Ville', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('city'));
        },
    },
    {
        accessorKey: 'zip_code',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('zip_code'),
            }, () => ['C.P', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('zip_code'));
        },
    },
    {
        accessorKey: 'settings',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Préférences', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            const settings = JSON.parse(row.getValue('settings'));
            const zipCodes = settings?.replacement?.zip_codes?.join(', ') || 'Aucun code postal';
            return h('div', { class: 'text-center capitalize truncate whitespace-nowrap overflow-hidden' }, zipCodes);
        },
    },
    {
        accessorKey: 'is_business_referrer',
        header: 'Porteur d\'affaire',
        cell: ({ row }) => {
            const user = row.original as User;

            const toggle = async (value: boolean) => {
                const response = await edit(Number(user.id), { is_business_referrer: value });

                if (response.status === 'Succès') {
                    user.is_business_referrer = value;
                }
            };

            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': !!user.is_business_referrer,
                    'onUpdate:checked': toggle,
                    'disabled': isCollaborator.value,
                }),
            ]);
        },
        enableSorting: false,
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
            const user = row.original;
            const actions = [
                ...(!isDeveloper.value || !isManager.value
                    ? [
                            {
                                label: 'Modifier',
                                onClick: () => handleEdit(user),
                            },
                        ]
                    : []),
                ...(isSuperAdmin.value
                    ? [
                            {
                                label: 'Supprimer',
                                confirm: true,
                                onClick: () => handleDelete(user),
                            },
                        ]
                    : []),
            ];

            if (user.email_verified_at === null && isSuperAdmin.value) {
                actions.push({
                    label: 'Renvoi mail',
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
        await getUsers(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);

const handleEdit = (user: User) => {
    navigateTo(`/dashboard/admin/users/${user.id}`);
};

const handleDelete = async (user: User) => {
    selectedUser.value = user;

    return await softDelete(selectedUser.value.id).then(async () => {
        $toast({
            description: 'Utilisateur supprimé avec succès',
        });

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
