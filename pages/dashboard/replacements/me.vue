<template>
    <div>
        <div class="bg-gray-100 flex px-9 rounded-lg items-center w-full h-12">
            <h1 class="text-primary">
                Mes
                <strong>
                    remplacements
                </strong>
            </h1>
        </div>

        <Replacement :get-data="getMyReplacements" />
    </div>
</template>

<script setup lang="ts">
import Replacement from '~/components/Replacement.vue';
import { useReplacements } from '~/composables/useReplacements';

const { getMyReplacements } = useReplacements();

useHead({
    title: 'Mes remplacements',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified', 'subscribed'],
    ssr: false,
});
</script>
