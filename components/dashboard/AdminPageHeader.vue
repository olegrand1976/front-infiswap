<template>
    <div
        class="px-4 h-20 mb-10 text-gray-700 shadow-md rounded-md bg-white"
        :class="flexClass"
    >
        <h1 class="font-bold text-xl">
            {{ title }}
        </h1>
        <component
            :is="as"
            class="rounded-md"
        >
            <slot name="action" />
        </component>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string;
    flexClass?: string;
    as?: string;
}>();

const defaultFlex = 'flex items-center justify-between';
const flexClass = computed(() => props.flexClass ?? defaultFlex);
const as = computed(() => props.as ?? 'button');
</script>
