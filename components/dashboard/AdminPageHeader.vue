<template>
    <div
        class="px-4 h-20 mb-10 text-gray-700 shadow-md rounded-md bg-white"
        :class="flexClass"
    >
        <div class="flex items-center font-bold gap-2 lg:gap-4">
            <h1 class="text-xl">
                {{ title }}
            </h1>
            <span
                v-if="props.count>0"
                class="text-lg min-w-10 p-2 text-center bg-primary text-white rounded-lg"
            >
                {{ props.count }}
            </span>
        </div>
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
    count?: number;
}>();

const defaultFlex = 'flex items-center justify-between';
const flexClass = computed(() => props.flexClass ?? defaultFlex);
const as = computed(() => props.as ?? 'button');
</script>
