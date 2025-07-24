<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Liste des tutoriels"
        >
            <template #action>
                <Button
                    class="rounded"
                    href="/dashboard/admin/tutorials/create"
                >
                    <PlusCircleIcon />
                    <span class="hidden md:inline-block">
                        Nouveau
                    </span>
                </Button>
            </template>
        </DashboardAdminPageHeader>
    </div>
</template>

<script lang="ts" setup>
import { PlusCircleIcon } from '@heroicons/vue/24/solid';

useHead({ title: 'Gestion des tutoriels' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
