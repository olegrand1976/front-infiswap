<template>
    <div
        class="w-full px-6 sm:w-1/2 xl:w-1/3"
        :class="containerClass"
    >
        <div class="flex items-center px-5 py-6 bg-white rounded-md shadow-md">
            <div :class="['p-3 bg-opacity-75 rounded-full', colorClass]">
                <component
                    :is="icon"
                    class="w-8 h-8 text-white"
                />
            </div>
            <div class="mx-5">
                <h4 class="text-2xl font-semibold text-gray-700">
                    {{ value }}
                </h4>
                <div class="text-gray-500">
                    {{ label }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    value: Number,
    label: String,
    colorClass: String,
    icon: Object,
    containerClass: {
        type: String,
        default: '',
    },
});
</script>
