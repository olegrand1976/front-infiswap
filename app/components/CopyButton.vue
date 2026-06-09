<template>
    <Button
        :variant="props.variant"
        class="flex items-center gap-2"
        :class="props.class"
        @click="() => handleCopy(props.content)"
    >
        <Copy />
        <span v-if="showLabel == true">
            {{ props.label }}
        </span>
    </Button>
</template>

<script lang="ts" setup>
import { Copy } from 'lucide-vue-next';

const { $toast } = useNuxtApp();

const props = defineProps<{
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'dark' | 'success' | 'ghost' | 'none' | 'light';
    class?: string;
    showLabel: boolean;
    label?: string;
    content?: string;
    successMessage?: string;
}>();

const handleCopy = async (content) => {
    await navigator.clipboard.writeText(content);
    $toast({
        description: props.successMessage,
    });
};
</script>
