<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Gestion des institutions">
            <template #action>
                <Button
                    class="rounded"
                    href="/dashboard/admin/institutions/create"
                >
                    <CirclePlus />
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
                    <RefreshCw class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>

            <div
                v-if="loading"
                class="flex justify-center items-center py-12"
            >
                <RollingLoader :loading="loading" />
            </div>
            <DataTable
                v-else
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
import { ArrowUpDown, CirclePlus, Pencil, RefreshCw, Star, Trash2 } from 'lucide-vue-next';

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { PERPAGE } from '~/lib/constants';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import type { Institution } from '~/lib/types';
import RollingLoader from '~/components/RollingLoader.vue';

useHead({ title: 'Gestion des institutions' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { institutions, getInstitutions, count, forceDelete, updateStatus, loading } = useInstitutions();
const { isSuperAdmin } = useAuth();

// ============ AJOUT DES COOKIES ============
const pageCookie = useCookie<number>('institutions_page', {
    default: () => 1,
    maxAge: 60 * 60 * 24 * 7 // 7 jours
});

const perPageCookie = useCookie<number>('institutions_per_page', {
    default: () => PERPAGE,
    maxAge: 60 * 60 * 24 * 7
});

const filterCookie = useCookie<string>('institutions_filter', {
    default: () => '',
    maxAge: 60 * 60 * 24 * 7
});

const sortByCookie = useCookie<string>('institutions_sort_by', {
    default: () => 'name',
    maxAge: 60 * 60 * 24 * 7
});

const sortOrderCookie = useCookie<'ASC' | 'DESC'>('institutions_sort_order', {
    default: () => 'ASC',
    maxAge: 60 * 60 * 24 * 7
});
const perPage = ref(perPageCookie.value);
const page = ref(pageCookie.value);

const initialFilter = { name: filterCookie.value };
const option = ref({ ...initialFilter });

const sort = reactive<{ order: 'ASC' | 'DESC'; by: string | null }>({
    order: sortOrderCookie.value,
    by: sortByCookie.value,
});

onMounted(async () => {
    await getInstitutions(page.value, perPage.value, {
        ...option.value,
        sortKey: sort.by,
        sortOrder: sort.order,
    });
});

const dataInstitutions = computed(() => institutions.value ?? []);

const refreshInstitutions = async (newPage: number) => {
    page.value = newPage;
    pageCookie.value = newPage;
    await getInstitutions(newPage, perPage.value, {
        ...option.value,
        sortKey: sort.by,
        sortOrder: sort.order,
    });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    perPageCookie.value = value; 
    page.value = 1;
    pageCookie.value = 1;
    await getInstitutions(page.value, value, {
        ...option.value,
        sortKey: sort.by,
        sortOrder: sort.order,
    });
};

const resetFilter = async () => {
    option.value = { name: '' };
    filterCookie.value = ''; // Sauvegarder le filtre vide
    
    sort.by = 'name';
    sort.order = 'ASC';
    sortByCookie.value = 'name';
    sortOrderCookie.value = 'ASC';
    
    page.value = 1;
    pageCookie.value = 1;
    
    await getInstitutions(1, perPage.value, {
        sortKey: sort.by,
        sortOrder: sort.order,
    });
};


let debounceTimer: ReturnType<typeof setTimeout>;
const debouncedFilter = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        page.value = 1;
        pageCookie.value = 1;
        filterCookie.value = option.value.name;
        await getInstitutions(1, perPage.value, {
            ...option.value,
            sortKey: sort.by,
            sortOrder: sort.order,
        });
    }, 350);
};

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
    sortOrderCookie.value = sort.order;
};

const setSort = (columnKey: string) => {
    if (sort.by === columnKey) {
        toggleSort();
    }
    else {
        sort.by = columnKey;
        sort.order = 'ASC';
        sortByCookie.value = columnKey;
        sortOrderCookie.value = 'ASC';
    }
};

watch(
    () => sort,
    async (newVal) => {
        sortByCookie.value = newVal.by as string;
        sortOrderCookie.value = newVal.order;
        
        await getInstitutions(page.value, perPage.value, {
            ...option.value,
            sortKey: newVal.by,
            sortOrder: newVal.order,
        });
    },
    { deep: true },
);

const handleEdit = (institution: Institution) => {
    navigateTo(`/dashboard/admin/institutions/${institution.id}/show`);
};

