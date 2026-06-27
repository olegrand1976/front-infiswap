<template>
    <div class="space-y-6 p-4">
        <CommissionKpiCards
            :kpis="kpis"
            :loading="kpiLoading"
        />

        <div class="flex flex-wrap gap-3 items-center">
            <InputIcon
                v-if="isAdminView"
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
            <Input
                v-if="isAdminView"
                v-model.number="filters.vendor_id"
                type="number"
                min="1"
                placeholder="ID vendeur"
                class="max-w-[140px] rounded-md"
                @change="refresh"
            />
            <Input
                v-model="filters.contract_created_from"
                type="date"
                class="max-w-[170px] rounded-md"
                @change="refresh"
            />
            <Input
                v-model="filters.contract_created_to"
                type="date"
                class="max-w-[170px] rounded-md"
                @change="refresh"
            />
            <Select
                v-model="filters.commission_status"
                @update:model-value="refresh"
            >
                <SelectTrigger class="max-w-xs rounded-md">
                    <span>{{ commissionStatusLabel }}</span>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        Toutes commissions
                    </SelectItem>
                    <SelectItem value="due">
                        Commissions dues
                    </SelectItem>
                    <SelectItem value="paid">
                        Commissions versées
                    </SelectItem>
                </SelectContent>
            </Select>
            <Button
                variant="outline"
                class="rounded-md"
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

        <template v-else>
            <DataTable
                v-if="isAdminView"
                :data="vendors"
                :columns="vendorColumns"
            />
            <div
                v-else
                class="space-y-4"
            >
                <Button
                    class="rounded-md"
                    variant="outline"
                    @click="openMyDetail"
                >
                    <Eye class="mr-2 h-4 w-4" />
                    Voir mon détail
                </Button>
                <DataTable
                    :data="vendors"
                    :columns="vendorColumns"
                />
            </div>

            <CustomPagination
                :default-page="page"
                :per-page="perPage"
                :total="vendorCount"
                @update:page="onPageChange"
                @update:per-page="onPerPageChange"
            />
        </template>

        <Sheet
            v-model:open="detailOpen"
        >
            <SheetContent class="w-full sm:max-w-3xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        {{ detail?.vendor.full_name ?? 'Détail vendeur' }}
                    </SheetTitle>
                </SheetHeader>

                <div
                    v-if="detailLoading"
                    class="py-12 flex justify-center"
                >
                    <RollingLoader :loading="detailLoading" />
                </div>

                <div
                    v-else-if="detail"
                    class="mt-6 space-y-6"
                >
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p class="text-muted-foreground">
                                Encaissé
                            </p>
                            <p class="font-semibold">
                                {{ formatEuro(detail.summary?.amount_received ?? 0) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">
                                Commissions dues
                            </p>
                            <p class="font-semibold">
                                {{ formatEuro(detail.summary?.commission_due ?? 0) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">
                                Commissions versées
                            </p>
                            <p class="font-semibold">
                                {{ formatEuro(detail.summary?.commission_paid ?? 0) }}
                            </p>
                        </div>
                    </div>

                    <div
                        v-for="contract in detail.contracts"
                        :key="contract.id"
                        class="border rounded-lg p-4 space-y-3"
                    >
                        <div class="flex flex-wrap justify-between gap-2">
                            <div>
                                <p class="font-medium">
                                    {{ contract.reference ?? `BC #${contract.id}` }}
                                </p>
                                <p class="text-sm text-muted-foreground">
                                    {{ contract.institution?.name ?? '—' }}
                                </p>
                            </div>
                            <div class="text-sm text-right">
                                <p>{{ contract.status_label ?? contract.status }}</p>
                                <p class="text-muted-foreground">
                                    {{ formatDate(contract.created_at) }}
                                </p>
                            </div>
                        </div>

                        <div
                            v-if="contract.payments.length === 0"
                            class="text-sm text-muted-foreground"
                        >
                            Aucun encaissement enregistré.
                        </div>

                        <div
                            v-for="payment in contract.payments"
                            :key="payment.id"
                            class="flex flex-wrap justify-between gap-2 text-sm border-t pt-2"
                        >
                            <div>
                                <p>{{ formatDate(payment.received_at) }}</p>
                                <p class="text-muted-foreground">
                                    Année {{ payment.subscription_year }} — {{ payment.commission_rate }} %
                                </p>
                            </div>
                            <div class="text-right">
                                <p>{{ formatEuro(payment.amount_received) }} encaissé</p>
                                <p :class="payment.commission_paid_at ? 'text-emerald-600' : 'text-amber-600'">
                                    {{ formatEuro(payment.commission_amount) }}
                                    {{ payment.commission_paid_at ? 'versée' : 'due' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    </div>
</template>

<script setup lang="ts">
import { Eye, RefreshCw } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputIcon } from '~/components/ui/input-with-icon';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CommissionKpiCards from '@/components/commissions/CommissionKpiCards.vue';
import RollingLoader from '~/components/RollingLoader.vue';
import { PERPAGE } from '~/lib/constants';
import { formatToDMY } from '@/composables/useDate';
import type { CommissionTrackingFilters, VendorCommissionDetail, VendorCommissionSummary } from '@/composables/useInstitutionCommissionTracking';
import { h } from 'vue';

const props = defineProps<{
    isAdminView?: boolean;
}>();

const {
    kpis,
    vendors,
    vendorCount,
    loading,
    getAdminKpis,
    getAdminVendors,
    getAdminVendorDetail,
    getMyKpis,
    getMyTracking,
    getMyDetail,
} = useInstitutionCommissionTracking();

const page = ref(1);
const perPage = ref(PERPAGE);
const kpiLoading = ref(false);
const detailOpen = ref(false);
const detailLoading = ref(false);
const detail = ref<VendorCommissionDetail | null>(null);

const initialFilters: CommissionTrackingFilters = {
    institution_name: '',
    reference: '',
    vendor_id: null,
    contract_created_from: '',
    contract_created_to: '',
    commission_status: 'all',
};

const filters = reactive<CommissionTrackingFilters>({ ...initialFilters });

const commissionStatusLabel = computed(() => {
    switch (filters.commission_status) {
        case 'due':
            return 'Commissions dues';
        case 'paid':
            return 'Commissions versées';
        default:
            return 'Toutes commissions';
    }
});

function formatEuro(value: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

function formatDate(value?: string | null) {
    return value ? formatToDMY(value) : '—';
}

async function loadKpis() {
    kpiLoading.value = true;
    try {
        if (props.isAdminView) {
            await getAdminKpis(filters);
        }
        else {
            await getMyKpis(filters);
        }
    }
    finally {
        kpiLoading.value = false;
    }
}

async function refresh() {
    await Promise.all([
        loadKpis(),
        props.isAdminView
            ? getAdminVendors(page.value, perPage.value, filters)
            : getMyTracking(page.value, perPage.value, filters),
    ]);
}

let debounceTimer: ReturnType<typeof setTimeout>;
function debouncedRefresh() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(refresh, 350);
}

function resetFilters() {
    Object.assign(filters, initialFilters);
    page.value = 1;
    refresh();
}

function onPageChange(value: number) {
    page.value = value;
    refresh();
}

function onPerPageChange(value: number) {
    perPage.value = value;
    page.value = 1;
    refresh();
}

async function openVendorDetail(vendorId: number) {
    detailOpen.value = true;
    detailLoading.value = true;
    try {
        detail.value = await getAdminVendorDetail(vendorId, filters);
    }
    finally {
        detailLoading.value = false;
    }
}

async function openMyDetail() {
    detailOpen.value = true;
    detailLoading.value = true;
    try {
        detail.value = await getMyDetail(filters);
    }
    finally {
        detailLoading.value = false;
    }
}

const vendorColumns: ColumnDef<VendorCommissionSummary>[] = [
    {
        accessorKey: 'vendor.full_name',
        header: 'Vendeur',
        cell: ({ row }) => row.original.vendor.full_name,
    },
    {
        accessorKey: 'contracts_signed',
        header: 'BC signés',
    },
    {
        accessorKey: 'amount_received',
        header: 'Encaissé',
        cell: ({ row }) => formatEuro(row.original.amount_received),
    },
    {
        accessorKey: 'commission_due',
        header: 'Commissions dues',
        cell: ({ row }) => formatEuro(row.original.commission_due),
    },
    {
        accessorKey: 'commission_paid',
        header: 'Commissions versées',
        cell: ({ row }) => formatEuro(row.original.commission_paid),
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => h(Button, {
            variant: 'outline',
            size: 'sm',
            class: 'rounded-md',
            onClick: () => props.isAdminView
                ? openVendorDetail(row.original.vendor.id)
                : openMyDetail(),
        }, () => [h(Eye, { class: 'h-4 w-4' })]),
    },
];

onMounted(refresh);
</script>
