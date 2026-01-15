<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="flex items-center justify-between w-full mb-4">
            <h1 class="py-3 text-primary sm:bg-gray-100 w-full sm:px-9 rounded-lg">
                Nouveau <strong> groupe</strong>
            </h1>
        </div>
        <div>
            <GroupsAdminModalForm />
        </div>
    </div>
</template>

<script lang="ts" setup>
useHead({
    title: 'Nouveau groupe',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
