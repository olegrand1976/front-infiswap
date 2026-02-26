<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TabsList, type TabsListProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
    <TabsList
        v-bind="delegatedProps"
        :class="cn(
            'inline-flex items-center p-1 pb-0 text-muted-foreground border-b border-gray-300',
            props.class,
        )"
    >
        <slot />
    </TabsList>
</template>
