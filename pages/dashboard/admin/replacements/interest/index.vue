<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Intérêt pour remplacement" />

        <DashboardAdminPageContent>
            <Tabs
                class="mb-4"
            >
                <TabsList class="w-full">
                    <TabsTrigger
                        value="nurstech"
                        class="w-full md:w-64 h-12"
                    >
                        Par infirmière ayant accepté
                    </TabsTrigger>
                    <TabsTrigger
                        value="nursassur"
                        class="w-full md:w-64 h-12"
                    >
                        Par infirmière ayant posté
                    </TabsTrigger>
                    <TabsTrigger
                        value="infiswap"
                        class="w-full md:w-96 h-12"
                    >
                        Par remplacement ayant reçu des réponses
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Intérêt pour remplacement' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
