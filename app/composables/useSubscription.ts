export const useSubscription = () => {
    const { $apifetch, $toast } = useNuxtApp();

    const accessPlan = useState<AccessPlan | null>('accessPlan', () => null);
    const loading = useState<boolean>('subscriptionLoading', () => false);
    const current = useState<ActiveAccess | null>('currentAccess', () => null);
    const user = useUser();

    const bypassesPlatformAccess = (): boolean => {
        const {
            isCollaborator,
            isAdmin,
            isDeveloper,
            isManager,
            isCommunityManager,
            isSaleRepresentative,
            isTester,
            isInstitution,
        } = useAuth();

        if (!user.value?.id) {
            return true;
        }

        if (isInstitution.value) {
            return true;
        }

        return isCollaborator.value
            || isAdmin.value
            || isDeveloper.value
            || isManager.value
            || isCommunityManager.value
            || isSaleRepresentative.value
            || isTester.value;
    };

    const hasPlatformAccess = async (): Promise<boolean> => {
        if (bypassesPlatformAccess()) {
            return true;
        }

        const response = await check(user.value!.id);

        return response?.status === 'active';
    };

    const requirePlatformAccess = async (): Promise<boolean> => {
        if (await hasPlatformAccess()) {
            return true;
        }

        await navigateTo('/acces-plan');

        return false;
    };

    const isPlatformAccessError = (error: unknown): boolean => {
        const err = error as { status?: number; data?: { code?: string } };

        return err?.status === 403 && err?.data?.code === 'platform_access_required';
    };

    const getAccessPlan = async (): Promise<void> => {
        loading.value = true;
        try {
            const response = await $apifetch<{ access: AccessPlan | null }>('api/subscription/plans');
            accessPlan.value = response.access;
        }
        catch (error) {
            console.error('Error fetching access plan:', error);
        }
        finally {
            loading.value = false;
        }
    };

    const purchaseAccess = async (priceId: string): Promise<CheckoutResponse | null> => {
        if (!user.value) {
            navigateTo('/login');
            return null;
        }

        loading.value = true;
        try {
            return await $apifetch<CheckoutResponse>('api/subscription/create', {
                method: 'POST',
                body: { priceId },
            });
        }
        catch (error: any) {
            $toast({
                variant: 'destructive',
                description: error?.data?.message || 'Erreur lors de l\'achat de l\'accès',
                duration: 3000,
            });
            return null;
        }
        finally {
            loading.value = false;
        }
    };

    const confirmAccess = async (sessionId: string): Promise<boolean> => {
        try {
            const response = await $apifetch<{ status: string }>('api/subscription/confirm', {
                method: 'POST',
                body: { session_id: sessionId },
            });
            return response.status === 'active';
        }
        catch {
            return false;
        }
    };

    const boostReplacement = async (replacementId: number): Promise<CheckoutResponse | null> => {
        loading.value = true;
        try {
            return await $apifetch<CheckoutResponse>(`api/subscription/replacements/${replacementId}/boost`, {
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
        getAccessPlan,
        purchaseAccess,
        confirmAccess,
        boostReplacement,
        cancelBoost,
        check,
        getCurrentAccess,
        current,
        startTrial,
        hasPlatformAccess,
        requirePlatformAccess,
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
}

interface CheckoutResponse {
    url: string;
}

interface CheckResponse {
    status: 'active' | 'expired';
}

export interface ActiveAccess {
    status: 'active' | 'no_access';
    plan: AccessPlan | null;
    paid_at: string | null;
}
