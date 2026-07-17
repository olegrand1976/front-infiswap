import {
    hasPaidPlatformAccess,
    isLocallyExemptFromPlatformPayment,
    isOneTimeAccessPlan,
    resolvePlatformAccessPromptAction,
} from '~/utils/platformAccess';
import { parseConfirmAccessOutcome, safeReturnPath, type ConfirmAccessOutcome } from '~/utils/accessReturn';

export type ConfirmAccessResult = {
    outcome: ConfirmAccessOutcome;
};

export type ConfirmBoostResult = {
    outcome: ConfirmAccessOutcome;
    planDays: number | null;
};

/** Intention qui ouvre le paywall / le checkout (analytics + copy). */
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
    const { refresh } = useAuth();
    const { trackEvent } = useProductAnalytics();

    const accessPlan = useState<AccessPlan | null>('accessPlan', () => null);
    const loading = useState<boolean>('subscriptionLoading', () => false);
    const current = useState<ActiveAccess | null>('currentAccess', () => null);
    const platformAccessModalOpen = useState<boolean>('platformAccessModalOpen', () => false);
    const platformAccessRedirectTo = useState<string | null>('platformAccessRedirectTo', () => null);
    const platformAccessTrigger = useState<PlatformAccessTrigger | null>('platformAccessTrigger', () => null);
    const user = useUser();
    const route = useRoute();

    const bypassesPlatformAccess = (): boolean => {
        const { isInfiswapStaff, isInstitution } = useAuth();

        if (!user.value?.id) {
            return true;
        }

        if (isInstitution.value) {
            return true;
        }

        return isInfiswapStaff.value;
    };

    const isLocallyExemptFromPlatformPaymentFn = (): boolean => {
        return isLocallyExemptFromPlatformPayment(user.value, {
            bypassesPlatformAccess: bypassesPlatformAccess(),
        });
    };

    const hasPlatformAccess = async (): Promise<boolean> => {
        if (bypassesPlatformAccess()) {
            return true;
        }

        const response = await check(user.value!.id);

        if (!response) {
            return false;
        }

        return response.status === 'active';
    };

    const redirectToAccesPlan = async (
        redirectTo?: string,
        options?: { checkout?: boolean; trigger?: PlatformAccessTrigger },
    ) => {
        const query: Record<string, string> = {
            redirectTo: safeReturnPath(redirectTo ?? route.fullPath),
        };

        if (options?.checkout) {
            query.checkout = '1';
        }

        if (options?.trigger) {
            query.trigger = options.trigger;
        }

        await navigateTo({
            path: '/acces-plan',
            query,
        });
    };

    const openPlatformAccessModal = (
        redirectTo?: string | null,
        trigger: PlatformAccessTrigger = 'direct',
    ) => {
        platformAccessRedirectTo.value = redirectTo ?? safeReturnPath(route.fullPath);
        platformAccessTrigger.value = trigger;
        platformAccessModalOpen.value = true;
    };

    const closePlatformAccessModal = () => {
        platformAccessModalOpen.value = false;
        platformAccessRedirectTo.value = null;
        platformAccessTrigger.value = null;
    };

    /** Opens the payment modal when cotisation is required; call after form validation. */
    const promptPlatformAccessIfRequired = async (
        redirectTo?: string,
        trigger: PlatformAccessTrigger = 'direct',
    ): Promise<boolean> => {
        if (bypassesPlatformAccess()) {
            return true;
        }

        if (hasPaidPlatformAccess(user.value)) {
            return true;
        }

        if (!user.value?.id) {
            return false;
        }

        const response = await check(user.value.id);
        const action = resolvePlatformAccessPromptAction(response, false);

        if (action === 'allow') {
            await refresh();

            return true;
        }

        if (action === 'deny') {
            return false;
        }

        openPlatformAccessModal(redirectTo ?? safeReturnPath(route.fullPath), trigger);

        return false;
    };

    const requirePlatformAccess = async (
        redirectTo?: string,
        trigger: PlatformAccessTrigger = 'direct',
    ): Promise<boolean> => {
        return promptPlatformAccessIfRequired(redirectTo, trigger);
    };

    const isPlatformAccessError = (error: unknown): boolean => {
        const err = error as { status?: number; data?: { code?: string } };

        return err?.status === 403 && err?.data?.code === 'platform_access_required';
    };

    const getAccessPlan = async (): Promise<void> => {
        loading.value = true;
        try {
            const response = await $apifetch<{ access: AccessPlan | null }>('api/subscription/plans');
            accessPlan.value = response.access?.interval === 'one_time' ? response.access : null;
        }
        catch (error) {
            console.error('Error fetching access plan:', error);
        }
        finally {
            loading.value = false;
        }
    };

    const purchaseAccess = async (
        priceId: string,
        options?: { redirectTo?: string | null; trigger?: PlatformAccessTrigger | string | null; source?: string },
    ): Promise<CheckoutResponse | null> => {
        if (!user.value) {
            await navigateTo({
                path: '/login',
                query: { redirect: route.fullPath },
            });
            return null;
        }

        if (!accessPlan.value || !isOneTimeAccessPlan(accessPlan.value)) {
            $toast({
                variant: 'destructive',
                description: 'Le plan d\'accès unique n\'est pas disponible pour le moment.',
            });
            return null;
        }

        loading.value = true;
        try {
            const trigger = options?.trigger
                ?? platformAccessTrigger.value
                ?? String(route.query.trigger ?? 'direct');

            trackEvent('platform_access_checkout_started', {
                source: options?.source ?? 'acces_plan',
                trigger,
            });

            return await $apifetch<CheckoutResponse>('api/subscription/create', {
                method: 'POST',
                body: {
                    priceId,
                    redirectTo: safeReturnPath(options?.redirectTo ?? route.query.redirectTo),
                    trigger,
                },
            });
        }
        catch (error: unknown) {
            $toast({
                variant: 'destructive',
                description: getApiErrorMessage(error, 'Erreur lors de l\'achat de l\'accès'),
                duration: 3000,
            });
            return null;
        }
        finally {
            loading.value = false;
        }
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
