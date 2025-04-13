<template>
    <div>
        <DashboardAdminPageHeader title="Mis à jour utilisateur">
            <template #action>
                <UsersCreateUserButton />
            </template>
        </DashboardAdminPageHeader>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

useHead({ title: 'Mis à jour utilisateur' });

definePageMeta({
    layout: 'dashboard',
});
const route = useRoute();
const id = computed(() => route.params.id);
</script>
