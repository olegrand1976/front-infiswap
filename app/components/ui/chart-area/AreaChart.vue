<script setup lang="ts" generic="T extends Record<string, any>">
import { type BulletLegendItemInterface, CurveType, Area, Axis, Line } from '@unovis/ts';
import { VisArea, VisAxis, VisLine, VisXYContainer } from '@unovis/vue';
import { useMounted } from '@vueuse/core';
import { useId } from 'reka-ui';
import { type Component, computed, ref, watch } from 'vue';
import type { BaseChartProps } from '.';
import { cn } from '@/lib/utils';
import { ChartCrosshair, ChartLegend, defaultColors } from '@/components/ui/chart';

const props = withDefaults(defineProps<BaseChartProps<T> & {
    /**
   * Render custom tooltip component.
   */
    customTooltip?: Component;
    /**
   * Type of curve
   */
    curveType?: CurveType;
    /**
     *
   * Controls the visibility of gradient.
   * @default true
   */
    /**
     * Customized legends
     */
    legendLabels?: Record<string, string>;
    showGradiant?: boolean;
    /**
     * Number of ticks to display on X axis. If not provided, will show all data points.
     */
    numTicksX?: number;
    /**
     * Number of ticks to display on Y axis
     */
    numTicksY?: number;
    /**
     * Show all X axis ticks
     */
    showAllXTicks?: boolean;
}>(), {
    curveType: CurveType.MonotoneX,
    filterOpacity: 0.2,
    margin: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    showXAxis: true,
    showYAxis: true,
    showTooltip: true,
    showLegend: true,
    showGridLine: true,
    showGradiant: true,
    showAllXTicks: false,
});

const emits = defineEmits<{
    legendItemClick: [d: BulletLegendItemInterface, i: number];
}>();

type KeyOfT = Extract<keyof T, string>;
type Data = typeof props.data[number];

const chartRef = useId();

const index = computed(() => props.index as KeyOfT);
const colors = computed(() => props.colors?.length ? props.colors : defaultColors(props.categories.length));

const legendItems = computed(() =>
    props.categories.map((category, i) => ({
        name: props.legendLabels?.[category] ?? category,
        color: colors.value[i],
        inactive: false,
    })),
);

const internalLegendItems = ref<BulletLegendItemInterface[]>([]);

watch(legendItems, (newItems) => {
    internalLegendItems.value = [...newItems];
}, { immediate: true });

const isMounted = useMounted();

// Compute x-axis ticks based on showAllXTicks prop
const xTicks = computed(() => {
    if (!props.data?.length || !Array.isArray(props.data)) return [];
    if (props.showAllXTicks) {
        return Array.from({ length: props.data.length }, (_, i) => i);
    }
    const numTicks = props.numTicksX ?? Math.min(props.data.length, 10);
    const step = Math.max(1, Math.floor(props.data.length / numTicks));
    return Array.from({ length: Math.ceil(props.data.length / step) }, (_, i) => i * step);
});

// Format x-axis tick labels
const xTickFormat = computed(() => {
    return (tick: number) => {
        if (props.xFormatter) {
            return props.xFormatter(tick, tick, xTicks.value);
        }
        const dataItem = props.data[tick];
        if (dataItem && index.value) {
            return String(dataItem[index.value] ?? tick);
        }
        return String(tick);
    };
});

function handleLegendItemClick(d: BulletLegendItemInterface, i: number) {
    emits('legendItemClick', d, i);
}
</script>

<template>
    <div :class="cn('w-full h-[400px] flex flex-col items-end', $attrs.class ?? '')">
        <ChartLegend
            v-if="showLegend"
            v-model:items="internalLegendItems"
            :colors="colors"
            @legend-item-click="handleLegendItemClick"
        />

        <VisXYContainer
            :style="{ height: isMounted ? '100%' : 'auto' }"
            :margin="{ left: 20, right: 20, bottom: 40 }"
            :data="data"
        >
            <svg
                width="0"
                height="0"
            >
                <defs>
                    <linearGradient
                        v-for="(color, i) in colors"
                        :id="`${chartRef}-color-${i}`"
                        :key="i"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <template v-if="showGradiant">
                            <stop
                                offset="5%"
                                :stop-color="color"
                                stop-opacity="0.7"
                            />
                            <stop
                                offset="95%"
                                :stop-color="color"
                                stop-opacity="0.2"
                            />
                        </template>
                        <template v-else>
                            <stop
                                offset="0%"
                                :stop-color="color"
                            />
                        </template>
                    </linearGradient>
                </defs>
            </svg>

            <ChartCrosshair
                v-if="showTooltip"
                :colors="colors"
                :items="internalLegendItems"
                :index="index"
                :custom-tooltip="customTooltip"
            />

            <template
                v-for="(category, i) in categories"
                :key="category"
            >
                <VisArea
                    :x="(d: Data, i: number) => i"
                    :y="(d: Data) => d[category]"
                    color="auto"
                    :curve-type="curveType"
                    :attributes="{
                        [Area.selectors.area]: {
                            fill: `url(#${chartRef}-color-${i})`,
                        },
                    }"
                    :opacity="legendItems.find(item => item.name === category)?.inactive ? filterOpacity : 1"
                />
            </template>

            <template
                v-for="(category, i) in categories"
                :key="category"
            >
                <VisLine
                    :x="(d: Data, i: number) => i"
                    :y="(d: Data) => d[category]"
                    :color="colors[i]"
                    :curve-type="curveType"
                    :attributes="{
                        [Line.selectors.line]: {
                            opacity: legendItems.find(item => item.name === category)?.inactive ? filterOpacity : 1,
                        },
                    }"
                />
            </template>

            <VisAxis
                v-if="showXAxis"
                type="x"
                :ticks="xTicks"
                :tick-format="xTickFormat"
                :grid-line="false"
                :tick-line="true"
                :domain-line="true"
                :tick-text-font-size="12"
                tick-text-color="var(--axis-text-color, #333)"
                tick-margin="10"
            />
            <VisAxis
                v-if="showYAxis"
                type="y"
                :tick-line="true"
                :tick-format="yFormatter ?? ((v: number) => v.toString())"
                :domain-line="true"
                :grid-line="showGridLine"
                :num-ticks="numTicksY ?? 6"
                :tick-text-font-size="12"
                :attributes="{
                    [Axis.selectors.grid]: {
                        class: 'text-black/30',
                    },
                }"
                tick-text-color="var(--axis-text-color, #333)"
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
  opacity: 1 !important;
}

:deep(.unovis-axis line) {
  stroke: var(--axis-line-color, rgba(0, 0, 0, 0.2));
  stroke-width: 1px;
}

:deep(.unovis-axis .domain) {
  stroke: var(--axis-line-color, rgba(0, 0, 0, 0.2));
  stroke-width: 1px;
}
</style>
