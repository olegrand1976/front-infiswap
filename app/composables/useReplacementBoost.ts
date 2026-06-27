export const useReplacementBoost = () => {
    const { $apifetch } = useNuxtApp();
    const { isInstitution } = useAuth();

    const boostPlan = useState<{ label?: string; amount?: string | number; interval?: string } | null>(
        'replacementBoostPlan',
        () => null,
    );
    const planLoaded = useState('replacementBoostPlanLoaded', () => false);

    const fetchBoostPlan = async () => {
        if (planLoaded.value) return boostPlan.value;

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

    const boostShortLabel = computed(() => {
        if (!boostPlan.value?.label) return null;
        const parts = boostPlan.value.label.split(' · ');
        return parts[0] ?? boostPlan.value.label;
    });

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
        boostShortLabel,
        fetchBoostPlan,
        canBoostReplacement,
    };
};
