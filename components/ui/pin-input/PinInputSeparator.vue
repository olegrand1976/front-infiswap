<script setup lang="ts">
import { StopIcon } from '@heroicons/vue/24/solid';
import { Primitive, type PrimitiveProps, useForwardProps } from 'radix-vue';

const props = defineProps<PrimitiveProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
    <Primitive v-bind="forwardedProps">
        <slot>
            <StopIcon />
        </slot>
    </primitive>
</template>
