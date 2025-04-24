<script setup lang="ts">
import { ref, type Component } from 'vue';
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const props = defineProps<{
    actions: {
        label: string;
        icon?: Component;
        confirm?: boolean;
        onClick: () => void;
    }[];
}>();

const isDialogOpen = ref(false);
const pendingAction = ref<null | (() => void)>(null);

const handleClick = (action: typeof props.actions[number]) => {
    if (action.confirm) {
        pendingAction.value = action.onClick;
        isDialogOpen.value = true;
    }
    else {
        action.onClick();
    }
};

const confirmAction = () => {
    pendingAction.value?.();
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
            <DropdownMenuItem
                v-for="(action, index) in props.actions"
                :key="index"
                @click="handleClick(action)"
            >
                <component
                    :is="action.icon"
                    v-if="action.icon"
                    class="w-4 h-4"
                />
                <span class="pl-2">{{ action.label }}</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <Dialog v-model:open="isDialogOpen">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirmer l'action</DialogTitle>
            </DialogHeader>
            <p class="text-sm text-gray-500">
                Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?
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
                    @click="confirmAction"
                >
                    Confirmer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
