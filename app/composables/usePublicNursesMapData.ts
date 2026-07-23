import type { ComputedRef, Ref } from 'vue';
import type { NursesMapCountry, NursesMapPoint } from '@/composables/useNursesMap';
import { useNursesMap } from '@/composables/useNursesMap';

export const usePublicNursesMapData = (
    countryCode: Ref<NursesMapCountry> | ComputedRef<NursesMapCountry>,
) => {
    const { fetchPublicMap } = useNursesMap();

    const points = ref<NursesMapPoint[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const placedCount = computed(() =>
        points.value.reduce((sum, point) => sum + point.count, 0),
    );
    const isEmpty = computed(
        () => !loading.value && !error.value && points.value.length === 0,
    );

    let requestId = 0;

    const load = async () => {
        const currentRequest = ++requestId;
        loading.value = true;
        error.value = null;
        try {
            const response = await fetchPublicMap(countryCode.value);
            if (currentRequest !== requestId) {
                return;
            }
            points.value = response.points;
        }
        catch {
            if (currentRequest !== requestId) {
                return;
            }
            error.value = 'Impossible de charger la carte pour le moment.';
            points.value = [];
        }
        finally {
            if (currentRequest === requestId) {
                loading.value = false;
            }
        }
    };

    onMounted(() => {
        void load();
    });

    watch(countryCode, () => {
        void load();
    });

    return {
        points,
        loading,
        error,
        placedCount,
        isEmpty,
        load,
    };
};
