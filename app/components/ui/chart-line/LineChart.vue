<script setup lang="ts" generic="T extends Record<string, any>">
import { type BulletLegendItemInterface, CurveType, Axis, Line } from '@unovis/ts';
import { VisAxis, VisLine, VisXYContainer } from '@unovis/vue';
import { useMounted } from '@vueuse/core';
import { type Component, computed } from 'vue';
import type { BaseChartProps } from '.';
import { ChartCrosshair, ChartLegend, defaultColors } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

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
   * Customized legends
   */
    legendLabels?: Record<string, string>;
}>(), {
    curveType: CurveType.MonotoneX,
    filterOpacity: 0.2,
    margin: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    showXAxis: true,
    showYAxis: true,
    showTooltip: true,
    showLegend: true,
    showGridLine: true,
});

const emits = defineEmits<{
    legendItemClick: [d: BulletLegendItemInterface, i: number];
}>();

type KeyOfT = Extract<keyof T, string>;
type Data = typeof props.data[number];

const index = computed(() => props.index as KeyOfT);
const colors = computed(() => props.colors?.length ? props.colors : defaultColors(props.categories.length));

const legendItems = computed(() =>
    props.categories.map((category, i) => ({
        name: props.legendLabels?.[category] ?? category,
        color: colors.value[i],
        inactive: false,
    })),
);

const isMounted = useMounted();

function handleLegendItemClick(d: BulletLegendItemInterface, i: number) {
    emits('legendItemClick', d, i);
}
</script>

<template>
    <div :class="cn('w-full h-[300px] flex flex-col items-end', $attrs.class ?? '')">
        <ChartLegend
            v-if="showLegend"
            v-model:items="legendItems"
            @legend-item-click="handleLegendItemClick"
        />

        <VisXYContainer
            :margin="{ top: 0, bottom: 0, left: 0, right: 0 }"
            :data="data"
            :style="{ height: isMounted ? '90%' : 'auto' }"
        >
            <ChartCrosshair
                v-if="showTooltip"
                :colors="colors"
                :items="legendItems"
                :index="index"
                :custom-tooltip="customTooltip"
            />

            <template
                v-for="(category, i) in categories"
                :key="category"
            >
                <VisLine
                    :x="(d: Data, i: number) => i"
                    :y="(d: Data) => d[category]"
                    :curve-type="curveType"
                    :color="colors[i]"
                    :attributes="{
                        [Line.selectors.line]: {
                            opacity: legendItems.find(item => item.name === (legendLabels?.[category] ?? category))?.inactive ? filterOpacity : 1,
                        },
                    }"
                />
            </template>

            <VisAxis
                v-if="showXAxis"
                type="x"
                :tick-format="xFormatter ?? ((v: number) => data[v]?.[index])"
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
                :num-ticks="6"
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
