<template>
    <div
        class="px-4 h-20 mb-10 text-gray-700 shadow-md rounded-md bg-white"
        :class="flexClass"
    >
        <div class="flex items-center font-bold gap-2 lg:gap-4">
            <ArrowLeft
                class="size-6 cursor-pointer hover:text-primary"
                title="Retour"
                @click="goBack"
            />
            <h1 class="text-xl">
                {{ title }}
            </h1>

            <Button
                v-show="props.count>0"
                class="rounded-md font-semibold"
            >
                {{ props.count }}
            </Button>
        </div>
        <component
            :is="as"
            class="rounded-md"
        >
            <slot name="action" />
        </component>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { goBack } from '~/lib/utils';

const props = defineProps<{
    title: string;
    flexClass?: string;
    as?: string;
    count?: number;
}>();

const defaultFlex = 'flex items-center justify-between';
const flexClass = computed(() => props.flexClass ?? defaultFlex);
const as = computed(() => props.as ?? 'button');
</script>
