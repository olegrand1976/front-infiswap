<template>
    <NuxtImg
        :src="'/logo.png'"
        alt="InfiSwap"
        :class="classe"
        format="png"
    />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
    classe?: string;
}>();
</script>
