<script setup lang="ts">
import { CircleHelp } from 'lucide-vue-next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

withDefaults(
    defineProps<{
        text: string;
        label?: string;
        variant?: 'default' | 'onPrimary';
    }>(),
    { variant: 'default' },
);
</script>

<template>
    <TooltipProvider :delay-duration="200">
        <Tooltip>
            <TooltipTrigger as-child>
                <button
                    type="button"
                    :class="cn(
                        'shrink-0 inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        variant === 'onPrimary'
                            ? 'text-white/70 hover:text-white'
                            : 'text-muted-foreground hover:text-primary',
                    )"
                    :aria-label="label ? `Aide : ${label}` : 'Aide'"
                    @click.stop
                >
                    <CircleHelp class="size-4" />
                </button>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                class="max-w-sm text-left text-sm"
            >
                {{ text }}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>
