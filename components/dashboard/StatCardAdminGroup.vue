<template>
    <div :class="parentClass">
        <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
            {{ title }}
        </p>
        <div class="flex flex-wrap -mx-6 space-y-4 lg:space-y-0">
            <DashboardStatCard
                v-for="(item, index) in items"
                :key="index"
                :value="item.value"
                :label="item.label"
                :color-class="item.colorClass"
                :container-class="item.containerClass"
                :icon="item.icon"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
type StatItem = {
    value: number;
    label: string;
    colorClass: string;
    icon: Component;
    containerClass?: string;
};

defineProps<{
    title: string;
    items: StatItem[];
    parentClass?: string;
}>();
</script>
