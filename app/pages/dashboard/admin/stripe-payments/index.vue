<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Paiements Stripe"
            :count="count"
        />

        <DashboardAdminPageContent>
            <StripePaymentKpiCards
                :kpis="paymentKpis"
                :loading="kpiLoading"
            />

            <p
                v-if="showBoostHistoryNote"
                class="mx-4 mb-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
            >
                L'historique des boosts remonte au déploiement de cette fonctionnalité. Les paiements antérieurs ne sont pas disponibles.
            </p>

            <div class="px-4 pb-2">
                <div class="inline-flex rounded-lg border bg-white p-1">
                    <button
                        v-for="tab in STRIPE_PAYMENT_VIEWS"
                        :key="tab.key"
                        type="button"
                        class="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        :class="selectedView === tab.key
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:text-gray-900'"
                        @click="selectView(tab.key)"
                    >
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <div class="p-4 flex flex-wrap gap-3 items-center">
                <InputIcon
                    v-model="filters.q"
                    rounded="md"
                    placeholder="Utilisateur (nom, email)"
                    class="max-w-xs"
                    @input="debouncedRefresh"
                />
                <Input
                    v-model="filters.paid_from"
                    type="date"
                    class="max-w-[170px] rounded-md"
                    @change="refreshList"
                />
                <Input
                    v-model="filters.paid_to"
                    type="date"
                    class="max-w-[170px] rounded-md"
                    @change="refreshList"
                />
                <Select
                    v-model="filters.product_type"
                    @update:model-value="refreshList"
                >
                    <SelectTrigger class="max-w-xs rounded-md">
                        <span>{{ productTypeLabel }}</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            v-for="option in STRIPE_PAYMENT_PRODUCT_TYPES"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    v-model="filters.sort"
                    @update:model-value="refreshList"
                >
                    <SelectTrigger class="max-w-xs rounded-md">
                        <span>{{ sortLabel }}</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            v-for="option in sortOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
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
                v-else-if="selectedView === 'transactions'"
                :data="payments"
                :columns="transactionColumns"
            />

            <DataTable
                v-else
                :data="usersAggregate"
                :columns="userColumns"
            />

            <CustomPagination
                :default-page="page"
                :per-page="perPage"
                :total="count"
                @update:page="onPageChange"
                @update:per-page="onPerPageChange"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputIcon } from '~/components/ui/input-with-icon';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { PERPAGE } from '~/lib/constants';
import { formatToDMY } from '@/composables/useDate';
import StripePaymentKpiCards from '@/components/subscription/StripePaymentKpiCards.vue';
import RollingLoader from '~/components/RollingLoader.vue';
import {
    STRIPE_PAYMENT_PRODUCT_TYPES,
    STRIPE_PAYMENT_VIEWS,
    formatStripePaymentAmount,
    stripePaymentProductLabel,
    type StripePaymentKpis,
    type StripePaymentRow,
    type StripePaymentUserAggregate,
} from '@/composables/useStripePaymentsAdmin';

