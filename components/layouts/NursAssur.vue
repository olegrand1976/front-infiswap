<template>
    <div>
        <LayoutsAppImage
            :src="'nurs_assur.png'"
            alt="logo-NursAssur"
            class="hover:cursor-pointer"
            :class="classe"
            format="png"
            @click="navigateToNursAssur"
        />
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
    classe?: string;
}>();

function navigateToNursAssur() {
    navigateTo('/nursassur-by-infiswap');
}
</script>
