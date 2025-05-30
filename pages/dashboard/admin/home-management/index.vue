<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Gestion d'accueil"
        >
            <template #action>
                <Button class="rounded">
                    <PlusCircleIcon />
                    <span class="hidden md:inline-block">
                        Nouveau
                    </span>
                </Button>
            </template>
        </DashboardAdminPageHeader>
        <DashboardAdminPageContent>
            <p>testing</p>
            <!-- <DataTable
                :data="dataUsers"
                :columns="columns"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="users.total"
                    @update:page="refreshUsers"
                    @update:per-page="handlePerPageChange"
                />
            </div> -->
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { PlusCircleIcon } from '@heroicons/vue/24/solid';

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
