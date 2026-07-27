import { parseConfirmAccessOutcome, type ConfirmAccessOutcome } from '~/utils/accessReturn';

export type ConfirmAccessResult = {
    outcome: ConfirmAccessOutcome;
};

export type ConfirmBoostResult = {
    outcome: ConfirmAccessOutcome;
    planDays: number | null;
};

/** @deprecated Paywall retiré — conservé pour compat callers. */
export type PlatformAccessTrigger =
    | 'create'
    | 'apply'
    | 'banner'
    | 'header'
    | 'settings'
    | 'onboarding_banner'
    | 'quest'
    | 'direct';

export const useSubscription = () => {
    const { $apifetch, $toast } = useNuxtApp();

    const accessPlan = useState<AccessPlan | null>('accessPlan', () => null);
    const loading = useState<boolean>('subscriptionLoading', () => false);
    const current = useState<ActiveAccess | null>('currentAccess', () => null);
    const platformAccessModalOpen = useState<boolean>('platformAccessModalOpen', () => false);
    const platformAccessRedirectTo = useState<string | null>('platformAccessRedirectTo', () => null);
    const platformAccessTrigger = useState<PlatformAccessTrigger | null>('platformAccessTrigger', () => null);
    const user = useUser();

    const hasPlatformAccess = async (): Promise<boolean> => {
        return true;
    };

    /** Paywall retiré — redirige vers le dashboard. */
    const redirectToAccesPlan = async (
        _redirectTo?: string,
        _options?: { checkout?: boolean; trigger?: PlatformAccessTrigger },
    ) => {
        await navigateTo('/dashboard');
    };

    const openPlatformAccessModal = (
        _redirectTo?: string | null,
        _trigger: PlatformAccessTrigger = 'direct',
    ) => {
        // Modal retirée — no-op.
    };

    const closePlatformAccessModal = () => {
        platformAccessModalOpen.value = false;
        platformAccessRedirectTo.value = null;
        platformAccessTrigger.value = null;
    };

    const promptPlatformAccessIfRequired = async (
        _redirectTo?: string,
        _trigger: PlatformAccessTrigger = 'direct',
    ): Promise<boolean> => {
        return true;
    };

    const requirePlatformAccess = async (
        _redirectTo?: string,
        _trigger: PlatformAccessTrigger = 'direct',
    ): Promise<boolean> => {
        return true;
    };

    const isPlatformAccessError = (error: unknown): boolean => {
        const err = error as { status?: number; data?: { code?: string } };

        return err?.status === 403 && err?.data?.code === 'platform_access_required';
    };

    const getAccessPlan = async (): Promise<void> => {
        accessPlan.value = null;
    };

    /** Produit retiré — refuse tout nouvel achat. */
    const purchaseAccess = async (
        _priceId: string,
        _options?: { redirectTo?: string | null; trigger?: PlatformAccessTrigger | string | null; source?: string },
    ): Promise<CheckoutResponse | null> => {
        $toast({
            variant: 'destructive',
            description: 'L\'accès réseau payant a été retiré. Publiez et postulez librement.',
        });

        return null;
    };

    const confirmAccess = async (sessionId: string): Promise<ConfirmAccessResult> => {
        try {
            const response = await $apifetch<{ status: string }>('api/subscription/confirm', {
                method: 'POST',
                body: { session_id: sessionId },
            });

            return { outcome: parseConfirmAccessOutcome(response) };
        }
        catch (error: unknown) {
            return { outcome: parseConfirmAccessOutcome(null, error) };
        }
    };

    const confirmBoost = async (
        replacementId: number,
        sessionId: string,
    ): Promise<ConfirmBoostResult> => {
        try {
            const response = await $apifetch<{ status: string; plan_days?: number | null }>(
                `api/subscription/replacements/${replacementId}/boost/confirm`,
                {
                    method: 'POST',
                    body: { session_id: sessionId },
                },
            );

            return {
                outcome: parseConfirmAccessOutcome(response),
                planDays: response.plan_days ?? null,
            };
        }
        catch (error: unknown) {
            return {
                outcome: parseConfirmAccessOutcome(null, error),
                planDays: null,
            };
        }
    };

    const boostReplacement = async (replacementId: number, planId: number): Promise<CheckoutResponse | null> => {
        loading.value = true;
        try {
            return await $apifetch<CheckoutResponse>(`api/subscription/replacements/${replacementId}/boost`, {
                method: 'POST',
                body: { plan_id: planId },
            });
        }
        catch (error: unknown) {
            $toast({
                variant: 'destructive',
                description: getApiErrorMessage(error, 'Impossible d\'activer la mise en avant.'),
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

    const getCurrentAccess = async () => {
        loading.value = true;
        try {
            const response = await $apifetch<ActiveAccess>('/api/subscription/current');
            current.value = response;
            return response;
        }
        catch (error) {
            console.error('Error checking access:', error);
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
            console.error('Error checking access:', error);
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
        accessPlan,
        platformAccessModalOpen,
        platformAccessRedirectTo,
        platformAccessTrigger,
        getAccessPlan,
        purchaseAccess,
        confirmAccess,
        confirmBoost,
        boostReplacement,
        cancelBoost,
        check,
        getCurrentAccess,
        current,
        startTrial,
        hasPlatformAccess,
        requirePlatformAccess,
        promptPlatformAccessIfRequired,
        openPlatformAccessModal,
        closePlatformAccessModal,
        redirectToAccesPlan,
        isPlatformAccessError,
    };
};

export interface AccessPlan {
    id: number;
    name: string;
    amount: number | string;
    currency: string;
    description: string;
    valid_from: string | null;
    valid_until: string | null;
    stripe_price_id: string;
    is_active?: boolean;
    interval?: string;
    live_interval?: string | null;
}

interface CheckoutResponse {
    url: string;
}

function getApiErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object' && 'data' in error) {
        const message = (error as { data?: { message?: string } }).data?.message;
        if (message) {
            return message;
        }
    }

    return fallback;
}

interface CheckResponse {
    status: 'active' | 'expired';
    payment_required?: boolean;
}

export interface ActiveAccess {
    status: 'active' | 'no_access';
    plan: AccessPlan | null;
    paid_at: string | null;
}
