import { useState, useNuxtApp } from '#app';

export type InstitutionSubscriptionPayment = {
    id: number;
    period_start?: string | null;
    period_end?: string | null;
    amount_received: number;
    received_at: string;
    payment_reference?: string | null;
    subscription_year: number;
    commission_rate: number;
    commission_amount: number;
    commission_paid_at?: string | null;
    notes?: string | null;
};

export type InstitutionSubscriptionBilling = {
    proforma_sent_at?: string | null;
    proforma_reference?: string | null;
    proforma_file_path?: string | null;
    proforma_file_uploaded_at?: string | null;
    invoice_number?: string | null;
    invoice_issued_at?: string | null;
    invoice_file_path?: string | null;
    invoice_file_uploaded_at?: string | null;
    invoice_emailed_at?: string | null;
};

export type InstitutionSubscriptionHistory = {
    id: number;
    event: string;
    event_label: string;
    description?: string | null;
    metadata?: Record<string, unknown> | null;
    actor?: { id: number; full_name: string; email: string } | null;
    created_at?: string | null;
};

export type InstitutionSubscriptionItem = {
    id: number;
    reference?: string | null;
    status?: string | null;
    status_label?: string | null;
    documenso_status?: string | null;
    documenso_status_label?: string | null;
    can_delete?: boolean;
    is_archived?: boolean;
    deleted_at?: string | null;
    formula?: string | null;
    formula_label?: string | null;
    payment_mode?: string | null;
    created_at?: string | null;
    signed_at?: string | null;
    has_signed_pdf?: boolean;
    institution?: { id: number; name: string } | null;
    requester?: { id: number; full_name: string; email: string } | null;
    signatory?: { id: number; full_name: string; email: string } | null;
    billing?: InstitutionSubscriptionBilling | null;
    payments?: InstitutionSubscriptionPayment[];
    totals?: {
        amount_received: number;
        commission_due: number;
        commission_paid: number;
        last_payment_at?: string | null;
    };
    subscription?: {
        can_cancel?: boolean;
        can_delete_draft?: boolean;
        contract_id?: number | null;
    };
};

export type InstitutionSubscriptionKpis = {
    total: number;
    created_this_month: number;
    created_previous_month: number;
    signed: number;
    pending_signature: number;
    draft: number;
    active: number;
    total_received: number;
};

export const useInstitutionSubscription = () => {
    const { $apifetch } = useNuxtApp();
    const subscriptions = useState<InstitutionSubscriptionItem[]>('institutionSubscriptions', () => []);
    const currentSubscription = useState<InstitutionSubscriptionItem | null>('currentInstitutionSubscription', () => null);
    const count = useState<number>('institutionSubscriptionsCount', () => 0);
    const loading = useState<boolean>('institutionSubscriptionsLoading', () => false);

    async function getSubscriptions(page = 1, perPage = 25, options: Record<string, unknown> = {}) {
        loading.value = true;
        try {
            const response = await $apifetch('api/crm/institution-subscriptions', {
                params: { page, perPage, ...options },
            });
            subscriptions.value = response.subscriptions?.data ?? response.subscriptions ?? [];
            count.value = response.count ?? 0;
            return response;
        }
        finally {
            loading.value = false;
        }
    }

    async function getSubscriptionKpis(options: Record<string, unknown> = {}): Promise<InstitutionSubscriptionKpis> {
        const response = await $apifetch('api/crm/institution-subscriptions/kpis', {
            params: options,
        });

        return response.data as InstitutionSubscriptionKpis;
    }

    async function getSubscription(contractId: number) {
        const response = await $apifetch(`api/crm/institution-subscriptions/${contractId}`);
        currentSubscription.value = response.data;
        return {
            data: response.data as InstitutionSubscriptionItem,
            histories: (response.histories ?? []) as InstitutionSubscriptionHistory[],
        };
    }

    async function updateBilling(contractId: number, formData: FormData) {
        const response = await $apifetch(`api/crm/institution-subscriptions/${contractId}/billing`, {
            method: 'PUT',
            body: formData,
        });
        currentSubscription.value = response.data;
        return response;
    }

    async function createPayment(contractId: number, payload: Record<string, unknown>) {
        const response = await $apifetch(`api/crm/institution-subscriptions/${contractId}/payments`, {
            method: 'POST',
            body: payload,
        });
        currentSubscription.value = response.data;
        return response;
    }

    async function markCommissionPaid(contractId: number, paymentId: number) {
        const response = await $apifetch(
            `api/crm/institution-subscriptions/${contractId}/payments/${paymentId}/mark-commission-paid`,
            { method: 'POST' },
        );
        currentSubscription.value = response.data;
        return response;
    }

    async function deleteSubscription(contractId: number) {
        return await $apifetch(`api/crm/institution-subscriptions/${contractId}`, {
            method: 'DELETE',
        });
    }

    async function cancelSubscription(institutionId: number, contractId: number) {
        return await $apifetch(`/api/crm/institutions/${institutionId}/subscription/${contractId}`, {
            method: 'DELETE',
        });
    }

    async function viewPdf(institutionId: number, contractId: number) {
        const { viewInstitutionSubscriptionPdf } = useCrm();
        return await viewInstitutionSubscriptionPdf(institutionId, contractId);
    }

    async function downloadBillingFile(contractId: number, type: 'proforma' | 'invoice') {
        const { $apifetch: fetch } = useNuxtApp();
        const blob = await fetch(
            `/api/crm/institution-subscriptions/${contractId}/billing/${type}-file`,
            { responseType: 'blob' },
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}-${contractId}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    }

    async function sendProforma(contractId: number) {
        const response = await $apifetch(`api/crm/institution-subscriptions/${contractId}/billing/send-proforma`, {
            method: 'POST',
        });
        currentSubscription.value = response.data;
        return response;
    }

    async function sendInvoice(contractId: number) {
        const response = await $apifetch(`api/crm/institution-subscriptions/${contractId}/billing/send-invoice`, {
            method: 'POST',
        });
        currentSubscription.value = response.data;
        return response;
    }

    return {
        subscriptions,
        currentSubscription,
        count,
        loading,
        getSubscriptions,
        getSubscriptionKpis,
        getSubscription,
        updateBilling,
        createPayment,
        markCommissionPaid,
        deleteSubscription,
        cancelSubscription,
        viewPdf,
        downloadBillingFile,
        sendProforma,
        sendInvoice,
    };
};
