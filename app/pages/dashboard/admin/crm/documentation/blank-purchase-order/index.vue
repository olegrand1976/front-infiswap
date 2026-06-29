<template>
    <div class="flex min-h-[40vh] items-center justify-center p-8">
        <p class="text-sm text-muted-foreground">
            Ouverture du bon de commande vierge…
        </p>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { openCrmDocumentationPdf } = useCrm();

onMounted(async () => {
    try {
        await openCrmDocumentationPdf('blank-purchase-order');
    }
    catch {
        $toast({
            description: 'Impossible d\'ouvrir le bon de commande vierge.',
            variant: 'destructive',
        });
    }
    await navigateTo('/dashboard/admin/crm/documentation');
});
</script>
