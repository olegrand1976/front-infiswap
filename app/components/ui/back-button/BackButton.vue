<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import type { HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

interface Props {
    to?: string;
    text?: string;
    class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
    to: '/login',
    text: 'Retour',
});

const handleBack = () => {
    navigateTo(props.to);
};
</script>

<template>
    <div>
        <div class="hidden sm:block absolute top-8 left-8">
            <button
                :class="cn('flex items-center space-x-2 text-primary hover:underline group', $props.class)"
                @click="handleBack"
            >
                <ArrowLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span class="font-medium">{{ text }}</span>
            </button>
        </div>

        <div class="sm:hidden absolute top-4 left-4 z-30">
            <button
                class="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm text-primary active:scale-95 transition-transform"
                @click="handleBack"
            >
                <ArrowLeft class="w-6 h-6" />
            </button>
        </div>
    </div>
</template>
