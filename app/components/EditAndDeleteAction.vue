<template>
    <div class="flex items-center gap-2">
        <Button
            variant="secondary"
            size="icon"
            title="edit"
            @click="onEdit"
        >
            <SquarePen class="w-5 h-5" />
        </Button>
        <Button
            variant="destructive"
            class="rounded-full"
            size="icon"
            title="delete"
            @click="onDelete"
        >
            <Trash2 class="w-5 h-5" />
        </Button>
    </div>
</template>

<script setup lang="ts">
import { SquarePen, Trash2 } from 'lucide-vue-next';

defineProps<{
    onEdit: () => void;
    onDelete: () => void;
}>();
</script>
