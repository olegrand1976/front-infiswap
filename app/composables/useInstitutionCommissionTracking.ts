import { useState, useNuxtApp } from '#app';

export type CommissionRatePeriod = {
    id?: number;
    effective_from: string;
    first_year_rate: number;
    renewal_rates: Array<{ from_year: number; rate: number }>;
    annual_indexation_rate?: number | null;
    updated_at?: string | null;
    updated_by?: { id: number; full_name: string; email: string } | null;
};

export type InstitutionCommissionSettingsPayload = {
    periods: CommissionRatePeriod[];
};

export type CommissionKpis = {
    total_received: number;
    commission_due: number;
    commission_paid: number;
    commission_direct_due?: number;
    commission_direct_paid?: number;
    commission_override_due?: number;
    commission_override_paid?: number;
    commission_earned?: number;
    commission_reversed?: number;
    commission_net?: number;
    commission_clawback_due?: number;
    commission_at_risk?: number;
    client_collection_rate?: number;
    net_remuneration_impact?: number;
    signed_contracts: number;
    active_vendors: number;
    payout_rate: number;
};

export type GainLossRow = {
    month: string;
    received: number;
    earned: number;
    paid: number;
    reversed: number;
    net: number;
};

export type VendorCommissionSummary = {
    vendor: { id: number; full_name: string; email: string | null };
    contracts_created: number;
    contracts_signed: number;
    amount_received: number;
    commission_due: number;
    commission_paid: number;
    commission_direct_due?: number;
    commission_direct_paid?: number;
    commission_override_due?: number;
    commission_override_paid?: number;
    last_payment_at?: string | null;
};

export type CommissionSplitRow = {
    id: number;
    split_type: string;
    commission_amount: number;
    commission_paid_at?: string | null;
    override_rate?: number | null;
};

export type VendorCommissionDetail = {
    vendor: { id: number; full_name: string; email: string };
    summary: VendorCommissionSummary | null;
    contracts: Array<{
        id: number;
        reference?: string | null;
        status?: string | null;
        status_label?: string | null;
        created_at?: string | null;
        signed_at?: string | null;
        institution?: { id: number; name: string } | null;
        totals: {
            amount_received: number;
            commission_due: number;
            commission_paid: number;
        };
        payments: Array<{
            id: number;
            received_at?: string | null;
            amount_received: number;
            commission_rate: number;
            commission_amount: number;
            commission_paid_at?: string | null;
            subscription_year?: number | null;
            splits?: CommissionSplitRow[];
        }>;
    }>;
    override_payments?: Array<{
        split_id: number;
        split_type: string;
        commission_amount: number;
        commission_paid_at?: string | null;
        override_rate?: number | null;
        payment?: { id: number; received_at?: string | null; amount_received: number } | null;
        contract?: { id: number; reference?: string | null; institution?: { id: number; name: string } | null } | null;
    }>;
};

export type CommissionTrackingFilters = {
    vendor_id?: number | null;
    contract_created_from?: string;
    contract_created_to?: string;
    payment_received_from?: string;
    payment_received_to?: string;
    commission_status?: 'all' | 'due' | 'paid';
    institution_name?: string;
    reference?: string;
};

export const useInstitutionCommissionTracking = () => {
    const { $apifetch } = useNuxtApp();
    const kpis = useState<CommissionKpis | null>('institutionCommissionKpis', () => null);
    const vendors = useState<VendorCommissionSummary[]>('institutionCommissionVendors', () => []);
    const vendorCount = useState<number>('institutionCommissionVendorCount', () => 0);
    const vendorDetail = useState<VendorCommissionDetail | null>('institutionCommissionVendorDetail', () => null);
    const loading = useState<boolean>('institutionCommissionTrackingLoading', () => false);
    const commissionSettings = useState<InstitutionCommissionSettingsPayload | null>('institutionCommissionSettings', () => null);

    function buildParams(filters: CommissionTrackingFilters = {}, page = 1, perPage = 25) {
        const params: Record<string, unknown> = { page, perPage };
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && value !== 'all') {
                params[key] = value;
            }
        });
        return params;
    }

    async function getCommissionSettings() {
        const response = await $apifetch('api/admin/institution-commission-settings');
        commissionSettings.value = response.data;
        return response.data as InstitutionCommissionSettingsPayload;
    }

    async function updateCommissionSettings(payload: InstitutionCommissionSettingsPayload) {
        const response = await $apifetch('api/admin/institution-commission-settings', {
            method: 'PUT',
            body: payload,
        });
        commissionSettings.value = response.data;
        return response;
    }

    async function getAdminKpis(filters: CommissionTrackingFilters = {}) {
        const response = await $apifetch('api/admin/institution-commission-tracking/kpis', {
            params: buildParams(filters),
        });
        kpis.value = response.data;
        return response.data as CommissionKpis;
    }

    async function getAdminVendors(page = 1, perPage = 25, filters: CommissionTrackingFilters = {}) {
        loading.value = true;
        try {
            const response = await $apifetch('api/admin/institution-commission-tracking/vendors', {
                params: buildParams(filters, page, perPage),
            });
            vendors.value = response.vendors?.data ?? response.vendors ?? [];
            vendorCount.value = response.count ?? 0;
            return response;
        }
        finally {
            loading.value = false;
        }
    }

    async function getAdminVendorDetail(userId: number, filters: CommissionTrackingFilters = {}) {
        const response = await $apifetch(`api/admin/institution-commission-tracking/vendors/${userId}`, {
            params: buildParams(filters),
        });
        vendorDetail.value = response.data;
        return response.data as VendorCommissionDetail;
    }

    async function getMyKpis(filters: CommissionTrackingFilters = {}) {
        const response = await $apifetch('api/crm/institution-commission-tracking/kpis', {
            params: buildParams(filters),
        });
        kpis.value = response.data;
        return response.data as CommissionKpis;
    }

    async function getMyTracking(page = 1, perPage = 25, filters: CommissionTrackingFilters = {}) {
        loading.value = true;
        try {
            const response = await $apifetch('api/crm/institution-commission-tracking', {
                params: buildParams(filters, page, perPage),
            });
            vendors.value = response.vendors?.data ?? response.vendors ?? [];
            vendorCount.value = response.count ?? 0;
            return response;
        }
        finally {
            loading.value = false;
        }
    }

    async function getMyDetail(filters: CommissionTrackingFilters = {}) {
        const response = await $apifetch('api/crm/institution-commission-tracking/detail', {
            params: buildParams(filters),
        });
        vendorDetail.value = response.data;
        return response.data as VendorCommissionDetail;
    }

    async function getAdminGainLoss(filters: CommissionTrackingFilters = {}) {
        const response = await $apifetch('api/admin/institution-commission-tracking/gain-loss', {
            params: buildParams(filters),
        });
        return response.data as GainLossRow[];
    }

    async function getMyGainLoss(filters: CommissionTrackingFilters = {}) {
        const response = await $apifetch('api/crm/institution-commission-tracking/gain-loss', {
            params: buildParams(filters),
        });
        return response.data as GainLossRow[];
    }

    return {
        kpis,
        vendors,
        vendorCount,
        vendorDetail,
        loading,
        commissionSettings,
        getCommissionSettings,
        updateCommissionSettings,
        getAdminKpis,
        getAdminVendors,
        getAdminVendorDetail,
        getMyKpis,
        getMyTracking,
        getMyDetail,
        getAdminGainLoss,
        getMyGainLoss,
    };
};
