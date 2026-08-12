import type { User } from '~/lib/types';

/** Upsell Infiswap Premium sur les pages de recherche de remplacements (infirmières freemium). */
export function useProSearchUpsell() {
    const { t } = useI18n();
    const user = useState<User | null>('user');
    const { status, isPremium, fetchStatus } = useProSubscription();

    const proSearchBenefits = computed(() => [
        t('replacements.proSearchBenefitAlert'),
        t('replacements.proSearchBenefitBoost'),
        t('replacements.proSearchBenefitContract'),
    ]);

    const showProSearchUpsell = computed(() => (
        Boolean(status.value)
        && !isPremium.value
        && !user.value?.institution
    ));

    /** Relance si le layout n’a pas encore (ou plus) de statut — sans inventer un freemium. */
    async function ensureProStatus(): Promise<void> {
        if (!status.value) {
            await fetchStatus();
        }
    }

    return {
        showProSearchUpsell,
        proSearchBenefits,
        ensureProStatus,
    };
}
