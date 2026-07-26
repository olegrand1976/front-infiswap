import {
    HOME_KPI_DEFINITIONS,
    HOME_MEMBERS_DISPLAY_BOOST,
    HOME_STATS_FALLBACK,
    type HomeKpiKey,
    type PlatformStats,
} from '~/lib/constants/homeStats';

export function usePlatformStats() {
    const { $apifetch } = useNuxtApp();
    const { t } = useI18n();

    const stats = useState<PlatformStats>('platformStats', () => ({ ...HOME_STATS_FALLBACK }));
    const loading = useState('platformStatsLoading', () => true);
    const fromApi = useState('platformStatsFromApi', () => false);

    async function fetchStats(): Promise<PlatformStats> {
        loading.value = true;

        try {
            const data = await $apifetch<PlatformStats>('/api/platform/stats');
            stats.value = data;
            fromApi.value = true;
            return data;
        }
        catch (error) {
            console.warn('[usePlatformStats] Fallback sur chiffres locaux:', error);
            stats.value = { ...HOME_STATS_FALLBACK };
            fromApi.value = false;
            return stats.value;
        }
        finally {
            loading.value = false;
        }
    }

    function getKpiValue(key: HomeKpiKey): number {
        return Math.round(stats.value[key] * HOME_MEMBERS_DISPLAY_BOOST);
    }

    const copy = computed(() => ({
        sectionTitle: t('home.stats.sectionTitle'),
        sectionSubtitle: t('home.stats.sectionSubtitle'),
        badge: t('home.stats.badge'),
        badgeHint: t('home.stats.badgeHint'),
        communityTitle: t('home.stats.communityTitle'),
        communityLead: t('home.stats.communityLead'),
        communityBody: t('home.stats.communityBody'),
        communityCta: t('home.stats.communityCta'),
        learnMore: t('home.stats.learnMore'),
        growthLabel: t('home.stats.growthLabel'),
        updatedLabel: t('home.stats.updatedLabel'),
        featureVerifiedTitle: t('home.stats.featureVerifiedTitle'),
        featureVerifiedBody: t('home.stats.featureVerifiedBody'),
        featureCommunityTitle: t('home.stats.featureCommunityTitle'),
        featureCommunityBody: t('home.stats.featureCommunityBody'),
        membersBadgeFoot: t('home.stats.membersBadgeFoot'),
    }));

    const kpiDefinitions = computed(() =>
        HOME_KPI_DEFINITIONS.map(def => ({
            key: def.key,
            suffix: def.suffix,
            label: t(def.labelKey),
            description: t(def.descriptionKey),
        })),
    );

    return {
        stats,
        loading,
        fromApi,
        copy,
        kpiDefinitions,
        fetchStats,
        getKpiValue,
    };
}
