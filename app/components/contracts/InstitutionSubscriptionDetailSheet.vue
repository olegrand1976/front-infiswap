<script setup lang="ts">
import { formatToDMY } from '@/composables/useDate';
import type { InstitutionSubscriptionItem, InstitutionSubscriptionPayment } from '@/composables/useInstitutionSubscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

const props = defineProps<{
    open: boolean;
    subscription: InstitutionSubscriptionItem | null;
}>();

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

const hasProformaFile = computed(() => Boolean(props.subscription?.billing?.proforma_file_path));
const hasInvoiceFile = computed(() => Boolean(props.subscription?.billing?.invoice_file_path));
const proformaAlreadySent = computed(() => Boolean(props.subscription?.billing?.proforma_sent_at));
const invoiceAlreadySent = computed(() => Boolean(props.subscription?.billing?.invoice_emailed_at));
const pendingProformaUpload = computed(() => proformaFile.value !== null);
const pendingInvoiceUpload = computed(() => invoiceFile.value !== null);

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
</script>

<template>
    <Sheet
        :open="open"
        @update:open="emit('update:open', $event)"
    >
        <SheetContent class="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
                <SheetTitle>
                    BC {{ subscription?.reference ?? subscription?.id }}
                </SheetTitle>
            </SheetHeader>

            <div
                v-if="subscription"
                class="space-y-8 mt-6"
            >
                <section class="space-y-2 text-sm">
                    <p><strong>Institution :</strong> {{ subscription.institution?.name ?? '—' }}</p>
                    <p><strong>Demandeur :</strong> {{ subscription.requester?.full_name ?? '—' }}</p>
                    <p><strong>Statut :</strong> {{ subscription.status_label ?? subscription.status }}</p>
                    <p><strong>Base BC :</strong> {{ subscription.formula_label ?? '—' }}</p>
                    <NuxtLink
                        v-if="subscription.institution?.id"
                        :to="`/dashboard/admin/institutions/${subscription.institution.id}/show`"
                        class="text-primary underline text-sm"
                    >
                        Voir la fiche institution
                    </NuxtLink>
                </section>

                <section class="space-y-4 border-t pt-4">
                    <h3 class="font-semibold">
                        Proforma & facture
                    </h3>
                    <div class="grid gap-3 sm:grid-cols-2">
                        <div>
                            <Label>Réf. proforma</Label>
                            <Input v-model="billingForm.proforma_reference" />
                        </div>
                        <div>
                            <Label>N° facture</Label>
                            <Input v-model="billingForm.invoice_number" />
                        </div>
                        <div>
                            <Label>Date facture</Label>
                            <Input
                                v-model="billingForm.invoice_issued_at"
                                type="date"
                            />
                        </div>
                        <div>
                            <Label>PDF proforma</Label>
                            <Input
                                type="file"
                                accept="application/pdf"
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
                    <div class="flex flex-wrap gap-2">
                        <Button
                            class="rounded-md"
                            :disabled="savingBilling"
                            @click="saveBilling"
                        >
                            Enregistrer facturation
                        </Button>
                        <Button
                            class="rounded-md"
                            variant="outline"
                            :disabled="!hasProformaFile || sendingProforma || pendingProformaUpload"
                            @click="handleSendProforma"
                        >
                            {{ proformaAlreadySent ? 'Renvoyer proforma par e-mail' : 'Envoyer proforma par e-mail' }}
                        </Button>
                        <Button
                            class="rounded-md"
                            variant="outline"
                            :disabled="!hasInvoiceFile || sendingInvoice || pendingInvoiceUpload"
                            @click="handleSendInvoice"
                        >
                            {{ invoiceAlreadySent ? 'Renvoyer facture par e-mail' : 'Envoyer facture par e-mail' }}
                        </Button>
                    </div>
                </section>

                <section class="space-y-4 border-t pt-4">
                    <h3 class="font-semibold">
                        Encaissements & commissions
                    </h3>
                    <div
                        v-if="subscription.payments?.length"
                        class="space-y-2"
                    >
                        <div
                            v-for="payment in subscription.payments"
                            :key="payment.id"
                            class="border rounded-md p-3 text-sm flex flex-wrap justify-between gap-2"
                        >
                            <div>
                                <p>{{ formatToDMY(payment.received_at) }} — {{ payment.amount_received }} €</p>
                                <p class="text-muted-foreground">
                                    Commission année {{ payment.subscription_year }} :
                                    {{ payment.commission_amount }} € ({{ payment.commission_rate }} %)
                                </p>
                            </div>
                            <Button
                                v-if="!payment.commission_paid_at"
                                size="sm"
                                variant="outline"
                                class="rounded-md"
                                @click="payCommission(payment)"
                            >
                                Marquer commission payée
                            </Button>
                            <span
                                v-else
                                class="text-green-700 text-xs self-center"
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

                    <div class="grid gap-3 sm:grid-cols-2 border-t pt-4">
                        <div>
                            <Label>Montant reçu (€)</Label>
                            <Input
                                v-model="paymentForm.amount_received"
                                type="number"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <Label>Date encaissement</Label>
                            <Input
                                v-model="paymentForm.received_at"
                                type="date"
                            />
                        </div>
                        <div>
                            <Label>Début période</Label>
                            <Input
                                v-model="paymentForm.period_start"
                                type="date"
                            />
                        </div>
                        <div>
                            <Label>Fin période</Label>
                            <Input
                                v-model="paymentForm.period_end"
                                type="date"
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <Label>Référence paiement</Label>
                            <Input v-model="paymentForm.payment_reference" />
                        </div>
                        <div class="sm:col-span-2">
                            <Label>Notes</Label>
                            <Textarea v-model="paymentForm.notes" />
                        </div>
                    </div>
                    <Button
                        class="rounded-md"
                        :disabled="savingPayment"
                        @click="addPayment"
                    >
                        Ajouter encaissement
                    </Button>
                </section>
            </div>
        </SheetContent>
    </Sheet>
</template>
