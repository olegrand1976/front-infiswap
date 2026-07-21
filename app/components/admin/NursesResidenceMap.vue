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
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
    points: NursesMapPoint[];
    countryLabel: string;
}>();

const mapEl = ref<HTMLElement | null>(null);
const ariaLabel = computed(
    () => `Carte des infirmières — ${props.countryLabel}`,
);

let map: LeafletMap | null = null;
let markersLayer: LayerGroup | null = null;

const markerRadius = (count: number): number =>
    Math.min(8 + Math.sqrt(count) * 4, 32);

const renderMarkers = async () => {
    if (!map || !markersLayer) {
        return;
    }

    const L = await import('leaflet');
    markersLayer.clearLayers();

    if (props.points.length === 0) {
        return;
    }

    const bounds: [number, number][] = [];

    for (const point of props.points) {
        const latLng: [number, number] = [point.latitude, point.longitude];
        bounds.push(latLng);

        L.circleMarker(latLng, {
            radius: markerRadius(point.count),
            color: '#0f766e',
            weight: 1.5,
            fillColor: '#14b8a6',
            fillOpacity: 0.65,
        })
            .bindPopup(
                `<strong>${point.zip} — ${point.city}</strong><br>${point.count} soignant${point.count > 1 ? 's' : ''}`,
            )
            .addTo(markersLayer);
    }

    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
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

    markersLayer = L.layerGroup().addTo(map);
    await renderMarkers();
};

onMounted(() => {
    void initMap();
});

watch(
    () => props.points,
    () => {
        void renderMarkers();
    },
    { deep: true },
);

onBeforeUnmount(() => {
    map?.remove();
    map = null;
    markersLayer = null;
});
</script>
