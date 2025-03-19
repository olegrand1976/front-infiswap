export const useSubscription = () => {
    const { $apifetch } = useNuxtApp();

    const plans = useState<Plans>('plans', () => null);
    const loading = useState<boolean>('loading', () => false);
    const plan = useState<Plan>('plan', () => null);
    const current = useState<ActiveSubscription>('current', () => null);

    const getPlans = async (): Promise<void> => {
        loading.value = true;
        try {
            const response = await $apifetch<{ plans: Plans }>('api/subscription/plans');
            plans.value = response.plans;
        }
        catch (error) {
            console.error('Error fetching plans:', error);
        }
        finally {
            loading.value = false;
        }
    };

    const selectPlan = (selected: Plan): void => {
        plan.value = selected;
    };

    const create = async (priceId: string): Promise<SubscriptionResponse | null> => {
        loading.value = true;
        try {
            const response = await $apifetch<SubscriptionResponse>('api/subscription/create', { method: 'POST', body: {
                priceId: priceId,
            } });

            return response;
        }
        catch (error) {
            console.error('Error creating subscription:', error);
        }
        finally {
            loading.value = false;
        }
    };

    const getCurrentSubscription = async () => {
        loading.value = true;
        try {
            const response = await $apifetch<ActiveSubscription>('/api/subscription/current');
            current.value = response;
            return response;
        }
        catch (error) {
            console.error('Error checking active subscription:', error);
        }
        finally {
            loading.value = false;
        }
    };

    const check = async (user: number) => {
        try {
            return await $apifetch<CheckResponse>(`/api/subscription/${user}/check`, { method: 'GET' });
        }
        catch (error) {
            console.error('Error checking subscription:', error);
        }
    };

    return {
        loading,
        getPlans,
        plans,
        plan,
        create,
        selectPlan,
        check,
        getCurrentSubscription,
        current,
    };
};

export interface Plan {
    id: number;
    name: string;
    interval: 'month' | 'year';
    amount: string;
    currency: 'eur';
    description: string;
    expire_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    stripe_price_id: string;
}

export interface Plans {
    monthly: Plan;
    yearly: Plan;
}

export interface PaymentDetails {
    paymentMethodId: string;
    priceId: string;
}

interface SubscriptionResponse {
    url: string;
}

interface CheckResponse {
    status: 'active' | 'expired';
}

interface ActiveSubscription {
    status: 'active' | 'expired';
    plan: Plan;
    subscription: Subscription;
}

interface Subscription {
    name: string;
    stripe_status: string;
    ends_at: string | null;
    price_id: string;
    stripe_subscription_id: string;
    created_at: string;
}
