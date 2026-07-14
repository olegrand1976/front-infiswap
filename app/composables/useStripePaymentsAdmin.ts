export type StripePaymentUser = {
    id: number;
    full_name: string;
    email: string;
};

export type StripePaymentRow = {
    id: number;
    paid_at?: string | null;
    user?: StripePaymentUser | null;
    product_type: string;
    product_label: string;
    amount_cents: number;
    currency: string;
    stripe_checkout_session_id?: string | null;
    stripe_checkout_session_short?: string | null;
    replacement_id?: number | null;
};

export type StripePaymentUserAggregate = {
    user?: StripePaymentUser | null;
    payment_count: number;
    total_amount_cents: number;
    last_paid_at?: string | null;
    max_amount_cents: number;
    product_types: string[];
};

export type StripePaymentProductBreakdown = {
    product_type: string;
    count: number;
    amount_cents: number;
};

export type StripePaymentKpis = {
    total_amount_cents: number;
    payment_count: number;
    payments_this_month: {
        count: number;
        amount_cents: number;
    };
    latest_payment?: {
        user?: StripePaymentUser | null;
        amount_cents: number;
        paid_at?: string | null;
        product_label: string;
    } | null;
    top_payer?: {
        user?: StripePaymentUser | null;
        total_amount_cents: number;
        payment_count: number;
    } | null;
    by_product_type: StripePaymentProductBreakdown[];
};

export type StripePaymentFilters = {
    paid_from?: string;
    paid_to?: string;
    product_type?: string;
    q?: string;
    sort?: string;
};

export const STRIPE_PAYMENT_PRODUCT_TYPES = [
    { value: 'all', label: 'Tous les produits' },
    { value: 'platform_access', label: 'Accès réseau' },
    { value: 'boost', label: 'Boost remplacement' },
    { value: 'replacement_contract', label: 'Contrat remplacement' },
    { value: 'sponsorship', label: 'Sponsoring' },
] as const;

export const STRIPE_PAYMENT_VIEWS = [
    { key: 'transactions', label: 'Par date' },
    { key: 'users', label: 'Par utilisateur' },
] as const;

export function formatStripePaymentAmount(amountCents: number, currency = 'eur'): string {
    const amount = amountCents / 100;
    const suffix = currency.toUpperCase() === 'EUR' ? ' €' : ` ${currency.toUpperCase()}`;

    return amount.toLocaleString('fr-BE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) + suffix;
}

export function stripePaymentProductLabel(type: string): string {
    return STRIPE_PAYMENT_PRODUCT_TYPES.find(item => item.value === type)?.label ?? type;
}

export const useStripePaymentsAdmin = () => {
    const { $apifetch } = useNuxtApp();

    const buildQuery = (filters: StripePaymentFilters, page?: number, perPage?: number) => {
        const params = new URLSearchParams();

        if (filters.paid_from) params.set('paid_from', filters.paid_from);
        if (filters.paid_to) params.set('paid_to', filters.paid_to);
        if (filters.product_type && filters.product_type !== 'all') params.set('product_type', filters.product_type);
        if (filters.q) params.set('q', filters.q);
        if (filters.sort) params.set('sort', filters.sort);
        if (page) params.set('page', String(page));
        if (perPage) params.set('perPage', String(perPage));

        return params.toString();
    };

    const getKpis = async (filters: StripePaymentFilters = {}) => {
        const query = buildQuery(filters);
        const response = await $apifetch<{ data: StripePaymentKpis }>(
            `api/admin/stripe-payments/kpis${query ? `?${query}` : ''}`,
        );

        return response.data;
    };

    const getPayments = async (page: number, perPage: number, filters: StripePaymentFilters = {}) => {
        const query = buildQuery(filters, page, perPage);
        return $apifetch<{ payments: StripePaymentRow[]; count: number }>(
            `api/admin/stripe-payments?${query}`,
        );
    };

    const getPaymentsByUser = async (page: number, perPage: number, filters: StripePaymentFilters = {}) => {
        const query = buildQuery(filters, page, perPage);
        return $apifetch<{ users: StripePaymentUserAggregate[]; count: number }>(
            `api/admin/stripe-payments/by-user?${query}`,
        );
    };

    return {
        getKpis,
        getPayments,
        getPaymentsByUser,
    };
};