useHead({ title: 'Paiements Stripe' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const route = useRoute();
const router = useRouter();
const { getKpis, getPayments, getPaymentsByUser } = useStripePaymentsAdmin();

const page = ref(1);
const perPage = ref(PERPAGE);
const loading = ref(false);
const kpiLoading = ref(false);
const count = ref(0);
const payments = ref<StripePaymentRow[]>([]);
const usersAggregate = ref<StripePaymentUserAggregate[]>([]);
const paymentKpis = ref<StripePaymentKpis | null>(null);

const filters = reactive({
    q: '',
    paid_from: '',
    paid_to: '',
    product_type: 'all',
    sort: 'paid_at_desc',
});

const selectedView = computed(() => {
    const view = typeof route.query.view === 'string' ? route.query.view : 'transactions';
    return view === 'users' ? 'users' : 'transactions';
});

const transactionSortOptions = [
    { value: 'paid_at_desc', label: 'Date (récent → ancien)' },
    { value: 'amount_desc', label: 'Montant (élevé → faible)' },
];

const userSortOptions = [
    { value: 'last_paid_at_desc', label: 'Dernier paiement' },
    { value: 'total_amount_desc', label: 'Total le plus élevé' },
];

const sortOptions = computed(() =>
    selectedView.value === 'users' ? userSortOptions : transactionSortOptions,
);

const productTypeLabel = computed(() =>
    STRIPE_PAYMENT_PRODUCT_TYPES.find(option => option.value === filters.product_type)?.label ?? 'Produit',
);

const sortLabel = computed(() =>
    sortOptions.value.find(option => option.value === filters.sort)?.label ?? 'Tri',
);

const showBoostHistoryNote = computed(() =>
    !loading.value
    && filters.product_type === 'boost'
    && count.value === 0,
);

function syncSortForView() {
    const validUserSort = userSortOptions.some(option => option.value === filters.sort);
    const validTransactionSort = transactionSortOptions.some(option => option.value === filters.sort);

    if (selectedView.value === 'users' && !validUserSort) {
        filters.sort = 'last_paid_at_desc';
    }
    else if (selectedView.value === 'transactions' && !validTransactionSort) {
        filters.sort = 'paid_at_desc';
    }
}

function buildParams() {
    const params: Record<string, string> = {};
    if (filters.q.trim()) params.q = filters.q.trim();
    if (filters.paid_from) params.paid_from = filters.paid_from;
    if (filters.paid_to) params.paid_to = filters.paid_to;
    if (filters.product_type !== 'all') params.product_type = filters.product_type;
    if (filters.sort) params.sort = filters.sort;
    return params;
}

function selectView(view: string) {
    const nextSort = view === 'users' ? 'last_paid_at_desc' : 'paid_at_desc';
    filters.sort = nextSort;
    router.replace({ query: { ...route.query, view } });
    refreshList();
}

async function refreshKpis() {
    kpiLoading.value = true;
    try {
        paymentKpis.value = await getKpis(buildParams());
    }
    catch {
        paymentKpis.value = null;
    }
    finally {
        kpiLoading.value = false;
    }
}

async function refreshList() {
    page.value = 1;
    loading.value = true;
    try {
        await Promise.all([
            refreshKpis(),
            fetchCurrentView(),
        ]);
    }
    finally {
        loading.value = false;
    }
}

async function fetchCurrentView() {
    const params = buildParams();

    if (selectedView.value === 'users') {
        const response = await getPaymentsByUser(page.value, perPage.value, params);
        usersAggregate.value = response.users;
        count.value = response.count;
        return;
    }

    const response = await getPayments(page.value, perPage.value, params);
    payments.value = response.payments;
    count.value = response.count;
}

let debounceTimer: ReturnType<typeof setTimeout>;
function debouncedRefresh() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(refreshList, 350);
}

function resetFilters() {
    filters.q = '';
    filters.paid_from = '';
    filters.paid_to = '';
    filters.product_type = 'all';
    filters.sort = selectedView.value === 'users' ? 'last_paid_at_desc' : 'paid_at_desc';
    refreshList();
}

async function onPageChange(newPage: number) {
    page.value = newPage;
    loading.value = true;
    try {
        await fetchCurrentView();
    }
    finally {
        loading.value = false;
    }
}

async function onPerPageChange(value: number) {
    perPage.value = value;
    page.value = 1;
    loading.value = true;
    try {
        await fetchCurrentView();
    }
    finally {
        loading.value = false;
    }
}

function productBadgeClass(type: string): string {
    if (type === 'platform_access') return 'bg-indigo-100 text-indigo-800';
    if (type === 'boost') return 'bg-amber-100 text-amber-800';
    if (type === 'replacement_contract') return 'bg-emerald-100 text-emerald-800';
    if (type === 'sponsorship') return 'bg-violet-100 text-violet-800';
    return 'bg-gray-100 text-gray-700';
}

const transactionColumns: ColumnDef<StripePaymentRow>[] = [
    {
        accessorKey: 'paid_at',
        header: () => h('div', 'Date'),
        cell: ({ row }) => h('div', row.original.paid_at ? formatToDMY(row.original.paid_at, true) : '—'),
    },
    {
        id: 'user',
        header: () => h('div', 'Utilisateur'),
        cell: ({ row }) => {
            const user = row.original.user;
            if (!user) return h('div', '—');

            return h(
                resolveComponent('NuxtLink'),
                {
                    to: `/dashboard/admin/users/${user.id}`,
                    class: 'font-medium text-primary hover:underline',
                },
                () => user.full_name,
            );
        },
    },
    {
        accessorKey: 'product_label',
        header: () => h('div', 'Produit'),
        cell: ({ row }) => h('div', { class: 'space-y-1' }, [
            h('div', row.original.product_label),
            h(
                'span',
                { class: `inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${productBadgeClass(row.original.product_type)}` },
                stripePaymentProductLabel(row.original.product_type),
            ),
        ]),
    },
    {
        accessorKey: 'amount_cents',
        header: () => h('div', 'Montant'),
        cell: ({ row }) => h('div', { class: 'font-medium' }, formatStripePaymentAmount(row.original.amount_cents, row.original.currency)),
    },
    {
        id: 'replacement',
        header: () => h('div', 'Remplacement'),
        cell: ({ row }) => {
            const replacementId = row.original.replacement_id;

            if (!replacementId) {
                return h('div', '—');
            }

            return h(
                resolveComponent('NuxtLink'),
                {
                    to: `/dashboard/admin/replacements/${replacementId}`,
                    class: 'text-sm text-primary hover:underline',
                },
                () => `#${replacementId}`,
            );
        },
    },
    {
        accessorKey: 'stripe_checkout_session_short',
        header: () => h('div', 'Session Stripe'),
        cell: ({ row }) => h('div', { class: 'font-mono text-xs text-gray-600' }, row.original.stripe_checkout_session_short ?? '—'),
    },
];

const userColumns: ColumnDef<StripePaymentUserAggregate>[] = [
    {
        id: 'user',
        header: () => h('div', 'Utilisateur'),
        cell: ({ row }) => {
            const user = row.original.user;
            if (!user) return h('div', '—');

            return h('div', { class: 'space-y-0.5' }, [
                h(
                    resolveComponent('NuxtLink'),
                    {
                        to: `/dashboard/admin/users/${user.id}`,
                        class: 'font-medium text-primary hover:underline',
                    },
                    () => user.full_name,
                ),
                h('div', { class: 'text-xs text-gray-500' }, user.email),
            ]);
        },
    },
    {
        accessorKey: 'payment_count',
        header: () => h('div', 'Nb paiements'),
        cell: ({ row }) => h('div', String(row.original.payment_count)),
    },
    {
        accessorKey: 'total_amount_cents',
        header: () => h('div', 'Total'),
        cell: ({ row }) => h('div', { class: 'font-medium' }, formatStripePaymentAmount(row.original.total_amount_cents)),
    },
    {
        accessorKey: 'last_paid_at',
        header: () => h('div', 'Dernier paiement'),
        cell: ({ row }) => h('div', row.original.last_paid_at ? formatToDMY(row.original.last_paid_at, true) : '—'),
    },
    {
        accessorKey: 'max_amount_cents',
        header: () => h('div', 'Plus gros paiement'),
        cell: ({ row }) => h('div', formatStripePaymentAmount(row.original.max_amount_cents)),
    },
    {
        id: 'product_types',
        header: () => h('div', 'Types'),
        cell: ({ row }) => h(
            'div',
            { class: 'flex flex-wrap gap-1' },
            row.original.product_types.map(type =>
                h(
                    'span',
                    { class: `inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${productBadgeClass(type)}` },
                    stripePaymentProductLabel(type),
                ),
            ),
        ),
    },
];

watch(
    () => route.query.view,
    async () => {
        if (selectedView.value === 'users' && !userSortOptions.some(option => option.value === filters.sort)) {
            filters.sort = 'last_paid_at_desc';
        }
        if (selectedView.value === 'transactions' && !transactionSortOptions.some(option => option.value === filters.sort)) {
            filters.sort = 'paid_at_desc';
        }
        page.value = 1;
        loading.value = true;
        try {
            await Promise.all([refreshKpis(), fetchCurrentView()]);
        }
        finally {
            loading.value = false;
        }
    },
);

onMounted(() => {
    syncSortForView();
    refreshList();
});
</script>
