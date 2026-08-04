<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import type { HTMLAttributes } from 'vue';
import { cn } from '~/lib/utils';

interface Props {
    to?: string;
    text?: string;
    class?: HTMLAttributes['class'];
    size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
    to: '/login',
    text: 'Retour',
    size: 'md',
});

const sizeClasses = {
    sm: { icon: 'w-3.5 h-3.5', text: 'text-xs', gap: 'gap-1', mobileIcon: 'w-4 h-4', mobilePad: 'p-1.5' },
    md: { icon: 'w-4 h-4', text: 'text-sm', gap: 'gap-1.5', mobileIcon: 'w-5 h-5', mobilePad: 'p-2' },
    lg: { icon: 'w-5 h-5', text: 'text-base', gap: 'gap-2', mobileIcon: 'w-6 h-6', mobilePad: 'p-2' },
}[props.size];

const handleBack = () => {
    navigateTo(props.to);
};
</script>

<template>
    <div>
        <div class="hidden sm:block absolute top-6 left-6">
            <button
                :class="cn('flex items-center text-primary hover:underline group', sizeClasses.gap, $props.class)"
                @click="handleBack"
            >
                <ArrowLeft :class="cn(sizeClasses.icon, 'transition-transform group-hover:-translate-x-1')" />
                <span :class="cn('font-medium', sizeClasses.text)">{{ text }}</span>
            </button>
        </div>

        <div class="sm:hidden absolute top-4 left-4 z-30">
            <button
                :class="cn(sizeClasses.mobilePad, 'bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-primary active:scale-95 transition-transform')"
                @click="handleBack"
            >
                <ArrowLeft :class="sizeClasses.mobileIcon" />
            </button>
        </div>
    </div>
</template>
