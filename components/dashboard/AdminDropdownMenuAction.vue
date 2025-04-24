<script setup lang="ts">
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

defineProps<{
    onEdit?: () => void;
    onDelete?: () => void;
}>();
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                variant="ghost"
                class="w-8 h-8 p-0"
            >
                <span class="sr-only">Ouvrir</span>
                <EllipsisHorizontalIcon class="w-4 h-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem @click="onEdit?.()">
                Modifier
            </DropdownMenuItem>
            <DropdownMenuItem @click="onDelete?.()">
                Supprimer
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
