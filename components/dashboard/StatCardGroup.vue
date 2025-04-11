<template>
    <section class="grid grid-cols-1 items-center gap-4 mt-4">
        <div class="mt-4 p-2">
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
    </section>
</template>

<script setup lang="ts">
type StatItem = {
    value: string;
    label: string;
    colorClass: string;
    icon: Component;
    containerClass?: string;
};

defineProps<{
    title: string;
    items: StatItem[];
}>();
</script>
