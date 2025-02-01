<template>
    <div>
        <ClientOnly>
            <div v-if="error?.statusCode===404">
                <ErrorNotFound />
            </div>
            <!-- <div v-else>
                <ErrorBasic />
            </div> -->
        </ClientOnly>
    </div>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app';

useHead({
    title: 'Erreur | InfiSwap',
});

defineProps({
    error: Object as () => NuxtError,
});
</script>
