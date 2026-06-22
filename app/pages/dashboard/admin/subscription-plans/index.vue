<template>
    <div>
        <DashboardAdminPageHeader title="Plans d'abonnement">
            <template #action>
                <Button
                    v-if="isSuperAdmin"
                    class="rounded"
                    href="/dashboard/admin/subscription-plans/create"
                >
                    <CirclePlus />
                    <span class="hidden md:inline-block">Nouveau plan</span>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <DataTable
                :data="dataPlans"
                :columns="columns"
            />
            <CustomPagination
                :default-page="page"
                :per-page="perPage"
                :total="count"
                @update:page="refreshPlans"
                @update:per-page="handlePerPageChange"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown, CirclePlus } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { PERPAGE } from '~/lib/constants';
import type { StripePlan } from '~/composables/useSubscriptionPlansAdmin';

useHead({ title: 'Plans d\'abonnement' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { plans, getPlans, count, deactivatePlan, loading } = useSubscriptionPlansAdmin();
const { isSuperAdmin } = useAuth();

const perPage = ref(PERPAGE);
const page = ref(1);

await getPlans(page.value, perPage.value);
const dataPlans = computed(() => plans.value ?? []);

const typeLabels: Record<string, string> = {
    platform_access: 'Accès plateforme',
    replacement_boost: 'Mise en avant',
};

const refreshPlans = async (newPage: number) => {
    page.value = newPage;
    await getPlans(newPage, perPage.value);
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getPlans(page.value, value);
};

const columns: ColumnDef<StripePlan>[] = [
    {
        accessorKey: 'name',
        header: 'Nom',
        cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => h('div', typeLabels[row.getValue('type') as string] ?? row.getValue('type')),
    },
    {
        accessorKey: 'amount',
        header: 'Prix',
        cell: ({ row }) => h('div', `${row.getValue('amount')} € / ${row.original.interval}`),
    },
    {
        accessorKey: 'is_active',
        header: 'Actif',
        cell: ({ row }) => h('div', row.getValue('is_active') ? 'Oui' : 'Non'),
    },
    {
        accessorKey: 'valid_from',
        header: 'Début',
        cell: ({ row }) => h('div', row.getValue('valid_from') ? formatRelativeDate(row.getValue('valid_from')) : '—'),
    },
    {
        accessorKey: 'stripe_price_id',
        header: 'Stripe Price',
        cell: ({ row }) => h('div', { class: 'text-xs truncate max-w-[180px]' }, row.getValue('stripe_price_id')),
    },
    ...(isSuperAdmin.value
        ? [{
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const plan = row.original;
                    return h(DropdownMenuAction, {
                        actions: [
                            {
                                label: 'Modifier',
                                onClick: () => navigateTo(`/dashboard/admin/subscription-plans/${plan.id}`),
                            },
                            {
                                label: 'Désactiver',
                                confirm: true,
                                onClick: async () => {
                                    await deactivatePlan(plan.id);
                                    await getPlans(page.value, perPage.value);
                                },
                            },
                        ],
                    });
                },
            }]
        : []),
];
</script>
