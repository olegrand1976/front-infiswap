<template>
    <div class="flex items-center gap-2">
        <Button
            variant="secondary"
            size="icon"
            title="edit"
            @click="onEdit"
        >
            <PencilSquareIcon class="w-5 h-5" />
        </Button>
        <Button
            variant="destructive"
            class="rounded-full"
            size="icon"
            title="delete"
            @click="onDelete"
        >
            <TrashIcon class="w-5 h-5" />
        </Button>
    </div>
</template>

<script setup lang="ts">
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';

defineProps<{
    onEdit: () => void;
    onDelete: () => void;
}>();
</script>
