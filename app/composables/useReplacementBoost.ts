export const useReplacementBoost = () => {
    const { $apifetch } = useNuxtApp();
    const { isInstitution } = useAuth();

    const boostPlan = useState<{
        label?: string;
        amount?: string | number;
        interval?: string;
        description?: string | null;
    } | null>('replacementBoostPlan', () => null);
    const planLoaded = useState('replacementBoostPlanLoaded', () => false);

    const fetchBoostPlan = async (force = false) => {
        if (planLoaded.value && !force) return boostPlan.value;

        try {
            const response = await $apifetch<{ plan: typeof boostPlan.value }>('api/subscription/boosts/replacement');
            boostPlan.value = response.plan;
        }
        catch {
            boostPlan.value = null;
        }
        finally {
            planLoaded.value = true;
        }

        return boostPlan.value;
    };

    const canBoostReplacement = (r: {
        institution_id?: number | null;
        status?: string;
        has_confirmed_substitute?: boolean;
    }, listType = 'me') =>
        listType === 'me'
        && !isInstitution.value
        && !r.institution_id
        && r.status === 'open'
        && r.has_confirmed_substitute !== true;

    return {
        boostPlan,
        fetchBoostPlan,
        canBoostReplacement,
    };
};