const handleDelete = async (institution: Institution) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette institution ?')) {
        await forceDelete(institution.id);
        await getInstitutions(page.value, perPage.value, {
            ...option.value,
            sortKey: sort.by,
            sortOrder: sort.order,
        });
    }
};

const handleStatusChange = async (institution: Institution, newStatus: 'pending' | 'active' | 'rejected') => {
    try {
        await updateStatus(institution.id, newStatus);
        await getInstitutions(page.value, perPage.value, {
            ...option.value,
            sortKey: sort.by,
            sortOrder: sort.order,
        });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
    }
};

const getStatusLabel = (status: string | null | undefined) => {
    switch (status) {
        case 'active':
            return 'Active';
        case 'pending':
            return 'En attente';
        case 'rejected':
            return 'Rejetée';
        default:
            return '—';
    }
};

const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'rejected':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
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
                'Nom de l\'institution',
                h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
            ]),
        cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name') || '—'),
    },
    {
        accessorKey: 'company_number',
        header: () => h('div', { class: 'text-center' }, 'Numéro d\'entreprise'),
        cell: ({ row }) => {
            const institution = row.original;
            return h('div', { class: 'text-center text-sm' }, institution.company_number || '—');
        },
    },
    {
        id: 'status',
        header: () => h('div', { class: 'text-center' }, 'Statut'),
        cell: ({ row }) => {
            const institution = row.original;
            const currentStatus = institution.status || 'pending';

            return h('div', { class: 'flex justify-center' }, [
                h('select', {
                    value: currentStatus,
                    class: `px-3 py-1.5 rounded-md text-sm font-medium border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusColor(currentStatus)}`,
                    onChange: (e: Event) => {
                        const target = e.target as HTMLSelectElement;
                        handleStatusChange(institution, target.value as 'pending' | 'active' | 'rejected');
                    },
                }, [
                    h('option', { value: 'pending' }, 'En attente'),
                    h('option', { value: 'active' }, 'Active'),
                    h('option', { value: 'rejected' }, 'Rejetée'),
                ]),
            ]);
        },
    },
    {
        id: 'contact',
        header: () => h('div', { class: 'text-center' }, 'Contact'),
        cell: ({ row }) => {
            const institution = row.original;
            const contact = institution.contact;
            if (!contact) return h('div', { class: 'text-center text-sm' }, '—');

            const fullName = [contact.firstname, contact.lastname].filter(Boolean).join(' ') || '—';
            return h('div', { class: 'text-sm' }, [
                h('div', { class: 'font-medium' }, fullName),
                h('div', { class: 'text-gray-500 text-xs mt-1' }, contact.email || '—'),
            ]);
        },
    },
    {
        id: 'phone',
        header: () => h('div', { class: 'text-center' }, 'Téléphone'),
        cell: ({ row }) => {
            const institution = row.original;
            const phone = institution.contact?.phone_number;
            return h('div', { class: 'text-center text-sm' }, phone || '—');
        },
    },
    {
        id: 'address',
        header: () => h('div', { class: 'text-center' }, 'Adresse'),
        cell: ({ row }) => {
            const institution = row.original;
            const address = institution.address;
            if (!address || (!address.street_address && !address.city && !address.zip_code)) {
                return h('div', { class: 'text-center text-sm' }, '—');
            }

            const parts = [
                address.street_address,
                address.zip_code ? `${address.zip_code} ${address.city || ''}`.trim() : address.city,
                address.country,
            ].filter(Boolean);

            return h('div', { class: 'text-sm' }, parts.join(', ') || '—');
        },
    },
    {
        id: 'actions',
        header: () => h('div', { class: 'mx-2 text-center' }, 'Actions'),
        enableHiding: false,
        cell: ({ row }) => {
            const institution = row.original;

            return h('div', { class: 'flex justify-center items-center gap-2' }, [
                h(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    class: 'w-8 h-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50',
                    onClick: () => handleEdit(institution),
                    title: 'Modifier',
                }, () => h(Pencil, { class: 'w-4 h-4' })),

                isSuperAdmin.value
                    ? h(Button, {
                            variant: 'ghost',
                            size: 'sm',
                            class: 'w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50',
                            onClick: () => handleDelete(institution),
                            title: 'Supprimer',
                        }, () => h(Trash2, { class: 'w-4 h-4' }))
                    : null,
            ]);
        },
    },
];
</script>
