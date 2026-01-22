<template>
    <div>
        <DashboardAdminPageHeader
            title="Factures"
            :count="invoices.meta.total"
        />

        <DashboardAdminPageContent>
            <DataTable
                :data="dataInvoices"
                :columns="columns"
            />

            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="invoices.meta.total"
                    @update:page="refreshInvoices"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import type { ColumnDef } from '@tanstack/vue-table';
import { ChevronUpDownIcon } from '@heroicons/vue/24/outline';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { UsersName } from '#components';
import Button from '~/components/ui/button/Button.vue';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { PERPAGE } from '~/lib/constants';
import type { MissionInvoice } from '~/lib/types';

useHead({ title: 'Factures' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

const statusLabel = {
    draft: 'Brouillon',
    sent: 'Livré',
    paid: 'Payé',
};

const router = useRouter();
const perPage = ref(PERPAGE);
const page = ref(1);

const { getAll, invoices } = useMissionInvoices();

await getAll(page.value, perPage.value);
const dataInvoices = computed(() => invoices.value.data ?? []);

const refreshInvoices = async (pge: number) => {
    page.value = pge;
    await getAll(page.value, perPage.value);
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getAll(page.value, perPage.value);
};

const columns: ColumnDef<MissionInvoice>[] = [
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
        id: 'mission',
        accessorFn: row => row.mission_id,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Mission', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const missionId = `#${row.original.mission_id}`;
            return h('div', { class: 'ml-4 w-40 truncate' }, missionId);
        },
    },
    {
        id: 'period_start',
        accessorFn: row => row.period_start,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Début', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const start = row.original.period_start;
            return h('div', { class: 'ml-4 w-40 truncate' }, formatToDMY(start));
        },
    },
    {
        id: 'period_end',
        accessorFn: row => row.period_end,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Fin', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const end = row.original.period_end;
            return h('div', { class: 'ml-4 w-40 truncate' }, formatToDMY(end));
        },
    },
    {
        id: 'nurse',
        accessorFn: row => row.mission.nurse,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Infirmier', h('', { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            const user = row.original.mission.nurse;
            return h(UsersName, { class: 'ml-4', user: user });
        },
    },
    {
        id: 'status',
        accessorFn: row => row.status,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Statut', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const status = row.original.status;
            return h('div', { class: 'px-4 py-3 text-xs text-center font-medium bg-primary/20 text-gray-700 rounded-full' }, statusLabel[status]);
        },
    },
    {
        id: 'invoice_lines',
        accessorFn: row => row.invoice_lines,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Jours facturés', h('', { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            const count = row.original.invoice_lines.length;
            return h('div', { class: 'w-40 text-center truncate' }, count);
        },
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_at'),
            }, () => ['Création', h(ChevronUpDownIcon, { class: '' })]);
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
            const invoice = row.original;
            const actions = [
                {
                    label: 'Visualiser',
                },
                {
                    label: 'Détail de la mission',
                    onClick: () => handleShowMission(invoice.mission_id),
                },
                {
                    label: 'Feuille de temps',
                    onClick: () => handleShowTimesheet(invoice.mission_id),
                },
                ...(invoice.status == 'draft'
                    ? [{
                            label: 'Envoyer la facture',
                        }]
                    : []),
                ...(invoice.status != 'draft' && invoice.status == 'sent'
                    ? [{
                            label: 'Marquer comme payé',
                        }]
                    : []),
            ];

            return h('div', { class: 'ml-4' }, [
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
        await getAll(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);

const handleShowMission = (id: number) => {
    router.push(`/dashboard/institution/missions/${id}`);
};

const handleShowTimesheet = (id: number) => {
    router.push(`/dashboard/institution/missions/timesheet/${id}`);
};
</script>
