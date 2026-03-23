<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Mes Favoris"
            description="Gérez vos listes d'infirmiers privilégiés"
        />

        <DashboardAdminPageContent>
            <PoolManager />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import PoolManager from '~/components/institutions/PoolManager.vue';
import DashboardAdminPageHeader from '~/components/dashboard/AdminPageHeader.vue';
import DashboardAdminPageContent from '~/components/dashboard/AdminPageContent.vue';

definePageMeta({
    layout: 'dashboard',
    middleware: 'institution',
});

useHead({
    title: 'Mes Favoris',
    meta: [
        { name: 'description', content: 'Gérez vos pools d\'infirmiers favoris pour un recrutement prioritaire.' }
    ]
});
</script>
