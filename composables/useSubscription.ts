export const useSubscription = () => {
    const { $apifetch } = useNuxtApp();

    interface PaymentDetails {
        paymentMethodId: string;
        priceId: string;
    }

    const plans = useState<Plans>('plans', () => null);
    const loading = useState<boolean>('loading', () => false);
    const plan = useState<Plan>('plan', () => null);

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

    const create = async (payment: PaymentDetails): Promise<void> => {
        loading.value = true;
        try {
            await $apifetch('api/subscription/create', { method: 'POST', body: payment });
        }
        catch (error) {
            console.error('Error creating subscription:', error);
        }
        finally {
            loading.value = false;
        }
    };

    return {
        loading,
        getPlans,
        plans,
        plan,
        create,
        selectPlan,
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
