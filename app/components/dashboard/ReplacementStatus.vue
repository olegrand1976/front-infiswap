<template>
    <div :class="[status === 'open' ? 'text-green-500' : 'text-red-500', 'capitalize', customClass]">
        {{ getFRStatus(status) }}
    </div>
</template>

<script setup lang="ts">
const { getFRStatus } = useReplacements();

defineProps<{
    status: 'open' | 'closed';
    customClass?: string;
}>();
</script>
