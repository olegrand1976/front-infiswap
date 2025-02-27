<template>
    <NuxtImg
        :src="'/logo.png'"
        alt="InfiSwap"
        class="hover:cursor-pointer"
        :class="classe"
        format="png"
        @click="navigateToHome"
    />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
    classe?: string;
}>();

const { isLoggedIn } = useAuth();

function navigateToHome() {
    if (isLoggedIn.value) {
        navigateTo('/dashboard');
    }
    else {
        navigateTo('/');
    }
}
</script>
