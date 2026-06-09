<script setup lang="ts">
import { Menu } from 'lucide-vue-next';
import type { HTMLAttributes } from 'vue';
import { useSidebar } from './utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class'];
}>();

const { toggleSidebar } = useSidebar();
</script>

<template>
    <Button
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        :class="cn('h-7 w-7 xl:ml-0 lg:-ml-12', props.class)"
        @click="toggleSidebar"
    >
        <Menu />
        <span class="sr-only">Toggle Sidebar</span>
    </Button>
</template>
