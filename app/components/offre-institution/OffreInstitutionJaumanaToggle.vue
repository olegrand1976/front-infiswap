<template>
    <div
        class="flex items-center gap-2"
        :class="layoutClass"
    >
        <span
            :id="labelId"
            class="text-xs text-slate-600 font-semibold"
        >Afficher l'offre Jaumana Soins</span>
        <button
            type="button"
            role="switch"
            :aria-checked="modelValue"
            :aria-labelledby="labelId"
            class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#46d88e]"
            :class="modelValue ? 'bg-[#d3405c]' : 'bg-slate-300'"
            @click="emit('update:modelValue', !modelValue)"
        >
            <span
                class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                :class="modelValue ? 'translate-x-4' : 'translate-x-0.5'"
            />
        </button>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue: boolean;
    layout?: 'inline' | 'between';
}>(), {
    layout: 'inline',
});

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
}>();

const labelId = useId();

const layoutClass = computed(() =>
    props.layout === 'between' ? 'justify-between w-full' : '',
);
</script>
