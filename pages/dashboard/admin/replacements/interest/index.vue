<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Intérêt pour remplacement" />

        <DashboardAdminPageContent>
            <Tabs
                v-model="selected"
                class="mb-4"
            >
                <TabsList class="w-full">
                    <TabsTrigger
                        value="accepted"
                        class="w-full md:w-64 h-12"
                    >
                        Par infirmière accepté
                    </TabsTrigger>
                    <TabsTrigger
                        value="posted"
                        class="w-full md:w-64 h-12"
                    >
                        Par infirmière ayant posté
                    </TabsTrigger>
                    <!-- <TabsTrigger
                        value="responses"
                        class="w-full md:w-96 h-12"
                    >
                        Par remplacement ayant reçu des réponses
                    </TabsTrigger> -->
                </TabsList>
            </Tabs>
            <div>
                <ReplacementsInterestNursesAccepted v-if="selected === 'accepted'" />
                <ReplacementsInterestNursesPosted v-else-if="selected === 'posted'" />
                <ReplacementsInterestReceivedResponses v-else-if="selected === 'responses'" />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Intérêt pour remplacement' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const selected = ref('accepted');
</script>
