<template>
    <div class="bg-white">
        <div :class="{ 'pb-16 lg:pb-0': !isDashboardRoute }">
            <NuxtPage />
        </div>
        <LayoutsBottomTabsMenu v-if="!isDashboardRoute" />
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();

const isDashboardRoute = computed(() => {
    return route.path.startsWith('/dashboard');
});
</script>
