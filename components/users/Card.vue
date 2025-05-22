<template>
    <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden transition-all duration-300">
        <div class="relative h-32 bg-gradient-to-r from-indigo-600 to-blue-700">
            <!-- //image -->
        </div>
        <div class="pt-16 pb-6 px-6 text-center">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {{ user.full_name }}
            </h1>
            <p class="text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                Infirmière
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { User } from '~/lib/types';

defineProps<{
    user: User;
}>();
</script>
