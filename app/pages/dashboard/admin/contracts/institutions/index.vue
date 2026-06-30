<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="BC Institutions"
            :count="count"
        />

        <DashboardAdminPageContent>
            <InstitutionSubscriptionKpiCards
                :kpis="subscriptionKpis"
                :loading="kpiLoading"
            />
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
                    :variant="filters.archived ? 'default' : 'outline'"
                    @click="toggleArchived"
                >
                    Archivés
                </Button>
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
            :histories="selectedHistories"
            @refresh="reloadDetail"
        />
    </div>
</template>

<script setup lang="ts">
import { Eye, FileText, RefreshCw, Trash2 } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '~/components/ui/alert-dialog/ConfirmDialog.vue';
import { InputIcon } from '~/components/ui/input-with-icon';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { PERPAGE } from '~/lib/constants';
import { formatToDMY } from '@/composables/useDate';
import type { InstitutionSubscriptionHistory, InstitutionSubscriptionItem, InstitutionSubscriptionKpis } from '@/composables/useInstitutionSubscription';
import InstitutionSubscriptionDetailSheet from '@/components/contracts/InstitutionSubscriptionDetailSheet.vue';
import InstitutionSubscriptionKpiCards from '@/components/contracts/InstitutionSubscriptionKpiCards.vue';
import RollingLoader from '~/components/RollingLoader.vue';

useHead({ title: 'BC Institutions' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { subscriptions, count, loading, getSubscriptions, getSubscriptionKpis, getSubscription, deleteSubscription, viewPdf } = useInstitutionSubscription();
const { $toast } = useNuxtApp();

const page = ref(1);
const perPage = ref(PERPAGE);
const kpiLoading = ref(false);
const subscriptionKpis = ref<InstitutionSubscriptionKpis | null>(null);
const detailOpen = ref(false);
const selectedSubscription = ref<InstitutionSubscriptionItem | null>(null);
const selectedHistories = ref<InstitutionSubscriptionHistory[]>([]);
const deletingId = ref<number | null>(null);

const filters = reactive({
    institution_name: '',
    reference: '',
    status: 'all',
    archived: false,
});

function buildParams() {
    const params: Record<string, unknown> = {};
    if (filters.institution_name) params.institution_name = filters.institution_name;
    if (filters.reference) params.reference = filters.reference;
    if (filters.status !== 'all') params.status = filters.status;
    if (filters.archived) params.archived = 1;
    return params;
}

function toggleArchived() {
    filters.archived = !filters.archived;
    refreshList();
}

async function refreshKpis() {
    kpiLoading.value = true;
    try {
        subscriptionKpis.value = await getSubscriptionKpis(buildParams());
    }
    catch {
        subscriptionKpis.value = null;
    }
    finally {
        kpiLoading.value = false;
    }
}

async function refreshList() {
    page.value = 1;
    await Promise.all([
        getSubscriptions(page.value, perPage.value, buildParams()),
        refreshKpis(),
    ]);
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
    filters.archived = false;
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
        const { data, histories } = await getSubscription(item.id);
        selectedSubscription.value = data;
        selectedHistories.value = histories;
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
        const { data, histories } = await getSubscription(selectedSubscription.value.id);
        selectedSubscription.value = data;
        selectedHistories.value = histories;
        await getSubscriptions(page.value, perPage.value, buildParams());
    }
    catch {
        $toast({ description: 'Impossible de rafraîchir le détail.', variant: 'destructive' });
    }
}

function documensoStatusBadgeClass(status?: string | null): string {
    if (!status) return 'bg-gray-100 text-gray-600';
    if (status === 'DRAFT') return 'bg-blue-100 text-blue-800';
    if (status === 'COMPLETED') return 'bg-green-100 text-green-800';
    if (status === 'PENDING') return 'bg-amber-100 text-amber-800';
    if (status === 'CANCELLED' || status === 'REJECTED') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-700';
}

function archiveDescription(item: InstitutionSubscriptionItem): string {
    const ref = item.reference ?? String(item.id);
    return `Le BC ${ref} sera retiré de la liste active. L'historique des actions sera conservé et consultable dans les archivés.`;
}

async function confirmArchive(item: InstitutionSubscriptionItem) {
    deletingId.value = item.id;
    try {
        await deleteSubscription(item.id);
        $toast({ description: 'Bon de commande archivé.' });
        if (detailOpen.value && selectedSubscription.value?.id === item.id) {
            detailOpen.value = false;
        }
        await refreshList();
    }
    catch {
        $toast({ description: 'Impossible d\'archiver ce bon de commande.', variant: 'destructive' });
    }
    finally {
        deletingId.value = null;
    }
}

onMounted(async () => {
    await refreshList();
    const route = useRoute();
    const contractId = Number(route.query.contract);
    if (contractId) {
        try {
            const { data, histories } = await getSubscription(contractId);
            selectedSubscription.value = data;
            selectedHistories.value = histories;
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
        header: () => h('div', 'Statut BC'),
        cell: ({ row }) => h('div', row.original.status_label ?? row.original.status ?? '—'),
    },
    {
        id: 'documenso_status',
        header: () => h('div', 'Signature Documenso'),
        cell: ({ row }) => {
            const label = row.original.documenso_status_label ?? '—';
            const status = row.original.documenso_status;
            const badgeClass = documensoStatusBadgeClass(status);

            return h('span', {
                class: `inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`,
            }, label);
        },
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
            const canDelete = item.can_delete
                ?? item.subscription?.can_cancel
                ?? item.subscription?.can_delete_draft;

            return h('div', { class: 'flex gap-1' }, [
                h(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    title: 'Voir le détail',
                    onClick: () => openDetail(item),
                }, () => h(Eye, { class: 'w-4 h-4' })),
                institutionId && !item.is_archived
                    ? h(Button, {
                            variant: 'ghost',
                            size: 'sm',
                            title: 'Voir le PDF',
                            onClick: () => handleViewPdf(institutionId, item.id),
                        }, () => h(FileText, { class: 'w-4 h-4' }))
                    : null,
                canDelete && !item.is_archived
                    ? h(ConfirmDialog, {
                            title: 'Archiver le bon de commande',
                            description: archiveDescription(item),
                            confirmText: 'Archiver',
                            cancelText: 'Annuler',
                            onConfirm: () => confirmArchive(item),
                        }, {
                            trigger: () => h(Button, {
                                variant: 'ghost',
                                size: 'sm',
                                class: 'text-red-600',
                                title: 'Archiver',
                                disabled: deletingId.value === item.id,
                                inProgress: deletingId.value === item.id,
                            }, () => h(Trash2, { class: 'w-4 h-4' })),
                        })
                    : null,
            ]);
        },
    },
];
</script>
