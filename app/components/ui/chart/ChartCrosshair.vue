<script setup lang="ts">
import type { BulletLegendItemInterface } from '@unovis/ts';
import { omit } from '@unovis/ts';
import { VisCrosshair, VisTooltip } from '@unovis/vue';
import { type Component, createVNode, render } from 'vue';
import { ChartTooltip } from '.';

const props = withDefaults(defineProps<{
    colors: string[];
    index: string;
    items: BulletLegendItemInterface[];
    customTooltip?: Component;
    legendLabels?: string[];
    categories?: string[];
}>(), {
    colors: () => [],
    legendLabels: () => [],
    categories: () => [],
});

const wm = new WeakMap();

function template(d: any) {
    if (wm.has(d)) {
        return wm.get(d);
    }
    else {
        const omittedData = Object.entries(omit(d, [props.index])).map(([key, value], idx) => {
            const label = props.legendLabels?.[idx] || props.items.find(i => i.name === key)?.name || key;
            const legendReference = props.items.find(i => i.name === (props.legendLabels?.[idx] || key)) || {
                name: label,
                color: props.colors[idx] || 'transparent',
            };
            return { ...legendReference, value };
        });

        const container = document.createElement('div');

        const vnode = createVNode(
            props.customTooltip ?? ChartTooltip,
            {
                title: d[props.index]?.toString() || 'Unknown',
                data: omittedData,
            },
        );

        render(vnode, container);

        wm.set(d, container);

        return container;
    }
}

function color(_: unknown, i: number) {
    return props.colors[i] ?? 'transparent';
}
</script>

<template>
    <VisTooltip
        :horizontal-shift="30"
        :vertical-shift="30"
        :colors="colors"
    />
    <VisCrosshair
        :template="template"
        :color="color"
        :colors="colors"
    />
</template>
