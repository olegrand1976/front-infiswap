import { canBoostReplacement as canBoostReplacementItem, type ReplacementBoostPlan } from '~/lib/replacementBoost';

export const useReplacementBoost = () => {
    const { $apifetch } = useNuxtApp();
    const { isInstitution } = useAuth();

    const boostPlans = useState<ReplacementBoostPlan[]>('replacementBoostPlans', () => []);
    const boostPlan = useState<ReplacementBoostPlan | null>('replacementBoostPlan', () => null);
    const planLoaded = useState('replacementBoostPlanLoaded', () => false);

    const fetchBoostPlans = async (force = false) => {
        if (planLoaded.value && !force) {
            return boostPlans.value;
        }

        try {
            const response = await $apifetch<{
                plans?: ReplacementBoostPlan[];
                plan?: ReplacementBoostPlan | null;
            }>('api/subscription/boosts/replacement');

            boostPlans.value = response.plans ?? (response.plan ? [response.plan] : []);
            boostPlan.value = boostPlans.value[0] ?? null;
        }
        catch {
            boostPlans.value = [];
            boostPlan.value = null;
        }
        finally {
            planLoaded.value = true;
        }

        return boostPlans.value;
    };

    const fetchBoostPlan = async (force = false) => {
        await fetchBoostPlans(force);
        return boostPlan.value;
    };

    const canBoostReplacement = (
        replacement: {
            institution_id?: number | null;
            status?: string;
            has_confirmed_substitute?: boolean;
        },
        listType = 'me',
    ) => canBoostReplacementItem(replacement, {
        listType,
        isInstitutionUser: isInstitution.value,
    });

    return {
        boostPlan,
        boostPlans,
        fetchBoostPlan,
        fetchBoostPlans,
        canBoostReplacement,
    };
};
