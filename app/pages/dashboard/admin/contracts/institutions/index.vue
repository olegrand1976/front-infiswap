<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="BC Institutions"
            :count="count"
        />

        <DashboardAdminPageContent>
            <div class="p-4 flex flex-wrap gap-3 items-center">
                <InputIcon
                    v-model="filters.institution_name"
                    rounded="md"
                    placeholder="Institution"
                    class="max-w-xs"
                    @input="debouncedRefresh"
                />
                <InputIcon
                    v-model="filters.reference"
                    rounded="md"
                    placeholder="Réf. BC"
                    class="max-w-xs"
                    @input="debouncedRefresh"
                />
                <Select
                    v-model="filters.status"
                    @update:model-value="refreshList"
                >
                    <SelectTrigger class="max-w-xs rounded-md">
                        <span>Statut BC</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            Tous
                        </SelectItem>
                        <SelectItem value="draft">
                            Brouillon
                        </SelectItem>
                        <SelectItem value="sent_for_signature">
                            Envoyé pour signature
                        </SelectItem>
                        <SelectItem value="sign">
                            Lien de signature actif
                        </SelectItem>
                        <SelectItem value="pending_signature">
                            En attente de signature
                        </SelectItem>
                        <SelectItem value="signed">
                            Signé
                        </SelectItem>
                        <SelectItem value="paid">
                            Payé
                        </SelectItem>
                        <SelectItem value="accomplished">
                            Abonnement actif
                        </SelectItem>
                        <SelectItem value="cancelled">
                            Annulé
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    class="rounded-md"
                    variant="outline"
                    @click="resetFilters"
                >
                    <RefreshCw class="md:mr-2" />
                    Restaurer
                </Button>
            </div>

            <div
                v-if="loading"
                class="flex justify-center py-12"
            >
                <RollingLoader :loading="loading" />
            </div>

            <DataTable
                v-else
                :data="subscriptions"
                :columns="columns"
            />

            <CustomPagination
                :default-page="page"
                :per-page="perPage"
                :total="count"
                @update:page="onPageChange"
                @update:per-page="onPerPageChange"
            />
        </DashboardAdminPageContent>

        <InstitutionSubscriptionDetailSheet
            v-model:open="detailOpen"
            :subscription="selectedSubscription"
            @refresh="reloadDetail"
        />
    </div>
</template>

<script setup lang="ts">
import { Eye, FileText, RefreshCw, Trash2 } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { InputIcon } from '~/components/ui/input-with-icon';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { PERPAGE } from '~/lib/constants';
import { formatToDMY } from '@/composables/useDate';
import type { InstitutionSubscriptionItem } from '@/composables/useInstitutionSubscription';
import InstitutionSubscriptionDetailSheet from '@/components/contracts/InstitutionSubscriptionDetailSheet.vue';
import RollingLoader from '~/components/RollingLoader.vue';

