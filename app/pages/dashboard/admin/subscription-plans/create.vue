<template>
    <div>
        <DashboardAdminPageHeader :title="pageTitle" />
        <DashboardAdminPageContent class="bg-gray-100">
            <SubscriptionAdminPlanForm
                :mode="mode"
                :feature="feature"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['admin'] });

const route = useRoute();

const tabKey = computed(() => (route.query.tab as string) || 'access');
const mode = computed<'access' | 'boost'>(() =>
    tabKey.value === 'boost_replacement' ? 'boost' : 'access',
);
const feature = computed(() => (mode.value === 'boost' ? 'replacement' : undefined));

const pageTitle = computed(() =>
    mode.value === 'boost' ? 'Nouveau plan boost remplacement' : 'Nouveau plan d\'accès',
);

useHead({ title: pageTitle });
</script>
