export const useSubscription = () => {
    const { $apifetch, $toast } = useNuxtApp();

    const plans = useState<SubscriptionPlans | null>('plans', () => null);
    const loading = useState<boolean>('subscriptionLoading', () => false);
    const current = useState<ActiveSubscription | null>('currentSubscription', () => null);
    const user = useUser();

    const getPlans = async (): Promise<void> => {
        loading.value = true;
        try {
            const response = await $apifetch<{ plans: SubscriptionPlans }>('api/subscription/plans');
            plans.value = response.plans;
        }
        catch (error) {
            console.error('Error fetching plans:', error);
        }
        finally {
            loading.value = false;
        }
    };

    const create = async (priceId: string): Promise<SubscriptionResponse | null> => {
        if (!user.value) {
            navigateTo('/login');
            return null;
        }

        loading.value = true;
        try {
            return await $apifetch<SubscriptionResponse>('api/subscription/create', {
                method: 'POST',
                body: { priceId },
            });
        }
        catch (error: any) {
            $toast({
                variant: 'destructive',
                description: error?.data?.message || 'Erreur lors de la création de votre abonnement',
                duration: 3000,
            });
            return null;
        }
        finally {
            loading.value = false;
        }
    };

    const boostReplacement = async (replacementId: number): Promise<SubscriptionResponse | null> => {
        loading.value = true;
        try {
            return await $apifetch<SubscriptionResponse>(`api/subscription/replacements/${replacementId}/boost`, {
                method: 'POST',
            });
        }
        catch (error: any) {
            $toast({
                variant: 'destructive',
                description: error?.data?.message || 'Impossible d\'activer la mise en avant.',
            });
            return null;
        }
        finally {
            loading.value = false;
        }
    };

    const cancelBoost = async (replacementId: number): Promise<void> => {
        await $apifetch(`api/subscription/replacements/${replacementId}/boost/cancel`, {
            method: 'POST',
        }).then(() => {
            $toast({ description: 'Mise en avant annulée.' });
        });
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

    const check = async (userId: number) => {
        try {
            return await $apifetch<CheckResponse>(`/api/subscription/${userId}/check`, { method: 'GET' });
        }
        catch (error) {
            console.error('Error checking subscription:', error);
        }
    };

    const startTrial = async () => {
        if (!user.value) {
            navigateTo('/login');
            return;
        }

        await $apifetch('/api/subscription/start-trial', { method: 'POST' }).then(() => {
            $toast({ description: 'Essai gratuit activé' });
        });
    };

    return {
        loading,
        getPlans,
        plans,
        create,
        boostReplacement,
        cancelBoost,
        check,
        getCurrentSubscription,
        current,
        startTrial,
    };
};

export interface Plan {
    id: number;
    name: string;
    type: 'platform_access' | 'replacement_boost';
    interval: 'week' | 'month' | 'year';
    amount: number | string;
    currency: 'eur' | string;
    description: string;
    valid_from: string | null;
    valid_until: string | null;
    stripe_price_id: string;
    is_active?: boolean;
    is_boosted?: boolean;
    boosted_until?: string | null;
}

export interface SubscriptionPlans {
    platform: Plan | null;
    boost: Plan | null;
    current_plan?: string | null;
}

interface SubscriptionResponse {
    url: string;
}

interface CheckResponse {
    status: 'active' | 'expired';
}

interface ActiveSubscription {
    status: 'active' | 'expired' | 'no_active_subscription';
    plan: Plan | null;
    subscription: Subscription | null;
}

interface Subscription {
    name: string;
    stripe_status: string;
    ends_at: string | null;
    price_id: string;
    stripe_subscription_id: string;
    created_at: string;
}
