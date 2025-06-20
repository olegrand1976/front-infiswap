<template>
    <div>
        <DashboardAdminPageHeader title="Mis à jour utilisateur" />
        <DashboardAdminPageContent class="bg-gray-100">
            <UsersAdminForm :user="user" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { User } from '~/lib/types';

useHead({ title: 'Mis à jour utilisateur' });

definePageMeta({
    layout: 'dashboard',
});

const route = useRoute();
const user = ref<User>(null);
const { show } = useAuth();
const id = computed(() => route.params.id);

await show(Number(id.value)).then((response) => {
    user.value = response.user;
});
</script>
