<script setup lang="ts">
defineProps<{
    title: string;
    description: string;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
}>();
</script>

<template>
    <AlertDialog>
        <AlertDialogTrigger as-child>
            <slot name="trigger" />
        </AlertDialogTrigger>

        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{{ title }}</AlertDialogTitle>
                <AlertDialogDescription>
                    {{ description }}
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogCancel>{{ cancelText || 'Annuler' }}</AlertDialogCancel>
                <AlertDialogAction
                    class="rounded"
                    variant="success"
                    @click="onConfirm"
                >
                    {{ confirmText || 'Confirmer' }}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
