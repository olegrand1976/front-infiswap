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
    invoice_number?: string | null;
    invoice_issued_at?: string | null;
    invoice_file_path?: string | null;
};

export type InstitutionSubscriptionItem = {
    id: number;
    reference?: string | null;
    status?: string | null;
    status_label?: string | null;
    formula?: string | null;
    payment_mode?: string | null;
    created_at?: string | null;
    signed_at?: string | null;
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

export type InstitutionCommissionSettings = {
    first_year_rate: number;
    renewal_rates: Array<{ from_year: number; rate: number }>;
    updated_at?: string | null;
    updated_by?: { id: number; full_name: string; email: string } | null;
};

export const useInstitutionSubscription = () => {
    const { $apifetch } = useNuxtApp();
    const subscriptions = useState<InstitutionSubscriptionItem[]>('institutionSubscriptions', () => []);
    const currentSubscription = useState<InstitutionSubscriptionItem | null>('currentInstitutionSubscription', () => null);
    const count = useState<number>('institutionSubscriptionsCount', () => 0);
    const loading = useState<boolean>('institutionSubscriptionsLoading', () => false);
    const commissionSettings = useState<InstitutionCommissionSettings | null>('institutionCommissionSettings', () => null);

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

    async function getSubscription(contractId: number) {
        const response = await $apifetch(`api/crm/institution-subscriptions/${contractId}`);
        currentSubscription.value = response.data;
        return response.data as InstitutionSubscriptionItem;
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

    async function cancelSubscription(institutionId: number, contractId: number) {
        return await $apifetch(`/api/crm/institutions/${institutionId}/subscription/${contractId}`, {
            method: 'DELETE',
        });
    }

    async function viewPdf(institutionId: number, contractId: number) {
        const { $apifetch: fetch } = useNuxtApp();
        const blob = await fetch(
            `/api/crm/institutions/${institutionId}/subscription/${contractId}/pdf`,
            { responseType: 'blob' },
        );
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    async function getCommissionSettings() {
        const response = await $apifetch('api/admin/institution-commission-settings');
        commissionSettings.value = response.data;
        return response.data;
    }

    async function updateCommissionSettings(payload: InstitutionCommissionSettings) {
        const response = await $apifetch('api/admin/institution-commission-settings', {
            method: 'PUT',
            body: payload,
        });
        commissionSettings.value = response.data;
        return response;
    }

    return {
        subscriptions,
        currentSubscription,
        count,
        loading,
        commissionSettings,
        getSubscriptions,
        getSubscription,
        updateBilling,
        createPayment,
        markCommissionPaid,
        cancelSubscription,
        viewPdf,
        getCommissionSettings,
        updateCommissionSettings,
    };
};
