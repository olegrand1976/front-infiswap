import { BellRing, FileCheck, Sparkles, Star, type LucideIcon } from 'lucide-vue-next';

export type PremiumBenefit = {
    icon: LucideIcon;
    title: string;
    description: string;
};

/** Copy marketing Premium partagée (dashboard, page abonnement, pricing). */
export function usePremiumMarketing() {
    const { t } = useI18n();

    const benefits = computed<PremiumBenefit[]>(() => [
        {
            icon: BellRing,
            title: t('premiumMarketing.benefits.alert.title'),
            description: t('premiumMarketing.benefits.alert.description'),
        },
        {
            icon: Sparkles,
            title: t('premiumMarketing.benefits.boost.title'),
            description: t('premiumMarketing.benefits.boost.description'),
        },
        {
            icon: FileCheck,
            title: t('premiumMarketing.benefits.contract.title'),
            description: t('premiumMarketing.benefits.contract.description'),
        },
        {
            icon: Star,
            title: t('premiumMarketing.benefits.visibility.title'),
            description: t('premiumMarketing.benefits.visibility.description'),
        },
    ]);

    const badge = computed(() => t('premiumMarketing.badge'));
    const title = computed(() => t('premiumMarketing.title'));
    const subtitle = computed(() => t('premiumMarketing.subtitle'));
    const cta = computed(() => t('premiumMarketing.cta'));
    const priceNote = computed(() => t('premiumMarketing.priceNote'));

    return {
        badge,
        title,
        subtitle,
        cta,
        priceNote,
        benefits,
    };
}
