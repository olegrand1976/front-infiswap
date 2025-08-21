<template>
    <div v-if="loading">
        <Skeleton class=" bg-gray-200 rounded-sm h-24" />
    </div>
    <div
        v-else
        :class="parentClass"
    >
        <p class="ml-2 mb-1 first-letter:uppercase font-semibold text-sm">
            {{ title }}
        </p>
        <div class="flex flex-wrap -mx-6">
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
    loading?: boolean;
}>();
</script>
