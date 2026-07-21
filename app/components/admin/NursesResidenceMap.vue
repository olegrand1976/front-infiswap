<template>
    <div
        ref="mapEl"
        class="h-[min(70vh,640px)] w-full rounded-md border border-gray-200 bg-gray-50"
        role="img"
        :aria-label="ariaLabel"
    />
</template>

<script setup lang="ts">
import type { NursesMapPoint } from '@/composables/useNursesMap';
import type { Circle, LayerGroup, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
    points: NursesMapPoint[];
    institutionPoints: NursesMapPoint[];
    countryLabel: string;
    showNurses?: boolean;
    showInstitutions?: boolean;
}>();

const mapEl = ref<HTMLElement | null>(null);
const ariaLabel = computed(
    () => `Carte soignants et prospects institutions — ${props.countryLabel}`,
);

let map: LeafletMap | null = null;
let nursesLayer: LayerGroup | null = null;
let institutionsLayer: LayerGroup | null = null;
let focusCircle: Circle | null = null;
let focusActive = false;

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const markerRadius = (count: number): number =>
    Math.min(8 + Math.sqrt(count) * 4, 32);

const renderMarkers = async (options: { fit?: boolean } = {}) => {
    if (!map || !nursesLayer || !institutionsLayer) {
        return;
    }

    const shouldFit = options.fit !== false;
    const L = await import('leaflet');
    nursesLayer.clearLayers();
    institutionsLayer.clearLayers();

    const bounds: [number, number][] = [];
    const showNurses = props.showNurses !== false;
    const showInstitutions = props.showInstitutions !== false;

    if (showNurses) {
        for (const point of props.points) {
            const latLng: [number, number] = [point.latitude, point.longitude];
            bounds.push(latLng);

            const zip = escapeHtml(String(point.zip));
            const city = escapeHtml(String(point.city));

            L.circleMarker(latLng, {
                radius: markerRadius(point.count),
                color: '#0f766e',
                weight: 1.5,
                fillColor: '#14b8a6',
                fillOpacity: 0.65,
            })
                .bindPopup(
                    `<strong>${zip} — ${city}</strong><br>${point.count} soignant${point.count > 1 ? 's' : ''}`,
                )
                .addTo(nursesLayer);
        }
    }

    if (showInstitutions) {
        for (const point of props.institutionPoints) {
            const latLng: [number, number] = [point.latitude, point.longitude];
            bounds.push(latLng);

            const zip = escapeHtml(String(point.zip));
            const city = escapeHtml(String(point.city));

            L.circleMarker(latLng, {
                radius: markerRadius(point.count),
                color: '#991b1b',
                weight: 1.5,
                fillColor: '#dc2626',
                fillOpacity: 0.7,
            })
                .bindPopup(
                    `<strong>${zip} — ${city}</strong><br>${point.count} prospect${point.count > 1 ? 's' : ''} institution`,
                )
                .addTo(institutionsLayer);
        }
    }

    if (shouldFit && !focusActive && bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
    }
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

    const L = await import('leaflet');
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
};

const initMap = async () => {
    if (!mapEl.value || map) {
        return;
    }

    const L = await import('leaflet');
    map = L.map(mapEl.value, {
        scrollWheelZoom: true,
    }).setView([50.5, 4.5], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
    }).addTo(map);

    nursesLayer = L.layerGroup().addTo(map);
    institutionsLayer = L.layerGroup().addTo(map);
    await renderMarkers();
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
    map?.remove();
    map = null;
    nursesLayer = null;
    institutionsLayer = null;
    focusCircle = null;
});

defineExpose({
    focusAround,
    clearFocus,
});
</script>
