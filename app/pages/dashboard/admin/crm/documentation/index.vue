<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Documentation CRM" />

        <DashboardAdminPageContent>
            <div class="grid gap-4 p-4 md:grid-cols-2 max-w-3xl">
                <button
                    type="button"
                    class="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-primary/40 hover:bg-primary/5"
                    :disabled="loadingType !== null"
                    @click="openDocument('blank-purchase-order')"
                >
                    <FileText class="mb-3 size-8 text-primary" />
                    <p class="font-semibold text-gray-900">
                        Bon de commande vierge
                    </p>
                    <p class="mt-1 text-sm text-muted-foreground">
                        Modèle PDF institution sans données client, pour présentation ou impression.
                    </p>
                </button>

                <button
                    type="button"
                    class="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-primary/40 hover:bg-primary/5"
                    :disabled="loadingType !== null"
                    @click="openDocument('general-terms')"
                >
                    <FileText class="mb-3 size-8 text-primary" />
                    <p class="font-semibold text-gray-900">
                        Conditions générales de vente
                    </p>
                    <p class="mt-1 text-sm text-muted-foreground">
                        CGS InfiSwap Institution (annexe contractuelle officielle).
                    </p>
                </button>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next';

useHead({ title: 'Documentation CRM' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { openCrmDocumentationPdf } = useCrm();

const loadingType = ref<'blank-purchase-order' | 'general-terms' | null>(null);

async function openDocument(type: 'blank-purchase-order' | 'general-terms') {
    loadingType.value = type;
    try {
        await openCrmDocumentationPdf(type);
    }
    catch {
        $toast({
            description: 'Impossible d\'ouvrir le document PDF.',
            variant: 'destructive',
        });
    }
    finally {
        loadingType.value = null;
    }
}
</script>
