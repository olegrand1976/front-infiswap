<template>
    <div
        class="grid gap-2 sm:grid-cols-2 rounded-2xl border border-gray-200/80 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-1.5 shadow-sm"
        role="tablist"
    >
        <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            role="tab"
            :aria-selected="modelValue === tab.key"
            class="group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            :class="modelValue === tab.key
                ? 'bg-white shadow-md ring-1 ring-primary/15'
                : 'hover:bg-white/70'"
            @click="emit('update:modelValue', tab.key)"
        >
            <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
                :class="modelValue === tab.key
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200/80'"
            >
                <component
                    :is="iconFor(tab.key)"
                    class="h-5 w-5"
                />
            </div>

            <div class="min-w-0 flex-1">
                <p
                    class="truncate text-sm font-semibold"
                    :class="modelValue === tab.key ? 'text-gray-900' : 'text-gray-600'"
                >
                    {{ tab.label }}
                </p>
                <p class="mt-0.5 truncate text-xs text-gray-500">
                    {{ descriptionFor(tab) }}
                </p>
            </div>

            <span
                v-if="modelValue === tab.key"
                class="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-primary via-primary to-emerald-500"
            />
        </button>
    </div>
</template>

<script setup lang="ts">
import { KeyRound, Rocket } from 'lucide-vue-next';
import type { SubscriptionTab } from '~/composables/useSubscriptionPlansAdmin';

defineProps<{
    tabs: SubscriptionTab[];
    modelValue: string;
}>();

const emit = defineEmits<{
    'update:modelValue': [key: string];
}>();

function iconFor(key: string) {
    return key.startsWith('boost') ? Rocket : KeyRound;
}

function descriptionFor(tab: SubscriptionTab) {
    if (tab.group === 'access') {
        return 'Tarif d\'accès permanent à la plateforme';
    }

    return 'Mise en avant des annonces de remplacement';
}
</script>
