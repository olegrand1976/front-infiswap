<template>
    <Button
        class="rounded-md"
        href="/dashboard/admin/users/create"
    >
        <span><PlusCircleIcon /></span>
        <span class="hidden lg:inline-block">Ajouter un utilisateur</span>
    </Button>
</template>

<script setup lang="ts">
import { PlusCircleIcon } from '@heroicons/vue/24/solid';
</script>
