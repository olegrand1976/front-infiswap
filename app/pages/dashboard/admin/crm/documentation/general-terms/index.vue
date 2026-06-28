<template>
    <div class="flex min-h-[40vh] items-center justify-center p-8">
        <p class="text-sm text-muted-foreground">
            Ouverture des conditions générales de vente…
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
        await openCrmDocumentationPdf('general-terms');
    }
    catch {
        $toast({
            description: 'Impossible d\'ouvrir les conditions générales de vente.',
            variant: 'destructive',
        });
    }
    await navigateTo('/dashboard/admin/crm/documentation');
});
</script>
