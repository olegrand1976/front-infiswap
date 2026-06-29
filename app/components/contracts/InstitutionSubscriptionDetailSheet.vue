<script setup lang="ts">
import { ExternalLink, FileText } from 'lucide-vue-next';
import { formatToDMY } from '@/composables/useDate';
import type { InstitutionSubscriptionHistory, InstitutionSubscriptionItem, InstitutionSubscriptionPayment } from '@/composables/useInstitutionSubscription';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogScrollContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const props = defineProps<{
    open: boolean;
    subscription: InstitutionSubscriptionItem | null;
    histories?: InstitutionSubscriptionHistory[];
}>();

const isArchived = computed(() => props.subscription?.is_archived ?? false);

const emit = defineEmits<{
    'update:open': [value: boolean];
    refresh: [];
}>();

const {
    updateBilling,
    createPayment,
    markCommissionPaid,
    downloadBillingFile,
    sendProforma,
    sendInvoice,
    viewPdf,
} = useInstitutionSubscription();
const { $toast } = useNuxtApp();

const billingForm = reactive({
    proforma_reference: '',
    invoice_number: '',
    invoice_issued_at: '',
});
const proformaFile = ref<File | null>(null);
const invoiceFile = ref<File | null>(null);
const savingBilling = ref(false);
const sendingProforma = ref(false);
const sendingInvoice = ref(false);

const paymentForm = reactive({
    amount_received: '',
    received_at: '',
    period_start: '',
    period_end: '',
    payment_reference: '',
    notes: '',
});
const savingPayment = ref(false);
const pdfLoading = ref(false);

const hasProformaFile = computed(() => Boolean(props.subscription?.billing?.proforma_file_path));
const hasInvoiceFile = computed(() => Boolean(props.subscription?.billing?.invoice_file_path));
const proformaAlreadySent = computed(() => Boolean(props.subscription?.billing?.proforma_sent_at));
const invoiceAlreadySent = computed(() => Boolean(props.subscription?.billing?.invoice_emailed_at));
const pendingProformaUpload = computed(() => proformaFile.value !== null);
const pendingInvoiceUpload = computed(() => invoiceFile.value !== null);

const statusBadgeClass = computed(() => {
    const status = props.subscription?.status;
    if (!status) return 'bg-gray-100 text-gray-700';
    if (status === 'draft') return 'bg-blue-100 text-blue-800';
    if (status === 'paid' || status === 'accomplished') return 'bg-green-100 text-green-800';
    if (['sent_for_signature', 'sign', 'pending_signature', 'signed'].includes(status)) {
        return 'bg-amber-100 text-amber-800';
    }
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-700';
});

watch(() => props.subscription, (sub) => {
    if (!sub?.billing) {
        billingForm.proforma_reference = '';
        billingForm.invoice_number = '';
        billingForm.invoice_issued_at = '';
        return;
    }
    billingForm.proforma_reference = sub.billing.proforma_reference ?? '';
    billingForm.invoice_number = sub.billing.invoice_number ?? '';
    billingForm.invoice_issued_at = sub.billing.invoice_issued_at?.slice(0, 10) ?? '';
}, { immediate: true });

async function saveBilling() {
    if (!props.subscription) return;
    savingBilling.value = true;
    try {
        const formData = new FormData();
        Object.entries(billingForm).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
        if (proformaFile.value) formData.append('proforma_file', proformaFile.value);
        if (invoiceFile.value) formData.append('invoice_file', invoiceFile.value);
        await updateBilling(props.subscription.id, formData);
        proformaFile.value = null;
        invoiceFile.value = null;
        $toast({ description: 'Suivi facturation enregistré.' });
        emit('refresh');
    }
    catch {
        $toast({ description: 'Erreur lors de la mise à jour.', variant: 'destructive' });
    }
    finally {
        savingBilling.value = false;
    }
}

async function handleSendProforma() {
    if (!props.subscription) return;
    if (proformaAlreadySent.value && !confirm('Renvoyer la proforma par e-mail ?')) return;
    sendingProforma.value = true;
    try {
        await sendProforma(props.subscription.id);
        $toast({ description: 'Proforma envoyée par e-mail.' });
        emit('refresh');
    }
    catch {
        $toast({ description: 'Impossible d\'envoyer la proforma.', variant: 'destructive' });
    }
    finally {
        sendingProforma.value = false;
    }
}

