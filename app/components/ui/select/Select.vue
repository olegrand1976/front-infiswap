<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SelectRootEmits, SelectRootProps } from 'radix-vue';
import { SelectRoot, useForwardPropsEmits } from 'radix-vue';

type CustomSelectProps = Omit<SelectRootProps, 'modelValue'> & {
    modelValue: any;
    label?: string;
};

const props = defineProps<CustomSelectProps>();
const emits = defineEmits<SelectRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
    <div>
        <label class="text-sm text-gray-500">{{ props.label }}</label>
        <SelectRoot v-bind="forwarded">
            <slot />
        </SelectRoot>
    </div>
</template>
