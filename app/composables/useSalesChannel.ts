import type { ProOffer, ProPlan } from '~/composables/useProSubscription';

export interface SalesProspect {
    id: number;
    name: string | null;
    email: string;
    phone_number: string | null;
    country: string | null;
    member_since: string | null;
    last_login_at: string | null;
    email_verified: boolean;
    is_premium: boolean;
    replacements_published: number;
    pending_applications: number;
    active_offer: ProOffer | null;
}

export type SalesCommissionStatus = 'pending' | 'payable' | 'paid' | 'clawed_back';

export interface SalesCommissionLine {
    id: number;
    subscriber: { id: number; name: string | null; email: string | null };
    base_amount_ht: number;
    rate: number;
    amount: number;
    currency: string;
    status: SalesCommissionStatus;
    invoice_paid_at: string | null;
    payable_at: string | null;
    paid_at: string | null;
    clawback_reason: string | null;
}

export interface SalesCommissionSummary {
    totals: Record<SalesCommissionStatus, { lines: number; amount: number }>;
    commissions: SalesCommissionLine[];
}

export function useSalesChannel() {
    const { $apifetch, $toast } = useNuxtApp();

    const plans = ref<ProPlan[]>([]);
    const prospects = ref<SalesProspect[]>([]);
    const summary = ref<SalesCommissionSummary | null>(null);
    const loading = ref(false);

    async function fetchPlans(): Promise<void> {
        const response = await $apifetch<{ plans: ProPlan[] }>('api/subscription/sales/plans');
        plans.value = response.plans ?? [];
    }

    async function searchProspects(term: string): Promise<void> {
        if (term.trim().length < 3) {
            prospects.value = [];

            return;
        }

        loading.value = true;
        try {
            const response = await $apifetch<{ prospects: SalesProspect[] }>('api/subscription/sales/prospects', {
                params: { q: term.trim() },
            });
            prospects.value = response.prospects ?? [];
        }
        catch (error: unknown) {
            $toast({ variant: 'destructive', description: salesErrorMessage(error, 'Recherche impossible.') });
        }
        finally {
            loading.value = false;
        }
    }

    async function depositOffer(userId: number, lookupKey: string): Promise<boolean> {
        loading.value = true;
        try {
            const response = await $apifetch<{ message?: string }>('api/subscription/sales/offers', {
                method: 'POST',
                body: { user_id: userId, lookup_key: lookupKey },
            });
            $toast({ description: response.message ?? 'Offre déposée.' });

            return true;
        }
        catch (error: unknown) {
            $toast({ variant: 'destructive', description: salesErrorMessage(error, 'Dépôt de l\'offre impossible.') });

            return false;
        }
        finally {
            loading.value = false;
        }
    }

    async function fetchCommissions(): Promise<void> {
        loading.value = true;
        try {
            summary.value = await $apifetch<SalesCommissionSummary>('api/subscription/sales/commissions');
        }
        catch (error: unknown) {
            $toast({ variant: 'destructive', description: salesErrorMessage(error, 'Chargement des commissions impossible.') });
        }
        finally {
            loading.value = false;
        }
    }

    return {
        plans,
        prospects,
        summary,
        loading,
        fetchPlans,
        searchProspects,
        depositOffer,
        fetchCommissions,
    };
}

function salesErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object' && 'data' in error) {
        const message = (error as { data?: { message?: string } }).data?.message;

        if (message) {
            return message;
        }
    }

    return fallback;
}
