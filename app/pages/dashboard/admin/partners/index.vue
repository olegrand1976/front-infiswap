<template>
    <div class="w-full min-w-0">
        <DashboardAdminPageHeader
            title="Des binômes"
            :count="count"
        />

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
                    @click="resetFilter"
                >
                    <RefreshCw class="md:mr-2" />
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
                    @update:page="refreshDemand"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown, ChevronsUpDown, Eye, RefreshCw, Star } from 'lucide-vue-next';

import type { ColumnDef } from '@tanstack/vue-table';
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

const { fetchDemandPartners, demandPartners, forceDelete, updatePartnership, count } = usePartners();

const { $toast } = useNuxtApp();
const pageCookie = useCookie<number>('partners_page');
const perPageCookie = useCookie<number>('partners_per_page');

const page = ref(pageCookie.value || 1);
const perPage = ref(perPageCookie.value || PERPAGE);

const { isSuperAdmin } = useAuth();

const initialFilter = {
    zip: null,
    city: null,
    type: 'admin',
};

watch(page, (value) => {
    pageCookie.value = value;
});

watch(perPage, (value) => {
    perPageCookie.value = value;
});

const option = ref({ ...initialFilter });

await fetchDemandPartners(page.value, perPage.value, option.value);
const dataPartners = computed(() => demandPartners.value.data ?? []);

// const typePartnership = {
//     in_search: 'Recherche',
//     available: 'Disponible',
// };

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

const refreshDemand = async (pge: number) => {
    page.value = pge;
    await filterPartnerships();
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    page.value = 1;
    await filterPartnerships();
};

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(initialFilter);
    if (isSame) {
        return;
    }

    option.value = { ...initialFilter };
    page.value = 1;
    pageCookie.value = 1;
    await fetchDemandPartners(
        page.value,
        perPage.value,
        {
            zip_code: option.value.zip,
            city: option.value.city,
            type: option.value.type,
        });
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
    // {
    //     id: 'type',
    //     accessorFn: row => row.type,
    //     header: ({ column }) =>
    //         h(Button, {
    //             variant: 'ghost',
    //             onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    //         }, () => ['Type', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    //     cell: ({ row }) => {
    //         const type = typePartnership[row.original.type];
    //         return h('div', { class: 'ml-4' }, type);
    //     },
    // },
    {
        id: 'zip_code',
        accessorFn: row => row.user.zip_code,
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Code postal', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const zipCode = Number(row.original.user.zip_code);
            const isClosed = row.original.status === 'closed';

            return h('div', { class: 'relative ml-8 flex items-center' }, [
                isClosed && h(
                    'span',
                    {
                        class: `
                        absolute -top-4 -left-10
                        bg-primary rounded-md text-white
                        text-xs px-2 py-0.5
                        font-semibold
                        shadow
                        z-10 animate-pulse
                    `,
                    },
                    'FERMÉ',
                ),

                h('span', zipCode.toString()),
            ]);
        },
        sortingFn: 'alphanumeric',
    },
    {
        id: 'city',
        accessorFn: row => row.user.city,
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Ville', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const city = row.original.user.city;
            return h('div', { class: 'ml-4' }, city);
        },
    },
    {
        id: 'creator',
        accessorFn: row => row.user,
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Créateur', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const user = row.original.user;
            return h(UsersName, { user });
        },
        sortingFn: (rowA, rowB, columnId) => {
            const userA = rowA.getValue(columnId) as { firstname?: string; lastname?: string } | null;
            const userB = rowB.getValue(columnId) as { firstname?: string; lastname?: string } | null;

            const nameA = userA ? `${userA.firstname ?? ''} ${userA.lastname ?? ''}`.toLowerCase() : '';
            const nameB = userB ? `${userB.firstname ?? ''} ${userB.lastname ?? ''}`.toLowerCase() : '';

            return nameA.localeCompare(nameB);
        },
    },
    {
        id: 'partner',
        accessorFn: row => row.partner,
        header: ({ column }) =>
            h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Partenaire', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const user = row.original.partner;

            if (!user) {
                return h('span', { class: 'italic text-gray-400' }, ' ');
            }

            return h(UsersName, { user });
        },
        sortingFn: (rowA, rowB, columnId) => {
            const userA = rowA.getValue(columnId) as { firstname?: string; lastname?: string } | null;
            const userB = rowB.getValue(columnId) as { firstname?: string; lastname?: string } | null;

            const nameA = userA ? `${userA.firstname ?? ''} ${userA.lastname ?? ''}`.toLowerCase() : '';
            const nameB = userB ? `${userB.firstname ?? ''} ${userB.lastname ?? ''}`.toLowerCase() : '';

            return nameA.localeCompare(nameB);
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
                }, () => h(Eye, { class: 'h-4 w-4 ml-1' })),
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
            }, () => ['Intéressés', h(ChevronsUpDown, { class: 'ml-2 h-2 w-2' })]),
        cell: ({ row }) => {
            const users = row.original.responses_count ?? 0;
            const id = row.original.id;

            return h(
                NuxtLink,
                {
                    to: `/dashboard/admin/partners/interest/${id}`,
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
        header: ({ column }) => {
            return h('div', { class: 'flex items-center justify-center gap-1' }, [
                h(Button, {
                    variant: 'ghost',
                    class: 'flex items-center justify-center gap-1',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                }, () => [
                    'Création',
                    h(ArrowUpDown, { class: '' }),
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
            const partnership = row.original;
            const actions = [
                {
                    label: 'Modifier',
                    onClick: () => handleEdit(partnership),
                },
                {
                    label: partnership.status == 'open' ? 'Fermer' : 'Ouvrir',
                    onClick: () => partnership.status == 'open' ? handleOpenOrClose(partnership, 'closed') : handleOpenOrClose(partnership, 'open'),
                },
                ...(isSuperAdmin.value
                    ? [
                            {
                                label: 'Supprimer',
                                confirm: true,
                                onClick: () => handleDelete(partnership),
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

const sort = reactive({
    order: 'DESC',
    by: null,
});

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        await fetchDemandPartners(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by,
            type: 'admin',
        },
        );
    },
    { deep: true },
);

const handleEdit = (userPartner: UserPartner) => {
    navigateTo(`/dashboard/admin/partners/${userPartner.id}`);
};

const handleOpenOrClose = async (
    partnership: UserPartner,
    status: 'open' | 'closed',
) => {
    try {
        await updatePartnership({ ...partnership, status });

        demandPartners.value.data = demandPartners.value.data.map(p =>
            p.id === partnership.id
                ? { ...p, status }
                : p,
        );

        $toast({
            description:
                status === 'closed'
                    ? 'Demande fermée avec succès'
                    : 'Demande ouverte avec succès',
        });
    }
    catch {
        $toast({
            variant: 'destructive',
            description:
                status === 'closed'
                    ? 'Une erreur est survenue lors de la fermeture'
                    : 'Une erreur est survenue lors de l’ouverture',
        });
    }
};

const handleDelete = async (partnership: UserPartner) => {
    await forceDelete(partnership.id).then(() => {
        demandPartners.value.data = demandPartners.value.data.filter(
            p => p.id !== partnership.id,
        );
    });
};
</script>
