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
definePageMeta({
    layout: 'dashboard',
    middleware: [
        'admin',
        (to) => {
            const raw = typeof to.query.tab === 'string' ? to.query.tab.trim() : '';
            const tab = raw || 'boost_replacement';

            if (tab !== 'boost_replacement') {
                return navigateTo({
                    path: '/dashboard/admin/subscription-plans',
                    query: { tab: 'access' },
                });
            }
        },
    ],
});

const pageTitle = 'Nouveau plan boost remplacement';
const mode = 'boost' as const;
const feature = 'replacement';

useHead({ title: pageTitle });
</script>
