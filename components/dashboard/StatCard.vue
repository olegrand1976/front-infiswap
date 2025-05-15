<template>
    <div
        class="w-full px-6 sm:w-1/2 xl:w-1/3 mb-4"
        :class="containerClass"
    >
        <div class="flex items-center px-5 py-6 bg-white rounded shadow-md">
            <div :class="['p-3 bg-opacity-75 rounded-full', colorClass]">
                <component
                    :is="icon"
                    class="w-8 h-8 text-white"
                />
            </div>
            <div class="mx-5 w-full">
                <div class="w-full flex justify-between items-center">
                    <h4 class="text-2xl font-semibold text-gray-700">
                        {{ value }}
                    </h4>

                    <p
                        v-if="colorClass == 'bg-indigo-600'"
                        class="text-xs text-indigo-600"
                    >
                        {{ new Date().toLocaleDateString('fr-FR') }}
                    </p>
                </div>
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
    icon: {
        type: [Object, Function],
        required: true,
    },
    containerClass: {
        type: String,
        default: '',
    },
});
</script>
