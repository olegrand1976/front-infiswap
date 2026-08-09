import { assertAllowedExternalRedirectUrl, type ConfirmAccessOutcome } from '~/utils/accessReturn';

export interface ProPlan {
    id: number;
    key: string;
    lookup_key: string;
    name: string;
    description: string | null;
    amount: number;
    currency: string;
    interval: string;
    interval_count: number;
    channel: string | null;
    label: string;
    billed_months: number | null;
    covered_months: number | null;
    free_months: number | null;
    monthly_equivalent: number | null;
}

export interface ProOffer {
    id: number;
    token: string;
    status: string;
    expires_at: string;
    price_lookup_key: string;
    plan: ProPlan | null;
    sold_by: { id: number | null; name: string | null };
}

export interface ProBoostCredit {
    is_premium: boolean;
    available: boolean;
    duration_days: number;
    last_granted_at: string | null;
    next_credit_at: string | null;
}

export interface ProStatus {
    is_premium: boolean;
    status: string;
    subscription: {
        on_grace_period: boolean;
        cancelled: boolean;
        ends_at: string | null;
        plan: ProPlan | null;
    } | null;
    boost_credit: ProBoostCredit;
}

export interface ProCatalog {
    plans: ProPlan[];
    offer: ProOffer | null;
}

/** Le back renvoie `outcome` à plat ; `status` porte le libellé traduit de jsonResponse(). */
function parseProOutcome(response: { outcome?: string } | null, error?: unknown): ConfirmAccessOutcome {
    if (!error) {
        return response?.outcome === 'active' ? 'active' : 'pending';
    }

    const err = error as { status?: number; data?: { outcome?: string } };

    if (err?.status === 401 || err?.status === 403) {
        return 'auth_error';
    }

    if (err?.status === 202) {
        return 'pending';
    }

    return 'error';
}

