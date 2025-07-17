<template>
    <div>
        <LayoutsAppImage
            :src="'nurs_tech.png'"
            alt="logo-NursTech"
            class="hover:cursor-pointer"
            :class="classe"
            format="png"
            @click="navigateToNursTech"
        />
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
    classe?: string;
}>();

function navigateToNursTech() {
    navigateTo('/nurstech-by-infiswap');
}
</script>
