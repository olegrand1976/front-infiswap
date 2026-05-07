<template>
    <Button
        class="rounded-md"
        href="/dashboard/admin/users/create"
    >
        <span><CirclePlus /></span>
        <span class="hidden lg:inline-block">Ajouter un utilisateur</span>
    </Button>
</template>

<script setup lang="ts">
import { CirclePlus, Star } from 'lucide-vue-next';
</script>
