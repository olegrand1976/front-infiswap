<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            as="div"
            title="Gestion des institutions"
        >
            <template #action>
                <div class="flex gap-2">
                    <Button
                        v-if="canImportInstitutions"
                        class="rounded"
                        variant="outline"
                        @click="importDialogOpen = true"
                    >
                        <Upload />
                        <span class="hidden md:inline-block">Importer</span>
                    </Button>
                    <Button
                        class="rounded"
                        href="/dashboard/admin/institutions/create"
                    >
                        <CirclePlus />
                        <span class="hidden md:inline-block">Nouvelle</span>
                    </Button>
                </div>
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
                <Select
                    v-model="option.registration_source"
                    @update:model-value="onRegistrationSourceChange"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Source</span>
                        <strong class="ml-4">{{ registrationSourceLabel }}</strong>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">
                                Tous
                            </SelectItem>
                            <SelectItem value="site">
                                Site
                            </SelectItem>
                            <SelectItem value="file">
                                Fichier
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
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

        <AlertDialog v-model:open="deleteDialogOpen">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                    <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer l'institution « {{ institutionToDelete?.name }} » ? Elle sera masquée de la liste (suppression logique).
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                        class="rounded"
                        variant="destructive"
                        :disabled="deleting"
                        @click="confirmDelete"
                    >
                        Supprimer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <Dialog v-model:open="importDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Importer des institutions</DialogTitle>
                    <DialogDescription>
                        Fichier Excel (.xlsx) avec les colonnes Nom, Ville, Email, Téléphone, Adresse, Code postal.
                    </DialogDescription>
                </DialogHeader>
                <FileUpload
                    accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    :max-size="10 * 1024 * 1024"
                    @update:model-value="importFile = $event"
                />
                <DialogFooter>
                    <Button
                        variant="outline"
                        class="rounded-md"
                        @click="importDialogOpen = false"
                    >
                        Annuler
                    </Button>
                    <Button
                        class="rounded-md"
                        :disabled="!importFile || importing"
                        @click="handleImport"
                    >
                        {{ importing ? 'Import en cours…' : 'Importer' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown, CirclePlus, RefreshCw, Trash2, Upload, Pencil } from 'lucide-vue-next';
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { PERPAGE } from '~/lib/constants';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import type { Institution } from '~/lib/types';
import RollingLoader from '~/components/RollingLoader.vue';
import FileUpload from '~/components/ui/file-upload/FileUpload.vue';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/components/ui/select';
import { formatToDMY } from '@/composables/useDate';

useHead({ title: 'Gestion des institutions' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { institutions, getInstitutions, count, forceDelete, updateStatus, importInstitutions, loading } = useInstitutions();
const { isSuperAdmin, isAdmin } = useAuth();

const canImportInstitutions = computed(() => isSuperAdmin.value || isAdmin.value);

const isImportProspect = (institution: Institution): boolean =>
    institution.registration_source === 'file' && !institution.contact;

const canDeleteInstitution = (institution: Institution): boolean => {
    if (isSuperAdmin.value) {
        return true;
    }

    return isAdmin.value && isImportProspect(institution);
};

// ============ AJOUT DES COOKIES ============
const pageCookie = useCookie<number>('institutions_page', {
    default: () => 1,
    maxAge: 60 * 60 * 24 * 7, // 7 jours
});

const perPageCookie = useCookie<number>('institutions_per_page', {
    default: () => PERPAGE,
    maxAge: 60 * 60 * 24 * 7,
});

const filterCookie = useCookie<string>('institutions_filter', {
    default: () => '',
    maxAge: 60 * 60 * 24 * 7,
});

const sortByCookie = useCookie<string>('institutions_sort_by', {
    default: () => 'name',
    maxAge: 60 * 60 * 24 * 7,
});

const sortOrderCookie = useCookie<'ASC' | 'DESC'>('institutions_sort_order', {
    default: () => 'ASC',
    maxAge: 60 * 60 * 24 * 7,
});

const registrationSourceCookie = useCookie<string>('institutions_registration_source', {
    default: () => 'all',
    maxAge: 60 * 60 * 24 * 7,
});

const importDialogOpen = ref(false);
const importFile = ref<File | null>(null);
const importing = ref(false);
const perPage = ref(perPageCookie.value);
const page = ref(pageCookie.value);

const initialFilter = {
    name: filterCookie.value,
    registration_source: registrationSourceCookie.value as 'all' | 'site' | 'file',
};
const option = ref({ ...initialFilter });

const registrationSourceLabel = computed(() => {
    switch (option.value.registration_source) {
        case 'site':
            return 'Site';
        case 'file':
            return 'Fichier';
        default:
            return 'Tous';
    }
});

function buildListOptions() {
    const params: Record<string, unknown> = {
        ...option.value,
        sortKey: sort.by,
        sortOrder: sort.order,
    };

    if (params.registration_source === 'all') {
        delete params.registration_source;
    }

    return params;
}

const sort = reactive<{ order: 'ASC' | 'DESC'; by: string | null }>({
    order: sortOrderCookie.value,
    by: sortByCookie.value,
});

onMounted(async () => {
    await getInstitutions(page.value, perPage.value, buildListOptions());
});

const dataInstitutions = computed(() => institutions.value ?? []);

const refreshInstitutions = async (newPage: number) => {
    page.value = newPage;
    pageCookie.value = newPage;
    await getInstitutions(newPage, perPage.value, buildListOptions());
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    perPageCookie.value = value;
    page.value = 1;
    pageCookie.value = 1;
    await getInstitutions(page.value, value, buildListOptions());
};

const resetFilter = async () => {
    option.value = { name: '', registration_source: 'all' };
    filterCookie.value = '';
    registrationSourceCookie.value = 'all';

    sort.by = 'name';
    sort.order = 'ASC';
    sortByCookie.value = 'name';
    sortOrderCookie.value = 'ASC';

    page.value = 1;
    pageCookie.value = 1;

    await getInstitutions(1, perPage.value, buildListOptions());
};

let debounceTimer: ReturnType<typeof setTimeout>;
const debouncedFilter = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        page.value = 1;
        pageCookie.value = 1;
        filterCookie.value = option.value.name;
        await getInstitutions(1, perPage.value, buildListOptions());
    }, 350);
};

