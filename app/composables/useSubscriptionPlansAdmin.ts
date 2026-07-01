export const SUBSCRIPTION_TABS: SubscriptionTab[] = [
    { key: 'access', label: 'Accès plateforme', group: 'access' },
    { key: 'boost_replacement', label: 'Boost remplacement', group: 'boost', feature: 'replacement' },
];

export const resolveSubscriptionTab = (tabKey: string): SubscriptionTab =>
    SUBSCRIPTION_TABS.find(t => t.key === tabKey) ?? SUBSCRIPTION_TABS[0];

type TabPlansCache = Record<string, {
    active: StripePlanAdmin | null;
    inactive: StripePlanAdmin[];
}>;

export const useSubscriptionPlansAdmin = () => {
    const { $apifetch, $toast } = useNuxtApp();
    const tabs = useState<SubscriptionTab[]>('adminSubscriptionTabs', () => SUBSCRIPTION_TABS);
    const activePlan = useState<StripePlanAdmin | null>('adminActivePlan', () => null);
    const inactivePlans = useState<StripePlanAdmin[]>('adminInactivePlans', () => []);
    const loadedTabKey = useState<string>('adminLoadedTabKey', () => '');
    const loading = useState<boolean>('adminPlansLoading', () => false);
    const tabCache = useState<TabPlansCache>('adminSubscriptionPlansCache', () => ({}));

    const applyTabData = (tabKey: string, active: StripePlanAdmin | null, inactive: StripePlanAdmin[]) => {
        activePlan.value = active;
        inactivePlans.value = inactive;
        loadedTabKey.value = tabKey;
    };

    const invalidateTabCache = (tabKey?: string) => {
        if (!tabKey) {
            tabCache.value = {};
            return;
        }

        const { [tabKey]: _removed, ...rest } = tabCache.value;
        tabCache.value = rest;
    };

    const getPlansByGroup = async (group: 'access' | 'boost', feature?: string, tabKey?: string) => {
        const resolvedTabKey = tabKey ?? (group === 'access' ? 'access' : `boost_${feature ?? 'replacement'}`);

        if (tabCache.value[resolvedTabKey]) {
            applyTabData(resolvedTabKey, tabCache.value[resolvedTabKey].active, tabCache.value[resolvedTabKey].inactive);
            return;
        }

        loading.value = true;
        try {
            const params = new URLSearchParams({ group });
            if (feature) {
                params.set('feature', feature);
            }

            const response = await $apifetch<PlansGroupResponse>(`api/admin/stripe-plans?${params.toString()}`);
            tabs.value = response.tabs ?? SUBSCRIPTION_TABS;

            const inactive = response.inactive ?? [];
            tabCache.value = {
                ...tabCache.value,
                [resolvedTabKey]: {
                    active: response.active,
                    inactive,
                },
            };

            applyTabData(resolvedTabKey, response.active, inactive);
        }
        finally {
            loading.value = false;
        }
    };

    const loadTab = async (tabKey: string, force = false) => {
        const tab = resolveSubscriptionTab(tabKey);

        if (force) {
            invalidateTabCache(tab.key);
        }

        await getPlansByGroup(tab.group, tab.feature, tab.key);
    };

    /** @deprecated use getPlansByGroup */
    const getCurrentPlan = async () => {
        await getPlansByGroup('access');
    };

    const getPlan = async (id: number) => {
        const response = await $apifetch<{ plan: StripePlanAdmin }>(`api/admin/stripe-plans/${id}`);
        return response.plan;
    };

    const createPlan = async (payload: StripePlanPayload) => {
        const response = await $apifetch<{ plan: StripePlanAdmin; message: string }>('api/admin/stripe-plans', {
            method: 'POST',
            body: payload,
        });
        $toast({ description: response.message || 'Plan créé.' });
        const cacheKey = payload.type === 'boost'
            ? `boost_${payload.feature ?? 'replacement'}`
            : 'access';
        invalidateTabCache(cacheKey);
        activePlan.value = response.plan;
        return response.plan;
    };

    const updatePlan = async (id: number, payload: Partial<StripePlanPayload>) => {
        const response = await $apifetch<{ plan: StripePlanAdmin; message: string }>(`api/admin/stripe-plans/${id}`, {
            method: 'PUT',
            body: payload,
        });
        $toast({ description: response.message || 'Plan mis à jour.' });
        invalidateTabCache(loadedTabKey.value);
        return response.plan;
    };

    const activatePlan = async (id: number) => {
        const response = await $apifetch<{ plan: StripePlanAdmin; message: string }>(`api/admin/stripe-plans/${id}/activate`, {
            method: 'POST',
        });
        $toast({ description: response.message || 'Plan réactivé.' });
        return response.plan;
    };

    const deactivatePlan = async (id: number) => {
        const response = await $apifetch<{ plan: StripePlanAdmin; message: string }>(`api/admin/stripe-plans/${id}`, {
            method: 'DELETE',
        });
        $toast({ description: response.message || 'Plan désactivé.' });
        return response.plan;
    };

    return {
        tabs,
        activePlan,
        inactivePlans,
        loadedTabKey,
        loading,
        getPlansByGroup,
        loadTab,
        getCurrentPlan,
        getPlan,
        createPlan,
        updatePlan,
        activatePlan,
        deactivatePlan,
    };
};

export interface SubscriptionTab {
    key: string;
    label: string;
    group: 'access' | 'boost';
    feature?: string;
}

export interface StripePlanAdmin {
    id: number;
    name: string;
    stripe_product_id: string | null;
    stripe_price_id: string;
    type: 'platform_access' | 'boost';
    feature: string | null;
    interval: string;
    interval_count: number | null;
    duration_days: number | null;
    amount: number | string;
    currency: string;
    description: string | null;
    is_active: boolean;
    priority: number;
    label?: string;
    created_at: string;
    updated_at: string;
}

export interface PlansGroupResponse {
    tabs: SubscriptionTab[];
    active: StripePlanAdmin | null;
    inactive: StripePlanAdmin[];
    plan?: StripePlanAdmin | null;
}

export interface StripePlanPayload {
    name: string;
    type?: 'platform_access' | 'boost';
    feature?: string;
    interval?: string;
    duration_days?: number;
    amount: number;
    currency?: string;
    description?: string;
    priority?: number;
    deactivate_previous?: boolean;
    is_active?: boolean;
}

/** @deprecated use StripePlanAdmin */
export type AccessPlanAdmin = StripePlanAdmin;

/** @deprecated use StripePlanPayload */
export type AccessPlanPayload = StripePlanPayload;
