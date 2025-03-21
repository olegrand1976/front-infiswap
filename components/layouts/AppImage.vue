<template>
    <NuxtImg
        :src="computedSrc"
        v-bind="$attrs"
    />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    src: String,
});

const computedSrc = computed(() => {
    return props.src.startsWith('images/') ? `/${props.src}` : `/images/${props.src}`;
});
</script>
