<template>
    <NuxtImg
        :src="computedSrc"
        :alt="alt"
        v-bind="$attrs"
        format="webp"
    />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    src: String,
    alt: String,
});

const computedSrc = computed(() => {
    return props.src.startsWith('images/') ? `/${props.src}` : `/images/${props.src}`;
});
</script>
