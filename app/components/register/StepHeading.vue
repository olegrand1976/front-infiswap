<script lang="ts" setup>
defineProps<{
    number: number;
    title: string;
    subtitle?: string;
    light?: boolean;
}>();
</script>

<template>
    <div class="relative flex gap-3 pl-0">
        <span
            class="flex size-9 shrink-0 items-center justify-center rounded-md border font-secondary text-base font-semibold"
            :class="light
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-primary/25 bg-primary/10 text-primary'"
        >
            {{ number }}
        </span>
        <div class="min-w-0">
            <h2
                class="text-base font-semibold leading-tight"
                :class="light ? 'text-white' : 'text-gray-900'"
            >
                {{ title }}
            </h2>
            <p
                v-if="subtitle"
                class="mt-0.5 text-xs"
                :class="light ? 'text-white/70' : 'text-gray-500'"
            >
                {{ subtitle }}
            </p>
        </div>
    </div>
</template>
