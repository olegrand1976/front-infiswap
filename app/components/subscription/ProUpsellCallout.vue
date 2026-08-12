<script setup lang="ts">
import { Crown } from 'lucide-vue-next';

withDefaults(
    defineProps<{
        title: string;
        description: string;
        tone?: 'primary' | 'amber';
        benefits?: string[];
    }>(),
    { tone: 'primary', benefits: () => [] },
);

const localePath = useLocalePath();
</script>

<template>
    <NuxtLink
        :to="localePath('/dashboard/subscriptions')"
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
        <span class="min-w-0">
            <span class="block font-semibold text-gray-800">{{ title }}</span>
            <span class="mt-0.5 block text-xs text-gray-600">{{ description }}</span>
            <ul
                v-if="benefits.length"
                class="mt-2 list-disc space-y-0.5 pl-4 text-xs text-gray-600"
            >
                <li
                    v-for="(benefit, index) in benefits"
                    :key="index"
                >
                    {{ benefit }}
                </li>
            </ul>
        </span>
    </NuxtLink>
</template>