async function handleSendInvoice() {
    if (!props.subscription) return;
    if (invoiceAlreadySent.value && !confirm('Renvoyer la facture par e-mail ?')) return;
    sendingInvoice.value = true;
    try {
        await sendInvoice(props.subscription.id);
        $toast({ description: 'Facture envoyée par e-mail.' });
        emit('refresh');
    }
    catch {
        $toast({ description: 'Impossible d\'envoyer la facture.', variant: 'destructive' });
    }
    finally {
        sendingInvoice.value = false;
    }
}

async function handleDownload(type: 'proforma' | 'invoice') {
    if (!props.subscription) return;
    try {
        await downloadBillingFile(props.subscription.id, type);
    }
    catch {
        $toast({ description: 'Impossible de télécharger le fichier.', variant: 'destructive' });
    }
}

async function addPayment() {
    if (!props.subscription) return;
    savingPayment.value = true;
    try {
        await createPayment(props.subscription.id, { ...paymentForm });
        paymentForm.amount_received = '';
        paymentForm.received_at = '';
        paymentForm.period_start = '';
        paymentForm.period_end = '';
        paymentForm.payment_reference = '';
        paymentForm.notes = '';
        $toast({ description: 'Encaissement enregistré.' });
        emit('refresh');
    }
    catch {
        $toast({ description: 'Erreur lors de l\'enregistrement.', variant: 'destructive' });
    }
    finally {
        savingPayment.value = false;
    }
}

async function payCommission(payment: InstitutionSubscriptionPayment) {
    if (!props.subscription) return;
    try {
        await markCommissionPaid(props.subscription.id, payment.id);
        $toast({ description: 'Commission marquée comme payée.' });
        emit('refresh');
    }
    catch {
        $toast({ description: 'Erreur.', variant: 'destructive' });
    }
}

async function viewSignedBcPdf() {
    if (!props.subscription?.institution?.id) return;

    pdfLoading.value = true;
    try {
        await viewPdf(props.subscription.institution.id, props.subscription.id);
    }
    catch {
        $toast({ description: 'Impossible d\'ouvrir le PDF.', variant: 'destructive' });
    }
    finally {
        pdfLoading.value = false;
    }
}
</script>

