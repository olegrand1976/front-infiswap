<template>
    <div
        class="flex items-center justify-center overflow-hidden border-4 border-white bg-muted shadow-md"
        :class="[sizeClass, roundedClass]"
    >
        <LayoutsApiImage
            v-if="logo"
            :path="logo"
            :alt="name"
            class="h-full w-full object-cover"
        >
            <template #fallback>
                <Building2
                    :class="iconClass"
                    stroke-width="1.5"
                />
            </template>
        </LayoutsApiImage>
        <Building2
            v-else
            :class="iconClass"
            stroke-width="1.5"
            class="text-primary"
        />
    </div>
</template>

<script lang="ts" setup>
import { Building2 } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        name: string;
        logo?: string | null;
        size?: 'sm' | 'md' | 'lg';
        rounded?: 'lg' | 'full';
    }>(),
    {
        size: 'md',
        rounded: 'lg',
    },
);

const sizeClass = computed(() => {
    switch (props.size) {
        case 'sm': return 'h-12 w-12';
        case 'lg': return 'h-28 w-28';
        default: return 'h-16 w-16';
    }
});

const iconClass = computed(() => {
    switch (props.size) {
        case 'sm': return 'size-6 shrink-0';
        case 'lg': return 'h-14 w-14 shrink-0';
        default: return 'size-8 shrink-0';
    }
});

const roundedClass = computed(() => (props.rounded === 'full' ? 'rounded-full' : 'rounded-lg'));
</script>
