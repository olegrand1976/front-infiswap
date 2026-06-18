import {
    HOME_KPI_DEFINITIONS,
    HOME_MEMBERS_DISPLAY_BOOST,
    HOME_STATS_COPY,
    HOME_STATS_FALLBACK,
    type HomeKpiKey,
    type PlatformStats,
} from '~/lib/constants/homeStats';

export function usePlatformStats() {
    const { $apifetch } = useNuxtApp();

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

    return {
        stats,
        loading,
        fromApi,
        copy: HOME_STATS_COPY,
        kpiDefinitions: HOME_KPI_DEFINITIONS,
        fetchStats,
        getKpiValue,
    };
}
