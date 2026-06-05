<template>
    <img
        v-if="src && !hasError"
        :src="src"
        :alt="alt"
        loading="lazy"
        decoding="async"
        v-bind="$attrs"
        @error="hasError = true"
    >
    <slot
        v-else
        name="fallback"
    />
</template>

<script lang="ts" setup>
const props = defineProps<{
    path?: string | null;
    alt?: string;
}>();

const { getStorageUrl } = useStorageUrl();
const hasError = ref(false);

watch(() => props.path, () => {
    hasError.value = false;
});

const src = computed(() => getStorageUrl(props.path));
</script>
