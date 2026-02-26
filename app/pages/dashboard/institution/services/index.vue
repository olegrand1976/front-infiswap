<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Services"
            :count="services.meta.total"
        >
            <template #action>
                <Button class="rounded-md">
                    <NuxtLink
                        to="/dashboard/institution/services/create"
                        class="flex gap-3 items-center"
                    >
                        <PlusIcon class="w-6 h-6" />
                        <span>Nouveau</span>
                    </NuxtLink>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <DataTable
                :data="dataServices"
                :columns="columns"
            />

            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="services.meta.total"
                    @update:page="refreshServices"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import type { ColumnDef } from '@tanstack/vue-table';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { PERPAGE } from '~/lib/constants';
import { formatRelativeDate } from '~/composables/useDate';

const { $toast } = useNuxtApp();
const { getAll, services, remove } = useInstitutionServices();

useHead({ title: 'Services' });

definePageMeta({
    layout: 'dashboard',
    middleware: 'institution',
});

const router = useRouter();
const perPage = ref(PERPAGE);
const page = ref(1);

await getAll(page.value, perPage.value);
const dataServices = computed(() => services.value.data ?? []);

const refreshServices = async (pge: number) => {
    page.value = pge;
    await getAll(page.value, perPage.value);
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getAll(page.value, perPage.value);
};

const columns: ColumnDef<any>[] = [
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
        id: 'name',
        accessorFn: row => row.name,
        header: () => h(Button, {
            variant: 'ghost',
        }, () => ['Nom', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const name = row.original.name;
            return h('div', { class: 'ml-4' }, name);
        },
    },
    {
        id: 'phone_number',
        accessorFn: row => row.phone_number,
        header: () => h(Button, {
            variant: 'ghost',
        }, () => ['Téléphone', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const phone = row.original.phone_number;
            return h('div', { class: 'ml-4' }, phone || '-');
        },
    },
    {
        id: 'address',
        accessorFn: row => row.address,
        header: () => h(Button, {
            variant: 'ghost',
        }, () => ['Adresse', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const address = row.original.address;
            if (!address) return h('div', { class: 'ml-4' }, '-');
            const addressParts = [
                address.street,
                address.zipCode,
                address.city,
                address.country,
            ].filter(Boolean);
            return h('div', { class: 'ml-4' }, addressParts.join(', ') || '-');
        },
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
            }, () => ['Création', h('', { class: 'ml-2 h-4 w-4' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: '' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
            const service = row.original;
            const actions = [
                {
                    label: 'Modifier',
                    onClick: () => handleEdit(service),
                },
                {
                    label: 'Supprimer',
                    confirm: true,
                    onClick: () => handleDelete(service),
                },
            ];

            return h('div', { class: 'ml-4' }, [
                h(DropdownMenuAction, {
                    actions: actions,
                }),
            ]);
        },
    },
];

const handleEdit = (service) => {
    router.push(`/dashboard/institution/services/${service.id}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDelete = async (service: any) => {
    return await remove(service.id).then(async () => {
        services.value.data = services.value.data.filter(
            s => s.id !== service.id,
        );

        $toast({
            description: 'Service supprimé avec succès.',
        });
    });
};
</script>
