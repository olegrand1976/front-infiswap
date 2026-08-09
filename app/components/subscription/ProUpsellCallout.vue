<script setup lang="ts">
import { Crown } from 'lucide-vue-next';

withDefaults(
    defineProps<{
        title: string;
        description: string;
        tone?: 'primary' | 'amber';
    }>(),
    { tone: 'primary' },
);
</script>

<template>
    <NuxtLink
        to="/dashboard/subscriptions"
        class="flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors sm:p-4"
        :class="tone === 'amber'
            ? 'border-amber-300 bg-amber-50 hover:bg-amber-100'
            : 'border-primary/30 bg-primary/5 hover:bg-primary/10'"
    >
        <Crown
            class="mt-0.5 size-5 shrink-0"
            :class="tone === 'amber' ? 'text-amber-600' : 'text-primary'"
            aria-hidden="true"
        />
        <span>
            <span class="block font-semibold text-gray-800">{{ title }}</span>
            <span class="mt-0.5 block text-xs text-gray-600">{{ description }}</span>
        </span>
    </NuxtLink>
</template>
