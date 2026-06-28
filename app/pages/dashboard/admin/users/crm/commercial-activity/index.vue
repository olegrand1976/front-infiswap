<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Récap activité commerciale" />

        <DashboardAdminPageContent>
            <CommercialActivityRecap v-if="canAccess" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import CommercialActivityRecap from '@/components/crm/CommercialActivityRecap.vue';

useHead({ title: 'Récap activité commerciale' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { isAdmin, isSuperAdmin } = useAuth();

const canAccess = computed(() => isSuperAdmin.value || isAdmin.value);

onMounted(() => {
    if (!canAccess.value) {
        navigateTo('/dashboard/admin/users/crm', { replace: true });
    }
});
</script>
