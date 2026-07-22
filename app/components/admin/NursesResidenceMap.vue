<template>
    <div
        ref="wrapperEl"
        class="relative z-0 h-full w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50"
        role="region"
        :aria-label="ariaLabel"
    >
        <div
            ref="mapEl"
            class="h-full w-full"
        />
    </div>
</template>

<script setup lang="ts">
import type { NursesMapPoint, NursesMapPointType } from '@/composables/useNursesMap';
import type { Circle, LayerGroup, Map as LeafletMap } from 'leaflet';
import type LType from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type NursesMapSelectPointPayload = {
    type: NursesMapPointType;
    zip: string;
    city: string;
};

const props = defineProps<{
    points: NursesMapPoint[];
    institutionPoints: NursesMapPoint[];
    countryLabel: string;
    showNurses?: boolean;
    showInstitutions?: boolean;
}>();

const emit = defineEmits<{
    'select-point': [payload: NursesMapSelectPointPayload];
}>();

const wrapperEl = ref<HTMLElement | null>(null);
const mapEl = ref<HTMLElement | null>(null);
const ariaLabel = computed(
    () => `Carte soignants et prospects institutions — ${props.countryLabel}`,
);

let map: LeafletMap | null = null;
let nursesLayer: LayerGroup | null = null;
let institutionsLayer: LayerGroup | null = null;
let focusCircle: Circle | null = null;
let focusActive = false;
let resizeObserver: ResizeObserver | null = null;
let sizeWaitObserver: ResizeObserver | null = null;
let sizeWaitTimeoutId: ReturnType<typeof setTimeout> | null = null;
let leafletModule: typeof LType | null = null;
let initPromise: Promise<void> | null = null;
let disposed = false;

const markerRadius = (count: number): number =>
    Math.min(8 + Math.sqrt(count) * 4, 32);

/** Léger décalage lng pour distinguer soignants / institutions au même CP. */
const INSTITUTION_LNG_OFFSET = 0.004;

const loadLeaflet = async (): Promise<typeof LType> => {
    if (leafletModule) {
        return leafletModule;
    }
    const mod = await import('leaflet');
    leafletModule = (mod.default ?? mod) as typeof LType;
    return leafletModule;
};

const scheduleInvalidateSize = () => {
    if (!map) {
        return;
    }
    requestAnimationFrame(() => {
        map?.invalidateSize({ animate: false });
    });
};

const hasUsableSize = (el: HTMLElement): boolean =>
    el.clientWidth > 0 && el.clientHeight > 0;

const clearSizeWait = () => {
    sizeWaitObserver?.disconnect();
    sizeWaitObserver = null;
    if (sizeWaitTimeoutId !== null) {
        clearTimeout(sizeWaitTimeoutId);
        sizeWaitTimeoutId = null;
    }
};

const waitForUsableSize = (el: HTMLElement): Promise<void> => {
    if (disposed || hasUsableSize(el)) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const done = () => {
            clearSizeWait();
            resolve();
        };

        sizeWaitObserver = new ResizeObserver(() => {
            if (disposed || hasUsableSize(el)) {
                done();
            }
        });
        sizeWaitObserver.observe(el);

        // Filet si aucun resize n'arrive
        sizeWaitTimeoutId = setTimeout(done, 2000);
    });
};

const renderMarkers = async (options: { fit?: boolean } = {}) => {
    if (!map || !nursesLayer || !institutionsLayer) {
        return;
    }

    const shouldFit = options.fit !== false;
    const L = await loadLeaflet();
    nursesLayer.clearLayers();
    institutionsLayer.clearLayers();

    const bounds: [number, number][] = [];
    const showNurses = props.showNurses !== false;
    const showInstitutions = props.showInstitutions !== false;

    if (showNurses) {
        for (const point of props.points) {
            const latLng: [number, number] = [point.latitude, point.longitude];
            bounds.push(latLng);

            L.circleMarker(latLng, {
                radius: markerRadius(point.count),
                color: '#0f766e',
                weight: 1.5,
                fillColor: '#14b8a6',
                fillOpacity: 0.65,
                className: 'cursor-pointer',
            })
                .on('click', () => {
                    emit('select-point', {
                        type: 'nurses',
                        zip: String(point.zip),
                        city: String(point.city),
                    });
                })
                .addTo(nursesLayer);
        }
    }

    if (showInstitutions) {
        for (const point of props.institutionPoints) {
            const latLng: [number, number] = [
                point.latitude,
                point.longitude + INSTITUTION_LNG_OFFSET,
            ];
            bounds.push(latLng);

            L.circleMarker(latLng, {
                radius: markerRadius(point.count),
                color: '#991b1b',
                weight: 1.5,
                fillColor: '#dc2626',
                fillOpacity: 0.7,
                className: 'cursor-pointer',
            })
                .on('click', () => {
                    emit('select-point', {
                        type: 'institutions',
                        zip: String(point.zip),
                        city: String(point.city),
                    });
                })
                .addTo(institutionsLayer);
        }
    }

    if (shouldFit && !focusActive && bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
    }

    scheduleInvalidateSize();
};

const clearFocus = async () => {
    focusActive = false;
    if (focusCircle && map) {
        map.removeLayer(focusCircle);
        focusCircle = null;
    }
    await renderMarkers();
};

const focusAround = async (latitude: number, longitude: number, radiusKm = 25) => {
    if (!map || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
    }

    const L = await loadLeaflet();
    focusActive = true;

    if (focusCircle) {
        map.removeLayer(focusCircle);
        focusCircle = null;
    }

    focusCircle = L.circle([latitude, longitude], {
        radius: radiusKm * 1000,
        color: '#2563eb',
        weight: 2,
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
    }).addTo(map);

    map.fitBounds(focusCircle.getBounds(), { padding: [24, 24], maxZoom: 13 });
    scheduleInvalidateSize();
};

const initMap = async () => {
    if (map || initPromise) {
        return initPromise ?? undefined;
    }

    initPromise = (async () => {
        await nextTick();
        if (disposed) {
            return;
        }

        const sizeEl = wrapperEl.value;
        const el = mapEl.value;
        if (!sizeEl || !el || map) {
            return;
        }

        await waitForUsableSize(sizeEl);
        if (disposed || map || !mapEl.value) {
            return;
        }

        const L = await loadLeaflet();
        if (disposed) {
            return;
        }

        map = L.map(el, {
            scrollWheelZoom: true,
        }).setView([50.5, 4.5], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
        }).addTo(map);

        nursesLayer = L.layerGroup().addTo(map);
        institutionsLayer = L.layerGroup().addTo(map);
        await renderMarkers();
        scheduleInvalidateSize();

        resizeObserver = new ResizeObserver(() => {
            scheduleInvalidateSize();
        });
        resizeObserver.observe(sizeEl);
    })();

    return initPromise;
};

onMounted(() => {
    void initMap();
});

watch(
    () => [props.points, props.institutionPoints] as const,
    () => {
        void renderMarkers({ fit: true });
    },
    { deep: true },
);

watch(
    () => [props.showNurses, props.showInstitutions] as const,
    () => {
        void renderMarkers({ fit: false });
    },
);

onBeforeUnmount(() => {
    disposed = true;
    clearSizeWait();
    resizeObserver?.disconnect();
    resizeObserver = null;
    map?.remove();
    map = null;
    nursesLayer = null;
    institutionsLayer = null;
    focusCircle = null;
    initPromise = null;
});

defineExpose({
    focusAround,
    clearFocus,
});
</script>
