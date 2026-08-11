<template>
    <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-5xl space-y-6">
            <header class="flex flex-wrap items-start justify-between gap-3">
                <div class="space-y-1">
                    <h1 class="text-2xl font-semibold">
                        {{ isAdminView ? 'Commissions Infiswap Premium' : 'Mes commissions' }}
                    </h1>
                    <p class="text-sm text-muted-foreground">
                        Assiette : le montant hors taxes de la facture Stripe. Versement 30 jours
                        après encaissement, sous réserve que l'abonnée ait vérifié son email
                        et ouvert au moins une session.
                    </p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <Button
                        v-if="isAdminView"
                        class="min-h-11"
                        :disabled="selectedPayableIds.length === 0 || loading"
                        @click="markSelectedPaid"
                    >
                        Marquer payées ({{ selectedPayableIds.length }})
                    </Button>
                    <Button
                        variant="outline"
                        class="min-h-11"
                        :disabled="lines.length === 0"
                        @click="exportCsv"
                    >
                        Export du mois (CSV)
                    </Button>
                </div>
            </header>

            <div
                v-if="isAdminView"
                class="flex flex-col gap-2 sm:flex-row sm:items-center"
            >
                <label
                    class="text-sm font-medium"
                    for="sales-rep-filter"
                >
                    Commercial
                </label>
                <select
                    id="sales-rep-filter"
                    v-model="selectedSalesUserId"
                    class="min-h-11 rounded-md border bg-background px-3 text-sm dark:border-gray-700"
                    @change="reload"
                >
                    <option value="">
                        Tous les commerciaux
                    </option>
                    <option
                        v-for="rep in salesReps"
                        :key="rep.id"
                        :value="String(rep.id)"
                    >
                        {{ rep.name || rep.email }}
                    </option>
                </select>
            </div>

            <dl class="grid gap-3 sm:grid-cols-4">
                <div
                    v-for="card in totalCards"
                    :key="card.status"
                    class="rounded-xl border p-4 dark:border-gray-700"
                >
                    <dt class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {{ card.label }}
                    </dt>
                    <dd class="mt-1 text-2xl font-semibold">
                        {{ formatEuro(card.amount) }}
                    </dd>
                    <dd class="text-xs text-muted-foreground">
                        {{ card.lines }} ligne(s)
                    </dd>
                </div>
            </dl>

            <div class="overflow-x-auto rounded-xl border dark:border-gray-700">
                <table class="min-w-full text-sm">
                    <thead class="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                            <th
                                v-if="isAdminView"
                                class="px-4 py-3"
                            >
                                <input
                                    type="checkbox"
                                    class="size-4"
                                    :checked="allPayableSelected"
                                    :disabled="payableLines.length === 0"
                                    :aria-label="'Sélectionner toutes les commissions à payer'"
                                    @change="toggleSelectAllPayable(($event.target as HTMLInputElement).checked)"
                                >
                            </th>
                            <th
                                v-if="isAdminView"
                                class="px-4 py-3"
                            >
                                Commercial
                            </th>
                            <th class="px-4 py-3">
                                Abonnée
                            </th>
                            <th class="px-4 py-3">
                                Base HT
                            </th>
                            <th class="px-4 py-3">
                                Taux
                            </th>
                            <th class="px-4 py-3">
                                Commission
                            </th>
                            <th class="px-4 py-3">
                                Statut
                            </th>
                            <th class="px-4 py-3">
                                Encaissé le
                            </th>
                            <th class="px-4 py-3">
                                Payable le
                            </th>
                            <th
                                v-if="isAdminView"
                                class="px-4 py-3"
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="line in lines"
                            :key="line.id"
                            class="border-t dark:border-gray-700"
                        >
                            <td
                                v-if="isAdminView"
                                class="px-4 py-3"
                            >
                                <input
                                    v-if="line.status === 'payable'"
                                    v-model="selectedIds"
                                    type="checkbox"
                                    class="size-4"
                                    :value="line.id"
                                    :aria-label="`Sélectionner la commission ${line.id}`"
                                >
                            </td>
                            <td
                                v-if="isAdminView"
                                class="px-4 py-3"
                            >
                                <span class="block">{{ line.sales_user?.name || '—' }}</span>
                                <span class="text-xs text-muted-foreground">{{ line.sales_user?.email }}</span>
                            </td>
                            <td class="px-4 py-3">
                                <span class="block">{{ line.subscriber.name || '—' }}</span>
                                <span class="text-xs text-muted-foreground">{{ line.subscriber.email }}</span>
                            </td>
                            <td class="px-4 py-3">
                                {{ formatEuro(line.base_amount_ht) }}
                            </td>
                            <td class="px-4 py-3">
                                {{ Math.round(line.rate * 1000) / 10 }} %
                            </td>
                            <td class="px-4 py-3 font-semibold">
                                {{ formatEuro(line.amount) }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="rounded-full px-2 py-1 text-xs font-semibold"
                                    :class="STATUS_CLASS[line.status]"
                                >
                                    {{ STATUS_LABEL[line.status] }}
                                </span>
                                <span
                                    v-if="line.clawback_reason"
                                    class="mt-1 block text-xs text-muted-foreground"
                                >
                                    {{ line.clawback_reason }}
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                {{ formatDate(line.invoice_paid_at) }}
                            </td>
                            <td class="px-4 py-3">
                                {{ formatDate(line.payable_at) }}
                            </td>
                            <td
                                v-if="isAdminView"
                                class="px-4 py-3"
                            >
                                <Button
                                    v-if="line.status === 'payable'"
                                    size="sm"
                                    variant="outline"
                                    class="min-h-9"
                                    :disabled="loading"
                                    @click="markOnePaid(line.id)"
                                >
                                    Payée
                                </Button>
                                <span
                                    v-else-if="line.paid_at"
                                    class="text-xs text-muted-foreground"
                                >
                                    {{ formatDate(line.paid_at) }}
                                </span>
                                <span
                                    v-else
                                    class="text-xs text-muted-foreground"
                                >
                                    —
                                </span>
                            </td>
                        </tr>
                        <tr v-if="lines.length === 0">
                            <td
                                :colspan="isAdminView ? 10 : 7"
                                class="px-4 py-8 text-center text-muted-foreground"
                            >
                                Aucune commission enregistrée pour le moment.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { SalesCommissionStatus } from '~/composables/useSalesChannel';

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

useHead({
    title: 'Commissions Infiswap Premium',
});

const STATUS_LABEL: Record<SalesCommissionStatus, string> = {
    pending: 'En attente',
    payable: 'À payer',
    paid: 'Payée',
    clawed_back: 'Annulée',
};

const STATUS_CLASS: Record<SalesCommissionStatus, string> = {
    pending: 'bg-muted text-muted-foreground',
    payable: 'bg-amber-100 text-amber-800',
    paid: 'bg-success/10 text-success',
    clawed_back: 'bg-destructive/10 text-destructive',
};

const {
    summary,
    loading,
    fetchCommissions,
    markCommissionPaid,
    markCommissionsPaid,
} = useSalesChannel();

/** String pour éviter la coercition HTML `null` → `"null"`. */
const selectedSalesUserId = ref('');
const selectedIds = ref<number[]>([]);

/** Présent uniquement dans la réponse admin (`sales_reps`). */
const isAdminView = computed(() => Array.isArray(summary.value?.sales_reps));
const salesReps = computed(() => summary.value?.sales_reps ?? []);
const lines = computed(() => summary.value?.commissions ?? []);
const payableLines = computed(() => lines.value.filter(line => line.status === 'payable'));
const selectedPayableIds = computed(() =>
    selectedIds.value.filter(id => payableLines.value.some(line => line.id === id)),
);
const allPayableSelected = computed(() =>
    payableLines.value.length > 0
    && payableLines.value.every(line => selectedIds.value.includes(line.id)),
);

const totalCards = computed(() =>
    (Object.keys(STATUS_LABEL) as SalesCommissionStatus[]).map(status => ({
        status,
        label: STATUS_LABEL[status],
        amount: summary.value?.totals?.[status]?.amount ?? 0,
        lines: summary.value?.totals?.[status]?.lines ?? 0,
    })),
);

function formatEuro(amount: number): string {
    return new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(value: string | null): string {
    return value ? new Date(value).toLocaleDateString('fr-BE') : '—';
}

function toggleSelectAllPayable(checked: boolean) {
    selectedIds.value = checked ? payableLines.value.map(line => line.id) : [];
}

async function reload() {
    const raw = selectedSalesUserId.value.trim();
    const parsed = raw === '' ? null : Number(raw);
    selectedIds.value = [];
    await fetchCommissions(parsed !== null && Number.isFinite(parsed) ? parsed : null);
}

async function markOnePaid(id: number) {
    if (await markCommissionPaid(id)) {
        await reload();
    }
}

async function markSelectedPaid() {
    if (await markCommissionsPaid(selectedPayableIds.value)) {
        await reload();
    }
}

/** Export du mois en cours, destiné à la facturation / au contrôle admin. */
function exportCsv() {
    const now = new Date();
    const rows = lines.value.filter((line) => {
        const reference = line.invoice_paid_at ? new Date(line.invoice_paid_at) : null;

        return reference
            && reference.getMonth() === now.getMonth()
            && reference.getFullYear() === now.getFullYear();
    });

    const header = isAdminView.value
        ? ['commercial', 'commercial_email', 'abonnee', 'email', 'base_ht', 'taux', 'commission', 'statut', 'encaisse_le', 'payable_le', 'payee_le']
        : ['abonnee', 'email', 'base_ht', 'taux', 'commission', 'statut', 'encaisse_le', 'payable_le'];

    const body = rows.map((line) => {
        const base = [
            line.subscriber.name ?? '',
            line.subscriber.email ?? '',
            line.base_amount_ht.toFixed(2),
            line.rate.toString(),
            line.amount.toFixed(2),
            line.status,
            line.invoice_paid_at ?? '',
            line.payable_at ?? '',
        ];

        if (!isAdminView.value) {
            return base;
        }

        return [
            line.sales_user?.name ?? '',
            line.sales_user?.email ?? '',
            ...base,
            line.paid_at ?? '',
        ];
    });

    const csv = [header, ...body]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
        .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commissions-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

onMounted(reload);
</script>
