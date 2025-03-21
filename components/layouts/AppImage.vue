<template>
    <NuxtImg
        :src="`/images/${src}`"
        v-bind="$attrs"
    />
</template>

<script setup>
defineProps({
    src: String,
});
</script>