const onRegistrationSourceChange = async () => {
    registrationSourceCookie.value = option.value.registration_source;
    page.value = 1;
    pageCookie.value = 1;
    await getInstitutions(1, perPage.value, buildListOptions());
};

const handleImport = async () => {
    if (!importFile.value) return;

    importing.value = true;
    try {
        await importInstitutions(importFile.value);
        importDialogOpen.value = false;
        importFile.value = null;
        await getInstitutions(page.value, perPage.value, buildListOptions());
    }
    catch (error) {
        console.error('Erreur lors de l\'import:', error);
    }
    finally {
        importing.value = false;
    }
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

        await getInstitutions(page.value, perPage.value, buildListOptions());
    },
    { deep: true },
);

const handleEdit = (institution: Institution) => {
    navigateTo(`/dashboard/admin/institutions/${institution.id}/show`);
};

const deleteDialogOpen = ref(false);
const institutionToDelete = ref<Institution | null>(null);
const deleting = ref(false);

const openDeleteDialog = (institution: Institution) => {
    institutionToDelete.value = institution;
    deleteDialogOpen.value = true;
};

const closeDeleteDialog = () => {
    deleteDialogOpen.value = false;
    institutionToDelete.value = null;
};

const confirmDelete = async () => {
    if (!institutionToDelete.value) return;

    deleting.value = true;
    try {
        await forceDelete(institutionToDelete.value.id);
        await getInstitutions(page.value, perPage.value, buildListOptions());
        closeDeleteDialog();
    }
    catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
    finally {
        deleting.value = false;
    }
};

const handleStatusChange = async (institution: Institution, newStatus: 'pending' | 'active' | 'rejected') => {
    try {
        await updateStatus(institution.id, newStatus);
        await getInstitutions(page.value, perPage.value, buildListOptions());
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
    }
};

const getRegistrationSourceLabel = (source: string | null | undefined) => {
    switch (source) {
        case 'file':
            return 'Fichier';
        case 'site':
            return 'Site';
        default:
            return '—';
    }
};

const getRegistrationSourceColor = (source: string | null | undefined) => {
    switch (source) {
        case 'file':
            return 'bg-blue-100 text-blue-800';
        case 'site':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusLabel = (status: string | null | undefined) => {
    switch (status) {
        case 'not_applicable':
            return 'Non applicable';
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
        case 'not_applicable':
            return 'bg-gray-100 text-gray-600';
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
        id: 'registration_source',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('registration_source') }, () => [
                'Source',
                h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
            ]),
        cell: ({ row }) => {
            const institution = row.original;
            const source = institution.registration_source;

            return h('div', { class: 'flex justify-center' }, [
                h('span', {
                    class: `px-2 py-1 rounded-md text-xs font-medium ${getRegistrationSourceColor(source)}`,
                }, getRegistrationSourceLabel(source)),
            ]);
        },
    },
    {
        id: 'registered_at',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('registered_at') }, () => [
                'Date inscription / import',
                h(ArrowUpDown, { class: 'ml-2 h-4 w-4' }),
            ]),
        cell: ({ row }) => {
            const institution = row.original;
            const dateValue = institution.registered_at || institution.created_at;

            return h('div', { class: 'text-center text-sm' }, dateValue ? formatToDMY(dateValue) : '—');
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

                canDeleteInstitution(institution)
                    ? h(Button, {
                            variant: 'ghost',
                            size: 'sm',
                            class: 'w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50',
                            onClick: () => openDeleteDialog(institution),
                            title: 'Supprimer',
                        }, () => h(Trash2, { class: 'w-4 h-4' }))
                    : null,
            ]);
        },
    },
];
</script>
