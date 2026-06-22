export const useSubscriptionPlansAdmin = () => {
    const { $apifetch, $toast } = useNuxtApp();
    const plans = useState<StripePlan[]>('adminStripePlans', () => []);
    const count = useState<number>('adminStripePlansCount', () => 0);
    const loading = useState<boolean>('adminStripePlansLoading', () => false);

    const getPlans = async (page = 1, perPage = 15, options: Record<string, unknown> = {}) => {
        loading.value = true;
        try {
            const response = await $apifetch<{ plans: StripePlan[]; count: number }>('api/admin/stripe-plans', {
                params: { page, perPage, ...options },
            });
            plans.value = response.plans;
            count.value = response.count;
        }
        finally {
            loading.value = false;
        }
    };

    const getPlan = async (id: number) => {
        const response = await $apifetch<{ plan: StripePlan }>(`api/admin/stripe-plans/${id}`);
        return response.plan;
    };

    const createPlan = async (payload: StripePlanPayload) => {
        const response = await $apifetch<{ plan: StripePlan; message: string }>('api/admin/stripe-plans', {
            method: 'POST',
            body: payload,
        });
        $toast({ description: response.message || 'Plan créé.' });
        return response.plan;
    };

    const updatePlan = async (id: number, payload: Partial<StripePlanPayload>) => {
        const response = await $apifetch<{ plan: StripePlan; message: string }>(`api/admin/stripe-plans/${id}`, {
            method: 'PUT',
            body: payload,
        });
        $toast({ description: response.message || 'Plan mis à jour.' });
        return response.plan;
    };

    const deactivatePlan = async (id: number) => {
        const response = await $apifetch<{ message: string }>(`api/admin/stripe-plans/${id}`, {
            method: 'DELETE',
        });
        $toast({ description: response.message || 'Plan désactivé.' });
    };

    return {
        plans,
        count,
        loading,
        getPlans,
        getPlan,
        createPlan,
        updatePlan,
        deactivatePlan,
    };
};

export interface StripePlan {
    id: number;
    name: string;
    stripe_product_id: string | null;
    stripe_price_id: string;
    type: 'platform_access' | 'replacement_boost';
    interval: 'week' | 'month' | 'year';
    amount: number | string;
    currency: string;
    description: string | null;
    is_active: boolean;
    valid_from: string | null;
    valid_until: string | null;
    priority: number;
    target_roles: string[] | null;
    created_at: string;
    updated_at: string;
}

export interface StripePlanPayload {
    name: string;
    type: StripePlan['type'];
    interval: StripePlan['interval'];
    amount: number;
    currency?: string;
    description?: string;
    valid_from?: string | null;
    valid_until?: string | null;
    priority?: number;
    target_roles?: string[];
    deactivate_previous?: boolean;
}
