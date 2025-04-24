<script setup lang="ts">
import { ref } from 'vue';
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const props = defineProps<{
    onEdit?: () => void;
    onDelete?: () => void;
}>();

const isDialogOpen = ref(false);

const confirmDelete = () => {
    props.onDelete?.();
    isDialogOpen.value = false;
};
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
            <DropdownMenuItem @click="props.onEdit?.()">
                Modifier
            </DropdownMenuItem>
            <DropdownMenuItem @click="isDialogOpen = true">
                Supprimer
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <!-- Modal de confirmation -->
    <Dialog v-model:open="isDialogOpen">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <p class="text-sm text-gray-500">
                Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ?
            </p>
            <DialogFooter class="flex justify-end gap-2 mt-4">
                <Button
                    variant="ghost"
                    @click="isDialogOpen = false"
                >
                    Annuler
                </Button>
                <Button
                    variant="destructive"
                    @click="confirmDelete"
                >
                    Supprimer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
