<script setup lang="ts" generic="T extends Record<string, any>">
import type { BulletLegendItemInterface } from '@unovis/ts';
import { Axis, GroupedBar, StackedBar } from '@unovis/ts';
import { VisAxis, VisGroupedBar, VisStackedBar, VisXYContainer } from '@unovis/vue';
import { useMounted } from '@vueuse/core';
import { type Component, computed, ref } from 'vue';
import type { BaseChartProps } from '.';
import { cn } from '@/lib/utils';
import { ChartCrosshair, ChartLegend } from '@/components/ui/chart';

const props = withDefaults(defineProps<BaseChartProps<T> & {
    customTooltip?: Component;
    type?: 'grouped' | 'stacked';
    roundedCorners?: number;
    xTickStep?: number;
    xTickTextSize?: number;
    xTickRotation?: number;
    yTickTextSize?: number;
    showAllXTicks?: boolean;
}>(), {
    type: 'grouped',
    margin: () => ({ top: 10, bottom: 40, left: 0, right: 20 }),
    filterOpacity: 0.2,
    roundedCorners: 4,
    showXAxis: true,
    showYAxis: true,
    showTooltip: true,
    showLegend: true,
    showGridLine: true,
    xTickStep: 1,
    xTickTextSize: 12,
    xTickRotation: 0,
    yTickTextSize: 12,
    showAllXTicks: false,
});

const emits = defineEmits<{
    legendItemClick: [d: BulletLegendItemInterface, i: number];
}>();

type KeyOfT = Extract<keyof T, string>;
type Data = typeof props.data[number];

const index = computed(() => props.index as KeyOfT);
const colors = computed(() => props.colors?.length ? props.colors : defaultColors(props.categories.length));
const legendItems = ref<BulletLegendItemInterface[]>(props.categories.map((category, i) => ({
    name: 'Nombre',
    color: colors.value[i],
    inactive: false,
})));

const isMounted = useMounted();

function handleLegendItemClick(d: BulletLegendItemInterface, i: number) {
    emits('legendItemClick', d, i);
}

const xTicks = computed(() => {
    if (props.showAllXTicks) {
        return Array.from({ length: props.data.length }, (_, i) => i);
    }
    const step = props.xTickStep || 1;
    return Array.from({ length: Math.ceil(props.data.length / step) }, (_, i) => i * step);
});

const VisBarComponent = computed(() => props.type === 'grouped' ? VisGroupedBar : VisStackedBar);
const selectorsBar = computed(() => props.type === 'grouped' ? GroupedBar.selectors.bar : StackedBar.selectors.bar);
</script>

<template>
    <div :class="cn('w-full h-[400px] flex flex-col items-end', $attrs.class ?? '')">
        <ChartLegend
            v-if="showLegend"
            v-model:items="legendItems"
            @legend-item-click="handleLegendItemClick"
        />

        <VisXYContainer
            :data="data"
            :style="{ height: isMounted ? '100%' : 'auto' }"
            :margin="margin"
        >
            <ChartCrosshair
                v-if="showTooltip"
                :colors="colors"
                :items="legendItems"
                :custom-tooltip="customTooltip"
                :index="index"
            />

            <component
                :is="VisBarComponent"
                :x="(d: Data, i: number) => i"
                :y="categories.map(category => (d: Data) => d[category])"
                :color="colors"
                :rounded-corners="roundedCorners"
                :bar-padding="0.1"
                :attributes="{
                    [selectorsBar]: {
                        opacity: (d: Data, i: number) => {
                            const pos = i % categories.length
                            return legendItems[pos]?.inactive ? filterOpacity : 1
                        },
                    },
                }"
            />

            <VisAxis
                v-if="showXAxis"
                type="x"
                :ticks="showAllXTicks ? xTicks : undefined"
                :tick-format="xFormatter ?? ((v: number) => data[v]?.[index])"
                :grid-line="false"
                :tick-line="true"
                :tick-text-angle="xTickRotation"
                :tick-step="xTickStep"
                :tick-text-font-size="`${xTickTextSize}px`"
                tick-text-color="var(--axis-text-color, #333)"
                :domain-line="true"
                tick-margin="10"
                label="Période"
                :label-margin="30"
                label-position="center"
            />

            <VisAxis
                v-if="showYAxis"
                type="y"
                :tick-line="true"
                :tick-format="yFormatter ?? ((v: number) => v.toString())"
                :domain-line="true"
                :grid-line="showGridLine"
                :tick-text-font-size="`${yTickTextSize}px`"
                :attributes="{
                    [Axis.selectors.grid]: {
                        class: 'text-muted',
                    },
                    [Axis.selectors.label]: {
                        class: 'axis-label',
                    },
                }"
                tick-text-color="var(--axis-text-color, #333)"
                label="Nombre"
                label-position="center"
            />

            <slot />
        </VisXYContainer>
    </div>
</template>

<style scoped>
:deep(.unovis-axis text) {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  fill: var(--axis-text-color, #333);
  opacity: 1;
}

:deep(.unovis-axis .axis-label) {
  font-weight: 600;
  font-size: 12px;
}

:deep(.unovis-axis line) {
  stroke: var(--axis-line-color, rgba(0, 0, 0, 0.2));
  stroke-width: 1px;
}

:deep(.unovis-bar) {
  transition: all 0.2s ease;
}

:deep(.unovis-axis .domain) {
  stroke: var(--axis-line-color, rgba(0, 0, 0, 0.2));
  stroke-width: 1px;
}
</style>
