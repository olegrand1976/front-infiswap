<template>
    <div>
        <div class="flex items-center justify-between w-full">
            <h1 class="flex w-full py-3 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
                Liste des <span class="ml-1 font-semibold">intéressées par votre demande</span>
            </h1>
        </div>

        <Tabs
            class="my-6"
            default-value="in_search"
        >
            <TabsList class="w-full">
                <TabsTrigger
                    value="in_search"
                    class="w-48"
                >
                    À la recherche
                </TabsTrigger>
                <TabsTrigger
                    value="available"
                    class="w-48"
                >
                    Disponible
                </TabsTrigger>
            </TabsList>

            <TabsContent value="in_search">
                <div class="my-8">
                    Oui
                </div>
            </TabsContent>

            <TabsContent value="available">
                <div class="my-8">
                    Non
                </div>
            </TabsContent>
        </Tabs>
    </div>
</template>

<script lang="ts" setup>
import { usePartners } from '@/composables/usePartners';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const { fetchResponses } = usePartners();

useHead({
    title: 'Historique des réponses',
});

onMounted(async () => {
    await fetchResponses();
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