<template>
    <Dialog
        :open="open"
        @update:open="emit('update:open', $event)"
    >
        <DialogScrollContent class="max-w-3xl w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden">
            <DialogHeader class="sticky top-0 z-10 bg-background border-b px-6 py-4 pr-12">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <DialogTitle class="text-xl font-semibold text-primary">
                        BC {{ subscription?.reference ?? subscription?.id }}
                    </DialogTitle>
                    <span
                        v-if="subscription"
                        class="px-2.5 py-1 rounded-full text-xs font-medium"
                        :class="statusBadgeClass"
                    >
                        {{ subscription.status_label ?? subscription.status }}
                    </span>
                </div>
            </DialogHeader>

            <div
                v-if="subscription"
                class="px-6 py-5 space-y-5 max-h-[calc(90vh-5rem)] overflow-y-auto"
            >
                <div
                    v-if="isArchived"
                    class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                >
                    BC archivé le {{ subscription.deleted_at ? formatToDMY(subscription.deleted_at) : '—' }} — consultation seule.
                </div>

                <section class="rounded-lg border bg-muted/30 p-4">
                    <dl class="grid gap-3 sm:grid-cols-2 text-sm">
                        <div>
                            <dt class="text-muted-foreground mb-0.5">
                                Institution
                            </dt>
                            <dd class="font-medium">
                                {{ subscription.institution?.name ?? '—' }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-muted-foreground mb-0.5">
                                Demandeur
                            </dt>
                            <dd class="font-medium">
                                {{ subscription.requester?.full_name ?? '—' }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-muted-foreground mb-0.5">
                                Base BC
                            </dt>
                            <dd class="font-medium">
                                {{ subscription.formula_label ?? '—' }}
                            </dd>
                        </div>
                        <div
                            v-if="subscription.totals"
                            class="sm:col-span-2"
                        >
                            <dt class="text-muted-foreground mb-0.5">
                                Encaissé / Commission
                            </dt>
                            <dd class="font-medium">
                                {{ subscription.totals.amount_received }} € / {{ subscription.totals.commission_due }} € dûes
                            </dd>
                        </div>
                    </dl>
                    <Button
                        v-if="subscription.institution?.id"
                        variant="outline"
                        size="sm"
                        class="mt-4 rounded-md"
                        as-child
                    >
                        <NuxtLink :to="`/dashboard/admin/institutions/${subscription.institution.id}/show`">
                            <ExternalLink class="w-3.5 h-3.5 mr-1.5" />
                            Voir la fiche institution
                        </NuxtLink>
                    </Button>
                </section>

                <section class="rounded-lg border p-4 space-y-3">
                    <h3 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        Signature
                    </h3>
                    <dl class="grid gap-3 sm:grid-cols-3 text-sm">
                        <div>
                            <dt class="text-muted-foreground mb-0.5">
                                Signataire client
                            </dt>
                            <dd>{{ subscription.signatory?.full_name ?? '—' }}</dd>
                        </div>
                        <div>
                            <dt class="text-muted-foreground mb-0.5">
                                Commercial
                            </dt>
                            <dd>{{ subscription.requester?.full_name ?? '—' }}</dd>
                        </div>
                        <div>
                            <dt class="text-muted-foreground mb-0.5">
                                Signé le
                            </dt>
                            <dd>{{ subscription.signed_at ? formatToDMY(subscription.signed_at) : '—' }}</dd>
                        </div>
                    </dl>
                    <Button
                        v-if="subscription.institution?.id"
                        type="button"
                        variant="outline"
                        size="sm"
                        class="rounded-md"
                        :disabled="pdfLoading"
                        :in-progress="pdfLoading"
                        @click="viewSignedBcPdf"
                    >
                        <FileText class="w-3.5 h-3.5 mr-1.5" />
                        {{ subscription.has_signed_pdf ? 'Voir BC signé' : 'Voir le PDF' }}
                    </Button>
                </section>

                <section
                    v-if="!isArchived"
                    class="rounded-lg border p-4 space-y-4"
                >
                    <h3 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        Proforma & facture
                    </h3>
                    <div class="grid gap-3 sm:grid-cols-2">
                        <div>
                            <Label>Réf. proforma</Label>
                            <Input
                                v-model="billingForm.proforma_reference"
                                class="mt-1"
                            />
                        </div>
                        <div>
                            <Label>N° facture</Label>
                            <Input
                                v-model="billingForm.invoice_number"
                                class="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Date facture</Label>
                            <Input
                                v-model="billingForm.invoice_issued_at"
                                type="date"
                                class="mt-1"
                            />
                        </div>
                        <div>
                            <Label>PDF proforma</Label>
                            <Input
                                type="file"
                                accept="application/pdf"
                                class="mt-1"
                                @change="proformaFile = ($event.target as HTMLInputElement).files?.[0] ?? null"
                            />
                            <p
                                v-if="subscription.billing?.proforma_file_uploaded_at"
                                class="text-xs text-muted-foreground mt-1"
                            >
                                Inséré le {{ formatToDMY(subscription.billing.proforma_file_uploaded_at) }}
                                <button
                                    type="button"
                                    class="text-primary underline ml-1"
                                    @click="handleDownload('proforma')"
                                >
                                    Télécharger
                                </button>
                            </p>
                            <p
                                v-if="pendingProformaUpload"
                                class="text-xs text-amber-700 mt-1"
                            >
                                Enregistrez le fichier avant de l'envoyer par e-mail.
                            </p>
                            <p
                                v-if="subscription.billing?.proforma_sent_at"
                                class="text-xs text-muted-foreground mt-1"
                            >
                                Envoyé le {{ formatToDMY(subscription.billing.proforma_sent_at) }}
                            </p>
                        </div>
                        <div>
                            <Label>PDF facture</Label>
                            <Input
                                type="file"
                                accept="application/pdf"
                                class="mt-1"
                                @change="invoiceFile = ($event.target as HTMLInputElement).files?.[0] ?? null"
                            />
                            <p
                                v-if="subscription.billing?.invoice_file_uploaded_at"
                                class="text-xs text-muted-foreground mt-1"
                            >
                                Inséré le {{ formatToDMY(subscription.billing.invoice_file_uploaded_at) }}
                                <button
                                    type="button"
                                    class="text-primary underline ml-1"
                                    @click="handleDownload('invoice')"
                                >
                                    Télécharger
                                </button>
                            </p>
                            <p
                                v-if="pendingInvoiceUpload"
                                class="text-xs text-amber-700 mt-1"
                            >
                                Enregistrez le fichier avant de l'envoyer par e-mail.
                            </p>
                            <p
                                v-if="subscription.billing?.invoice_emailed_at"
                                class="text-xs text-muted-foreground mt-1"
                            >
                                Envoyé le {{ formatToDMY(subscription.billing.invoice_emailed_at) }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2 pt-1">
                        <Button
                            class="rounded-md"
                            :disabled="savingBilling"
                            :in-progress="savingBilling"
                            @click="saveBilling"
                        >
                            Enregistrer facturation
                        </Button>
                        <Button
                            class="rounded-md"
                            variant="outline"
                            :disabled="!hasProformaFile || sendingProforma || pendingProformaUpload"
                            :in-progress="sendingProforma"
                            @click="handleSendProforma"
                        >
                            {{ proformaAlreadySent ? 'Renvoyer proforma' : 'Envoyer proforma' }}
                        </Button>
                        <Button
                            class="rounded-md"
                            variant="outline"
                            :disabled="!hasInvoiceFile || sendingInvoice || pendingInvoiceUpload"
                            :in-progress="sendingInvoice"
                            @click="handleSendInvoice"
                        >
                            {{ invoiceAlreadySent ? 'Renvoyer facture' : 'Envoyer facture' }}
                        </Button>
                    </div>
                </section>

                <section class="rounded-lg border p-4 space-y-4">
                    <h3 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        Encaissements & commissions
                    </h3>
                    <div
                        v-if="subscription.payments?.length"
                        class="space-y-2"
                    >
                        <div
                            v-for="payment in subscription.payments"
                            :key="payment.id"
                            class="rounded-md border bg-muted/20 p-3 text-sm flex flex-wrap justify-between gap-2"
                        >
                            <div>
                                <p class="font-medium">
                                    {{ formatToDMY(payment.received_at) }} — {{ payment.amount_received }} €
                                </p>
                                <p class="text-muted-foreground text-xs mt-0.5">
                                    Commission année {{ payment.subscription_year }} :
                                    {{ payment.commission_amount }} € ({{ payment.commission_rate }} %)
                                </p>
                            </div>
                            <Button
                                v-if="!payment.commission_paid_at && !isArchived"
                                size="sm"
                                variant="outline"
                                class="rounded-md shrink-0"
                                @click="payCommission(payment)"
                            >
                                Marquer commission payée
                            </Button>
                            <span
                                v-else
                                class="text-green-700 text-xs font-medium self-center shrink-0"
                            >
                                Commission payée
                            </span>
                        </div>
                    </div>
                    <p
                        v-else
                        class="text-sm text-muted-foreground"
                    >
                        Aucun encaissement enregistré.
                    </p>

                    <div
                        v-if="!isArchived"
                        class="grid gap-3 sm:grid-cols-2 border-t pt-4"
                    >
                        <div>
                            <Label>Montant reçu (€)</Label>
                            <Input
                                v-model="paymentForm.amount_received"
                                type="number"
                                step="0.01"
                                class="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Date encaissement</Label>
                            <Input
                                v-model="paymentForm.received_at"
                                type="date"
                                class="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Début période</Label>
                            <Input
                                v-model="paymentForm.period_start"
                                type="date"
                                class="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Fin période</Label>
                            <Input
                                v-model="paymentForm.period_end"
                                type="date"
                                class="mt-1"
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <Label>Référence paiement</Label>
                            <Input
                                v-model="paymentForm.payment_reference"
                                class="mt-1"
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <Label>Notes</Label>
                            <Textarea
                                v-model="paymentForm.notes"
                                class="mt-1"
                            />
                        </div>
                    </div>
                    <Button
                        v-if="!isArchived"
                        class="rounded-md"
                        :disabled="savingPayment"
                        :in-progress="savingPayment"
                        @click="addPayment"
                    >
                        Ajouter encaissement
                    </Button>
                </section>

                <section class="rounded-lg border p-4 space-y-3">
                    <h3 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        Historique des actions
                    </h3>
                    <div
                        v-if="histories?.length"
                        class="space-y-2 max-h-64 overflow-y-auto"
                    >
                        <div
                            v-for="entry in histories"
                            :key="entry.id"
                            class="rounded-md border bg-muted/20 px-3 py-2 text-sm"
                        >
                            <div class="flex flex-wrap items-baseline justify-between gap-2">
                                <span class="font-medium">{{ entry.event_label }}</span>
                                <span class="text-xs text-muted-foreground">
                                    {{ entry.created_at ? formatToDMY(entry.created_at) : '—' }}
                                </span>
                            </div>
                            <p
                                v-if="entry.description"
                                class="text-muted-foreground text-xs mt-0.5"
                            >
                                {{ entry.description }}
                            </p>
                            <p
                                v-if="entry.actor?.full_name"
                                class="text-xs text-muted-foreground mt-0.5"
                            >
                                Par {{ entry.actor.full_name }}
                            </p>
                        </div>
                    </div>
                    <p
                        v-else
                        class="text-sm text-muted-foreground"
                    >
                        Aucune action enregistrée.
                    </p>
                </section>
            </div>
        </DialogScrollContent>
    </Dialog>
</template>
