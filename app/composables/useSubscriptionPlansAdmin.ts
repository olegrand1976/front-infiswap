export const useSubscriptionPlansAdmin = () => {
    const { $apifetch, $toast } = useNuxtApp();
    const plan = useState<AccessPlanAdmin | null>('adminAccessPlan', () => null);
    const loading = useState<boolean>('adminAccessPlansLoading', () => false);

    const getCurrentPlan = async () => {
        loading.value = true;
        try {
            const response = await $apifetch<{ plan: AccessPlanAdmin | null }>('api/admin/stripe-plans');
            plan.value = response.plan;
        }
        finally {
            loading.value = false;
        }
    };

    const getPlan = async (id: number) => {
        const response = await $apifetch<{ plan: AccessPlanAdmin }>(`api/admin/stripe-plans/${id}`);
        return response.plan;
    };

    const createPlan = async (payload: AccessPlanPayload) => {
        const response = await $apifetch<{ plan: AccessPlanAdmin; message: string }>('api/admin/stripe-plans', {
            method: 'POST',
            body: payload,
        });
        $toast({ description: response.message || 'Plan d\'accès créé.' });
        plan.value = response.plan;
        return response.plan;
    };

    const updatePlan = async (id: number, payload: Partial<AccessPlanPayload>) => {
        const response = await $apifetch<{ plan: AccessPlanAdmin; message: string }>(`api/admin/stripe-plans/${id}`, {
            method: 'PUT',
            body: payload,
        });
        $toast({ description: response.message || 'Plan d\'accès mis à jour.' });
        plan.value = response.plan;
        return response.plan;
    };

    return {
        plan,
        loading,
        getCurrentPlan,
        getPlan,
        createPlan,
        updatePlan,
    };
};

export interface AccessPlanAdmin {
    id: number;
    name: string;
    stripe_product_id: string | null;
    stripe_price_id: string;
    amount: number | string;
    currency: string;
    description: string | null;
    is_active: boolean;
    priority: number;
    created_at: string;
    updated_at: string;
}

export interface AccessPlanPayload {
    name: string;
    amount: number;
    currency?: string;
    description?: string;
    priority?: number;
    deactivate_previous?: boolean;
    is_active?: boolean;
}
