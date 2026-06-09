<template>
    <LayoutError>
        <template #image>
            <ExclamationCircleIcon class="h-48 lg:h-64 text-primary" />
        </template>
        <template #title>
            Accès refusé
        </template>
        <template #message>
            Vous n'avez pas les permissions pour accéder à cette page.
        </template>
    </LayoutError>
</template>

<script lang="ts" setup>
import LayoutError from '~/layouts/error.vue';
</script>
