<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Missions"
        >
            <template #action>
                <Button class="rounded-md">
                    <NuxtLink
                        to="/dashboard/institution/missions/create"
                        class="flex gap-3 items-center"
                    >
                        <PlusIcon class="w-6 h-6" />
                        <span>Nouveau</span>
                    </NuxtLink>
                </Button>
            </template>
        </DashboardAdminPageHeader>
    </div>
</template>

<script lang="ts" setup>
import { PlusIcon } from '@heroicons/vue/24/outline';

useHead({ title: 'Mission' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});
</script>
