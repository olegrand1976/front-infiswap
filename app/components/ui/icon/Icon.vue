<!-- eslint-disable vue/require-default-prop -->
<script setup>
import { computed } from 'vue';
import * as icons from 'lucide-vue-next';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 20,
    },
    color: String,
    strokeWidth: Number,
    defaultClass: String,
});

const icon = computed(() => icons[props.name]);
</script>

<template>
    <component
        :is="icon"
        :size="size"
        :color="color"
        :stroke-width="strokeWidth"
        :default-class="defaultClass"
    />
</template>