useHead({ title: 'BC Institutions' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { subscriptions, count, loading, getSubscriptions, getSubscription, cancelSubscription, viewPdf } = useInstitutionSubscription();
const { $toast } = useNuxtApp();

const page = ref(1);
const perPage = ref(PERPAGE);
const detailOpen = ref(false);
const selectedSubscription = ref<InstitutionSubscriptionItem | null>(null);

const filters = reactive({
    institution_name: '',
    reference: '',
    status: 'all',
});

function buildParams() {
    const params: Record<string, unknown> = {};
    if (filters.institution_name) params.institution_name = filters.institution_name;
    if (filters.reference) params.reference = filters.reference;
    if (filters.status !== 'all') params.status = filters.status;
    return params;
}

async function refreshList() {
    page.value = 1;
    await getSubscriptions(page.value, perPage.value, buildParams());
}

let debounceTimer: ReturnType<typeof setTimeout>;
function debouncedRefresh() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(refreshList, 350);
}

function resetFilters() {
    filters.institution_name = '';
    filters.reference = '';
    filters.status = 'all';
    refreshList();
}

async function onPageChange(newPage: number) {
    page.value = newPage;
    await getSubscriptions(page.value, perPage.value, buildParams());
}

async function onPerPageChange(value: number) {
    perPage.value = value;
    page.value = 1;
    await getSubscriptions(page.value, perPage.value, buildParams());
}

async function openDetail(item: InstitutionSubscriptionItem) {
    try {
        selectedSubscription.value = await getSubscription(item.id);
        detailOpen.value = true;
    }
    catch {
        $toast({ description: 'Impossible de charger le détail.', variant: 'destructive' });
    }
}

async function handleViewPdf(institutionId: number, contractId: number) {
    try {
        await viewPdf(institutionId, contractId);
    }
    catch {
        $toast({ description: 'Impossible d\'ouvrir le PDF.', variant: 'destructive' });
    }
}

async function reloadDetail() {
    if (!selectedSubscription.value) return;
    try {
        selectedSubscription.value = await getSubscription(selectedSubscription.value.id);
        await getSubscriptions(page.value, perPage.value, buildParams());
    }
    catch {
        $toast({ description: 'Impossible de rafraîchir le détail.', variant: 'destructive' });
    }
}

async function handleCancel(item: InstitutionSubscriptionItem) {
    const institutionId = item.institution?.id;
    if (!institutionId || !item.subscription?.can_cancel) return;
    if (!confirm('Annuler ce bon de commande ?')) return;
    try {
        await cancelSubscription(institutionId, item.id);
        $toast({ description: 'Bon de commande annulé.' });
        await refreshList();
    }
    catch {
        $toast({ description: 'Impossible d\'annuler.', variant: 'destructive' });
    }
}

onMounted(async () => {
    await refreshList();
    const route = useRoute();
    const contractId = Number(route.query.contract);
    if (contractId) {
        try {
            selectedSubscription.value = await getSubscription(contractId);
            detailOpen.value = true;
        }
        catch {
            $toast({ description: 'Bon de commande introuvable.', variant: 'destructive' });
        }
    }
});

const columns: ColumnDef<InstitutionSubscriptionItem>[] = [
    {
        accessorKey: 'reference',
        header: () => h('div', 'Réf. BC'),
        cell: ({ row }) => h('div', { class: 'font-medium' }, row.original.reference ?? '—'),
    },
    {
        id: 'institution',
        header: () => h('div', 'Institution'),
        cell: ({ row }) => h('div', row.original.institution?.name ?? '—'),
    },
    {
        accessorKey: 'status_label',
        header: () => h('div', 'Statut'),
        cell: ({ row }) => h('div', row.original.status_label ?? row.original.status ?? '—'),
    },
    {
        id: 'base',
        header: () => h('div', 'Base BC'),
        cell: ({ row }) => h('div', { class: 'text-sm' }, row.original.formula_label ?? '—'),
    },
    {
        id: 'requester',
        header: () => h('div', 'Demandeur'),
        cell: ({ row }) => h('div', row.original.requester?.full_name ?? '—'),
    },
    {
        id: 'proforma',
        header: () => h('div', 'Proforma'),
        cell: ({ row }) => {
            const uploaded = row.original.billing?.proforma_file_uploaded_at;
            const sent = row.original.billing?.proforma_sent_at;
            if (!uploaded && !sent) return h('div', { class: 'text-sm' }, '—');
            return h('div', { class: 'text-sm space-y-0.5' }, [
                uploaded ? h('div', `Inséré : ${formatToDMY(uploaded)}`) : null,
                sent ? h('div', { class: 'text-muted-foreground' }, `Envoyé : ${formatToDMY(sent)}`) : null,
            ]);
        },
    },
    {
        id: 'invoice',
        header: () => h('div', 'Facture'),
        cell: ({ row }) => {
            const number = row.original.billing?.invoice_number;
            const uploaded = row.original.billing?.invoice_file_uploaded_at;
            const sent = row.original.billing?.invoice_emailed_at;
            if (!number && !uploaded && !sent) return h('div', { class: 'text-sm' }, '—');
            return h('div', { class: 'text-sm space-y-0.5' }, [
                number ? h('div', number) : null,
                uploaded ? h('div', { class: 'text-muted-foreground' }, `Inséré : ${formatToDMY(uploaded)}`) : null,
                sent ? h('div', { class: 'text-muted-foreground' }, `Envoyé : ${formatToDMY(sent)}`) : null,
            ]);
        },
    },
    {
        id: 'totals',
        header: () => h('div', 'Encaissé / Commission'),
        cell: ({ row }) => {
            const t = row.original.totals;
            return h('div', { class: 'text-sm' }, t
                ? `${t.amount_received} € / ${t.commission_due} € dûes`
                : '—');
        },
    },
    {
        id: 'actions',
        header: () => h('div', 'Actions'),
        cell: ({ row }) => {
            const item = row.original;
            const institutionId = item.institution?.id;
            const canCancel = item.subscription?.can_cancel ?? item.subscription?.can_delete_draft;

            return h('div', { class: 'flex gap-1' }, [
                h(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => openDetail(item),
                }, () => h(Eye, { class: 'w-4 h-4' })),
                institutionId
                    ? h(Button, {
                            variant: 'ghost',
                            size: 'sm',
                            onClick: () => handleViewPdf(institutionId, item.id),
                        }, () => h(FileText, { class: 'w-4 h-4' }))
                    : null,
                canCancel && institutionId
                    ? h(Button, {
                            variant: 'ghost',
                            size: 'sm',
                            class: 'text-red-600',
                            onClick: () => handleCancel(item),
                        }, () => h(Trash2, { class: 'w-4 h-4' }))
                    : null,
            ]);
        },
    },
];
</script>
