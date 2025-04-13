<template>
    <div :class="['w-full p-4 rounded-md bg-white', customClass]">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    customClass?: string;
}>();
</script>