export function useProSubscription() {
    const { $apifetch, $toast } = useNuxtApp();

    const status = useState<ProStatus | null>('proSubscriptionStatus', () => null);
    const catalog = useState<ProCatalog | null>('proSubscriptionCatalog', () => null);
    const loading = ref(false);

    const isPremium = computed(() => status.value?.is_premium === true);
    const boostCredit = computed(() => status.value?.boost_credit ?? null);

    async function fetchStatus(): Promise<ProStatus | null> {
        try {
            const response = await $apifetch<ProStatus>('api/subscription/pro/status');
            status.value = response;

            return response;
        }
        catch {
            return null;
        }
    }

    async function fetchCatalog(): Promise<ProCatalog | null> {
        try {
            const response = await $apifetch<ProCatalog>('api/subscription/pro/catalog');
            catalog.value = { plans: response.plans ?? [], offer: response.offer ?? null };

            return catalog.value;
        }
        catch {
            return null;
        }
    }

    /** Offre nominative en cours, sans charger tout le catalogue (bannière dashboard). */
    async function fetchOffer(): Promise<ProOffer | null> {
        try {
            const response = await $apifetch<{ offer: ProOffer | null }>('api/subscription/pro/offer');

            return response.offer ?? null;
        }
        catch {
            return null;
        }
    }

    async function checkout(lookupKey: string, options?: { offerToken?: string | null }): Promise<string | null> {
        loading.value = true;
        try {
            const response = await $apifetch<{ url?: string }>('api/subscription/pro/checkout', {
                method: 'POST',
                body: {
                    lookup_key: lookupKey,
                    platform: 'web',
                    ...(options?.offerToken ? { offer_token: options.offerToken } : {}),
                },
            });

            return assertAllowedExternalRedirectUrl(response.url);
        }
        catch (error: unknown) {
            $toast({
                variant: 'destructive',
                description: proErrorMessage(error, 'Impossible d\'ouvrir le paiement.'),
            });

            return null;
        }
        finally {
            loading.value = false;
        }
    }

    /**
     * Confirme au retour de Stripe. La synchronisation Cashier passe par le
     * webhook : on rejoue l'appel tant que l'abonnement n'est pas actif.
     */
    async function confirm(sessionId: string, attempts = 4, delayMs = 1500): Promise<ConfirmAccessOutcome> {
        for (let attempt = 0; attempt < attempts; attempt++) {
            let outcome: ConfirmAccessOutcome;

            try {
                const response = await $apifetch<{ outcome?: string } & Partial<ProStatus>>(
                    'api/subscription/pro/confirm',
                    { method: 'POST', body: { session_id: sessionId } },
                );

                outcome = parseProOutcome(response);

                if (outcome === 'active' && response.is_premium !== undefined) {
                    status.value = response as ProStatus;
                }
            }
            catch (error: unknown) {
                outcome = parseProOutcome(null, error);
            }

            if (outcome !== 'pending') {
                return outcome;
            }

            if (attempt < attempts - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }

        return 'pending';
    }

    async function openBillingPortal(): Promise<void> {
        loading.value = true;
        try {
            const response = await $apifetch<{ url?: string }>('api/subscription/pro/portal', {
                method: 'POST',
                body: { return_url: `${window.location.origin}/dashboard/subscriptions` },
            });

            const url = assertAllowedExternalRedirectUrl(response.url);

            if (url) {
                window.location.href = url;
            }
        }
        catch (error: unknown) {
            $toast({
                variant: 'destructive',
                description: proErrorMessage(error, 'Impossible d\'ouvrir la gestion de l\'abonnement.'),
            });
        }
        finally {
            loading.value = false;
        }
    }

    async function cancel(): Promise<boolean> {
        loading.value = true;
        try {
            const response = await $apifetch<ProStatus & { message?: string }>('api/subscription/pro/cancel', {
                method: 'POST',
            });
            status.value = response;
            $toast({ description: response.message ?? 'Abonnement résilié.' });

            return true;
        }
        catch (error: unknown) {
            $toast({
                variant: 'destructive',
                description: proErrorMessage(error, 'Impossible de résilier l\'abonnement.'),
            });

            return false;
        }
        finally {
            loading.value = false;
        }
    }

    async function resume(): Promise<boolean> {
        loading.value = true;
        try {
            const response = await $apifetch<ProStatus & { message?: string }>('api/subscription/pro/resume', {
                method: 'POST',
            });
            status.value = response;
            $toast({ description: response.message ?? 'Abonnement réactivé.' });

            return true;
        }
        catch (error: unknown) {
            $toast({
                variant: 'destructive',
                description: proErrorMessage(error, 'Impossible de réactiver l\'abonnement.'),
            });

            return false;
        }
        finally {
            loading.value = false;
        }
    }

    /** Boost offert du mois : aucun passage par Stripe. */
    async function claimFreeBoost(replacementId: number): Promise<string | null> {
        loading.value = true;
        try {
            const response = await $apifetch<{ message?: string; boosted_until?: string }>(
                `api/subscription/replacements/${replacementId}/boost/free`,
                { method: 'POST' },
            );
            $toast({ description: response.message ?? 'Boost offert appliqué.' });
            await fetchStatus();

            return response.boosted_until ?? null;
        }
        catch (error: unknown) {
            $toast({
                variant: 'destructive',
                description: proErrorMessage(error, 'Impossible d\'appliquer le boost offert.'),
            });

            return null;
        }
        finally {
            loading.value = false;
        }
    }

    return {
        status,
        catalog,
        loading,
        isPremium,
        boostCredit,
        fetchStatus,
        fetchCatalog,
        fetchOffer,
        checkout,
        confirm,
        openBillingPortal,
        cancel,
        resume,
        claimFreeBoost,
    };
}

function proErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === 'object' && 'data' in error) {
        const message = (error as { data?: { message?: string } }).data?.message;

        if (message) {
            return message;
        }
    }

    return fallback;
}
