<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'radix-vue';
import { SelectRoot, useForwardPropsEmits } from 'radix-vue';

const props = defineProps<SelectRootProps & {
    label?: string;
}>();
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
