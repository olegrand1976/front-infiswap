<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Des utilisateurs"
            :count="count"
            flex-class="flex gap-2"
        >
            <template
                v-if="!isDeveloper || isManager"
                #action
            >
                <UsersCreateUserButton />
            </template>
        </DashboardAdminPageHeader>
        <DashboardAdminPageContent>
            <div class="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <InputIcon
                    v-model="option.name"
                    label="Nom ou prénom"
                    rounded="md"
                    placeholder="Filtrer par nom ou prénom"
                    class="max-w-sm"
                    @input="debouncedFilterUsers"
                />
                <InputIcon
                    v-model="option.zip"
                    label="Code postal"
                    rounded="md"
                    placeholder="Filtrer par C.P"
                    class="max-w-sm"
                    type="numeric"
                    @input="debouncedFilterUsers"
                />
                <div class="flex flex-col gap-2 max-w-sm">
                    <Label class="text-sm text-gray-500">Type de compte</Label>
                    <Select
                        v-model="option.type"
                        @update:model-value="debouncedFilterUsers"
                    >
                        <SelectTrigger class="w-full rounded-md">
                            <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">
                                    Tous
                                </SelectItem>
                                <SelectItem value="nurse">
                                    Infirmière
                                </SelectItem>
                                <SelectItem value="institution">
                                    Institution
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Button
                        class="rounded-md"
                        @click="resetFilter"
                    >
                        <RefreshCw class="md:mr-2" />
                        <span class="hidden md:inline-block">Restaurer</span>
                    </Button>
                </div>
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
import { ArrowUpDown, RefreshCw, XCircle } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { formatInamiNumber, formatPhoneNumber } from '~/lib/utils';
import type { User } from '~/lib/types';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { PERPAGE } from '~/lib/constants';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import ConfirmDialog from '~/components/ui/alert-dialog/ConfirmDialog.vue';
import { Switch } from '~/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

useHead({ title: 'Utilisateurs' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
const { users, isSuperAdmin, isManager, isDeveloper, count, getUsers, softDelete, resendEmailVerification, validate, edit, isCollaborator } = useAuth();
const pageCookie = useCookie<number>('admin_users_page');
const perPageCookie = useCookie<number>('admin_users_per_page');
const page = ref(pageCookie.value || 1);
const perPage = ref(perPageCookie.value || PERPAGE);

const initialFilter = {
    name: null,
    zip: null,
    type: 'all',
};

const buildFilterParams = (extra = {}) => {
    const params = { ...option.value, sortOrder: sort.order, sortKey: sort.by, ...extra };
    if (!params.type || params.type === 'all') {
        delete params.type;
    }
    return params;
};
const selectedUser = ref<User>(null);
const { $toast } = useNuxtApp();
const option = ref({ ...initialFilter });
const sort = reactive({
    order: 'DESC',
    by: null,
});
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
    await getUsers(page.value, perPage.value, buildFilterParams());
};
watch(page, (value) => {
    pageCookie.value = value;
});

watch(perPage, (value) => {
    perPageCookie.value = value;
});
const debouncedFilterUsers = debounce(filterUsers, 100);

await getUsers(page.value, perPage.value, buildFilterParams());

const dataUsers = computed(() => users.value?.data ?? []);

const refreshUsers = async (newPage: number) => {
    page.value = newPage;
    await getUsers(newPage, perPage.value, buildFilterParams());
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getUsers(page.value, value, buildFilterParams());
};

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(initialFilter);
    if (isSame) {
        return;
    }

    option.value = { ...initialFilter };
    page.value = 1;
    pageCookie.value = 1;
    await getUsers(page.value, perPage.value, buildFilterParams());
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
            }, () => ['Nom', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('full_name')),
    },
    {
        accessorKey: 'email',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('email'),
            }, () => ['Email', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            const isVerified = row.original.email_verified_at !== null;

            return h('div', { class: 'flex items-center gap-2 lowercase' }, [
                h('span', row.getValue('email')),
                !isVerified && canManageValidation.value
                    ? [
                            h(XCircle, {
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
        accessorKey: 'type',
        header: 'Compte',
        cell: ({ row }) => {
            const type = row.getValue('type') as string;
            const label = type === 'institution' ? 'Institution' : 'Infirmière';

            return h('div', { class: 'text-center capitalize' }, label);
        },
        enableSorting: false,
    },
    {
        id: 'institution',
        header: 'Institution',
        cell: ({ row }) => {
            const user = row.original as User;
            const name = user.institution?.name ?? null;

            return h('div', { class: 'text-center' }, name ?? '—');
        },
        enableSorting: false,
    },
    {
        accessorKey: 'identifier_number',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('identifier_number'),
            }, () => ['INAMI', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'lowercase text-center' }, formatInamiNumber(row.getValue('identifier_number'))),
    },
    {
        accessorKey: 'phone_number',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('phone_number'),
            }, () => ['Téléphone', h(ArrowUpDown, { class: '' })]);
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
            }, () => ['Rue', h(ArrowUpDown, { class: '' })]);
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
            }, () => ['Ville', h(ArrowUpDown, { class: '' })]);
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
            }, () => ['C.P', h(ArrowUpDown, { class: '' })]);
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
            }, () => ['Préférences', h(ArrowUpDown, { class: '' })]);
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
            }, () => ['Création', h(ArrowUpDown, { class: '' })]);
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
    async () => {
        await getUsers(page.value, perPage.value, buildFilterParams());
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
